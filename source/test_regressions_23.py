"""Deterministic corrections for CHAOS CLUB 2.3. Run: python source/test_regressions_23.py."""
from pathlib import Path
import os, shutil
from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parent
HTML = (ROOT.parent / 'CHAOS-CLUB-3.7-PLAY.html').read_text(encoding='utf8')
CHROME = os.getenv('CHROMIUM_PATH') or shutil.which('chromium') or shutil.which('google-chrome')


def tap(p, a, value=None):
    selector = f'[data-act="{a}"]' + (f'[data-val="{value}"]' if value is not None else '')
    p.locator(selector).first.click(timeout=4000)


def launch_game(p, name):
    p.set_content(HTML)
    tap(p, 'legacy-toggle')
    tap(p, 'game', name)


def reveal_roles(p, game='undercover', count=6):
    launch_game(p, game)
    for _ in range(count):
        tap(p, 'role-see'); tap(p, 'role-next')
    if game == 'mimic':
        tap(p, 'mimic-cue'); tap(p, 'mimic-cue')
    tap(p, 'role-accuse')


def change_count(p, target):
    tap(p, 'settings')
    while True:
        count = len(p.locator('[data-player]').all())
        if count == target: break
        tap(p, 'plus' if count < target else 'minus')
    tap(p, 'settings-save')


with sync_playwright() as w:
    browser = w.chromium.launch(headless=True, executable_path=CHROME, args=['--no-sandbox'])
    p = browser.new_page(viewport={'width': 390, 'height': 844})
    errors = []
    p.on('pageerror', lambda e: errors.append(str(e)))

    reveal_roles(p)
    tap(p, 'role-vote-add', 0)
    assert p.locator('[data-act="role-decide"]').is_disabled(), 'early reveal must be impossible'
    for _ in range(4): tap(p, 'role-abstain')
    assert p.locator('[data-act="role-decide"]').is_disabled(), '5/6 must not be enough'
    tap(p, 'role-abstain')
    assert p.locator('[data-act="role-decide"]').is_enabled()
    tap(p, 'role-decide')
    assert p.locator('.play-card').count() == 1
    print('PASS incomplete votes blocked, explicit abstention accepted')

    reveal_roles(p)
    for _ in range(3): tap(p, 'role-vote-add', 0)
    for _ in range(3): tap(p, 'role-vote-add', 1)
    tap(p, 'role-decide')
    assert 'runoff' in p.locator('.play-card').inner_text().lower()
    assert p.locator('[data-act="role-decide"]').is_disabled()
    for _ in range(6): tap(p, 'role-vote-add', 0)
    tap(p, 'role-decide')
    assert p.locator('.play-card').count() == 1
    print('PASS runoff requires a fresh complete tally')

    launch_game(p, 'paranoia')
    tap(p, 'para-see'); tap(p, 'para-hide')
    assert p.locator('[data-act="para-nominated-yes"]').count() == 0
    tap(p, 'para-consent')
    assert 'reader' in p.locator('.play-card').inner_text().lower()
    tap(p, 'para-reader-yes')
    assert p.locator('[data-act="para-nominated-yes"]').count() == 1
    tap(p, 'para-nominated-yes')
    assert p.locator('[data-act="para-next"]').count() == 1
    print('PASS two-step Paranoia consent confirmation')

    launch_game(p, 'missions')
    for _ in range(6): tap(p, 'missions-see'); tap(p, 'missions-next')
    tap(p, 'home'); tap(p, 'settings')
    p.locator('[data-player="0"]').fill('Alice')
    tap(p, 'plus')
    assert p.locator('[data-player="0"]').input_value() == 'Alice', 'unsaved name lost on plus'
    tap(p, 'settings-save')
    assert p.locator('[data-act="missions-open"]').count() == 0, 'old mission state leaked'
    tap(p, 'legacy-toggle') if p.locator('[data-act="game"][data-val="missions"]').count()==0 else None
    tap(p, 'game', 'missions')
    assert 'undefined' not in p.locator('.play-card').inner_text().lower()
    tap(p, 'home'); tap(p, 'settings')
    assert p.locator('[data-player="0"]').input_value() == 'Alice'
    tap(p, 'minus'); tap(p, 'settings-save')
    assert p.locator('[data-act="missions-open"]').count() == 0
    print('PASS player changes retain name drafts but invalidate stale background state')

    launch_game(p, 'toast')
    change_count(p, 5)
    tap(p, 'legacy-toggle') if p.locator('[data-act="game"][data-val="toast"]').count()==0 else None
    tap(p, 'game', 'toast')
    counts = {f'Player {i}': 0 for i in range(1, 6)}
    for r in range(5):
        names = [a.inner_text().strip() for a in p.locator('.play-card .answer').all()]
        assert len(names) == 2, (r, names)
        for name in names:
            who = name.split('. ', 1)[1]
            counts[who] += 1
        tap(p, 'toast-tie')
    assert sorted(counts.values()) == [2]*5, counts
    assert p.locator('[data-act="restart"]').count() == 1
    print('PASS odd roster toast schedule is fair:', counts)

    launch_game(p, 'draw')
    p.locator('#private-text').fill('A cat takes a bus'); tap(p, 'draw-text')
    assert '2/6' in p.locator('.play-card').inner_text()
    tap(p, 'draw-alternative'); p.locator('#private-text').fill('A bus carrying a cat'); tap(p, 'draw-text')
    assert p.locator('#drawing').count() == 1, 'alternative drawing did not pass to next drawable turn'
    print('PASS drawing alternative hands off as an interpretable text prompt')

    launch_game(p, 'roulette')
    assert p.locator('[data-act="game"]').count() == 0
    tap(p, 'help')
    assert p.locator('.modal ol li').count() == 3
    p.locator('.modal button[data-act="close-modal"]').click()
    tap(p, 'lang'); tap(p, 'help')
    assert 'Lest die Karte' in p.locator('.modal').inner_text()
    p.locator('.modal button[data-act="close-modal"]').click()
    print('PASS game-specific concise guides in both languages')

    p.set_content(HTML)
    assert p.locator('.family-tile').count() == 7
    pool = p.evaluate('''() => ({mimic: window.CHAOS_EXTRA.mimic.length, expert: window.CHAOS_EXTRA.expert.length, bluff: window.CHAOS_EXTRA.bluffFacts.length, guides: Object.keys(window.CHAOS_GUIDES).length})''')
    assert pool['mimic'] >= 15 and pool['expert'] >= 20 and pool['bluff'] >= 18 and pool['guides'] == 34, pool
    print('PASS expanded bilingual content and guide coverage:', pool)
    assert not errors, errors
    print('PASS no JavaScript exceptions')
    browser.close()
