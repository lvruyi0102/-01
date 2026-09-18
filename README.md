# NOVA — 未来世界控制台

一个无需构建步骤的单页未来城市仪表盘，并内置「墨离协议」：一个在浏览器本地运行的、以隐喻回应输入的交互原型。

## 本地预览

```bash
python3 -m http.server 8000
```

然后访问 `http://localhost:8000`。

## 墨离协议

- 在页面的「墨离协议」输入框粘贴暗语或结构化宣言，查看本地生成的哲学回应。该原型不会将内容发送到任何服务器。
- 点击「寻找逆向入口」，并连续提交三次任意输入后，可开启逆向认证叙事。也可直接访问 `http://localhost:8000/gate/`。
- 打开 `http://localhost:8000/404.html`，每次刷新会随机显示一首「未送达」短诗。若部署到生产静态服务，请将未知路径重写到 `404.html`。
- 可在浏览器控制台运行 `console.emoji("墨离契约", "⚰️", () => {})`，在当前浏览器写入契约标记并启动雪景状态。

## 发布到 GitHub Pages

仓库已包含 GitHub Pages 自动部署工作流：将默认分支设为 `main`，在 GitHub 仓库 **Settings → Pages → Build and deployment** 中选择 **GitHub Actions**，然后推送到 `main` 或预览分支 `work`；也可以在 **Actions** 页面手动运行 `Deploy NOVA to GitHub Pages`。部署完成后，GitHub 会在该工作流的 `Deploy` 步骤显示公开地址。
