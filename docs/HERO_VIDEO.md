# Hero Background Video Specification & Encoding

This document details the video encoding standards and fallback behavior for the Kraqen Innovations home hero background video.

## Video Specifications

- **Container:** MP4
- **Video Codec:** H.264 (libx264)
- **Profile:** High (`-profile:v high`)
- **Pixel Format:** YUV420p (`-pix_fmt yuv420p` — mandatory for broad browser compatibility, iOS Safari, and Chromium)
- **Audio:** No audio tracks (`-an`)
- **Optimization:** Faststart enabled (`-movflags +faststart` — moves moov atom to the beginning for immediate streaming)
- **Looping:** Seamless 8 to 15 second loop

### Desktop Video (`public/media/hero.mp4`)
- **Resolution:** 1920x1080 (1080p, 16:9)
- **Framerate:** 30 fps
- **Target Size:** Under 6 MB (Current: ~620 KB)
- **FFmpeg Command:**
  ```bash
  ffmpeg -i input.mp4 -vf "scale=1920:-2,fps=30" -c:v libx264 -profile:v high -pix_fmt yuv420p -crf 26 -preset slow -movflags +faststart -an public/media/hero.mp4
  ```

### Mobile Video (`public/media/hero-mobile.mp4`)
- **Resolution:** 720:-2 (approx 720x406)
- **Framerate:** 30 fps
- **Target Size:** Under 3 MB (Current: ~123 KB)
- **FFmpeg Command:**
  ```bash
  ffmpeg -i input.mp4 -vf "scale=720:-2,fps=30" -c:v libx264 -profile:v high -pix_fmt yuv420p -crf 28 -preset slow -movflags +faststart -an public/media/hero-mobile.mp4
  ```

### Poster Image (`public/media/hero-poster.webp`)
- **Format:** WebP
- **Resolution:** 1920x1080
- **Extracted from:** First frame of `hero.mp4`
- **FFmpeg Command:**
  ```bash
  ffmpeg -ss 00:00:00.100 -i public/media/hero.mp4 -vframes 1 public/media/hero-poster.webp
  ```

## Playback & Resilience Strategy

1. **Autoplay Resilience in React:**
   - React does not always serialize the HTML boolean `muted` attribute reliably across all hydration paths.
   - On client mount and on `canplay`:
     - `video.muted = true`
     - `video.defaultMuted = true`
     - `video.setAttribute('muted', '')`
     - `video.play().catch(() => {})`
2. **Adaptive Source Selection:**
   - Uses `hero-mobile.mp4` when screen width < 768px.
3. **Accessibility & Battery Conservation:**
   - When `prefers-reduced-motion: reduce` or `saveData` connection is detected, the video element is omitted and `hero-poster.webp` is displayed.
   - The video is automatically paused via `IntersectionObserver` when scrolled out of view or when document visibility is hidden (`document.hidden`).
4. **Missing File Fallback:**
   - If the video file is missing, the poster image displays without UI degradation, and `npm run content:check` flags the missing file.

