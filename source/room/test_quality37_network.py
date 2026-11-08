"""V3.7 LAN packaging regression: /offline must serve this exact standalone build."""
import asyncio
from pathlib import Path
from aiohttp.test_utils import TestClient, TestServer
import server

async def main():
    expected=(Path(__file__).resolve().parent.parent.parent/'CHAOS-CLUB-3.7-PLAY.html').read_bytes()
    async with TestClient(TestServer(server.create_app())) as client:
        response=await client.get('/offline')
        assert response.status==200,response.status
        assert await response.read()==expected,'LAN offline route did not serve exact build'
        response=await client.get('/room/')
        assert response.status==200 and b'CHAOS' in await response.read()
        for forbidden in ['/room/content.json','/room/fact-provenance.json','/room/server.py']:
            response=await client.get(forbidden)
            assert response.status==404,(forbidden,response.status)
    print('PASS V3.7 exact LAN /offline, room UI, private server assets denied')

if __name__=='__main__':asyncio.run(main())
