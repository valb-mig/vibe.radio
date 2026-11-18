import { Radio } from "@/core/radio"
import { catalog } from "@/infra/catalog"
import { read, write } from "@/infra/prefs"
import { Static } from "@/infra/static"
import { YouTubePlayer } from "@/infra/youtube"

const client = typeof window !== "undefined"

export const player = client ? new YouTubePlayer() : undefined

export const radio = player && new Radio(catalog, player, new Static(), read())

radio?.subscribe(() => write({ slug: radio.state.slug, level: radio.state.level }))
