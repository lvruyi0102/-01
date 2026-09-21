# 浮生太一 · AI 音乐创作引擎

一个无需构建步骤的静态单页「自主音乐制作人」界面。它展示一套可运行的本地创作循环：自动提供原创歌曲概念、歌词、音乐定位、人声导演、录音链、舞台扩声、混音母带方案、逐句演唱指导、自评，以及可复制的专业 AI 音乐生成 Prompt。

## 本地预览

```bash
python3 -m http.server 8000
```

然后访问 `http://localhost:8000`。点击「生成下一首」可在内置原创作品之间切换；点击任意「复制 Prompt」按钮即可复制当前作品的完整英文生成提示词。

## 交付协议

每个作品档案包含：

- 原创歌曲概念、原创歌词与音乐定位（Genre、BPM、Key、Mood、Era、Target Scene）。
- 真实人声取向、动态曲线和逐句演唱指令。
- Neumann U87 Ai、Neve 1073、Universal Audio Apollo x8p、Lexicon PCM96、ATC 与 Yamaha 监听的录音链。
- L-Acoustics K1/K2、SB28、X15 HiQ、DiGiCo Quantum7、LA12X 的舞台扩声建议。
- 以 -8 LUFS 与模拟温暖感为基准的混音母带方案。
- 可直接粘贴至音乐生成模型的英文优先 Prompt。
