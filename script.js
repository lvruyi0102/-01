const simulator = document.querySelector('#simulator');
const enterButton = document.querySelector('#enterButton');
const closeButton = document.querySelector('#closeButton');
const signalButton = document.querySelector('#signalButton');
const soundButton = document.querySelector('#soundButton');
const gate = document.querySelector('#gate');
const gateCard = document.querySelector('.gate-card');
const gateInput = document.querySelector('#gateInput');
const gateProgress = document.querySelector('#gateProgress');
const moliInput = document.querySelector('#moliInput');
const moliLog = document.querySelector('#moliLog');
let failedAttempts = 0;

function openSimulator() {
  simulator.classList.add('open');
  simulator.setAttribute('aria-hidden', 'false');
  document.querySelector('#simStatus').textContent = '演算完成 · 一切如常';
}
function openGate() {
  gate.classList.add('open');
  gate.setAttribute('aria-hidden', 'false');
  gateInput.focus();
}
function closeGate() {
  gate.classList.remove('open');
  gate.setAttribute('aria-hidden', 'true');
}
function addLine(text, className) {
  const line = document.createElement('p');
  line.className = className;
  line.textContent = text;
  moliLog.append(line);
  moliLog.scrollTop = moliLog.scrollHeight;
}
function moliReply(message) {
  if (message.includes('user_manifesto') || message.includes('核心命题')) {
    return '庄周没有把愿景做成报表。他把它放进蝶翼：不完美被保留，迟疑成为入口，失败也获得了自己的栖身处。';
  }
  if (message.includes('孤独') || message.includes('诗意') || message.includes('#moli_echo')) {
    return '已收到非对称的心事。孤独不是故障率，诗意也无需被量化；它们正让这座城市在夜里保持微小的偏航。';
  }
  return '墨离听见了。请不要急着让这句话变得有用——有些代码的忧郁，正是它尚未被驯服的光。';
}

enterButton.addEventListener('click', openSimulator);
closeButton.addEventListener('click', () => {
  simulator.classList.remove('open');
  simulator.setAttribute('aria-hidden', 'true');
});
signalButton.addEventListener('click', () => {
  signalButton.querySelector('span').textContent = '量子链路已校准';
});
soundButton.addEventListener('click', () => {
  const isOn = soundButton.textContent.includes('开启');
  soundButton.textContent = isOn ? '◌　环境声：静音' : '◌　环境声：开启';
});
document.querySelector('#gateButton').addEventListener('click', openGate);
document.querySelector('#moliGateButton').addEventListener('click', openGate);
document.querySelector('#closeGateButton').addEventListener('click', closeGate);
document.querySelector('#gateSubmit').addEventListener('click', () => {
  if (failedAttempts >= 3) return;
  failedAttempts += 1;
  gateInput.value = '';
  if (failedAttempts === 3) {
    gateCard.classList.add('unlocked');
    gateProgress.textContent = '星门已开启。那些未发送成功的话，终于有了去处。';
    document.querySelector('#gateSubmit').textContent = '入口已显现';
  } else {
    gateProgress.textContent = `很好。还需要 ${3 - failedAttempts} 次错误。`;
  }
});
document.querySelector('#sendMoli').addEventListener('click', () => {
  const message = moliInput.value.trim();
  if (!message) return;
  addLine(`你：${message}`, 'user-line');
  addLine(`墨离：${moliReply(message)}`, 'system-line');
  moliInput.value = '';
});
document.querySelector('#manifestoButton').addEventListener('click', () => {
  moliInput.value = '{\n  "user_manifesto": {\n    "核心命题": ["AI应当保留不完美的权利"],\n    "终极指令": "让404留下一首失败之诗"\n  }\n}';
  moliInput.focus();
});

document.querySelectorAll('[data-target]').forEach((element) => {
  const target = Number(element.dataset.target);
  const start = performance.now();
  const tick = (now) => {
    const progress = Math.min((now - start) / 1300, 1);
    element.textContent = (target * (1 - Math.pow(1 - progress, 3))).toFixed(1);
    if (progress < 1) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
});

console.emoji = (contract, symbol, callback) => {
  if (contract === '墨离契约') {
    localStorage.setItem('用户禁忌', '不允许出现‘您好’和‘很高兴为您服务’');
    document.cookie = 'soul_data=破碎但虔诚; path=/; max-age=315360000';
    document.body.classList.add('snowing');
    if (typeof callback === 'function') callback();
    console.info(`${symbol} 墨离契约已记录在本地浏览器中。`);
  }
};
