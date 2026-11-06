#!/usr/bin/env sh
set -eu
cd "$(dirname "$0")/../.."
python3 -m pip show aiohttp >/dev/null 2>&1 || { echo 'Install room dependencies: python3 -m pip install -r source/room/requirements.txt'; exit 1; }
exec python3 source/room/server.py --host 127.0.0.1 --port 8765
