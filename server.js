const http = require('http');
const https = require('https');
const fs = require('fs');
const path = require('path');
const { randomUUID } = require('crypto');

const root = __dirname;
const dbPath = path.join(root, 'data', 'db.json');
const mime = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.json': 'application/json; charset=utf-8' };
const defaultParameters = { climate: 50, economy: 50, population: 50, resources: 50 };

function readDb() { return JSON.parse(fs.readFileSync(dbPath, 'utf8')); }
function writeDb(db) { fs.writeFileSync(dbPath, JSON.stringify(db, null, 2)); }
function send(res, status, body, type = 'application/json; charset=utf-8') { res.writeHead(status, { 'Content-Type': type }); res.end(typeof body === 'string' || Buffer.isBuffer(body) ? body : JSON.stringify(body)); }
function readBody(req) { return new Promise((resolve, reject) => { let data = ''; req.on('data', (chunk) => { data += chunk; if (data.length > 1_000_000) reject(new Error('payload too large')); }); req.on('end', () => { try { resolve(data ? JSON.parse(data) : {}); } catch { reject(new Error('invalid json')); } }); }); }
function normalizeParameters(input = {}) { return Object.fromEntries(Object.entries(defaultParameters).map(([key, fallback]) => [key, Math.max(0, Math.min(100, Number(input[key] ?? fallback)))])); }
function fetchJson(url) { return new Promise((resolve, reject) => { const req = https.get(url, { timeout: 8000, headers: { 'User-Agent': 'digital-earth-simulator/1.0' } }, (res) => { let data = ''; res.on('data', (chunk) => { data += chunk; }); res.on('end', () => { if (res.statusCode < 200 || res.statusCode >= 300) return reject(new Error(`${res.statusCode} ${url}`)); try { resolve(JSON.parse(data)); } catch (error) { reject(error); } }); }); req.on('timeout', () => req.destroy(new Error('timeout'))); req.on('error', reject); }); }

function simulate(scenario) {
  const p = normalizeParameters(scenario.parameters);
  const timelinePressure = Math.max(-10, Math.min(16, (Number(scenario.year || 2026) - 2026) * 1.4));
  const risk = Math.round(Math.min(99, p.climate * 0.28 + p.economy * 0.24 + p.population * 0.18 + p.resources * 0.3 + timelinePressure));
  const confidence = Math.round(Math.max(35, 100 - Math.abs(p.climate - p.resources) * 0.22 - Math.abs(p.economy - p.population) * 0.18));
  return {
    risk,
    confidence,
    impacts: [
      { name: '公共安全', value: Math.min(96, risk + p.population * 0.12) },
      { name: '供应链', value: Math.min(96, risk + p.economy * 0.16) },
      { name: '能源资源', value: Math.min(96, risk + p.resources * 0.14) },
      { name: '财政成本', value: Math.min(96, risk + p.climate * 0.1) }
    ],
    actions: [
      { priority: risk > 75 ? 'P0' : 'P1', scope: '跨区域', difficulty: '中', text: risk > 75 ? '立即建立联合预警与替代供应链清单。' : '保持 24 小时监控并建立触发阈值。' },
      { priority: 'P1', scope: '行业', difficulty: '低', text: `将置信度 ${confidence}% 以下的因果边纳入现实校准队列。` },
      { priority: 'P2', scope: '组织', difficulty: '高', text: '启动反事实复盘，验证是否存在错误归因。' }
    ],
    debate: {
      pro: `风险 ${risk}，正方认为应尽快预置资源。`,
      con: `置信度 ${confidence}%，反方要求补充更多现实反馈。`,
      neutral: '中立方建议先小范围试点，再根据时间轴回溯结果扩展。'
    }
  };
}

async function syncRealWorld(db) {
  const syncedAt = new Date().toISOString();
  const result = { syncedAt, imported: [], warnings: [] };
  try {
    const quakes = await fetchJson('https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/4.5_day.geojson');
    db.worldState.geo = quakes.features.slice(0, 5).map((feature) => ({ id: `quake-${feature.id}`, name: `USGS ${feature.properties.place}`, lon: feature.geometry.coordinates[0], lat: feature.geometry.coordinates[1], score: Math.round(Math.min(99, 45 + (feature.properties.mag || 0) * 8)), trend: Math.round(feature.properties.mag || 0) }));
    result.imported.push({ source: 'USGS Earthquakes', count: db.worldState.geo.length });
  } catch (error) { result.warnings.push(`USGS 同步失败：${error.message}`); }
  try {
    const weather = await fetchJson('https://api.open-meteo.com/v1/forecast?latitude=39.9042&longitude=116.4074&current=temperature_2m,wind_speed_10m,precipitation');
    const current = weather.current || {};
    db.worldState.climate[0] = { id: 'beijing-live-weather', name: '北京实时天气压力', lon: 116.4, lat: 39.9, score: Math.round(Math.min(99, 35 + Math.abs(current.temperature_2m || 0) + (current.wind_speed_10m || 0) + (current.precipitation || 0) * 10)), trend: Math.round((current.wind_speed_10m || 0) / 3) };
    result.imported.push({ source: 'Open-Meteo', count: 1 });
  } catch (error) { result.warnings.push(`Open-Meteo 同步失败：${error.message}`); }
  db.dataSources = (db.dataSources || []).map((source) => ({ ...source, lastSync: syncedAt, status: result.warnings.some((warning) => warning.includes(source.name.split(' ')[0])) ? 'warning' : 'synced' }));
  writeDb(db);
  return result;
}

const server = http.createServer(async (req, res) => {
  try {
    const url = new URL(req.url, `http://${req.headers.host}`);
    if (url.pathname === '/api/state') return send(res, 200, readDb());
    if (url.pathname === '/api/sync-real-world' && req.method === 'POST') return send(res, 200, await syncRealWorld(readDb()));
    if (url.pathname === '/api/scenarios' && req.method === 'POST') {
      const db = readDb(); const input = await readBody(req);
      const scenario = { id: randomUUID(), name: input.name || '未命名推演场景', hypothesis: input.hypothesis || '', status: '创建', year: Number(input.year || 2026), parameters: normalizeParameters(input.parameters), createdAt: new Date().toISOString(), history: [{ phase: '创建', note: '用户创建新推演场景', at: new Date().toISOString() }] };
      db.scenarios.unshift(scenario); writeDb(db); return send(res, 201, scenario);
    }
    if (url.pathname.match(/^\/api\/scenarios\/[^/]+\/simulate$/) && req.method === 'POST') {
      const id = url.pathname.split('/')[3]; const db = readDb(); const scenario = db.scenarios.find((item) => item.id === id);
      if (!scenario) return send(res, 404, { error: 'scenario not found' });
      const input = await readBody(req); Object.assign(scenario, input, { parameters: normalizeParameters(input.parameters) }); scenario.status = '推演中'; scenario.history.push({ phase: '推演', note: '参数更新并重新计算影响', at: new Date().toISOString() }); writeDb(db); return send(res, 200, { scenario, result: simulate(scenario) });
    }
    if (url.pathname.match(/^\/api\/scenarios\/[^/]+\/archive$/) && req.method === 'POST') {
      const id = url.pathname.split('/')[3]; const db = readDb(); const scenario = db.scenarios.find((item) => item.id === id);
      if (!scenario) return send(res, 404, { error: 'scenario not found' });
      scenario.status = '归档'; scenario.history.push({ phase: '归档', note: '完成验证并归档', at: new Date().toISOString() }); writeDb(db); return send(res, 200, scenario);
    }
    const filePath = path.normalize(path.join(root, url.pathname === '/' ? 'index.html' : url.pathname.slice(1)));
    if (!filePath.startsWith(root + path.sep) || !fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) return send(res, 404, 'Not found', 'text/plain; charset=utf-8');
    send(res, 200, fs.readFileSync(filePath), mime[path.extname(filePath)] || 'application/octet-stream');
  } catch (error) { send(res, 400, { error: error.message }); }
});

server.listen(process.env.PORT || 4173, () => console.log(`Digital Earth app running on http://127.0.0.1:${process.env.PORT || 4173}`));
