/* グラス点字 — Glass Tenji
   入力: タップ(Enter) と D-pad(矢印キー) のみ。Escape は PC 確認用の補助。
   点の番号: 1,2,3 が左列（上から）、4,5,6 が右列（上から） */
(function () {
  'use strict';

  var DEMO = /[?&]demo=1/.test(location.search);
  var LS_KEY = 'glass-tenji-best';

  // ---------- 点字データ ----------
  var VOWEL = { 'あ': [1], 'い': [1, 2], 'う': [1, 4], 'え': [1, 2, 4], 'お': [2, 4] };
  var DAN = ['あ段', 'い段', 'う段', 'え段', 'お段'];
  function num(d) { return '①②③④⑤⑥'.charAt(d - 1); }
  function nums(arr) { return arr.length ? arr.map(num).join('') : '（空マス）'; }
  function merge(a, b) { return a.concat(b).sort(function (x, y) { return x - y; }); }

  function seionCol(name, kanas, add, hint) {
    var vowels = ['あ', 'い', 'う', 'え', 'お'];
    return {
      name: name,
      items: kanas.map(function (k, i) {
        if (!k) return null;
        return { k: k, cells: [merge(VOWEL[vowels[i]], add)], hint: hint, col: name, row: DAN[i] };
      })
    };
  }
  function fixedCol(name, list, hint) {
    return {
      name: name,
      items: list.map(function (e, i) {
        if (!e) return null;
        return { k: e[0], cells: [e[1]], hint: e[2] || hint, col: name, row: DAN[i] };
      })
    };
  }
  var SEION = [
    seionCol('あ行', ['あ', 'い', 'う', 'え', 'お'], [], '母音は左上①を中心に、あ・い・う・え・お。この形がぜんぶの基本'),
    seionCol('か行', ['か', 'き', 'く', 'け', 'こ'], [6], 'か行 ＝ あ行の形 ＋ ⑥'),
    seionCol('さ行', ['さ', 'し', 'す', 'せ', 'そ'], [5, 6], 'さ行 ＝ あ行の形 ＋ ⑤⑥'),
    seionCol('た行', ['た', 'ち', 'つ', 'て', 'と'], [3, 5], 'た行 ＝ あ行の形 ＋ ③⑤'),
    seionCol('な行', ['な', 'に', 'ぬ', 'ね', 'の'], [3], 'な行 ＝ あ行の形 ＋ ③'),
    seionCol('は行', ['は', 'ひ', 'ふ', 'へ', 'ほ'], [3, 6], 'は行 ＝ あ行の形 ＋ ③⑥'),
    seionCol('ま行', ['ま', 'み', 'む', 'め', 'も'], [3, 5, 6], 'ま行 ＝ あ行の形 ＋ ③⑤⑥'),
    fixedCol('や行', [['や', [3, 4]], null, ['ゆ', [3, 4, 6]], null, ['よ', [3, 4, 5]]], 'や行は ③④ が基本。ゆ ＝ ＋⑥、よ ＝ ＋⑤'),
    seionCol('ら行', ['ら', 'り', 'る', 'れ', 'ろ'], [5], 'ら行 ＝ あ行の形 ＋ ⑤'),
    fixedCol('わ行', [['わ', [3]], ['ゐ', [2, 3]], null, ['ゑ', [2, 3, 5]], ['を', [3, 5]]], 'わ行 ＝ あ行の形を1段下にずらしたもの'),
    fixedCol('その他', [
      ['ん', [3, 5, 6], 'ん ＝ ③⑤⑥。「を」③⑤ に ⑥ を足した形'],
      ['っ', [2], '促音「っ」＝ ②だけ'],
      ['ー', [2, 5], '長音「ー」＝ ②⑤'],
      null, null
    ], '')
  ];
  function base(k) { // 清音の1マスを引く
    for (var c = 0; c < SEION.length; c++) {
      for (var r = 0; r < 5; r++) { var it = SEION[c].items[r]; if (it && it.k === k) return it.cells[0]; }
    }
    return [];
  }
  function prefixCol(name, kanas, bases, prefix, hint) {
    return {
      name: name,
      items: kanas.map(function (k, i) {
        if (!k) return null;
        return { k: k, cells: [prefix, base(bases[i])], hint: hint, col: name, row: DAN[i] };
      })
    };
  }
  var DAKUON = [
    prefixCol('が行', ['が', 'ぎ', 'ぐ', 'げ', 'ご'], ['か', 'き', 'く', 'け', 'こ'], [5], '濁音 ＝ 前に ⑤（濁音符）を置いて、か行'),
    prefixCol('ざ行', ['ざ', 'じ', 'ず', 'ぜ', 'ぞ'], ['さ', 'し', 'す', 'せ', 'そ'], [5], '濁音 ＝ 前に ⑤（濁音符）を置いて、さ行'),
    prefixCol('だ行', ['だ', 'ぢ', 'づ', 'で', 'ど'], ['た', 'ち', 'つ', 'て', 'と'], [5], '濁音 ＝ 前に ⑤（濁音符）を置いて、た行'),
    prefixCol('ば行', ['ば', 'び', 'ぶ', 'べ', 'ぼ'], ['は', 'ひ', 'ふ', 'へ', 'ほ'], [5], '濁音 ＝ 前に ⑤（濁音符）を置いて、は行'),
    prefixCol('ぱ行', ['ぱ', 'ぴ', 'ぷ', 'ぺ', 'ぽ'], ['は', 'ひ', 'ふ', 'へ', 'ほ'], [6], '半濁音 ＝ 前に ⑥（半濁音符）を置いて、は行')
  ];
  function yoonCol(head, baseHead, prefix, hint) {
    var ys = ['ゃ', 'ゅ', 'ょ'];
    var b = { 'か': ['か', 'く', 'こ'], 'さ': ['さ', 'す', 'そ'], 'た': ['た', 'つ', 'と'], 'な': ['な', 'ぬ', 'の'],
              'は': ['は', 'ふ', 'ほ'], 'ま': ['ま', 'む', 'も'], 'ら': ['ら', 'る', 'ろ'] }[baseHead];
    return {
      name: head + 'ゃ行',
      items: ys.map(function (y, i) {
        return { k: head + y, cells: [prefix, base(b[i])], hint: hint, col: head + 'ゃ行', row: ['ゃ', 'ゅ', 'ょ'][i] };
      })
    };
  }
  var YOON = [
    yoonCol('き', 'か', [4], '拗音 ＝ 前に ④（拗音符）。きゃ・きゅ・きょ ＝ ④ ＋ か・く・こ'),
    yoonCol('し', 'さ', [4], '拗音 ＝ 前に ④（拗音符）。しゃ・しゅ・しょ ＝ ④ ＋ さ・す・そ'),
    yoonCol('ち', 'た', [4], '拗音 ＝ 前に ④（拗音符）。ちゃ・ちゅ・ちょ ＝ ④ ＋ た・つ・と'),
    yoonCol('に', 'な', [4], '拗音 ＝ 前に ④（拗音符）。にゃ・にゅ・にょ ＝ ④ ＋ な・ぬ・の'),
    yoonCol('ひ', 'は', [4], '拗音 ＝ 前に ④（拗音符）。ひゃ・ひゅ・ひょ ＝ ④ ＋ は・ふ・ほ'),
    yoonCol('み', 'ま', [4], '拗音 ＝ 前に ④（拗音符）。みゃ・みゅ・みょ ＝ ④ ＋ ま・む・も'),
    yoonCol('り', 'ら', [4], '拗音 ＝ 前に ④（拗音符）。りゃ・りゅ・りょ ＝ ④ ＋ ら・る・ろ'),
    yoonCol('ぎ', 'か', [4, 5], '拗濁音 ＝ 前に ④⑤。ぎゃ・ぎゅ・ぎょ ＝ ④⑤ ＋ か・く・こ'),
    yoonCol('じ', 'さ', [4, 5], '拗濁音 ＝ 前に ④⑤。じゃ・じゅ・じょ ＝ ④⑤ ＋ さ・す・そ'),
    yoonCol('び', 'は', [4, 5], '拗濁音 ＝ 前に ④⑤。びゃ・びゅ・びょ ＝ ④⑤ ＋ は・ふ・ほ'),
    yoonCol('ぴ', 'は', [4, 6], '拗半濁音 ＝ 前に ④⑥。ぴゃ・ぴゅ・ぴょ ＝ ④⑥ ＋ は・ふ・ほ')
  ];
  var NUMSIGN = [3, 4, 5, 6];
  var DIGIT = { '1': [1], '2': [1, 2], '3': [1, 4], '4': [1, 4, 5], '5': [1, 5], '6': [1, 2, 4], '7': [1, 2, 4, 5], '8': [1, 2, 5], '9': [2, 4], '0': [2, 4, 5] };
  var DIGIT_LIKE = { '1': 'あ', '2': 'い', '3': 'う', '4': 'る', '5': 'ら', '6': 'え', '7': 'れ', '8': 'り', '9': 'お', '0': 'ろ' };
  function digitCol(name, ds) {
    return {
      name: name,
      items: ds.map(function (d) {
        return { k: d, cells: [NUMSIGN, DIGIT[d]], hint: '数字 ＝ 前に 数符③④⑤⑥。' + d + ' は「' + DIGIT_LIKE[d] + '」と同じ形', col: name, row: '' };
      })
    };
  }
  var NUMBERS = [
    digitCol('1〜5', ['1', '2', '3', '4', '5']),
    digitCol('6〜0', ['6', '7', '8', '9', '0']),
    fixedCol('記号', [
      ['。', [2, 5, 6], '句点「。」＝ ②⑤⑥'],
      ['、', [5, 6], '読点「、」＝ ⑤⑥'],
      ['？', [2, 6], '疑問符「？」＝ ②⑥'],
      ['！', [2, 3, 5], '感嘆符「！」＝ ②③⑤'],
      ['␣', [], '空マス（何も打たない）＝ 語と語のあいだの区切り']
    ], '')
  ];
  var PAGES = [
    { name: '清音', cols: SEION },
    { name: '濁音', cols: DAKUON },
    { name: '拗音', cols: YOON },
    { name: '数字・記号', cols: NUMBERS }
  ];
  function flat(cols, filter) {
    var out = [];
    cols.forEach(function (c) { c.items.forEach(function (it) { if (it && (!filter || filter(it))) out.push(it); }); });
    return out;
  }
  var POOL_A = flat(SEION, function (it) { return ['ゐ', 'ゑ', 'っ', 'ー'].indexOf(it.k) < 0; }); // 46文字
  var POOL_B = flat(DAKUON).concat(flat(YOON), flat(NUMBERS, function (it) { return it.k !== '␣'; }));

  // ---------- DOM ----------
  var $ = function (id) { return document.getElementById(id); };
  var hudRight = $('hud-right'), hint = $('hint');
  var screens = { menu: $('menu'), browse: $('browse'), quiz: $('quiz'), result: $('result') };

  function show(name) {
    Object.keys(screens).forEach(function (k) { screens[k].classList.toggle('hidden', k !== name); });
    state = name;
  }
  function setHint(t) { hint.textContent = t; }

  function makeCell(dots, small) {
    var el = document.createElement('div');
    el.className = 'cell' + (small ? ' small' : '');
    for (var d = 1; d <= 6; d++) {
      var dot = document.createElement('div');
      dot.className = 'dot' + (dots.indexOf(d) >= 0 ? ' on' : '');
      dot.setAttribute('data-d', d);
      el.appendChild(dot);
    }
    return el;
  }
  function renderCells(container, cells, small, animate) {
    container.innerHTML = '';
    var row = document.createElement('div');
    row.className = 'cells-row';
    cells.forEach(function (c) { row.appendChild(makeCell(c, small)); });
    container.appendChild(row);
    if (animate) popDots(container);
  }
  var popTimers = [];
  function popDots(container) {
    popTimers.forEach(clearTimeout); popTimers = [];
    var ons = container.querySelectorAll('.dot.on');
    for (var i = 0; i < ons.length; i++) {
      (function (el, i) {
        el.classList.remove('pop');
        popTimers.push(setTimeout(function () { el.classList.add('pop'); }, 60 + i * 90));
      })(ons[i], i);
    }
  }

  // ---------- 状態 ----------
  var state = 'menu';
  var best = { A: null, B: null };
  try { if (!DEMO) { var s = JSON.parse(localStorage.getItem(LS_KEY) || '{}'); best.A = s.A == null ? null : s.A; best.B = s.B == null ? null : s.B; } } catch (e) {}
  function saveBest() { if (DEMO) return; try { localStorage.setItem(LS_KEY, JSON.stringify(best)); } catch (e) {} }

  // ---------- メニュー ----------
  var MENU = [
    { label: '五十音表をみる', sub: '清音・濁音・拗音・数字', act: function () { openBrowse(0); } },
    { label: 'クイズ：清音', sub: '', act: function () { startQuiz('A'); } },
    { label: 'クイズ：濁音・拗音・数字', sub: '', act: function () { startQuiz('B'); } }
  ];
  var menuIdx = 0;
  function renderMenu() {
    var list = $('menu-list'); list.innerHTML = '';
    MENU.forEach(function (m, i) {
      var b = document.createElement('div');
      b.className = 'rail-btn' + (i === menuIdx ? ' cur' : '');
      var sub = m.sub;
      if (i === 1 && best.A != null) sub = 'ベスト ' + best.A + '/10';
      if (i === 2 && best.B != null) sub = 'ベスト ' + best.B + '/10';
      b.innerHTML = '<span>' + m.label + '</span><small>' + sub + '</small>';
      b.onclick = function () { menuIdx = i; renderMenu(); m.act(); };
      list.appendChild(b);
    });
  }
  function toMenu() {
    show('menu'); renderMenu();
    hudRight.textContent = '';
    setHint('↑↓でえらぶ　タップで決定');
  }

  // ---------- 一覧 ----------
  var page = 0, col = 0, row = 0, onTabs = false, tabIdx = 0;
  function cols() { return PAGES[page].cols; }
  function item() { var c = cols()[col]; return c ? c.items[row] : null; }
  function openBrowse(p) {
    page = p; col = 0; row = 0; onTabs = false; tabIdx = p;
    show('browse'); renderTabs(); renderGrid(); renderCard(true);
    hudRight.textContent = PAGES[page].name;
  }
  function renderTabs() {
    var t = $('tabs'); t.innerHTML = '';
    PAGES.forEach(function (pg, i) {
      var el = document.createElement('div');
      el.className = 'tab' + (i === page ? ' active' : '') + (onTabs && i === tabIdx ? ' cur' : '');
      el.textContent = pg.name;
      el.onclick = function () { page = i; col = 0; row = 0; onTabs = false; tabIdx = i; renderTabs(); renderGrid(); renderCard(true); hudRight.textContent = pg.name; };
      t.appendChild(el);
    });
    var back = document.createElement('div');
    back.className = 'tab back' + (onTabs && tabIdx === PAGES.length ? ' cur' : '');
    back.textContent = 'もどる';
    back.onclick = toMenu;
    t.appendChild(back);
    $('grid').classList.toggle('dim', onTabs);
    setHint(onTabs ? '←→でページ　タップで開く　↓で表にもどる' : '←→で行　↑↓で段　タップで点を浮かせる　↑で上のタブへ');
  }
  function renderGrid() {
    var g = $('grid'); g.innerHTML = '';
    cols().forEach(function (c, ci) {
      var colEl = document.createElement('div'); colEl.className = 'gcol';
      var rows = c.items.length;
      for (var ri = 0; ri < rows; ri++) {
        (function (ri) {
          var it = c.items[ri];
          var cell = document.createElement('div');
          cell.className = 'gcell' + (it ? '' : ' empty') + (it && it.k.length > 1 ? ' wide' : '') + (ci === col && ri === row ? ' cur' : '');
          cell.textContent = it ? it.k : '';
          if (it) cell.onclick = function () { col = ci; row = ri; onTabs = false; renderTabs(); renderGrid(); renderCard(true); };
          colEl.appendChild(cell);
        })(ri);
      }
      g.appendChild(colEl);
    });
  }
  function renderCard(animate) {
    var it = item();
    if (!it) return;
    renderCells($('cells'), it.cells, it.cells.length > 1, animate);
    $('card-kana').textContent = it.k === '␣' ? '空マス' : it.k;
    $('card-dots').textContent = it.cells.map(nums).join(' ＋ ');
    $('card-hint').textContent = it.hint;
  }
  function moveCol(d) {
    var n = cols().length;
    for (var i = 0; i < n; i++) {
      col = (col + d + n) % n;
      var items = cols()[col].items;
      if (items[row]) break;
      // 同じ段が空なら一番近い段へ
      var found = -1, bestDist = 99;
      for (var r = 0; r < items.length; r++) if (items[r] && Math.abs(r - row) < bestDist) { bestDist = Math.abs(r - row); found = r; }
      if (found >= 0) { row = found; break; }
    }
  }
  function moveRow(d) {
    var items = cols()[col].items, n = items.length;
    var r = row;
    for (var i = 0; i < n; i++) {
      r += d;
      if (r < 0) { onTabs = true; tabIdx = page; return; }
      if (r >= n) return;
      if (items[r]) { row = r; return; }
    }
  }
  function browseKey(k, tap) {
    if (onTabs) {
      if (k === 'ArrowLeft') tabIdx = (tabIdx + PAGES.length) % (PAGES.length + 1);
      else if (k === 'ArrowRight') tabIdx = (tabIdx + 1) % (PAGES.length + 1);
      else if (k === 'ArrowDown') { onTabs = false; }
      else if (tap) {
        if (tabIdx === PAGES.length) { toMenu(); return; }
        onTabs = false;
      }
      if (tabIdx < PAGES.length && page !== tabIdx) { page = tabIdx; col = 0; row = 0; hudRight.textContent = PAGES[page].name; renderGrid(); renderCard(true); }
      renderTabs(); renderGrid();
      return;
    }
    if (k === 'ArrowLeft') moveCol(-1);
    else if (k === 'ArrowRight') moveCol(1);
    else if (k === 'ArrowUp') moveRow(-1);
    else if (k === 'ArrowDown') moveRow(1);
    else if (tap) { popDots($('cells')); return; }
    renderTabs(); renderGrid(); renderCard(true);
  }

  // ---------- クイズ ----------
  var Q = { mode: 'A', qs: [], idx: 0, score: 0, choice: 0, locked: false };
  function shuffle(a) { for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
  function pickDistractors(pool, ans) {
    var same = pool.filter(function (it) { return it !== ans && (it.col === ans.col || (it.row && it.row === ans.row)); });
    var others = pool.filter(function (it) { return it !== ans && same.indexOf(it) < 0; });
    shuffle(same); shuffle(others);
    var out = [];
    while (out.length < 3) {
      var src = (out.length < 2 && same.length) ? same : (others.length ? others : same);
      if (!src.length) break;
      out.push(src.shift());
    }
    return out;
  }
  function startQuiz(mode) {
    var pool = mode === 'A' ? POOL_A : POOL_B;
    Q.mode = mode; Q.idx = 0; Q.score = 0; Q.choice = 0; Q.locked = false;
    Q.qs = shuffle(pool.slice()).slice(0, 10).map(function (ans) {
      return { ans: ans, choices: shuffle([ans].concat(pickDistractors(pool, ans))) };
    });
    show('quiz'); renderQuestion();
    setHint('←→↑↓でえらぶ　タップで答える');
  }
  function renderQuestion() {
    var q = Q.qs[Q.idx];
    hudRight.textContent = (Q.idx + 1) + ' / 10　⭐' + Q.score;
    renderCells($('q-cells'), q.ans.cells, false, true);
    $('q-text').textContent = q.ans.cells.length > 1 ? 'この2マスは？' : 'この点字は？';
    var fb = $('q-feedback'); fb.textContent = ''; fb.className = '';
    var box = $('q-choices'); box.innerHTML = '';
    q.choices.forEach(function (c, i) {
      var el = document.createElement('div');
      el.className = 'choice' + (c.k.length > 1 ? ' wide' : '') + (i === Q.choice ? ' cur' : '');
      el.textContent = c.k;
      el.onclick = function () { Q.choice = i; answer(); };
      box.appendChild(el);
    });
  }
  function answer() {
    if (Q.locked) return;
    Q.locked = true;
    var q = Q.qs[Q.idx];
    var els = $('q-choices').children;
    var ok = q.choices[Q.choice] === q.ans;
    if (ok) Q.score++;
    for (var i = 0; i < els.length; i++) {
      if (q.choices[i] === q.ans) els[i].classList.add('ok');
      else if (i === Q.choice) els[i].classList.add('ng');
      els[i].classList.remove('cur');
    }
    var fb = $('q-feedback');
    fb.textContent = ok ? '正解！　' + q.ans.hint.split('。')[0] : 'ざんねん…　正解は「' + q.ans.k + '」';
    fb.className = ok ? 'ok' : 'ng';
    hudRight.textContent = (Q.idx + 1) + ' / 10　⭐' + Q.score;
    setTimeout(function () {
      Q.idx++; Q.choice = 0; Q.locked = false;
      if (Q.idx >= 10) showResult(); else renderQuestion();
    }, ok ? 900 : 1500);
  }
  var resultIdx = 0;
  function showResult() {
    var b = best[Q.mode];
    var isNew = b == null || Q.score > b;
    if (isNew) { best[Q.mode] = Q.score; saveBest(); }
    show('result');
    $('r-logo').textContent = Q.score === 10 ? '🏆' : Q.score >= 7 ? '⭐' : '⠿';
    $('r-score').textContent = Q.score + ' / 10';
    $('r-sub').textContent = (Q.score === 10 ? 'パーフェクト！' : Q.score >= 7 ? 'いい感じ！' : '五十音表で復習しよう') + (isNew ? '　🆕 ベスト更新' : '　ベスト ' + best[Q.mode] + '/10');
    resultIdx = 0; renderResult();
    hudRight.textContent = '';
    setHint('↑↓でえらぶ　タップで決定');
  }
  var RESULT = [
    { label: 'もういちど', act: function () { startQuiz(Q.mode); } },
    { label: '五十音表をみる', act: function () { openBrowse(Q.mode === 'A' ? 0 : 1); } },
    { label: 'メニューへ', act: toMenu }
  ];
  function renderResult() {
    var list = $('r-list'); list.innerHTML = '';
    RESULT.forEach(function (m, i) {
      var b = document.createElement('div');
      b.className = 'rail-btn' + (i === resultIdx ? ' cur' : '');
      b.innerHTML = '<span>' + m.label + '</span>';
      b.onclick = function () { resultIdx = i; renderResult(); m.act(); };
      list.appendChild(b);
    });
  }

  // ---------- 入力 ----------
  function onKey(e) {
    var k = e.key;
    if (k === 'Escape') { if (state !== 'menu') toMenu(); e.preventDefault(); return; } // PC確認用の補助
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Enter', ' '].indexOf(k) < 0) return;
    e.preventDefault();
    var tap = k === 'Enter' || k === ' ';
    if (state === 'menu') {
      if (k === 'ArrowUp') menuIdx = (menuIdx + MENU.length - 1) % MENU.length;
      else if (k === 'ArrowDown') menuIdx = (menuIdx + 1) % MENU.length;
      else if (tap) { MENU[menuIdx].act(); return; }
      renderMenu();
    } else if (state === 'browse') {
      browseKey(k, tap);
    } else if (state === 'quiz') {
      if (Q.locked) return;
      if (k === 'ArrowLeft' || k === 'ArrowRight') Q.choice ^= 1;
      else if (k === 'ArrowUp' || k === 'ArrowDown') Q.choice ^= 2;
      else if (tap) { answer(); return; }
      var els = $('q-choices').children;
      for (var i = 0; i < els.length; i++) els[i].classList.toggle('cur', i === Q.choice);
    } else if (state === 'result') {
      if (k === 'ArrowUp') resultIdx = (resultIdx + RESULT.length - 1) % RESULT.length;
      else if (k === 'ArrowDown') resultIdx = (resultIdx + 1) % RESULT.length;
      else if (tap) { RESULT[resultIdx].act(); return; }
      renderResult();
    }
  }
  document.addEventListener('keydown', onKey);

  toMenu();
})();
