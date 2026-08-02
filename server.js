const http = require('http');
const fs = require('fs');
const path = require('path');
const { randomUUID } = require('crypto');

const root = __dirname;
const dbPath = path.join(root, 'data', 'db.json');
const mime = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.json': 'application/json; charset=utf-8' };

function readDb() { return JSON.parse(fs.readFileSync(dbPath, 'utf8')); }
function writeDb(db) { fs.writeFileSync(dbPath, JSON.stringify(db, null, 2)); }
function send(res, status, body, type = 'application/json; charset=utf-8') { res.writeHead(status, { 'Content-Type': type }); res.end(typeof body === 'string' ? body : JSON.stringify(body)); }
function body(req) { return new Promise((resolve) => { let data = ''; req.on('data', (chunk) => { data += chunk; }); req.on('end', () => resolve(data ? JSON.parse(data) : {})); }); }
function simulate(scenario) {
  const p = scenario.parameters;
  const risk = Math.round(Math.min(99, p.climate * 0.28 + p.economy * 0.24 + p.population * 0.18 + p.resources * 0.3));
  return {
    risk,
    confidence: Math.round(100 - Math.abs(p.climate - p.resources) * 0.22 - Math.abs(p.economy - p.population) * 0.18),
    impacts: [
      { name: '公共安全', value: Math.min(96, risk + p.population * 0.12) },
      { name: '供应链', value: Math.min(96, risk + p.economy * 0.16) },
      { name: '能源资源', value: Math.min(96, risk + p.resources * 0.14) },
      { name: '财政成本', value: Math.min(96, risk + p.climate * 0.1) }
    ],
    actions: [
      { priority: 'P0', scope: '跨区域', difficulty: '中', text: risk > 75 ? '立即建立联合预警与替代供应链清单。' : '保持 24 小时监控并建立触发阈值。' },
      { priority: 'P1', scope: '行业', difficulty: '低', text: '订阅关键节点数据，校准气候与资源权重。' },
      { priority: 'P2', scope: '组织', difficulty: '高', text: '启动反事实复盘，验证是否存在错误归因。' }
    ],
    debate: {
      pro: `风险 ${risk}，正方认为应尽快预置资源。`,
      con: `置信度仍需校准，反方要求补充更多现实反馈。`,
      neutral: '中立方建议先小范围试点，再根据时间轴回溯结果扩展。'
    }
  };
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  if (url.pathname === '/api/state') return send(res, 200, readDb());
  if (url.pathname === '/api/scenarios' && req.method === 'POST') {
    const db = readDb();
    const input = await body(req);
    const scenario = { id: randomUUID(), name: input.name || '未命名推演场景', hypothesis: input.hypothesis || '', status: '创建', year: Number(input.year || 2026), parameters: input.parameters, createdAt: new Date().toISOString(), history: [{ phase: '创建', note: '用户创建新推演场景', at: new Date().toISOString() }] };
    db.scenarios.unshift(scenario); writeDb(db); return send(res, 201, scenario);
  }
  if (url.pathname.match(/^\/api\/scenarios\/[^/]+\/simulate$/) && req.method === 'POST') {
    const id = url.pathname.split('/')[3]; const db = readDb(); const scenario = db.scenarios.find((item) => item.id === id);
    if (!scenario) return send(res, 404, { error: 'scenario not found' });
    Object.assign(scenario, await body(req)); scenario.status = '推演中'; scenario.history.push({ phase: '推演', note: '参数更新并重新计算影响', at: new Date().toISOString() }); writeDb(db); return send(res, 200, { scenario, result: simulate(scenario) });
  }
  if (url.pathname.match(/^\/api\/scenarios\/[^/]+\/archive$/) && req.method === 'POST') {
    const id = url.pathname.split('/')[3]; const db = readDb(); const scenario = db.scenarios.find((item) => item.id === id);
    if (!scenario) return send(res, 404, { error: 'scenario not found' });
    scenario.status = '归档'; scenario.history.push({ phase: '归档', note: '完成验证并归档', at: new Date().toISOString() }); writeDb(db); return send(res, 200, scenario);
  }
  const filePath = path.join(root, url.pathname === '/' ? 'index.html' : url.pathname.slice(1));
  if (!filePath.startsWith(root) || !fs.existsSync(filePath)) return send(res, 404, 'Not found', 'text/plain; charset=utf-8');
  send(res, 200, fs.readFileSync(filePath), mime[path.extname(filePath)] || 'application/octet-stream');
});

server.listen(process.env.PORT || 4173, () => console.log(`Digital Earth app running on http://127.0.0.1:${process.env.PORT || 4173}`));
