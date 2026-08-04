const $ = (id) => document.getElementById(id);
const layers = ['geo', 'climate', 'economy', 'population', 'resources'];
const labels = { geo: '地理', climate: '气候', economy: '经济', population: '人口', resources: '资源' };
const params = { climate: 62, economy: 55, population: 48, resources: 70 };
const state = { db: null, layer: 'geo', scenario: null, result: null, year: 2026, graph: null, drag: null, rotation: 0, selectedNode: '气候风险', live: null };

async function api(path, options) {
  const response = await fetch(path, { headers: { 'Content-Type': 'application/json' }, ...options });
  if (!response.ok) throw new Error(await response.text());
  return response.json();
}

function allWorldItems() { return layers.flatMap((layer) => state.db.worldState[layer].map((item) => ({ ...item, layer }))); }
function yearFactor() { return 1 + (state.year - 2026) * 0.025; }
function score(item) { return Math.round(Math.max(1, Math.min(99, item.score * yearFactor() + item.trend * (state.year - 2026)))); }

function renderTabs() {
  $('layerTabs').innerHTML = layers.map((layer) => `<button class="${state.layer === layer ? 'active' : ''}" data-layer="${layer}">${labels[layer]}</button>`).join('');
  document.querySelectorAll('[data-layer]').forEach((button) => button.onclick = () => { state.layer = button.dataset.layer; renderAll(); });
}

function renderWorldList() {
  $('worldList').innerHTML = state.db.worldState[state.layer].map((item) => `<li><b>${item.name}</b><span>${labels[state.layer]} · ${score(item)} · 趋势 ${item.trend > 0 ? '+' : ''}${item.trend}</span><i style="width:${score(item)}%"></i></li>`).join('');
  const sources = state.db.dataSources || [];
  $('liveFeed').innerHTML = sources.map((source) => `<span class="${source.status}">${source.name}: ${source.lastSync ? new Date(source.lastSync).toLocaleTimeString() : '待同步'}</span>`).join('');
}

function drawEarth() {
  const canvas = $('earth');
  const ctx = canvas.getContext('2d');
  const rect = canvas.getBoundingClientRect();
  canvas.width = rect.width * devicePixelRatio; canvas.height = rect.height * devicePixelRatio;
  ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
  const r = Math.min(rect.width, rect.height) * 0.38; const cx = rect.width / 2; const cy = rect.height / 2;
  ctx.clearRect(0, 0, rect.width, rect.height);
  const g = ctx.createRadialGradient(cx - r * 0.35, cy - r * 0.35, 10, cx, cy, r); g.addColorStop(0, '#7df9ff'); g.addColorStop(0.45, '#1463d8'); g.addColorStop(1, '#02091a');
  ctx.fillStyle = g; ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.fill(); ctx.strokeStyle = '#aefcff55';
  for (let lat = -60; lat <= 60; lat += 30) line(lat, true); for (let lon = -150; lon <= 180; lon += 30) line(lon, false);
  allWorldItems().forEach((item) => { const p = project(item.lon, item.lat, r, cx, cy); if (p.z < 0) return; ctx.fillStyle = item.layer === state.layer ? '#d8ff63' : '#ffffff88'; ctx.beginPath(); ctx.arc(p.x, p.y, 3 + score(item) / 18, 0, Math.PI * 2); ctx.fill(); });
  state.rotation = (state.rotation + 0.2) % 360; requestAnimationFrame(drawEarth);
  function project(lon, lat, radius, centerX, centerY) { const lambda = ((lon + state.rotation) * Math.PI) / 180; const phi = (lat * Math.PI) / 180; return { x: centerX + radius * Math.cos(phi) * Math.sin(lambda), y: centerY - radius * Math.sin(phi), z: Math.cos(phi) * Math.cos(lambda) }; }
  function line(value, latitude) { ctx.beginPath(); for (let v = latitude ? -180 : -80; v <= (latitude ? 180 : 80); v += 5) { const p = latitude ? project(v, value, r, cx, cy) : project(value, v, r, cx, cy); if (p.z < 0) continue; v === (latitude ? -180 : -80) ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y); } ctx.stroke(); }
}

function initGraph() {
  const names = ['气候风险', '资源供应', '经济波动', '人口暴露', '供应链韧性', '政策干预', '行动建议'];
  state.graph = {
    nodes: names.map((name, i) => ({ id: name, x: 80 + (i % 4) * 150, y: 85 + Math.floor(i / 4) * 130, vx: 0, vy: 0 })),
    links: [['气候风险', '资源供应', .72], ['资源供应', '经济波动', .66], ['经济波动', '供应链韧性', .81], ['人口暴露', '供应链韧性', .54], ['政策干预', '供应链韧性', .48], ['供应链韧性', '行动建议', .88]]
  };
  for (let i = 0; i < 80; i += 1) forceTick();
}
function forceTick() {
  const { nodes, links } = state.graph;
  nodes.forEach((a) => nodes.forEach((b) => { if (a === b) return; const dx = a.x - b.x; const dy = a.y - b.y; const d2 = Math.max(80, dx * dx + dy * dy); a.vx += dx / d2 * 18; a.vy += dy / d2 * 18; }));
  links.forEach(([from, to, weight]) => { const a = nodes.find((n) => n.id === from); const b = nodes.find((n) => n.id === to); const dx = b.x - a.x; const dy = b.y - a.y; const dist = Math.hypot(dx, dy) || 1; const pull = (dist - 128) * 0.002 * weight; a.vx += dx * pull; a.vy += dy * pull; b.vx -= dx * pull; b.vy -= dy * pull; });
  nodes.forEach((n) => { n.x = Math.max(40, Math.min(600, n.x + n.vx)); n.y = Math.max(40, Math.min(320, n.y + n.vy)); n.vx *= 0.82; n.vy *= 0.82; });
}
function tracedLinks() {
  const links = state.graph.links; const path = new Set(); let frontier = [state.selectedNode];
  while (frontier.length) { const next = []; frontier.forEach((node) => links.filter(([a]) => a === node).forEach(([a, b]) => { path.add(`${a}->${b}`); next.push(b); })); frontier = next; }
  return path;
}

function renderGraph() {
  const svg = $('causalGraph'); const { nodes, links } = state.graph; const traced = tracedLinks();
  svg.innerHTML = links.map(([a, b, w]) => { const s = nodes.find((n) => n.id === a); const t = nodes.find((n) => n.id === b); const active = traced.has(`${a}->${b}`); return `<line class="${active ? 'active' : ''}" x1="${s.x}" y1="${s.y}" x2="${t.x}" y2="${t.y}" stroke-width="${1 + w * 5}"/><text x="${(s.x + t.x) / 2}" y="${(s.y + t.y) / 2 - 8}">${w}</text>`; }).join('') + nodes.map((n) => `<g class="${n.id === state.selectedNode ? 'selected' : ''}" data-node="${n.id}" transform="translate(${n.x} ${n.y})"><circle r="28"/><text>${n.id}</text></g>`).join('');
  svg.querySelectorAll('[data-node]').forEach((node) => node.onpointerdown = (event) => { state.selectedNode = node.dataset.node; state.drag = { id: node.dataset.node, ox: event.offsetX, oy: event.offsetY }; node.setPointerCapture(event.pointerId); renderGraph(); });
  svg.onpointermove = (event) => { if (!state.drag) return; const node = nodes.find((n) => n.id === state.drag.id); const box = svg.getBoundingClientRect(); node.x = event.offsetX * 640 / box.width; node.y = event.offsetY * 360 / box.height; renderGraph(); };
  svg.onpointerup = () => { state.drag = null; };
}

function renderParams() {
  $('params').innerHTML = Object.entries(params).map(([key, value]) => `<label>${labels[key]}<input data-param="${key}" type="range" min="0" max="100" value="${value}"/><b>${value}</b></label>`).join('');
  document.querySelectorAll('[data-param]').forEach((input) => input.oninput = () => { params[input.dataset.param] = Number(input.value); input.nextElementSibling.textContent = input.value; });
}

function renderScenario() {
  $('scenarioSelect').innerHTML = state.db.scenarios.map((item) => `<option value="${item.id}" ${state.scenario?.id === item.id ? 'selected' : ''}>${item.name} · ${item.status}</option>`).join('');
  const scenario = state.scenario || state.db.scenarios[0];
  $('lifecycle').innerHTML = scenario.history.map((item) => `<li><b>${item.phase}</b><span>${item.note}</span><small>${new Date(item.at).toLocaleString()}</small></li>`).join('');
  const risk = state.result?.risk || Math.round(Object.values(scenario.parameters).reduce((a, b) => a + b, 0) / 4);
  $('riskScore').textContent = risk; $('eventCount').textContent = allWorldItems().length; $('currentYear').textContent = state.year;
  $('calibration').innerHTML = `<p>接入源：JSON 世界状态库 / 场景库 / 时间轴参数 / 外部同步接口</p><p>偏差校准：${risk > 70 ? '需提高现实反馈权重' : '当前偏差可控'}</p><p>错误归因：重点检查资源供应与经济波动是否被时间滞后放大。</p>${state.live ? `<p>最近同步：导入 ${state.live.imported.map((i) => `${i.source}(${i.count})`).join('、') || '0'}；警告 ${state.live.warnings.length}</p>` : ''}`;
  const debate = state.result?.debate || { pro: '正方：应提前配置资源。', con: '反方：需要更多证据。', neutral: '中立：先进行小范围试点。' };
  $('debate').innerHTML = `<article><b>正方</b><p>${debate.pro}</p></article><article><b>反方</b><p>${debate.con}</p></article><article><b>中立</b><p>${debate.neutral}</p></article>`;
  const impacts = state.result?.impacts || ['公共安全', '供应链', '能源资源', '财政成本'].map((name, i) => ({ name, value: risk - i * 7 }));
  $('impact').innerHTML = impacts.map((item) => `<div><strong>${item.name}</strong><span>${Math.round(item.value)}%</span></div>`).join('');
  const actions = state.result?.actions || [{ priority: 'P1', scope: '跨区域', difficulty: '中', text: '创建或推演场景后生成建议。' }];
  $('advice').innerHTML = actions.map((item) => `<article><b>${item.priority}</b><p>${item.text}</p><small>${item.scope} · 难度 ${item.difficulty}</small></article>`).join('');
}

async function createScenario() {
  state.scenario = await api('/api/scenarios', { method: 'POST', body: JSON.stringify({ name: $('scenarioName').value, hypothesis: $('hypothesis').value, year: state.year, parameters: params }) });
  await load();
}
async function simulateScenario() {
  if (!state.scenario) state.scenario = state.db.scenarios[0];
  const data = await api(`/api/scenarios/${state.scenario.id}/simulate`, { method: 'POST', body: JSON.stringify({ hypothesis: $('hypothesis').value, year: state.year, parameters: params }) });
  state.scenario = data.scenario; state.result = data.result; renderAll();
}
async function archiveScenario() {
  if (!state.scenario) return;
  state.scenario = await api(`/api/scenarios/${state.scenario.id}/archive`, { method: 'POST' }); await load();
}
async function syncRealWorld() {
  state.live = await api('/api/sync-real-world', { method: 'POST' });
  await load();
}

function renderAll() { renderTabs(); renderWorldList(); renderGraph(); renderParams(); renderScenario(); }
async function load() { state.db = await api('/api/state'); state.scenario = state.db.scenarios[0]; initGraph(); renderAll(); }

$('timeline').oninput = (event) => { state.year = Number(event.target.value); renderAll(); };
$('scenarioSelect').onchange = (event) => { state.scenario = state.db.scenarios.find((item) => item.id === event.target.value); state.result = null; renderAll(); };
$('createScenario').onclick = createScenario; $('simulateScenario').onclick = simulateScenario; $('archiveScenario').onclick = archiveScenario; $('syncRealWorld').onclick = syncRealWorld;
load().then(drawEarth);
