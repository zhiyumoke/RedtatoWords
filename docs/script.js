/* ==========================================================================
   Redtato Words — 落地页交互
   约束：无任何外部依赖，仅使用浏览器原生 API。
   ========================================================================== */
(function () {
  'use strict'

  var root = document.documentElement
  var motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')

  /* ------------------------------------------------------------------
     1. 页脚年份
     ------------------------------------------------------------------ */
  var yearEl = document.getElementById('year')
  if (yearEl) yearEl.textContent = String(new Date().getFullYear())

  /* ------------------------------------------------------------------
     2. 顶栏滚动状态
     ------------------------------------------------------------------ */
  var header = document.querySelector('.site-header')
  var ticking = false

  function syncHeader() {
    if (!header) return
    header.classList.toggle('is-stuck', window.scrollY > 8)
    ticking = false
  }
  function requestHeaderSync() {
    if (ticking) return
    ticking = true
    window.requestAnimationFrame(syncHeader)
  }
  syncHeader()
  window.addEventListener('scroll', requestHeaderSync, { passive: true })

  /* ------------------------------------------------------------------
     3. 滚动进场：IntersectionObserver，元素进入视口后只触发一次
     ------------------------------------------------------------------ */
  var revealEls = Array.prototype.slice.call(document.querySelectorAll('.reveal'))

  if (motionQuery.matches || typeof window.IntersectionObserver !== 'function') {
    // 关掉动效时直接显示，不注册观察器
    revealEls.forEach(function (el) { el.classList.add('is-in') })
  } else {
    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return
        entry.target.classList.add('is-in')
        revealObserver.unobserve(entry.target)
      })
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 })

    revealEls.forEach(function (el) { revealObserver.observe(el) })

    // 兜底：无论观察器是否生效，3 秒后全部显示，避免内容永远不可见
    window.setTimeout(function () {
      revealEls.forEach(function (el) { el.classList.add('is-in') })
    }, 3000)
  }

  /* ------------------------------------------------------------------
     4. 演示动画：只在进入视口时播放，离开即暂停
        （7 段视频同时解码会明显拖慢滚动，这对低配机器尤其重要）
     ------------------------------------------------------------------ */
  var videos = Array.prototype.slice.call(document.querySelectorAll('video.step__video'))

  function safePlay(video) {
    var p = video.play()
    if (p && typeof p.catch === 'function') {
      p.catch(function () { /* 自动播放被拦截时保持静默，首帧仍在 */ })
    }
  }

  function showFirstFrame(video) {
    // preload="metadata" 不一定会绘制首帧，轻推一下时间轴
    if (video.readyState >= 1 && video.currentTime === 0) {
      try { video.currentTime = 0.001 } catch (err) { /* 忽略 */ }
    }
  }

  videos.forEach(function (video) {
    video.muted = true
    video.setAttribute('muted', '')
    video.playsInline = true

    video.addEventListener('loadedmetadata', function () {
      if (motionQuery.matches) showFirstFrame(video)
    })

    // 文件缺失或格式不支持时给出可读的说明，而不是一块空白
    video.addEventListener('error', function () {
      var frame = video.parentElement
      if (!frame || frame.querySelector('.step__fallback')) return
      var note = document.createElement('p')
      note.className = 'step__fallback'
      note.textContent = '演示动画未能加载，请检查 media/ 目录下的文件是否完整。'
      frame.appendChild(note)
    })
  })

  if (motionQuery.matches) {
    // 尊重「减少动效」偏好：不自动播放，改为提供原生控件由用户自行播放
    videos.forEach(function (video) {
      video.removeAttribute('autoplay')
      video.pause()
      video.setAttribute('controls', '')
      if (video.readyState >= 1) showFirstFrame(video)
    })
  } else if (typeof window.IntersectionObserver === 'function') {
    var videoObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        var video = entry.target
        if (entry.isIntersecting) {
          safePlay(video)
        } else if (!video.paused) {
          video.pause()
        }
      })
    }, { rootMargin: '180px 0px', threshold: 0.05 })

    videos.forEach(function (video) { videoObserver.observe(video) })
  }

  // 动效偏好被实时改变时重新加载一次，让上面的分支重新生效
  var onMotionChange = function () { window.location.reload() }
  if (typeof motionQuery.addEventListener === 'function') {
    motionQuery.addEventListener('change', onMotionChange)
  } else if (typeof motionQuery.addListener === 'function') {
    motionQuery.addListener(onMotionChange)
  }

  /* ------------------------------------------------------------------
     5. 站内锚点：滚动之后把焦点交到目标区块，方便键盘与读屏用户
     ------------------------------------------------------------------ */
  Array.prototype.slice.call(document.querySelectorAll('a[href^="#"]')).forEach(function (link) {
    link.addEventListener('click', function () {
      var id = link.getAttribute('href').slice(1)
      if (!id) return
      var target = document.getElementById(id)
      if (!target) return
      if (!target.hasAttribute('tabindex')) target.setAttribute('tabindex', '-1')
      window.setTimeout(function () {
        target.focus({ preventScroll: true })
      }, motionQuery.matches ? 0 : 420)
    })
  })
})()
