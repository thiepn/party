#!/usr/bin/env python3
"""Split the original local 4.0.1 room content into public prompts and PRIVATE fact answers.
Never commit --private output or the source/room/content.json input to a public repository.
"""
import argparse, json
from pathlib import Path
p=argparse.ArgumentParser()
p.add_argument('--input',type=Path,default=Path('source/room/content.json'))
p.add_argument('--public',type=Path,default=Path('server/cloudflare/src/public-prompts.json'))
p.add_argument('--private',type=Path,default=Path('private/room-facts.json'))
a=p.parse_args(); data=json.loads(a.input.read_text('utf-8')); hidden={}
for i, entry in enumerate(data['bluff']['fact']):
    key=f'fact-{i:03d}'
    assert entry['type']=='fact' and 'answer' in entry
    hidden[key]={'answer':entry.pop('answer'),'source':entry.pop('source',None)}
    entry['factId']=key
assert hidden
for path,obj in ((a.public,data),(a.private,hidden)):
    path.parent.mkdir(parents=True,exist_ok=True)
    path.write_text(json.dumps(obj,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
print(f'Public prompts: {sum(len(v) for g in data.values() for v in g.values())}; private fact answers: {len(hidden)}')
