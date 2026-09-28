/* 공통 동작: 상단 메뉴, 하단 문의 버튼, 예약 창, 사진 크게 보기, 지도 */
(function () {
  const S = STUDIO;
  const page = document.body.dataset.page || '';

  const MENU = [
    ['family', 'family.html', '가족사진'],
    ['id', 'id-photo.html', '증명·여권사진'],
    ['profile', 'profile.html', '프로필사진'],
    ['gallery', 'gallery.html', '갤러리'],
    ['price', 'index.html#products', '상품·가격'],
    ['location', 'index.html#location', '오시는 길'],
  ];

  /* ---------- 상단 메뉴 ---------- */
  const header = document.getElementById('site-header');
  if (header) {
    header.className = 'site-header';
    header.innerHTML = `
      <div class="wrap header-inner">
        <a class="logo" href="index.html" aria-label="홈으로">
          <span class="logo-mark">사랑이야기</span><span class="logo-sub">STUDIO · 대전점</span>
        </a>
        <nav class="nav" id="nav" aria-label="주 메뉴">
          ${MENU.map(([k, href, label]) =>
            `<a href="${href}"${k === page ? ' aria-current="page"' : ''}>${label}</a>`).join('')}
          <button class="btn btn-primary nav-cta" data-book>문의·예약</button>
        </nav>
        <button class="menu-toggle" aria-label="메뉴 열기" aria-expanded="false" aria-controls="nav">
          <span></span><span></span><span></span>
        </button>
      </div>`;
    const toggle = header.querySelector('.menu-toggle');
    toggle.addEventListener('click', () => {
      const open = header.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open);
      document.body.classList.toggle('no-scroll', open);
    });
    header.querySelectorAll('.nav a').forEach(a => a.addEventListener('click', () => {
      header.classList.remove('open');
      document.body.classList.remove('no-scroll');
    }));
    const onScroll = () => header.classList.toggle('scrolled', window.scrollY > 10);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ---------- 하단 정보 ---------- */
  const footer = document.getElementById('site-footer');
  if (footer) {
    footer.className = 'site-footer';
    footer.innerHTML = `
      <div class="wrap footer-inner">
        <div>
          <p class="footer-logo">${S.name}</p>
          <p>가족사진 · 증명사진 · 여권사진 · 프로필사진</p>
          <p>${S.address}</p>
          <p>문의 <a href="tel:${S.phoneDial}">${S.phone}</a></p>
        </div>
        <div class="footer-links">
          ${MENU.map(([, href, label]) => `<a href="${href}">${label}</a>`).join('')}
          <a href="${S.instagram}" target="_blank" rel="noopener">인스타그램</a>
        </div>
      </div>
      <p class="wrap copyright">© ${new Date().getFullYear()} ${S.name}</p>`;
  }

  /* ---------- 휴대폰 하단 고정 버튼 ---------- */
  const bar = document.createElement('div');
  bar.className = 'mobile-bar';
  bar.innerHTML = `
    <a href="tel:${S.phoneDial}">${icon('phone')}<span>전화</span></a>
    <a href="${S.kakao}" target="_blank" rel="noopener">${icon('chat')}<span>카톡 상담</span></a>
    <button data-book class="mobile-bar-main">${icon('calendar')}<span>예약하기</span></button>`;
  document.body.appendChild(bar);

  /* ---------- 문의·예약 창 ---------- */
  const sheet = document.createElement('div');
  sheet.className = 'sheet';
  sheet.setAttribute('role', 'dialog');
  sheet.setAttribute('aria-modal', 'true');
  sheet.setAttribute('aria-labelledby', 'sheet-title');
  sheet.hidden = true;
  sheet.innerHTML = `
    <div class="sheet-backdrop" data-close></div>
    <div class="sheet-panel">
      <button class="sheet-close" data-close aria-label="닫기">×</button>
      <p class="eyebrow">문의 · 예약</p>
      <h2 id="sheet-title">편하신 방법으로 연락 주세요</h2>
      <p class="sheet-note" data-sheet-note></p>
      <div class="sheet-options">
        <a class="sheet-opt" href="tel:${S.phoneDial}">${icon('phone')}<span><strong>전화 상담</strong><small>${S.phone}</small></span></a>
        <a class="sheet-opt" href="${S.kakao}" target="_blank" rel="noopener">${icon('chat')}<span><strong>카카오톡 상담</strong><small>사진·일정 문의를 편하게 남겨 주세요</small></span></a>
        <a class="sheet-opt" href="${S.naverBooking}" target="_blank" rel="noopener">${icon('calendar')}<span><strong>네이버 예약</strong><small>원하는 날짜·시간을 바로 선택</small></span></a>
      </div>
      <p class="sheet-hours">${S.hours.map(h => `${h[0]} ${h[1]}`).join(' · ')}</p>
    </div>`;
  document.body.appendChild(sheet);
  let lastFocus = null;
  const openSheet = (topic) => {
    lastFocus = document.activeElement;
    sheet.querySelector('[data-sheet-note]').textContent =
      topic ? `‘${topic}’ 촬영 문의라고 말씀해 주시면 더 빠르게 안내해 드려요.` : '';
    sheet.hidden = false;
    requestAnimationFrame(() => sheet.classList.add('show'));
    document.body.classList.add('no-scroll');
    sheet.querySelector('.sheet-close').focus();
  };
  const closeSheet = () => {
    sheet.classList.remove('show');
    document.body.classList.remove('no-scroll');
    setTimeout(() => { sheet.hidden = true; }, 250);
    if (lastFocus) lastFocus.focus();
  };
  document.addEventListener('click', e => {
    const b = e.target.closest('[data-book]');
    if (b) { e.preventDefault(); openSheet(b.dataset.book); }
    if (e.target.closest('[data-close]')) closeSheet();
  });

  /* ---------- 기본 정보 채우기 ---------- */
  document.querySelectorAll('[data-info]').forEach(el => {
    const key = el.dataset.info;
    if (key === 'phone-link') { el.href = `tel:${S.phoneDial}`; el.textContent = S.phone; return; }
    if (key === 'hours') {
      el.innerHTML = S.hours.map(h => `<li><span>${h[0]}</span><span>${h[1]}</span></li>`).join('');
      return;
    }
    if (S[key] != null) el.textContent = S[key];
  });
  document.querySelectorAll('[data-map]').forEach(el => {
    const q = encodeURIComponent(S.mapQuery);
    el.innerHTML = `<iframe title="${S.name} 위치 지도" loading="lazy"
      src="https://maps.google.com/maps?q=${q}&z=16&output=embed"></iframe>`;
  });
  document.querySelectorAll('[data-maplink]').forEach(el => {
    const q = encodeURIComponent(S.mapQuery);
    el.href = el.dataset.maplink === 'naver'
      ? `https://map.naver.com/p/search/${q}`
      : `https://map.kakao.com/?q=${q}`;
    el.target = '_blank'; el.rel = 'noopener';
  });

  /* ---------- 사진 크게 보기 ---------- */
  const shots = [...document.querySelectorAll('[data-zoom]')];
  if (shots.length) {
    const lb = document.createElement('div');
    lb.className = 'lightbox';
    lb.hidden = true;
    lb.innerHTML = `
      <button class="lb-close" aria-label="닫기">×</button>
      <button class="lb-prev" aria-label="이전 사진">‹</button>
      <figure><img alt=""><figcaption></figcaption></figure>
      <button class="lb-next" aria-label="다음 사진">›</button>`;
    document.body.appendChild(lb);
    const img = lb.querySelector('img'), cap = lb.querySelector('figcaption');
    let list = shots, idx = 0;
    const show = i => {
      idx = (i + list.length) % list.length;
      const s = list[idx], im = s.querySelector('img') || s;
      img.src = im.currentSrc || im.src; img.alt = im.alt;
      cap.textContent = s.dataset.zoom || im.alt;
    };
    const close = () => { lb.hidden = true; document.body.classList.remove('no-scroll'); };
    shots.forEach(s => {
      s.setAttribute('tabindex', '0');
      s.setAttribute('role', 'button');
      const open = () => {
        list = shots.filter(x => x.offsetParent !== null);
        show(list.indexOf(s)); lb.hidden = false; document.body.classList.add('no-scroll');
      };
      s.addEventListener('click', open);
      s.addEventListener('keydown', e => { if (e.key === 'Enter') open(); });
    });
    lb.querySelector('.lb-close').onclick = close;
    lb.querySelector('.lb-prev').onclick = () => show(idx - 1);
    lb.querySelector('.lb-next').onclick = () => show(idx + 1);
    lb.addEventListener('click', e => { if (e.target === lb) close(); });
    let x0 = null;
    lb.addEventListener('touchstart', e => { x0 = e.touches[0].clientX; }, { passive: true });
    lb.addEventListener('touchend', e => {
      if (x0 == null) return;
      const dx = e.changedTouches[0].clientX - x0;
      if (Math.abs(dx) > 50) show(idx + (dx < 0 ? 1 : -1));
      x0 = null;
    });
    document.addEventListener('keydown', e => {
      if (lb.hidden) return;
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowLeft') show(idx - 1);
      if (e.key === 'ArrowRight') show(idx + 1);
    });
  }
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && !sheet.hidden) closeSheet(); });

  /* ---------- 갤러리 분류 버튼 ---------- */
  const filters = document.querySelectorAll('[data-filter]');
  filters.forEach(btn => btn.addEventListener('click', () => {
    const f = btn.dataset.filter;
    filters.forEach(b => b.setAttribute('aria-pressed', b === btn));
    document.querySelectorAll('[data-cat]').forEach(el => {
      el.hidden = !(f === 'all' || el.dataset.cat.split(' ').includes(f));
    });
  }));
  const hashFilter = location.hash.slice(1);
  if (hashFilter) document.querySelector(`[data-filter="${hashFilter}"]`)?.click();

  /* ---------- 스크롤 시 부드럽게 나타나기 ---------- */
  if ('IntersectionObserver' in window && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const io = new IntersectionObserver(entries => entries.forEach(en => {
      if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
    }), { rootMargin: '0px 0px -8% 0px' });
    document.querySelectorAll('.reveal').forEach(el => io.observe(el));
  } else {
    document.querySelectorAll('.reveal').forEach(el => el.classList.add('in'));
  }

  function icon(name) {
    const p = {
      phone: '<path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.7a2 2 0 0 1-.5 2.1L8 9.8a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.7.7a2 2 0 0 1 1.7 2z"/>',
      chat: '<path d="M21 11.5a8.4 8.4 0 0 1-9 8.4 9 9 0 0 1-3.8-.8L3 21l1.9-4.6A8 8 0 0 1 3 11.5 8.4 8.4 0 0 1 12 3a8.4 8.4 0 0 1 9 8.5z"/>',
      calendar: '<rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>',
    }[name];
    return `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${p}</svg>`;
  }
})();
