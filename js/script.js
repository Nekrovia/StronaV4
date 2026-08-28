const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

const burger = document.getElementById('burger');
const nav = document.getElementById('nav');
const navClose = document.getElementById('nav-close');
if (burger && nav) {
  burger.addEventListener('click', () => nav.classList.toggle('open'));
  if (navClose) navClose.addEventListener('click', () => nav.classList.remove('open'));
  nav.querySelectorAll(':scope > a').forEach(link => {
    link.addEventListener('click', () => nav.classList.remove('open'));
  });
  nav.querySelectorAll('.nav-drop-menu a').forEach(link => {
    link.addEventListener('click', () => nav.classList.remove('open'));
  });
}

// Mobile: tap the "Usługi" dropdown label to expand instead of relying on hover
document.querySelectorAll('.nav-drop > button').forEach(btn => {
  btn.addEventListener('click', () => {
    if (window.innerWidth > 720) return;
    btn.closest('.nav-drop').classList.toggle('mobile-open');
  });
});

const form = document.getElementById('contact-form');
if (form && form.topic) {
  const topicParam = new URLSearchParams(window.location.search).get('topic');
  if (topicParam) {
    const match = Array.from(form.topic.options).find(o => o.value === topicParam);
    if (match) form.topic.value = topicParam;
  }
}
if (form) {
  const WEB3FORMS_KEY = 'eb22ca95-1fa3-4452-9559-a6b220d038bb';
  const statusMsg = document.getElementById('form-status');
  const submitBtn = form.querySelector('button[type="submit"]');

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = form.name.value.trim();
    const contact = form.contact.value.trim();
    const message = form.message.value.trim();
    const topic = form.topic ? form.topic.value : '';
    const subject = `Zapytanie ze strony${topic ? ' — ' + topic : ''}`;

    if (submitBtn) submitBtn.disabled = true;
    if (statusMsg) { statusMsg.textContent = 'Wysyłanie…'; statusMsg.classList.remove('error'); }

    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact);
    const payload = {
      access_key: WEB3FORMS_KEY,
      subject,
      name,
      'Telefon lub e-mail': contact,
      Temat: topic || '(nie wybrano)',
      Wiadomosc: message,
      from_name: 'Formularz — Pietrzak Sp. z o.o.'
    };
    if (isEmail) payload.email = contact;

    fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(payload)
    })
      .then((res) => res.json().then((data) => ({ ok: res.ok, data })))
      .then(({ ok, data }) => {
        if (!ok || !data.success) throw new Error(data.message || 'submit_failed');
        if (statusMsg) statusMsg.textContent = 'Wysłano — dziękujemy, odezwiemy się wkrótce!';
        form.reset();
      })
      .catch(() => {
        if (statusMsg) {
          statusMsg.textContent = 'Nie udało się wysłać — zadzwoń do nas albo spróbuj ponownie za chwilę.';
          statusMsg.classList.add('error');
        }
      })
      .finally(() => {
        if (submitBtn) submitBtn.disabled = false;
      });
  });
}

// Scroll reveal + animated counters
const revealEls = document.querySelectorAll('.reveal');
function animateCounter(el) {
  const target = parseInt(el.dataset.count, 10);
  const suffix = el.dataset.suffix || '';
  const duration = 1100;
  const start = performance.now();
  function tick(now) {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.round(eased * target) + suffix;
    if (progress < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}
const revealObserver = new IntersectionObserver((entries, obs) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add('is-visible');
    const counter = entry.target.querySelector('[data-count]');
    if (counter) animateCounter(counter);
    obs.unobserve(entry.target);
  });
}, { threshold: 0.15 });
revealEls.forEach(el => revealObserver.observe(el));

// Gallery lightbox
const galleryImgs = Array.from(document.querySelectorAll('.gallery img'));
const lightbox = document.getElementById('lightbox');
if (galleryImgs.length && lightbox) {
  const lightboxImg = document.getElementById('lightbox-img');
  let lightboxIndex = 0;
  function openLightbox(index) {
    lightboxIndex = index;
    lightboxImg.src = galleryImgs[index].src;
    lightboxImg.alt = galleryImgs[index].alt;
    lightbox.classList.add('open');
    lightbox.setAttribute('aria-hidden', 'false');
  }
  function closeLightbox() {
    lightbox.classList.remove('open');
    lightbox.setAttribute('aria-hidden', 'true');
  }
  function showLightbox(delta) {
    lightboxIndex = (lightboxIndex + delta + galleryImgs.length) % galleryImgs.length;
    lightboxImg.src = galleryImgs[lightboxIndex].src;
    lightboxImg.alt = galleryImgs[lightboxIndex].alt;
  }
  galleryImgs.forEach((img, i) => img.addEventListener('click', () => openLightbox(i)));
  document.getElementById('lightbox-close').addEventListener('click', closeLightbox);
  document.getElementById('lightbox-prev').addEventListener('click', () => showLightbox(-1));
  document.getElementById('lightbox-next').addEventListener('click', () => showLightbox(1));
  lightbox.addEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });
  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('open')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') showLightbox(-1);
    if (e.key === 'ArrowRight') showLightbox(1);
  });
}

// Floating call button — appears after scrolling a bit
const callFab = document.getElementById('call-fab');
if (callFab) {
  window.addEventListener('scroll', () => {
    callFab.classList.toggle('visible', window.scrollY > 500);
  }, { passive: true });
}
