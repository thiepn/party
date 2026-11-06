# CHAOS CLUB V3.7 — Maintained source

**Status:** final cleanup phase toward V4.0; internal beta, not deployed or published. Seven flagship party experiences and all 34 legacy modes remain available. Local play works without accounts, and alcohol is never mandatory.

## What changed in V3.7

- **Party Deck Story mode** now actually differs from Relaxed mode: a relevant *optional* follow-up appears on every card without another click. Relaxed and Quick-fire retain their optional add-follow-up control.
- **King's Night** instructions now correctly explain that house rules expire after four *drawn* cards, even when some are skipped. Its final summary distinguishes completed and skipped cards without changing rule timing.
- The three V2.6 flagship games no longer show two equivalent finish actions on the final result screen. The seven home tiles no longer repeat identical “Full game · multiple modes” labels.
- Corrected the old King's Deck description (52 physical cards, 13 rank effects), clarified spoken Bluff Factory roles, and made the legacy German Toast Battle title natural.
- Improved labels for existing language, audio and settings controls. No new buttons or games.
- Fixed **packaged test integrity**: 12 existing browser scripts were still hardcoded to V3.5. They now load the exact V3.7 standalone artifact. Added a focused V3.7 UI regression and LAN `/offline` route regression; the room server now serves the correct V3.7 filename.

Game content pools, legacy IDs, save keys, LAN game rules, room privacy, token rotation, and prompt/factual-source files are unchanged. The V3.6 network duplicate-statement correction and V3.5 Fact Trap privacy protections remain in force.

## Run the offline HTML

Open `CHAOS-CLUB-3.7-PLAY.html` in a browser supporting local HTML. No server or login is needed. Native `file://` browser navigation was **blocked by the automated test environment**, so hardware acceptance remains for V3.8.

## Optional LAN rooms

1. Extract `CHAOS-CLUB-3.7-Local-Rooms.zip` on a computer with Python 3.10+.
2. From the extracted root, install dependencies: `python -m pip install -r source/room/requirements.txt`.
3. Run `python source/room/server.py --host 0.0.0.0 --port 8765` or a provided launcher.
4. Open `http://<LAN-IP>:8765/room/` on 4–6 devices using the same trusted private Wi-Fi.

Only Social Radar, Comedy Battle, and Bluff Club use simultaneous LAN rooms. The `/offline` route opens the self-contained version of all seven flagship games and all legacy modes. **LAN traffic is unencrypted HTTP/WebSocket; never expose this server to the public Internet.** Rooms are in memory and will be lost if the server shuts down.

## Rebuild and verify

From the extracted source ZIP root:

```sh
python source/build.py
python source/test_quality37.py
python source/test_flows.py
python source/test_deep24.py
python source/test_deep25.py
CHAOS26_TEST_PART=full python source/test_deep26.py
CHAOS26_TEST_PART=variants python source/test_deep26.py
CHAOS26_TEST_PART=recovery python source/test_deep26.py
python source/test_deep27.py
python source/test_layout26.py
(cd source/room && python test_rules.py && python test_network.py && python test_quality35_network.py && python test_quality36_network.py && python test_quality37_network.py && python test_quality36_browser.py)
```

The source ZIP includes the historical suites for further targeted checks. `source/export_room_content.cjs` is needed only if the separate room-content data actually changes; V3.7 does not alter room content.

## V3.8 requirements

Real sessions with independent groups of 4/5/6 people, verified English/German prompt quality, physical Android/iPhone browser acceptance, actual trusted-LAN room joining/reconnecting, and documented 30–60-minute voluntary enjoyment. These **have not occurred** in V3.7. Firefox/WebKit and native file-origin/localhost browser acceptance are unverified. See the audit and blank V3.8 protocol for exact gates.
