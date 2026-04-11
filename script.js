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

  const firstName  = form.querySelector('.cf-first')?.value.trim() || '';
  const lastName   = form.querySelector('.cf-last')?.value.trim() || '';
  const email      = form.querySelector('.cf-email')?.value.trim() || '';
  const org        = form.querySelector('.cf-org')?.value.trim() || '';
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

/* ── CAREERS FORM → FORMSPREE ── */
const CAREERS_FORM_ID = 'mgopjnoo';

/* ── Resume file name display ── */
document.addEventListener('change', e => {
  const input = e.target.closest('#resumeFile');
  if (!input) return;
  const file = input.files[0];
  const label = document.getElementById('resumeLabel');
  const nameEl = document.getElementById('resumeFileName');
  if (file) {
    if (file.size > 5 * 1024 * 1024) {
      nameEl.textContent = '⚠ File too large — max 5 MB';
      nameEl.style.color = '#dc2626';
      input.value = '';
      return;
    }
    nameEl.textContent = '✓ ' + file.name;
    nameEl.style.color = 'var(--green)';
    label.style.borderColor = 'var(--green)';
  }
});

document.addEventListener('click', e => {
  const btn = e.target.closest('.career-submit');
  if (!btn) return;
  const form = btn.closest('.careers-form');
  if (!form) return;

  const firstName  = form.querySelector('.career-first')?.value.trim() || '';
  const lastName   = form.querySelector('.career-last')?.value.trim() || '';
  const email      = form.querySelector('.career-email')?.value.trim() || '';
  const phone      = form.querySelector('.career-phone')?.value.trim() || '';
  const position   = form.querySelector('.career-position')?.value || '';
  const experience = form.querySelector('.career-exp')?.value || '';
  const location   = form.querySelector('.career-location')?.value.trim() || '';
  const notice     = form.querySelector('.career-notice')?.value || '';
  const portfolio  = form.querySelector('.career-portfolio')?.value.trim() || '';
  const note       = form.querySelector('.career-note')?.value.trim() || '';
  const resumeFile = document.getElementById('resumeFile')?.files[0] || null;

  if (!firstName || !email || !phone || !position) {
    const orig = btn.textContent;
    btn.textContent = 'Please fill Name, Email, Phone & Position →';
    btn.style.background = '#dc2626';
    setTimeout(() => { btn.textContent = orig; btn.style.background = ''; }, 2500);
    return;
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    const orig = btn.textContent;
    btn.textContent = 'Enter a valid email →';
    btn.style.background = '#dc2626';
    setTimeout(() => { btn.textContent = orig; btn.style.background = ''; }, 2500);
    return;
  }

  if (!resumeFile) {
    const nameEl = document.getElementById('resumeFileName');
    const label  = document.getElementById('resumeLabel');
    nameEl.textContent = '⚠ Please upload your Resume / CV';
    nameEl.style.color = '#dc2626';
    label.style.borderColor = '#dc2626';
    setTimeout(() => {
      nameEl.textContent = 'Click to upload your Resume / CV';
      nameEl.style.color = 'var(--soft)';
      label.style.borderColor = 'var(--border2)';
    }, 3000);
    return;
  }

  btn.textContent = 'Submitting…';
  btn.disabled = true;

  /* Use multipart FormData so Formspree receives the file as attachment */
  const fd = new FormData();
  fd.append('_subject',          `[JOB APPLICATION] ${position} — ${firstName} ${lastName}`);
  fd.append('Application Type',  'JOB APPLICATION');
  fd.append('Position Applied',  position);
  fd.append('First Name',        firstName);
  fd.append('Last Name',         lastName);
  fd.append('email',             email);
  fd.append('Phone',             phone);
  fd.append('Experience',        experience);
  fd.append('Current Location',  location);
  fd.append('Notice Period',     notice);
  fd.append('LinkedIn / Portfolio', portfolio);
  fd.append('Cover Note',        note);
  fd.append('resume',            resumeFile, resumeFile.name);

  fetch(`https://formspree.io/f/${CAREERS_FORM_ID}`, {
    method: 'POST',
    headers: { 'Accept': 'application/json' },
    /* NO Content-Type header — browser sets multipart/form-data boundary automatically */
    body: fd
  })
  .then(res => res.json())
  .then(data => {
    if (data.ok) {
      btn.textContent = "Application Sent! We'll be in touch ✓";
      btn.style.background = 'linear-gradient(135deg,#059669,#22c984)';
      form.querySelectorAll('input:not([type=file])').forEach(i => i.value = '');
      form.querySelectorAll('select').forEach(s => s.selectedIndex = 0);
      form.querySelectorAll('textarea').forEach(t => t.value = '');
      document.getElementById('resumeFile').value = '';
      document.getElementById('resumeFileName').textContent = 'Click to upload your Resume / CV';
      document.getElementById('resumeFileName').style.color = 'var(--soft)';
      document.getElementById('resumeLabel').style.borderColor = 'var(--border2)';
      setTimeout(() => {
        btn.textContent = 'Submit Application →';
        btn.style.background = '';
        btn.disabled = false;
      }, 5000);
    } else {
      throw new Error('Formspree error');
    }
  })
  .catch(() => {
    btn.textContent = 'Something went wrong. Try again!';
    btn.style.background = '#dc2626';
    btn.disabled = false;
    setTimeout(() => { btn.textContent = 'Submit Application →'; btn.style.background = ''; }, 3000);
  });
});

/* ── INIT ── */
showPage('home');
