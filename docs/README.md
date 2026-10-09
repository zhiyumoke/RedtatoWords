# Redtato Words — 产品介绍页

这个目录是 [Redtato Words](https://github.com/zhiyumoke/RedtatoWords) 的**纯静态**介绍页，
用来做项目的第一印象落地页。它不依赖任何构建工具、包管理器或外部 CDN，
所有字体走系统字体栈，所有动画用原生 CSS 与少量原生 JS 实现。

> **发布方式**：这个目录是要放到**公开仓库** `zhiyumoke/RedtatoWords` 里的
> （源码仓库是私有的，两者分开）。把 `docs/` 整个目录复制过去，
> 然后在公开仓库的 Settings → Pages 里把来源选成 `main` 分支的 `/docs` 目录即可。
>
> ⚠️ 只复制 `docs/`，**不要**把这个仓库根目录的 `README.md` 一起带过去 ——
> 那份是私有源码仓库的说明，里面含对外不能出现的产品代称。
> 本目录内所有文件（含 `media/` 下的视频）都已确认不含那些字样。

```
docs/
├── index.html      页面结构
├── style.css       全部样式（含深色模式与响应式）
├── script.js       滚动进场、演示动画的播放控制、锚点焦点管理
├── README.md       本文件
└── media/
    ├── icon.png                  应用图标（来自 build/icon.png）
    ├── onboarding-step-1.webm    演示动画（共 6 段，1280×654）
    ├── onboarding-step-2.webm
    ├── onboarding-step-3.webm
    ├── onboarding-step-4.webm
    ├── onboarding-step-5.webm
    └── onboarding-step-6.webm
```

> 软件内置教程有 7 段，第 7 段是「教程结束」的收尾画面，页面没有采用
> （演示区只展示真正讲功能的 6 步），所以这里也没有放第 7 段的文件。

## 本地预览

因为页面引用了同目录下的 CSS / JS / 视频，直接双击 `index.html` 也能看，
但用本地 HTTP 服务更接近线上环境（推荐）：

```bash
# 在仓库根目录执行，任选一种
python -m http.server 8080 --directory docs
npx --yes serve docs
```

然后打开 <http://localhost:8080>。

## 开启 GitHub Pages

页面已经放在 `docs/` 目录下，可以直接用 GitHub 的「从分支目录发布」方式：

1. 打开仓库 **Settings → Pages**
2. **Source** 选择 `Deploy from a branch`
3. **Branch** 选择 `main`，目录选择 `/docs`，保存
4. 等一两分钟，访问 `https://<用户名>.github.io/RedtatoWords/`

> 仓库需要是公开的，Pages 才会对外可见。

## 维护说明

- **演示动画**：`media/onboarding-step-*.webm` 来自软件的引导演示录屏，
  但**已经用 ffmpeg 重新裁切过**，与 `src/renderer/public/onboarding/` 下的原片**不同**：

  ```bash
  # 原片 1280×800，顶部 146px 是录制时的窗口标题栏与会话栏（带旧产品名）
  # 裁掉这一条，输出 1280×654（高度取偶数以适配 yuv420p）
  ffmpeg -i 原片.webm -vf "crop=1280:654:0:146" \
         -c:v libvpx-vp9 -b:v 0 -crf 32 -an 输出.webm
  ```

  裁切是**做在文件上**的，不是靠 CSS 遮——这样任何人把 `.webm` 下载下来、
  拖进播放器、或从仓库里提取一帧，看到的画面都不含那个旧产品名。
  页面因此不需要任何裁切样式，视频直接铺满 `.step__box`（`aspect-ratio: 1280 / 654`）。
  裁掉的只是顶部状态条，核心演示内容（关键词输入、候选词列表、TAG 云、导出、结束页）全部保留。

  > 软件更新了引导动画后要重新裁一次：上面的命令跑一遍，覆盖 `media/` 即可。
- **改动文案**：全部文案都在 `index.html` 里，没有模板变量。
- **深浅色**：只跟随系统 `prefers-color-scheme`，页面本身不提供手动切换按钮。
- **动效**：`prefers-reduced-motion: reduce` 时进场动效关闭、演示动画不自动播放
  （改为显示原生播放控件，由用户自行决定）。
- **无障碍**：语义化标签、跳转链接、可见焦点样式、`<details>` 折叠面板、
  每个视频都有 `aria-label`，装饰性图形统一 `aria-hidden="true"`。
- **体积**：7 段动画合计约 18 MB，全部用 `preload="metadata"`，
  并且只有滚动到视口内才会播放，离开视口立刻暂停。
- **无外部依赖**：没有任何外链字体 / CSS / JS，断网也能完整显示。

## 许可

与主仓库一致：[MIT](https://github.com/zhiyumoke/RedtatoWords)。
