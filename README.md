# vibe.radio

Every Grand Theft Auto VI radio station, live in the browser. Stations run on the clock like the game: tune in and you land mid-song, at the same moment as everyone else. Music plays through the YouTube IFrame API.

Fan project, not affiliated with Rockstar Games or Take-Two Interactive. Station data and artwork come from [gta.wiki](https://gta.wiki).

## Run

```bash
npm install
npm run dev
```

## Data

`data/stations.json` and `public/art/` are generated and committed.

```bash
npm run sync          # wiki, then youtube
npm run sync:wiki     # stations, tracklists and art from gta.wiki
npm run sync:tube     # resolve tracks without a video on YouTube Music
npm run sync -- --fresh   # re-download art and re-resolve every track
```

Stations come from `scripts/sync/wiki/registry.ts`. A station with no tracks on the wiki is skipped until the wiki fills in.

To force a video for a track, add `data/pins.json`, keyed by track id:

```json
{
  "phil-collins-against-all-odds-take-a-look-at-me-now": { "video": "wuvtoyVi7vY", "secs": 211 },
  "some-track-id": null
}
```

`null` takes the track off air.

## Layout

```
src/core     domain: stations, tracks, live clock, dial, Radio service, ports
src/infra    adapters: JSON catalog, YouTube player, static noise, prefs
src/ui       React components
src/app      Next.js routes
scripts/sync wiki source, art localizer, YouTube Music resolver
```

`core` has no framework imports. It talks to the outside through the ports in `src/core/ports.ts`.

## Keys

`Q` hold for the wheel, `←` `→` change station, `Space` power, `M` mute.

## Test

```bash
npm test
```
