/* ============================================================
   合同会社BISIN — chatbot.js
   COOLSPA導入相談チャットウィジェット
   送信先: bisin202603@gmail.com (mailto / メールソフト起動)
   ============================================================ */
(function () {
  'use strict';

  /* ── LINE公式アカウントURL（差し替え可） ── */
  var LINE_URL = 'https://lin.ee/BISIN';

  /* ── Knowledge base — 6 topics ── */
  var TOPICS = {
    cryo: {
      label: '❄️ 脂肪冷却とは？',
      related: ['effect', 'areas', 'salon'],
      answer:
        'COOLSPAは<strong>クライオリポリシス（脂肪冷却）技術</strong>を採用した次世代痩身機器です。<br><br>' +
        '❄️ <strong>仕組み</strong><br>' +
        '脂肪細胞は約4℃から凍り始めますが、血液・神経・皮膚組織はその温度では影響を受けません。この差を利用して、<strong>脂肪細胞だけを選択的に凍結・分解</strong>します。<br><br>' +
        '✅ 切らない・痛みが少ない<br>' +
        '✅ ダウンタイムほぼなし<br>' +
        '✅ 部分痩せが可能<br>' +
        '✅ リバウンドしにくい<br><br>' +
        '通常ダイエットが脂肪の「大きさ」を縮めるのに対し、脂肪冷却は<strong>脂肪細胞の数そのものを減らす</strong>ため、リバウンドが起きにくいのが特徴です。',
    },
    effect: {
      label: '✨ 効果・施術回数',
      related: ['cryo', 'areas', 'demo'],
      answer:
        '実際のお客様データです（食事制限・激しい運動なし）。<br><br>' +
        '📊 <strong>施術実績</strong><br>' +
        '・30代女性 2回：腹囲 <strong>−6cm</strong>、ウエスト <strong>−3cm</strong><br>' +
        '・40代女性 5回：お腹 <strong>−5cm</strong>、太もも <strong>−3cm</strong><br>' +
        '・50代女性 5回：お腹 <strong>−10cm</strong>、ウエスト <strong>−10cm</strong><br>' +
        '・50代女性 7回：体重 <strong>−5.6kg</strong>、ウエスト <strong>−10cm</strong><br><br>' +
        '⏱ <strong>施術の目安</strong><br>' +
        '・1回あたり：約60〜90分（放置型なのでスタッフ不要）<br>' +
        '・推奨間隔：1〜2ヶ月に1回<br>' +
        '・効果実感：3〜5回で多くの方が変化を実感<br><br>' +
        '<span style="font-size:0.78em;opacity:0.7;">※効果には個人差があります。HotPepper評価 4.71/5.0（196件）</span>',
    },
    areas: {
      label: '📍 施術できる部位',
      related: ['effect', 'cryo', 'demo'],
      answer:
        'COOLSPAの専用アプリケーターで対応している部位です。<br><br>' +
        '📍 <strong>施術対応部位</strong><br>' +
        '・お腹・下腹部・わき腹<br>' +
        '・ウエスト（前後）<br>' +
        '・太もも（前面・外側・内側）<br>' +
        '・二の腕（上腕）<br>' +
        '・背中・ウエスト後ろ<br>' +
        '・お尻・ヒップライン<br><br>' +
        '360°冷却テクノロジーにより、アプリケーターが体の凹凸にフィットし、全方向から均一に冷却。<strong>気になる部位をピンポイントで集中ケア</strong>できます。',
    },
    salon: {
      label: '🏪 サロン導入について',
      related: ['demo', 'store'],
      answer:
        '<strong>COOLSPAはB2Bサロン向けの放置型痩身機器</strong>です。<br><br>' +
        '💡 <strong>放置型の特長</strong><br>' +
        '・施術中スタッフが付きっきり不要<br>' +
        '・他のお客様の対応と同時並行OK<br>' +
        '・1人〜少人数サロンでも無理なく運用可能<br>' +
        '・特別な工事不要、既存スペースに設置可能<br><br>' +
        '🛠 <strong>BISINのサポート内容</strong><br>' +
        '・現状ヒアリング＋ROIシミュレーション（無料）<br>' +
        '・現地設置＋スタッフ操作研修（半日）<br>' +
        '・施術プロトコルマニュアル一式提供<br>' +
        '・1年間メーカー保証／故障時代替機対応<br>' +
        '・電話・LINEサポート（月〜土 10:00〜20:00）<br><br>' +
        '⏱ <strong>最短2週間で稼働開始</strong>できます。<br>' +
        '<span style="font-size:0.78em;opacity:0.7;">※機器価格は担当者より個別にご案内します。</span>',
    },
    demo: {
      label: '📅 デモ体験の予約',
      related: ['salon', 'store'],
      answer:
        '<strong>無料デモ体験</strong>は2つの方法でご利用いただけます。<br><br>' +
        '📍 <strong>来店デモ（完全無料）</strong><br>' +
        '小郡店 または 天神店にてご体験いただけます。<br>' +
        '所要：約60〜90分<br>' +
        '内容：マシン体験・操作説明・メニュー設計アドバイス・収益シミュレーション<br><br>' +
        '📦 <strong>出張デモ</strong><br>' +
        '遠方のサロン様には条件によりご対応可能です。まずはご相談ください。<br><br>' +
        '📞 <strong>ご予約・お問い合わせ</strong><br>' +
        '小郡店　<a href="tel:0942806688" style="color:#1E6EDB;font-weight:700;">0942-80-6688</a><br>' +
        '天神店　<a href="tel:0927535515" style="color:#1E6EDB;font-weight:700;">0927-53-5515</a><br>' +
        '💬 LINEでのご予約も承っています',
    },
    store: {
      label: '🕐 店舗・営業時間',
      related: ['demo', 'salon'],
      answer:
        '◆ <strong>小郡店</strong><br>' +
        '📞 <a href="tel:0942806688" style="color:#1E6EDB;font-weight:700;">0942-80-6688</a><br>' +
        '⏰ 月〜土　10:00〜20:00（日祝休）<br><br>' +
        '◆ <strong>天神店（福岡市）</strong><br>' +
        '📞 <a href="tel:0927535515" style="color:#1E6EDB;font-weight:700;">0927-53-5515</a><br>' +
        '⏰ 月〜土　10:00〜20:00（日祝休）<br><br>' +
        '📍 <strong>本社住所</strong><br>' +
        '〒810-0004<br>福岡県福岡市中央区渡辺通５丁目２４−３０<br><br>' +
        '✉ <a href="mailto:bisin202603@gmail.com" style="color:#1E6EDB;">bisin202603@gmail.com</a><br>' +
        '<span style="font-size:0.78em;opacity:0.7;">2営業日以内にご返答いたします。</span>',
    },
  };

  var TOPIC_ORDER = ['cryo', 'effect', 'areas', 'salon', 'demo', 'store'];

  /* ── State ── */
  var isOpen  = false;
  var answers = {};

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
      '<div class="cb-progress"><div class="cb-progress__fill" id="cbProgress"></div></div>' +
      '<div class="cb-body" id="cbBody"></div>' +
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
          'こんにちは！COOLSPAについて知りたいことをお選びください。'
        ));
        setTimeout(buildTopicGrid, 400);
      }, 700);
    }
    document.getElementById('cbInput').focus();
  }

  function close() {
    isOpen = false;
    document.getElementById('cbWindow').classList.add('cb-hidden');
  }

  /* ── Progress ── */
  function setProgress(pct) {
    document.getElementById('cbProgress').style.width = pct + '%';
  }

  /* ── DOM helpers ── */
  function el(tag, attrs) {
    var node = document.createElement(tag);
    Object.keys(attrs || {}).forEach(function (k) {
      if (k === 'className') { node.className = attrs[k]; }
      else { node.setAttribute(k, attrs[k]); }
    });
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

  /* ── 6-topic grid ── */
  function buildTopicGrid() {
    var grid = document.createElement('div');
    grid.className = 'cb-topic-grid';
    TOPIC_ORDER.forEach(function (id) {
      var t = TOPICS[id];
      var btn = document.createElement('button');
      btn.className = 'cb-topic-btn';
      btn.textContent = t.label;
      btn.addEventListener('click', function () {
        grid.querySelectorAll('.cb-topic-btn').forEach(function (b) { b.disabled = true; b.style.opacity = '0.45'; });
        handleTopic(id);
      });
      grid.appendChild(btn);
    });
    addEl(grid);
  }

  /* ── Topic handler — shows answer + related chips ── */
  function handleTopic(id) {
    var t = TOPICS[id];
    answers.topic = t.label;
    setProgress(40);

    addEl(userBubble(t.label));
    typing(function () {
      addEl(botBubble(t.answer));
      setTimeout(function () { buildRelatedRow(t.related); }, 350);
    }, 680);
  }

  /* ── Related topic chips + contact CTA ── */
  function buildRelatedRow(relatedIds) {
    var wrap = document.createElement('div');
    wrap.className = 'cb-related-wrap';

    var lbl = document.createElement('div');
    lbl.className = 'cb-related-label';
    lbl.textContent = '他にご質問はありますか？';
    wrap.appendChild(lbl);

    var row = document.createElement('div');
    row.className = 'cb-related';

    relatedIds.forEach(function (id) {
      var t = TOPICS[id];
      var chip = document.createElement('button');
      chip.className = 'cb-related__chip';
      chip.textContent = t.label;
      chip.addEventListener('click', function () {
        disableWrap(wrap);
        handleTopic(id);
      });
      row.appendChild(chip);
    });

    /* お問い合わせフォーム chip */
    var formChip = document.createElement('button');
    formChip.className = 'cb-related__form';
    formChip.innerHTML = iconMail() + '&nbsp;お問い合わせフォーム';
    formChip.addEventListener('click', function () {
      disableWrap(wrap);
      showFormPanel();
    });
    row.appendChild(formChip);

    wrap.appendChild(row);
    addEl(wrap);
  }

  function disableWrap(wrap) {
    wrap.querySelectorAll('button').forEach(function (b) { b.disabled = true; b.style.opacity = '0.45'; });
  }

  /* ── Contact form ── */
  function showFormPanel() {
    setProgress(70);
    typing(function () {
      addEl(botBubble(
        'ありがとうございます！ご連絡先をご入力ください。<br>' +
        '担当者より2営業日以内にご返答いたします。'
      ));
      setTimeout(buildForm, 400);
    }, 650);
  }

  function buildForm() {
    var panel = document.createElement('div');

    panel.innerHTML =
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

          '<button type="submit" class="cb-submit" id="cbSubmit">' +
            '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" width="16" height="16"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>' +
            'この内容で送信する' +
          '</button>' +

          '<p class="cb-form-note">送信先：bisin202603@gmail.com<br>2営業日以内にご返答いたします。</p>' +

        '</div>' +
      '</form>';

    addEl(panel);

    document.getElementById('cbForm').addEventListener('submit', function (e) {
      e.preventDefault();
      if (!validateForm()) return;
      var submitBtn = document.getElementById('cbSubmit');
      submitBtn.disabled = true;
      submitBtn.innerHTML =
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg> メールを準備中…';
      openMailto();
    });
    setProgress(80);
  }

  /* ── Validation ── */
  function validateForm() {
    var ok = true;
    var nameEl  = document.getElementById('cbName');
    var salonEl = document.getElementById('cbSalon');
    var emailEl = document.getElementById('cbEmail');

    [nameEl, salonEl, emailEl].forEach(function (e) { e.classList.remove('cb-error'); });
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
      '■ チャットで閲覧されたトピック',
      'トピック　　: ' + (answers.topic || '未選択'),
      '',
      '■ ご質問・ご要望',
      msg || '（なし）',
    ].join('\n');

    var subject    = encodeURIComponent('【COOLSPA導入相談】お問い合わせ — ' + salon);
    var mailtoUrl  = 'mailto:bisin202603@gmail.com?subject=' + subject + '&body=' + encodeURIComponent(bodyText);

    var link = document.createElement('a');
    link.href = mailtoUrl;
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setTimeout(showSuccess, 600);
  }

  /* ── 完了画面 ── */
  function showSuccess() {
    setProgress(100);
    var body = document.getElementById('cbBody');
    body.innerHTML = '';
    var panel = document.createElement('div');
    panel.className = 'cb-success';
    panel.innerHTML =
      '<div class="cb-success__icon">' +
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>' +
      '</div>' +
      '<div class="cb-success__title">メールソフトが開きます</div>' +
      '<div class="cb-success__desc">内容はすでに入力済みです。<br>送信ボタンを押してください。</div>' +
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

    /* 価格関連キーワードはLINEへ誘導 */
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
