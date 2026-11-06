#!/usr/bin/env sh
set -eu
cd "$(dirname "$0")/../.."
python3 -m pip show aiohttp >/dev/null 2>&1 || { echo 'Install room dependencies: python3 -m pip install -r source/room/requirements.txt'; exit 1; }
printf '%s\n' 'LAN mode: use only on private, trusted Wi-Fi. Traffic is unencrypted HTTP/WS.'
exec python3 source/room/server.py --host 0.0.0.0 --port 8765
