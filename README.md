# CHAOS CLUB — Source and secure online rooms (draft)

Current live site: [party.thiepn.dev](https://party.thiepn.dev). **The production build is frozen.** This branch is an unmerged, non-deployed proposal for Cloudflare-hosted online rooms.

## Files

- `public/index.html` — exact frozen 4.0.1 standalone file, **unchanged** from production.
- `source/` — full original offline implementation, build script, legacy LAN server and regression tests, excluding three server-only Fact Trap data/hold files.
- `public/room/` — online room UI for Social Radar, Comedy Battle and Bluff Club; share links and locally encoded QR codes.
- `server/cloudflare/` — pure, independently tested rules engine, Durable Object/Worker adapter, public question bank, test fixtures, configuration.
- `scripts/split-private-content.py` — one-time extraction of real confidential fact answers into a **private** JSON file.
- `docs/` — architecture, privacy and release gates.

## Exact frozen offline build

```sh
python source/build.py --out /tmp/chaos-club-offline.html
sha256sum /tmp/chaos-club-offline.html
# Expected: 452806263e1cb06f779d6fc6ecd20274bdc2d4b89a7f9d23c35136ea8cc40794
```

This is the source-to-artifact guarantee. No changes to the 7 flagship families, 34 classic modes, offline game rules, or localStorage keys are authorized by this branch.

## Rules and transport tests

```sh
cd server/cloudflare
node --test test/*.test.mjs
node --check src/worker.mjs
```

Tests use **synthetic private fact answers** and a simulated Durable Object/WebSocket runtime. They do **not** claim native Cloudflare runtime, physical phone or production service acceptance.

## Do not deploy until acceptance

The Worker binds a private Cloudflare R2 bucket `chaos-club-private-facts`, holding `chaos-club/room-facts.json`. The original `source/room/content.json` must remain outside a public GitHub repository. To regenerate it locally, use an original trusted source archive:

```sh
python scripts/split-private-content.py --input /secure/source/room/content.json --public /tmp/public-prompts.json --private /secure/room-facts.json
```

Compare the generated public prompts with `server/cloudflare/src/public-prompts.json`; do not commit, log, or publish the private output. Configure the production R2 bucket and scoped bindings only under a separately authorized deployment. Cloudflare WAF rate-limits, access logging redaction and production staging checks are release requirements.

The online client defaults to `https://rooms.party.thiepn.dev` and will correctly display an unavailable-room error until the service is explicitly deployed and DNS configured. This branch must not change the existing public website.
