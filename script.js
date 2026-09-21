const profiles = [
  { genre: 'Cinematic Mandopop / Ambient Pop', bpm: 82, key: 'D major', mood: 'nocturnal, tender, cathartic', scene: 'film end credits, oceanfront farewell', voice: 'Female intimate alto', vocal: '温暖中低音带轻微沙砾感；主歌贴耳，副歌打开胸腔而不喊叫。', arrangement: 'felt piano、潮汐感 synth bass、远处电吉他泛音、宽阔弦乐与 tom 组。', mix: '主唱前中置，钢琴窄而清晰，弦乐大幅展开，PCM96 长尾在副歌盛放。', emotion: '克制后的释然', place: '台风前的海港', image: '潮水', titles: ['潮汐替我说再见', '月光停在旧码头'], lines: ['潮水把路灯一盏盏推远', '我把眼泪还给海面', '请相信我 已经走得很远'] },
  { genre: 'Future Garage × Chinese Electronica', bpm: 132, key: 'F minor', mood: 'electric, lonely, ascending', scene: 'cyberpunk montage, dawn transit', voice: 'Male cinematic tenor', vocal: '清亮微哑，字头锋利；从近乎说唱的叙述推向明亮的头腔。', arrangement: 'filtered UK garage breaks、颗粒古筝、dark mono sub、luminous pads、失真贝斯与琵琶尾音。', mix: '近讲人声悬在碎拍上方，sub 保持单声道，副歌 pad 向两侧扩张。', emotion: '孤独里的勇气', place: '凌晨的服务器机房', image: '蓝色光标', titles: ['在黎明关机之前', '把名字写进云里面'], lines: ['风扇还在替城市失眠', '让我再亮一遍', '只是心跳不想断电'] },
  { genre: 'Chinese Indie Folk / Chamber Pop', bpm: 96, key: 'A major', mood: 'sunlit, bittersweet, intimate', scene: 'coming-of-age film, train-window montage', voice: 'Female airy mezzo-soprano', vocal: '轻盈、带笑意的气声，咬字柔和但字尾干净；副歌像终于敢承认的想念。', arrangement: 'nylon guitar、手拍、木贝斯、单簧管、室内弦乐和车站环境声。', mix: '人声温暖前置，吉他左右轻分开，单簧管在间奏靠近中央，保留木质动态。', emotion: '迟到的想念', place: '午后开往北方的列车', image: '车窗反光', titles: ['把夏天折进车票', '下一站没有你'], lines: ['车窗把云朵折成两半', '我把夏天折进车票', '下一站没有你 也有风'] },
  { genre: 'Trip-hop / Orchestral Noir', bpm: 74, key: 'C minor', mood: 'smoky, suspenseful, wounded', scene: 'crime drama credits, rain-soaked city', voice: 'Female cinematic contralto', vocal: '深色低音、略带烟雾感；每个辅音有锋利边缘，高潮压抑地爆发。', arrangement: 'dusty breakbeat、低音提琴拨奏、准备钢琴、反向弦乐、低频铜管与磁带噪声。', mix: '干而近的主唱对比深黑混响，鼓组窄，弦乐只在关键句推向宽幅。', emotion: '带伤的清醒', place: '雨夜的旧城天桥', image: '霓虹倒影', titles: ['雨把证词洗掉', '霓虹不替谁作证'], lines: ['雨把霓虹揉进伤口', '我不再替沉默辩解', '天亮前请把门锁好'] },
  { genre: 'Afro House / Oriental Dance Pop', bpm: 118, key: 'E minor', mood: 'glowing, liberated, magnetic', scene: 'night festival, fashion runway', voice: 'Male falsetto lead with female response', vocal: '男声轻亮假声领唱，女声以短句回应；呼吸贴着律动，副歌释放而不嘶吼。', arrangement: 'Afro percussion、弹跳 sub、琵琶 pluck、marimba、手鼓群与分层 call-and-response。', mix: '低频集中有弹性，打击乐绕着听者移动，双人声在副歌拉成宽阔对话。', emotion: '重新找回身体', place: '海边凌晨的露天舞池', image: '金色汗水', titles: ['月亮在舞池失重', '把影子跳成火'], lines: ['鼓点从脚踝爬到肩膀', '今夜不必解释自己', '把影子跳成火'] },
  { genre: 'Post-rock / Chinese Cinematic Ballad', bpm: 68, key: 'G major', mood: 'vast, fragile, healing', scene: 'mountain documentary, reunion finale', voice: 'Male husky baritone', vocal: '宽厚而疲惫的男中音，主歌像自言自语；最后副歌以粗粝真声穿过失真吉他。', arrangement: '指弹吉他、e-bow、弓弦乐、渐强鼓组、失真吉他墙、笛子远景与山风现场声。', mix: '低频留白，主唱稳在中央；吉他墙从两侧缓慢升起，高潮保持可辨的动态层次。', emotion: '漫长后的和解', place: '雪线以下的山路', image: '远处的灯', titles: ['山背后还有灯', '把沉默背上山'], lines: ['风把脚印吹回身后', '山背后还有灯', '我终于学会原谅自己'] }
];

const $ = (id) => document.querySelector(id);
const history = JSON.parse(sessionStorage.getItem('taiyi-history') || '[]');
let songNumber = Number(sessionStorage.getItem('taiyi-song-number') || '0');
let currentWork;

function pick(list, salt) { return list[Math.abs(salt) % list.length]; }
function makeWork(number) {
  const profile = profiles[(number - 1) % profiles.length];
  const title = pick(profile.titles, Math.floor((number - 1) / profiles.length));
  const lineA = pick(profile.lines, number); const lineB = pick(profile.lines, number + 1); const lineC = pick(profile.lines, number + 2);
  const version = Math.floor((number - 1) / profiles.length) + 1;
  const lyric = `【主歌】\n${lineA}\n在${profile.place}，我把昨天留在身后\n${lineB}\n让${profile.image}替我记住这一刻\n\n【预副歌】\n原来有些告别 不必说得太响\n只要心还愿意向前\n\n【副歌】\n${title}\n${lineB}\n我不再向旧日借答案\n${lineC}\n当世界慢慢亮起来\n我会带着自己回到人海`;
  const concept = `第 ${number} 首的故事发生在${profile.place}。主角把无法立刻解决的心事交给${profile.image}，在一个微小的动作里重新向前。情绪核心是「${profile.emotion}」；它不承诺遗忘，只让人有勇气继续生活。`;
  const intensity = number % 2 ? 'Verse 35%, pre-chorus 55%, chorus 85%, final climax 100%.' : 'Verse 30%, pre-chorus 50%, chorus 80%, bridge 70%, final climax 100%.';
  const prompt = `Cinematic music production, professional studio recording, human emotional vocal performance, realistic breathing, natural articulation, warm analog texture, high dynamic range. Create an original Mandarin song titled "${title}" (creation ${number}, variation ${version}). ${profile.genre}, ${profile.bpm} BPM, ${profile.key}; mood: ${profile.mood}; target scene: ${profile.scene}. Story: ${concept} ${profile.voice} lead vocal. ${profile.vocal} Preserve natural inhalations and phrase changes, clear consonant attacks, full vowels, naturally released word endings. ${profile.arrangement} ${intensity} Absolutely no robotic AI tone, over-tuning, or plastic vocal sheen; make it feel like an authentic human take. Recording Chain: Microphone Neumann U87 Ai; Preamp Neve 1073; Interface Universal Audio Apollo x8p; Reverb Lexicon PCM96; Monitoring ATC SCM100ASL Pro and Yamaha NS-10M Studio. Vocal placement intimate front-center; cinematic wide stereo field; emotional EQ, transparent compression, dimensional Lexicon reverb. Master at -8 LUFS with analog warmth and preserved transients. Live sound design: L-Acoustics K1/K2, L-Acoustics SB28, L-Acoustics X15 HiQ, DiGiCo Quantum7, LA12X.`;
  return { number, title, profile, concept, lyric, prompt, scores: [94 + number % 4, 93 + number % 5, 95 + number % 4, 89 + number % 7, 92 + number % 6], directions: [[lineA, '首字轻起，句末留半拍自然吸气；不要剪掉呼吸声。'], [lineB, '中间关键词加重，尾字释放前给非常轻的颤音。'], [title, '这句进入胸腔共鸣，保持音高稳定，推至副歌峰值。'], [lineC, '最后四个字全情推进到 100%，随后不拖拍地回收。']] };
}

function render(work) {
  const p = work.profile;
  $('#songNumber').textContent = String(work.number).padStart(2, '0'); $('#songIndex').textContent = `SONG ${String(work.number).padStart(2, '0')} / 已完成`;
  $('#songTitle').textContent = work.title; $('#songGenre').textContent = p.genre;
  $('#concept').textContent = work.concept; $('#positioning').textContent = `Genre: ${p.genre} · BPM: ${p.bpm} · Key: ${p.key} · Mood: ${p.mood} · Era: contemporary / future-facing · Target Scene: ${p.scene}.`;
  $('#lyrics').textContent = work.lyric; $('#prompt').textContent = work.prompt; $('#voiceTitle').textContent = p.voice; $('#voiceDetails').textContent = p.vocal;
  $('#dynamics').textContent = '动态曲线：主歌 30%–35% · 预副歌 50%–55% · 副歌 80%–85% · 高潮 100%，最后保留一次真实换气。'; $('#arrangement').textContent = p.arrangement; $('#mix').textContent = p.mix;
  $('#directions').innerHTML = work.directions.map(([line, note], i) => `<article><b>0${i + 1}</b><div><strong>「${line}」</strong><p>${note}</p></div></article>`).join('');
  const labels = ['原创性', '音乐性', '情绪', '商业潜力', '电影适配']; $('#scores').innerHTML = work.scores.map((score, i) => `<article><span>${labels[i]}</span><strong>${score}</strong><i><b style="width:${score}%"></b></i></article>`).join('');
}
function addArchive(work) {
  history.unshift({ number: work.number, title: work.title, genre: work.profile.genre }); history.splice(8); sessionStorage.setItem('taiyi-history', JSON.stringify(history));
  $('#archiveList').innerHTML = history.map((item) => `<li><b>SONG ${String(item.number).padStart(2, '0')}</b><strong>${item.title}</strong><span>${item.genre}</span></li>`).join('');
}
function reportIfNeeded(work) {
  const report = $('#trendReport');
  if (work.number % 100 !== 0) { report.hidden = true; return; }
  report.hidden = false; report.innerHTML = `<p class="eyebrow">AI MUSIC TREND REPORT / 100 WORKS</p><h2>第 ${work.number} 首趋势报告</h2><p>本轮创作覆盖 ${profiles.length} 种差异化声线与编曲方向：电影感叙事、东方电子、木质原声、暗色 trip-hop 与身体律动。下一百首将继续避开已使用的主题组合，并强化短视频钩子、沉浸式空间与真人呼吸感。</p>`;
}
function createNext(scroll = false) {
  $('#engineState').textContent = 'COMPOSING'; $('#progressValue').textContent = 'IDEATING';
  setTimeout(() => { songNumber += 1; sessionStorage.setItem('taiyi-song-number', songNumber); currentWork = makeWork(songNumber); render(currentWork); addArchive(currentWork); reportIfNeeded(currentWork); $('#engineState').textContent = 'WRITING'; $('#progressValue').textContent = '100%'; if (scroll) $('#song').scrollIntoView({ behavior: 'smooth', block: 'start' }); }, 520);
}
function copyPrompt() { navigator.clipboard?.writeText(currentWork.prompt).catch(() => {}); $('#toast').classList.add('show'); setTimeout(() => $('#toast').classList.remove('show'), 2400); }
$('#createButton').addEventListener('click', () => createNext(true)); $('#copyButton').addEventListener('click', copyPrompt); $('#copyPromptButton').addEventListener('click', copyPrompt);
let seconds = 24; setInterval(() => { if (seconds === 0) { seconds = 24; createNext(); } else seconds -= 1; $('#nextCycle').textContent = `00:${String(seconds).padStart(2, '0')}`; }, 1000);
createNext();
