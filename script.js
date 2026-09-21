const works = [
  {
    title: '潮汐替我说再见', genre: 'Cinematic Mandopop',
    concept: '故事发生在台风登陆前的海港。一个人把没能说出口的告别交给潮水，等城市亮起第一盏灯时，终于允许自己转身。核心情绪是克制后的释然：离开并不是遗忘，而是学会温柔地放过。',
    positioning: 'Genre: Cinematic Mandopop / Ambient Pop · BPM: 82 · Key: D major · Mood: nocturnal, tender, tidal, cathartic · Era: contemporary 2020s · Target Scene: film end credits, night drive, oceanfront farewell.',
    lyrics: '【主歌】\n潮水把路灯一盏盏推远\n你没说完的名字 漂在鞋边\n我把伞收起 像收起昨天\n让风替我练习 一次道别\n\n【预副歌】\n原来不是每一艘船\n都要停在同一片岸\n\n【副歌】\n潮汐替我说再见\n在你回头以前\n我把眼泪还给海面\n把温柔留在从前\n若某天月光又落在肩\n请相信我 已经走得很远',
    voiceTitle: 'Female intimate alto · 近距离、温暖而带有轻微沙砾感的中低音',
    voiceDetails: '主歌贴近耳语，像在空港里写一封没有地址的信；副歌打开胸腔共鸣，但不靠喊叫取胜。情绪从疲惫克制，缓慢推向含泪的坚定与希望。',
    dynamics: '动态曲线：主歌 35% · 预副歌 55% · 副歌 82% · 最后一句高潮 100%，随后自然回落。',
    arrangement: '82 BPM 的 felt piano 作为潮水般的脉冲，远处的电吉他泛音与低频合成器托住空间；副歌加入宽阔弦乐、tom 组与反向钢琴尾音，结尾仅留海浪质感与呼吸。',
    mix: '主唱稳定置于前方中心，保留贴耳呼吸；钢琴窄而清晰，弦乐在左右大幅展开，低频克制深沉。U87 的近讲质地进入 Neve 饱和，PCM96 长尾在副歌才完全绽放。',
    directions: [['潮水把路灯一盏盏推远', '“潮”字轻起，唱完“远”后吸气半拍，让空气声保留。'], ['原来不是每一艘船', '“不”字压低力度，“船”字末尾给极轻的颤音。'], ['潮汐替我说再见', '“替我”连音推进，“再见”两个字打开胸腔，作为第一次情绪峰值。'], ['请相信我 已经走得很远', '“相信”带一点哽咽；“很远”全量爆发后自然释放，不拖拍。']],
    scores: [96, 94, 98, 90, 97],
    prompt: 'Cinematic music production, professional studio recording, human emotional vocal performance, realistic breathing, natural articulation, warm analog texture, high dynamic range. Create an original Mandarin cinematic mandopop song titled "Tide Says Goodbye for Me", 82 BPM, D major. Female intimate alto, warm lower register with a subtle grain; clear consonant attacks, full vowels, naturally released endings. Story: a person lets the tide deliver an unsaid farewell in a typhoon-lit harbor, moving from restrained grief to gentle release. Felt piano tidal pulse, distant electric-guitar harmonics, deep restrained synth bass, wide emotional strings, tom ensemble, reverse piano tails, ocean ambience. Verse at 35% intensity, pre-chorus 55%, chorus 82%, final line 100% then a natural fall. No robotic AI tone, no excessive tuning, no plastic vocal sheen; authentic close-mic human take. Recording Chain: Neumann U87 Ai, Neve 1073, Universal Audio Apollo x8p, Lexicon PCM96, ATC SCM100ASL Pro, Yamaha NS-10M Studio. Vocal front-center and intimate, cinematic wide stereo field, clean emotional EQ, transparent compression, Lexicon long-tail reverb opening in chorus, mastering -8 LUFS with analog warmth. Live sound design: L-Acoustics K1/K2, SB28, X15 HiQ, DiGiCo Quantum7, LA12X.'
  },
  {
    title: '在黎明关机之前', genre: 'Future Garage × Chinese Electronica',
    concept: '凌晨的服务器机房里，值夜的人听见城市最后一班车离站。他决定在黎明关机前，给未来留下一段不被删除的心跳。核心情绪是孤独中的微小勇气。',
    positioning: 'Genre: Future Garage × Chinese Electronica · BPM: 132 · Key: F minor · Mood: electric, lonely, ascending, hopeful · Era: forward-looking 2020s · Target Scene: cyberpunk montage, late-night coding, dawn transit.',
    lyrics: '【主歌】\n风扇还在替城市失眠\n蓝色光标闪在我的指尖\n最后一班车 穿过空的街\n把明天留给还没醒的人\n\n【副歌】\n在黎明关机之前\n让我再亮一遍\n不是为了被谁看见\n只是心跳不想断电\n当太阳越过天线\n我会把名字写进云里面',
    voiceTitle: 'Male cinematic tenor · 清亮、微哑、带夜色颗粒的男高音',
    voiceDetails: '主歌用近乎说唱的轻声叙述，咬字锋利；副歌逐渐拉开头腔与胸腔，像穿过清晨的高架桥。情绪从疏离、疲惫，抵达明亮的执拗。',
    dynamics: '动态曲线：主歌 32% · 预副歌 48% · 副歌 78% · 尾奏呼喊 100%。',
    arrangement: '碎拍 UK garage 鼓组以低通滤波开场，古筝颗粒采样切入节奏缝隙；副歌叠加合成器 pad、失真贝斯与男声和声群，最后让单音琵琶穿过噪声。',
    mix: '干净近讲主唱悬在鼓组上方，左右散布粒子化古筝；sub 保持单声道，副歌的 pad 向两侧扩张。瞬态清晰、侧链呼吸可感，母带保有暗色模拟温度。',
    directions: [['风扇还在替城市失眠', '“失眠”轻轻下坠，句末留一口短促换气。'], ['最后一班车 穿过空的街', '“穿过”咬字加速，“空”字延长半拍。'], ['让我再亮一遍', '“亮”字抬头推入头腔，力度瞬间升至 80%。'], ['只是心跳不想断电', '“断电”做干脆断句，随后保留可闻的呼吸。']],
    scores: [95, 96, 94, 93, 92],
    prompt: 'Cinematic music production, professional studio recording, human emotional vocal performance, realistic breathing, natural articulation, warm analog texture, high dynamic range. Original Mandarin future garage and Chinese electronica, 132 BPM, F minor. Male cinematic tenor with clear bright edge and midnight rasp. A night-shift worker in a server room refuses to let his heartbeat power down before dawn. Filtered UK garage breaks, granular guzheng fragments, dark mono sub bass, luminous synth pads, distorted bass lift, stacked male harmonies, lone pipa note through the outro noise. Verse 32%, pre-chorus 48%, chorus 78%, outro cry 100%. Natural breaths and precise diction; no robotic AI voice, over-tuning, or plastic sheen. Recording Chain: Neumann U87 Ai, Neve 1073, Universal Audio Apollo x8p, Lexicon PCM96, ATC SCM100ASL Pro, Yamaha NS-10M Studio. Front-center vocal, wide cinematic stereo, controlled transient EQ and compression, spacious Lexicon PCM96 reverb, -8 LUFS mastering with analog warmth. Live sound design: L-Acoustics K1/K2, SB28, X15 HiQ, DiGiCo Quantum7, LA12X.'
  }
];
let current = 0;
const $ = (id) => document.querySelector(id);
function render(work, index) {
  $('#songNumber').textContent = String(index + 1).padStart(2, '0');
  $('#songIndex').textContent = `SONG ${String(index + 1).padStart(2, '0')} / 已完成`;
  $('#songTitle').textContent = work.title; $('#songGenre').textContent = work.genre;
  $('#concept').textContent = work.concept; $('#positioning').textContent = work.positioning; $('#lyrics').textContent = work.lyrics; $('#prompt').textContent = work.prompt;
  $('#voiceTitle').textContent = work.voiceTitle; $('#voiceDetails').textContent = work.voiceDetails; $('#dynamics').textContent = work.dynamics; $('#arrangement').textContent = work.arrangement; $('#mix').textContent = work.mix;
  $('#directions').innerHTML = work.directions.map(([line, note], i) => `<article><b>0${i + 1}</b><div><strong>「${line}」</strong><p>${note}</p></div></article>`).join('');
  const labels = ['原创性', '音乐性', '情绪', '商业潜力', '电影适配'];
  $('#scores').innerHTML = work.scores.map((score, i) => `<article><span>${labels[i]}</span><strong>${score}</strong><i><b style="width:${score}%"></b></i></article>`).join('');
}
function copyPrompt() {
  navigator.clipboard?.writeText(works[current].prompt).catch(() => {});
  const toast = $('#toast'); toast.classList.add('show'); setTimeout(() => toast.classList.remove('show'), 2400);
}
function advanceWork(scroll = false) {
  $('#engineState').textContent = 'COMPOSING'; $('#progressValue').textContent = '—';
  setTimeout(() => {
    current = (current + 1) % works.length; render(works[current], current);
    $('#engineState').textContent = 'WRITING'; $('#progressValue').textContent = '100%';
    if (scroll) document.querySelector('#song').scrollIntoView({behavior: 'smooth', block: 'start'});
  }, 620);
}
$('#createButton').addEventListener('click', () => advanceWork(true));
$('#copyButton').addEventListener('click', copyPrompt); $('#copyPromptButton').addEventListener('click', copyPrompt);
let seconds = 24; setInterval(() => {
  if (seconds === 0) { seconds = 24; advanceWork(false); } else seconds -= 1;
  $('#nextCycle').textContent = `00:${String(seconds).padStart(2, '0')}`;
}, 1000);
render(works[current], current);
