/* ── CURSOR (desktop only) ── */
const cur = document.getElementById('cur');
const ring = document.getElementById('cur-ring');
let mx = 0, my = 0, rx = 0, ry = 0;
const isTouch = window.matchMedia('(hover: none)').matches || window.matchMedia('(pointer: coarse)').matches;

if (!isTouch && cur && ring) {
  document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    cur.style.left = mx + 'px';
    cur.style.top = my + 'px';
  });
  (function animRing() {
    rx += (mx - rx) * .12;
    ry += (my - ry) * .12;
    ring.style.left = rx + 'px';
    ring.style.top = ry + 'px';
    requestAnimationFrame(animRing);
  })();
}

/* ── CANVAS PARTICLES ── */
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
let W, H, pts = [];
function resize() { W = canvas.width = innerWidth; H = canvas.height = innerHeight; }
resize();
window.addEventListener('resize', resize);
for (let i = 0; i < 90; i++) pts.push({
  x: Math.random() * 2000, y: Math.random() * 1200,
  vx: (Math.random() - .5) * .3, vy: (Math.random() - .5) * .3,
  r: Math.random() * 1.2 + .3, a: Math.random()
});
function drawParticles() {
  ctx.clearRect(0, 0, W, H);
  pts.forEach(p => {
    p.x += p.vx; p.y += p.vy;
    if (p.x < 0) p.x = W; if (p.x > W) p.x = 0;
    if (p.y < 0) p.y = H; if (p.y > H) p.y = 0;
    ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(0,180,255,${p.a * .35})`; ctx.fill();
  });
  pts.forEach((p, i) => {
    pts.slice(i + 1).forEach(q => {
      const dx = p.x - q.x, dy = p.y - q.y, d = Math.sqrt(dx * dx + dy * dy);
      if (d < 120) {
        ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y);
        ctx.strokeStyle = `rgba(26,111,255,${(1 - d / 120) * .06})`; ctx.lineWidth = .5; ctx.stroke();
      }
    });
  });
  requestAnimationFrame(drawParticles);
}
drawParticles();

/* ── NAV SCROLL ── */
window.addEventListener('scroll', () => {
  document.getElementById('nav').classList.toggle('solid', scrollY > 60);
});

/* ── PAGE ROUTING ── */
function showPage(id) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  const target = document.getElementById('page-' + id);
  if (target) { target.classList.add('active'); window.scrollTo({ top: 0, behavior: 'instant' }); }
  document.querySelectorAll('.nav-link').forEach(a => {
    a.classList.toggle('active', a.dataset.page === id);
  });
  setTimeout(() => {
    initReveal();
    setTimeout(() => {
      document.querySelectorAll('.page.active .r').forEach(el => el.classList.add('on'));
    }, 200);
  }, 50);
  document.getElementById('mobileNav').classList.remove('open');
}

document.addEventListener('click', e => {
  const el = e.target.closest('[data-page]');
  if (el) { e.preventDefault(); showPage(el.dataset.page); }
});

/* ── CLIENT TABS ── */
document.addEventListener('click', e => {
  const tab = e.target.closest('.clients-tab');
  if (!tab) return;
  const tabId = tab.dataset.tab;
  document.querySelectorAll('.clients-tab').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.client-segment').forEach(s => s.classList.remove('active'));
  tab.classList.add('active');
  document.getElementById('tab-' + tabId).classList.add('active');
});

/* ── BLOG CATEGORY FILTER ── */
document.addEventListener('click', e => {
  const cat = e.target.closest('.blog-cat');
  if (!cat) return;
  document.querySelectorAll('.blog-cat').forEach(c => c.classList.remove('active'));
  cat.classList.add('active');
});
document.addEventListener('click', e => {
  const pgBtn = e.target.closest('.blog-pg-btn');
  if (!pgBtn) return;
  document.querySelectorAll('.blog-pg-btn').forEach(b => b.classList.remove('active'));
  pgBtn.classList.add('active');
});

/* ── CONTACT FORM → FORMSPREE ONLY (no WhatsApp) ── */
const CONTACT_FORM_ID = 'xlgoyngq';

document.addEventListener('click', e => {
  const btn = e.target.closest('.form-submit');
  if (!btn) return;
  const form = btn.closest('.contact-form');
  if (!form) return;

  const firstName  = form.querySelector('input[placeholder="Rahul"]')?.value.trim() || '';
  const lastName   = form.querySelector('input[placeholder="Sharma"]')?.value.trim() || '';
  const email      = form.querySelector('input[type="email"]')?.value.trim() || '';
  const org        = form.querySelector('input[placeholder*="Company"]')?.value.trim() || '';
  const selects    = form.querySelectorAll('select');
  const clientType = selects[0]?.value || '';
  const service    = selects[1]?.value || '';
  const brief      = form.querySelector('textarea')?.value.trim() || '';

  // Validation
  if (!firstName || !email) {
    const orig = btn.textContent;
    btn.textContent = 'Please fill Name & Email →';
    btn.style.background = '#dc2626';
    setTimeout(() => { btn.textContent = orig; btn.style.background = ''; }, 2500);
    return;
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    const orig = btn.textContent;
    btn.textContent = 'Enter valid email →';
    btn.style.background = '#dc2626';
    setTimeout(() => { btn.textContent = orig; btn.style.background = ''; }, 2500);
    return;
  }

  btn.textContent = 'Sending…';
  btn.disabled = true;

  fetch(`https://formspree.io/f/${CONTACT_FORM_ID}`, {
    method: 'POST',
    headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
    body: JSON.stringify({
      'First Name': firstName,
      'Last Name': lastName,
      'email': email,
      'Organisation': org,
      'Client Type': clientType,
      'Service Required': service,
      'Project Brief': brief,
      '_subject': `New Enquiry from ${firstName} ${lastName} - Alpha Geo Solution`
    })
  })
  .then(res => res.json())
  .then(data => {
    if (data.ok) {
      btn.textContent = "Sent! We'll respond within 24hrs ✓";
      btn.style.background = 'linear-gradient(135deg,#059669,#22c984)';
      // Reset form fields
      form.querySelectorAll('input').forEach(i => i.value = '');
      form.querySelectorAll('select').forEach(s => s.selectedIndex = 0);
      form.querySelectorAll('textarea').forEach(t => t.value = '');
      setTimeout(() => {
        btn.textContent = 'Send Enquiry →';
        btn.style.background = '';
        btn.disabled = false;
      }, 4000);
    } else {
      throw new Error('Formspree error');
    }
  })
  .catch(() => {
    btn.textContent = 'Something went wrong. Try again!';
    btn.style.background = '#dc2626';
    btn.disabled = false;
    setTimeout(() => { btn.textContent = 'Send Enquiry →'; btn.style.background = ''; }, 3000);
  });
});

/* ── NEWSLETTER → FORMSPREE ── */
const NEWSLETTER_FORM_ID = 'xykbqjeg';

document.addEventListener('click', e => {
  const btn = e.target.closest('.newsletter-submit');
  if (!btn) return;

  const input = btn.closest('.newsletter-form')?.querySelector('input');
  const email = input?.value.trim();

  if (!email) {
    input.style.outline = '1px solid #dc2626';
    setTimeout(() => input.style.outline = '', 2000);
    return;
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    input.style.outline = '1px solid #dc2626';
    input.placeholder = 'Enter valid email!';
    setTimeout(() => { input.style.outline = ''; input.placeholder = 'Enter your work email…'; }, 2500);
    return;
  }

  const orig = btn.textContent;
  btn.textContent = 'Subscribing…';
  btn.disabled = true;

  fetch(`https://formspree.io/f/${NEWSLETTER_FORM_ID}`, {
    method: 'POST',
    headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
    body: JSON.stringify({
      'email': email,
      '_subject': `New Newsletter Subscriber: ${email}`
    })
  })
  .then(res => res.json())
  .then(data => {
    if (data.ok) {
      btn.textContent = 'Subscribed ✓';
      btn.style.background = 'linear-gradient(135deg,#059669,#22c984)';
      input.value = '';
      setTimeout(() => {
        btn.textContent = orig;
        btn.style.background = '';
        btn.disabled = false;
      }, 3000);
    } else {
      throw new Error('Subscription failed');
    }
  })
  .catch(() => {
    btn.textContent = 'Error! Try again';
    btn.style.background = '#dc2626';
    btn.disabled = false;
    setTimeout(() => { btn.textContent = orig; btn.style.background = ''; }, 3000);
  });
});

/* ── HOVER CURSOR EFFECT ── */
function addHover() {
  document.querySelectorAll('a,button,.svc-item,.svc-card,.ind-cell,.testi-card,.f-soc,.proc-step,.team-card,.team-founder,.ind-row,.client-logo-cell,.priv-feat,.value-card,.case-study-card,.back-link,.blog-card').forEach(el => {
    el.addEventListener('mouseenter', () => document.body.classList.add('hovering'));
    el.addEventListener('mouseleave', () => document.body.classList.remove('hovering'));
  });
}
addHover();

/* ── REVEAL ON SCROLL ── */
function initReveal() {
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('on'); });
  }, { threshold: 0.12 });
  document.querySelectorAll('.page.active .r').forEach(el => obs.observe(el));
}
initReveal();

/* ── MOBILE NAV ── */
document.getElementById('hamburger').addEventListener('click', () => {
  document.getElementById('mobileNav').classList.add('open');
});
document.getElementById('closeMobile').addEventListener('click', () => {
  document.getElementById('mobileNav').classList.remove('open');
});

/* ── DOWNLOAD COMPANY PROFILE ── */
document.addEventListener('click', e => {
  const btn = e.target.closest('button');
  if (btn && btn.textContent.includes('Download Company Profile')) {
    showPage('contact');
  }
});

/* ── INIT ── */
showPage('home');
