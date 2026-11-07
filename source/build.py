from pathlib import Path
import argparse
here=Path(__file__).resolve().parent
parser=argparse.ArgumentParser(description='Build a standalone CHAOS CLUB app')
parser.add_argument('--out', type=Path, default=here.parent/'CHAOS-CLUB-3.7-PLAY.html')
a=parser.parse_args()
h=(here/'index.html').read_text(encoding='utf-8')
h=h.replace('<link rel="stylesheet" href="styles.css">','<style>\n'+(here/'styles.css').read_text(encoding='utf-8')+'\n</style>')
for name in ['base-data','content','content-boost','party-packs','editorial-content','guides','club24','club25','club26','club27','app']:
 h=h.replace(f'<script src="{name}.js"></script>', '<script>\n'+(here/(name+'.js')).read_text(encoding='utf-8')+'\n</script>')
a.out.parent.mkdir(parents=True,exist_ok=True)
a.out.write_text(h,encoding='utf-8')
print('built',a.out,a.out.stat().st_size)
