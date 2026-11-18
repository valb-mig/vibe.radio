import type { Player, Signal } from "@/core/ports"

type Native = {
  loadVideoById(o: { videoId: string; startSeconds?: number }): void
  stopVideo(): void
  seekTo(secs: number, ahead: boolean): void
  getCurrentTime(): number
  setVolume(level: number): void
  unMute(): void
  destroy(): void
}

type Api = {
  Player: new (el: HTMLElement, opts: object) => Native
  PlayerState: { ENDED: number; PLAYING: number }
}

declare global {
  interface Window {
    YT?: Api
    onYouTubeIframeAPIReady?: () => void
  }
}

let api: Promise<Api> | undefined

const boot = () =>
  (api ??= new Promise((done) => {
    if (window.YT?.Player) return done(window.YT)
    const prev = window.onYouTubeIframeAPIReady
    window.onYouTubeIframeAPIReady = () => {
      prev?.()
      done(window.YT!)
    }
    const tag = document.createElement("script")
    tag.src = "https://www.youtube.com/iframe_api"
    document.head.append(tag)
  }))

export class YouTubePlayer implements Player {
  #yt?: Native
  #ready = false
  #pending?: (yt: Native) => void
  #subs = new Map<Signal, Set<(code?: number) => void>>()
  #level = 80
  #gone = false

  #host?: HTMLElement

  mount(host: HTMLElement) {
    if (this.#host) return
    this.#host = host
    const el = document.createElement("div")
    host.replaceChildren(el)
    boot().then((YT) => {
      if (this.#gone) return
      this.#yt = new YT.Player(el, {
        width: "100%",
        height: "100%",
        playerVars: {
          autoplay: 1,
          controls: 0,
          disablekb: 1,
          fs: 0,
          rel: 0,
          playsinline: 1,
          iv_load_policy: 3,
          origin: location.origin,
        },
        events: {
          onReady: () => {
            this.#ready = true
            this.#yt!.setVolume(this.#level)
            this.#pending?.(this.#yt!)
            this.#pending = undefined
          },
          onStateChange: (e: { data: number }) => {
            if (e.data === YT.PlayerState.ENDED) this.#emit("end")
            if (e.data === YT.PlayerState.PLAYING) this.#emit("play")
          },
          onError: (e: { data: number }) => this.#emit("error", e.data),
        },
      })
    })
  }

  load(video: string, from: number) {
    this.#run((yt) => {
      yt.unMute()
      yt.loadVideoById({ videoId: video, startSeconds: Math.floor(from) })
    })
  }

  stop() {
    this.#run((yt) => yt.stopVideo())
  }

  seek(secs: number) {
    if (this.#ready) this.#yt!.seekTo(secs, true)
  }

  time() {
    return this.#ready ? this.#yt!.getCurrentTime() : 0
  }

  volume(level: number) {
    this.#level = level
    if (this.#ready) this.#yt!.setVolume(level)
  }

  on(signal: Signal, fn: (code?: number) => void) {
    const set = this.#subs.get(signal) ?? new Set()
    set.add(fn)
    this.#subs.set(signal, set)
  }

  destroy() {
    this.#gone = true
    this.#yt?.destroy()
  }

  #run(fn: (yt: Native) => void) {
    if (this.#ready) fn(this.#yt!)
    else this.#pending = fn
  }

  #emit(signal: Signal, code?: number) {
    for (const fn of this.#subs.get(signal) ?? []) fn(code)
  }
}
