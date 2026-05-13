/* ============================================================
   合同会社BISIN — chatbot.js
   COOLSPA導入相談チャットウィジェット
   送信先: bisin202603@gmail.com (mailto / メールソフト起動)
   ============================================================ */
(function () {
  'use strict';

  /* ── LINE公式アカウントURL（差し替え可） ── */
  var LINE_URL = 'https://lin.ee/BISIN';

  /* ── Qualification steps ── */
  var STEPS = [
    {
      id: 'genre',
      q: 'サロンの業種をお聞かせください。',
      choices: ['ネイルサロン', 'エステサロン', '美容室', 'リラクゼーション', 'その他'],
    },
    {
      id: 'area',
      q: '店舗のエリアはどちらですか？',
      choices: ['福岡市内', '九州（福岡市外）', '関西・関東', 'その他の地域'],
    },
    {
      id: 'purpose',
      q: '導入のご目的を教えてください。',
      choices: ['客単価・売上UP', '新メニューの追加', '放置型メニューが欲しい', '痩身メニューの強化'],
    },
    {
      id: 'hope',
      q: '今すぐご希望の内容は？',
      choices: ['無料デモを体験したい', '資料を見たい', '料金・プランを確認したい', 'LINEで相談したい'],
    },
  ];

  var TOTAL_STEPS = STEPS.length + 2;

  /* ── State ── */
  var isOpen = false;
  var answers = {};
  var currentStep = 0;

  /* ── Build DOM on first load ── */
  function buildWidget() {
    /* Launcher */
    var launcher = el('button', { className: 'cb-launcher', id: 'cbLauncher', 'aria-label': 'COOLSPA導入相談を開く' });
    launcher.innerHTML =
      '<div class="cb-launcher__circle">' +
        iconSnowflake() +
        '<span class="cb-launcher__badge" id="cbBadge" aria-hidden="true">1</span>' +
      '</div>' +
      '<span class="cb-launcher__label">導入相談はこちら</span>';

    /* Window */
    var win = el('div', { className: 'cb-window cb-hidden', id: 'cbWindow', role: 'dialog', 'aria-label': 'COOLSPA導入相談チャット' });
    win.innerHTML =
      /* Header */
      '<div class="cb-header">' +
        '<div class="cb-header__icon">' + iconSnowflake() + '</div>' +
        '<div class="cb-header__info">' +
          '<div class="cb-header__title">COOLSPA 導入相談</div>' +
          '<div class="cb-header__sub">オンライン — すぐにご案内します</div>' +
        '</div>' +
        '<button class="cb-header__close" id="cbClose" aria-label="閉じる">' +
          '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M18 6L6 18M6 6l12 12"/></svg>' +
        '</button>' +
      '</div>' +
      /* Progress */
      '<div class="cb-progress"><div class="cb-progress__fill" id="cbProgress"></div></div>' +
      /* Body */
      '<div class="cb-body" id="cbBody"></div>' +
      /* Footer */
      '<div class="cb-footer">' +
        '<input class="cb-footer__input" id="cbInput" type="text" placeholder="その他のご質問はこちら…" autocomplete="off" aria-label="メッセージ入力" />' +
        '<button class="cb-footer__send" id="cbSend" aria-label="送信">' +
          '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>' +
        '</button>' +
      '</div>';

    document.body.appendChild(launcher);
    document.body.appendChild(win);

    /* Events */
    launcher.addEventListener('click', function () { isOpen ? close() : open(); });
    document.getElementById('cbClose').addEventListener('click', close);
    document.getElementById('cbSend').addEventListener('click', handleFreeText);
    document.getElementById('cbInput').addEventListener('keydown', function (e) {
      if (e.key === 'Enter') handleFreeText();
    });

    /* Auto-open on first visit */
    if (!sessionStorage.getItem('bisin-chat-seen')) {
      setTimeout(function () {
        sessionStorage.setItem('bisin-chat-seen', '1');
        open();
      }, 4000);
    }
  }

  /* ── Open / close ── */
  function open() {
    isOpen = true;
    document.getElementById('cbWindow').classList.remove('cb-hidden');
    document.getElementById('cbBadge').style.display = 'none';
    if (document.getElementById('cbBody').childElementCount === 0) {
      setProgress(0);
      typing(function () {
        addEl(botBubble(
          'こんにちは。COOLSPAの導入について、気になることをすぐに確認できます。<br><br>' +
          '<strong>導入費用・収益シミュレーション・無料デモ予約</strong>など、お気軽にご相談ください。'
        ));
        setTimeout(buildActionGrid, 500);
      }, 700);
    }
    document.getElementById('cbInput').focus();
  }

  function close() {
    isOpen = false;
    document.getElementById('cbWindow').classList.add('cb-hidden');
  }

  /* ── Progress ── */
  function setProgress(step) {
    document.getElementById('cbProgress').style.width = Math.round((step / TOTAL_STEPS) * 100) + '%';
  }

  /* ── DOM helpers ── */
  function el(tag, attrs) {
    var node = document.createElement(tag);
    Object.keys(attrs || {}).forEach(function (k) { node.setAttribute(k, attrs[k]); });
    return node;
  }

  function scroll() {
    var body = document.getElementById('cbBody');
    if (body) body.scrollTop = body.scrollHeight;
  }

  function addEl(node) {
    document.getElementById('cbBody').appendChild(node);
    scroll();
  }

  function botBubble(html) {
    var d = document.createElement('div');
    d.className = 'cb-bubble-bot';
    d.innerHTML = html;
    return d;
  }

  function userBubble(text) {
    var d = document.createElement('div');
    d.className = 'cb-bubble-user';
    d.textContent = text;
    return d;
  }

  function typing(cb, ms) {
    ms = ms || 750;
    var wrap = document.createElement('div');
    wrap.className = 'cb-typing';
    wrap.innerHTML = '<div class="cb-typing__dot"></div><div class="cb-typing__dot"></div><div class="cb-typing__dot"></div>';
    addEl(wrap);
    setTimeout(function () { wrap.remove(); cb(); scroll(); }, ms);
  }

  /* ── SVG icons ── */
  function iconSnowflake() {
    return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">' +
      '<line x1="12" y1="3" x2="12" y2="21"/><line x1="3" y1="12" x2="21" y2="12"/>' +
      '<line x1="5.6" y1="5.6" x2="18.4" y2="18.4"/><line x1="18.4" y1="5.6" x2="5.6" y2="18.4"/>' +
      '<circle cx="12" cy="12" r="2" fill="#4BB3FF" stroke="none"/>' +
      '</svg>';
  }

  function iconLine() {
    return '<svg viewBox="0 0 24 24" fill="currentColor" width="14" height="14">' +
      '<path d="M20 10.1C20 5.6 15.5 2 10 2S0 5.6 0 10.1c0 4 3.6 7.4 8.4 8l.6.1v-1.4H7.5v-2h1.5V13c0-1.7 1-2.5 2.4-2.5.7 0 1.4.1 2.1.2v1.9h-1.1c-.7 0-.9.4-.9.8v1.2h1.9l-.3 2h-1.6v4.3c5.1-.7 9-4.1 9-8.8z"/>' +
      '</svg>';
  }

  function iconMail() {
    return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" width="14" height="14">' +
      '<path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>' +
      '<polyline points="22,6 12,13 2,6"/>' +
      '</svg>';
  }

  /* ── Action grid ── */
  var ACTIONS = [
    {
      label: '導入費用を\n知りたい',
      intent: 'cost',
      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="9"/><path d="M12 6v12M9 9.5c0-1.4 1.3-2.5 3-2.5s3 1.1 3 2.5-1.3 2.5-3 2.5-3 1.1-3 2.5 1.3 2.5 3 2.5 3-1.1 3-2.5"/></svg>',
    },
    {
      label: '無料デモを\n予約したい',
      intent: 'demo',
      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>',
    },
    {
      label: '自分のサロンに\n合うか相談したい',
      intent: 'consult',
      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg>',
    },
    {
      label: '資料を\n見たい',
      intent: 'doc',
      icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>',
    },
  ];

  function buildActionGrid() {
    var grid = document.createElement('div');
    grid.className = 'cb-grid';
    ACTIONS.forEach(function (a) {
      var btn = document.createElement('button');
      btn.className = 'cb-grid__btn';
      btn.innerHTML =
        '<div class="cb-grid__icon">' + a.icon + '</div>' +
        '<span style="white-space:pre-line">' + a.label + '</span>';
      btn.addEventListener('click', function () { handleAction(a, grid); });
      grid.appendChild(btn);
    });
    addEl(grid);
  }

  function handleAction(action, grid) {
    grid.querySelectorAll('.cb-grid__btn').forEach(function (b) { b.disabled = true; });
    answers.intent = action.intent;
    addEl(userBubble(action.label.replace('\n', '')));

    var map = {
      cost:    'ありがとうございます。導入費用についてご案内するため、いくつか確認させてください。',
      demo:    '無料デモのご予約を承ります！まず、いくつかお聞きします。',
      consult: 'お客様のサロンに最適なご提案をいたします。状況を確認させてください。',
      doc:     '最適な資料をお送りするため、いくつかお聞きします。',
    };

    setProgress(1);
    typing(function () {
      addEl(botBubble(map[action.intent]));
      setTimeout(showStep, 400);
    });
  }

  /* ── Qualification flow ── */
  function showStep() {
    if (currentStep >= STEPS.length) { showFormPanel(); return; }
    var step = STEPS[currentStep];
    setProgress(currentStep + 2);
    typing(function () {
      addEl(botBubble(step.q));
      setTimeout(function () { buildChoices(step); }, 300);
    }, 650);
  }

  function buildChoices(step) {
    var group = document.createElement('div');
    group.className = 'cb-choices';
    step.choices.forEach(function (c) {
      var btn = document.createElement('button');
      btn.className = 'cb-choice';
      btn.textContent = c;
      btn.addEventListener('click', function () {
        group.querySelectorAll('.cb-choice').forEach(function (b) { b.disabled = true; });
        btn.classList.add('cb-selected');
        answers[step.id] = c;
        addEl(userBubble(c));
        currentStep++;
        setTimeout(showStep, 350);
      });
      group.appendChild(btn);
    });
    addEl(group);
  }

  /* ── Contact form ── */
  function showFormPanel() {
    setProgress(TOTAL_STEPS);
    typing(function () {
      addEl(botBubble(
        'ありがとうございます！最後にご連絡先を教えてください。<br>' +
        '選択いただいた内容を添えてご担当者よりご連絡いたします。'
      ));
      setTimeout(buildForm, 400);
    }, 650);
  }

  function buildForm() {
    var panel = document.createElement('div');

    /* Summary */
    var rows = [
      { label: '業種',   val: answers.genre   || '—' },
      { label: 'エリア', val: answers.area     || '—' },
      { label: '目的',   val: answers.purpose  || '—' },
      { label: 'ご希望', val: answers.hope     || '—' },
    ];
    var rowHtml = rows.map(function (r) {
      return '<div class="cb-summary__row"><span class="cb-summary__label">' + r.label + '</span><span>' + r.val + '</span></div>';
    }).join('');

    panel.innerHTML =
      '<div class="cb-summary">' +
        '<div class="cb-summary__title">選択いただいた内容</div>' +
        rowHtml +
      '</div>' +
      '<form id="cbForm" novalidate>' +
        '<div class="cb-fields">' +

          '<div class="cb-field">' +
            '<label class="cb-label" for="cbName">お名前 <span class="cb-req">必須</span></label>' +
            '<input class="cb-input" type="text" id="cbName" name="name" placeholder="山田 花子" autocomplete="name" />' +
            '<span class="cb-errmsg" id="cbErrName">お名前を入力してください</span>' +
          '</div>' +

          '<div class="cb-field">' +
            '<label class="cb-label" for="cbSalon">サロン名 <span class="cb-req">必須</span></label>' +
            '<input class="cb-input" type="text" id="cbSalon" name="salon_name" placeholder="〇〇ネイルサロン" />' +
            '<span class="cb-errmsg" id="cbErrSalon">サロン名を入力してください</span>' +
          '</div>' +

          '<div class="cb-field">' +
            '<label class="cb-label" for="cbEmail">メールアドレス <span class="cb-req">必須</span></label>' +
            '<input class="cb-input" type="email" id="cbEmail" name="email" placeholder="example@salon.jp" autocomplete="email" />' +
            '<span class="cb-errmsg" id="cbErrEmail">正しいメールアドレスを入力してください</span>' +
          '</div>' +

          '<div class="cb-field">' +
            '<label class="cb-label" for="cbTel">電話番号 <span class="cb-opt">任意</span></label>' +
            '<input class="cb-input" type="tel" id="cbTel" name="tel" placeholder="092-XXX-XXXX" autocomplete="tel" />' +
          '</div>' +

          '<div class="cb-field">' +
            '<label class="cb-label" for="cbMsg">ご質問・ご要望 <span class="cb-opt">任意</span></label>' +
            '<textarea class="cb-textarea" id="cbMsg" name="message" placeholder="その他、気になることがあればご記入ください。"></textarea>' +
          '</div>' +

          /* Hidden fields — chatbot selections */
          '<input type="hidden" name="_subject" value="【COOLSPA導入相談】お問い合わせが届きました" />' +
          '<input type="hidden" name="チャット選択_業種"   id="cbHfGenre" />' +
          '<input type="hidden" name="チャット選択_エリア" id="cbHfArea" />' +
          '<input type="hidden" name="チャット選択_目的"   id="cbHfPurpose" />' +
          '<input type="hidden" name="チャット選択_希望"   id="cbHfHope" />' +
          '<input type="hidden" name="_next" value="/" />' +

          '<button type="submit" class="cb-submit" id="cbSubmit">' +
            '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" width="16" height="16"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>' +
            'この内容で送信する' +
          '</button>' +

          '<p class="cb-form-note">送信先：bisin202603@gmail.com<br>2営業日以内にご返答いたします。</p>' +

        '</div>' +
      '</form>';

    addEl(panel);

    /* Fill hidden fields */
    document.getElementById('cbHfGenre').value   = answers.genre   || '';
    document.getElementById('cbHfArea').value    = answers.area    || '';
    document.getElementById('cbHfPurpose').value = answers.purpose || '';
    document.getElementById('cbHfHope').value    = answers.hope    || '';

    /* Submit handler — mailto でメールソフトを起動 */
    document.getElementById('cbForm').addEventListener('submit', function (e) {
      e.preventDefault();
      if (!validateForm()) return;

      var submitBtn = document.getElementById('cbSubmit');
      submitBtn.disabled = true;
      submitBtn.innerHTML =
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg> メールを準備中…';

      openMailto();
    });
  }

  /* ── Validation ── */
  function validateForm() {
    var ok = true;
    var nameEl  = document.getElementById('cbName');
    var salonEl = document.getElementById('cbSalon');
    var emailEl = document.getElementById('cbEmail');

    [nameEl, salonEl, emailEl].forEach(function (el) {
      el.classList.remove('cb-error');
    });
    document.getElementById('cbErrName').style.display  = 'none';
    document.getElementById('cbErrSalon').style.display = 'none';
    document.getElementById('cbErrEmail').style.display = 'none';

    if (!nameEl.value.trim()) {
      nameEl.classList.add('cb-error');
      document.getElementById('cbErrName').style.display = 'block';
      ok = false;
    }
    if (!salonEl.value.trim()) {
      salonEl.classList.add('cb-error');
      document.getElementById('cbErrSalon').style.display = 'block';
      ok = false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailEl.value.trim())) {
      emailEl.classList.add('cb-error');
      document.getElementById('cbErrEmail').style.display = 'block';
      ok = false;
    }
    return ok;
  }

  /* ── mailto でメールソフトを起動 ── */
  function openMailto() {
    var name  = document.getElementById('cbName').value;
    var salon = document.getElementById('cbSalon').value;
    var email = document.getElementById('cbEmail').value;
    var tel   = document.getElementById('cbTel').value;
    var msg   = document.getElementById('cbMsg').value;

    var bodyText = [
      '■ お客様情報',
      'お名前　　　: ' + name,
      'サロン名　　: ' + salon,
      'メール　　　: ' + email,
      '電話番号　　: ' + (tel || '未記入'),
      '',
      '■ チャットでの選択内容',
      'サロン業種　: ' + (answers.genre   || '未回答'),
      '店舗エリア　: ' + (answers.area    || '未回答'),
      '導入目的　　: ' + (answers.purpose || '未回答'),
      'ご希望　　　: ' + (answers.hope    || '未回答'),
      '',
      '■ ご質問・ご要望',
      msg || '（なし）',
    ].join('\n');

    var subject = encodeURIComponent('【COOLSPA導入相談】お問い合わせ — ' + salon);
    var mailtoUrl = 'mailto:bisin202603@gmail.com?subject=' + subject + '&body=' + encodeURIComponent(bodyText);

    /* メールソフトを起動（新しいタブを開かずに遷移） */
    var link = document.createElement('a');
    link.href = mailtoUrl;
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    /* 少し待ってから完了画面を表示 */
    setTimeout(showSuccess, 600);
  }

  /* ── 完了画面（メールソフト起動後 + 送れない場合の連絡先表示） ── */
  function showSuccess() {
    var body = document.getElementById('cbBody');
    body.innerHTML = '';
    var panel = document.createElement('div');
    panel.className = 'cb-success';
    panel.innerHTML =
      '<div class="cb-success__icon">' +
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>' +
      '</div>' +
      '<div class="cb-success__title">メールソフトが開きます</div>' +
      '<div class="cb-success__desc">' +
        '内容はすでに入力済みです。<br>' +
        '送信ボタンを押してください。' +
      '</div>' +
      /* 送れない場合の連絡先 */
      '<div class="cb-fallback">' +
        '<div class="cb-fallback__title">メールソフトが開かない場合</div>' +
        '<a class="cb-fallback__email" href="mailto:bisin202603@gmail.com">bisin202603@gmail.com</a>' +
        '<div class="cb-fallback__tel">' +
          '<a href="tel:0942806688">📞 小郡店　0942-80-6688</a>' +
          '<a href="tel:0927535515">📞 天神店　0927-53-5515</a>' +
        '</div>' +
      '</div>' +
      '<div class="cb-cta-row" style="width:100%">' +
        '<a class="cb-cta-line" href="' + LINE_URL + '" target="_blank" rel="noopener">' +
          iconLine() + 'LINEで相談する' +
        '</a>' +
      '</div>';
    body.appendChild(panel);
  }

  /* ── Free-text handler ── */
  function handleFreeText() {
    var input = document.getElementById('cbInput');
    var val = input.value.trim();
    if (!val) return;
    input.value = '';
    addEl(userBubble(val));

    var PRICE_KW = ['価格', '費用', 'いくら', '料金', '値段'];
    if (PRICE_KW.some(function (k) { return val.includes(k); })) {
      typing(function () {
        addEl(botBubble('機器の導入費用はプランにより異なります。担当者より個別にご案内しますので、下記よりお問い合わせください。'));
        buildCtaRow();
      });
      return;
    }
    typing(function () {
      addEl(botBubble('ご質問ありがとうございます。担当者よりご案内いたします。'));
      buildCtaRow();
    });
  }

  function buildCtaRow() {
    var divider = document.createElement('div');
    divider.className = 'cb-divider';
    divider.textContent = 'LINEやお電話でもご相談いただけます。';
    addEl(divider);

    var row = document.createElement('div');
    row.className = 'cb-cta-row';

    var lineBtn = document.createElement('a');
    lineBtn.className = 'cb-cta-line';
    lineBtn.href = LINE_URL;
    lineBtn.target = '_blank';
    lineBtn.rel = 'noopener';
    lineBtn.innerHTML = iconLine() + 'LINEで相談する';

    var formBtn = document.createElement('button');
    formBtn.className = 'cb-cta-form';
    formBtn.innerHTML = iconMail() + 'お問い合わせフォーム';
    formBtn.addEventListener('click', showFormPanel);

    row.appendChild(lineBtn);
    row.appendChild(formBtn);
    addEl(row);
  }

  /* ── Init ── */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', buildWidget);
  } else {
    buildWidget();
  }
})();
