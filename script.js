const simulator = document.querySelector('#simulator');
const enterButton = document.querySelector('#enterButton');
const closeButton = document.querySelector('#closeButton');
const signalButton = document.querySelector('#signalButton');
const soundButton = document.querySelector('#soundButton');

function openSimulator() {
  simulator.classList.add('open');
  simulator.setAttribute('aria-hidden', 'false');
  document.querySelector('#simStatus').textContent = '演算完成 · 一切如常';
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
