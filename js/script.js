const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

const burger = document.getElementById('burger');
const nav = document.getElementById('nav');
if (burger && nav) {
  burger.addEventListener('click', () => nav.classList.toggle('open'));
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
  const CONTACT_EMAIL = 'szymonemps7@gmail.com';
  const sendOptions = document.getElementById('send-options');
  const statusMsg = document.getElementById('form-status');

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = form.name.value.trim();
    const contact = form.contact.value.trim();
    const message = form.message.value.trim();
    const topic = form.topic ? form.topic.value : '';
    const subject = `Zapytanie ze strony${topic ? ' — ' + topic : ''}`;
    const bodyText = `Imię i nazwisko: ${name}\nKontakt: ${contact}${topic ? '\nDotyczy: ' + topic : ''}\n\nWiadomość:\n${message}`;
    const mailtoUrl = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(bodyText)}`;

    if (!sendOptions) return;

    const gmailLink = sendOptions.querySelector('[data-gmail]');
    const mailtoLink = sendOptions.querySelector('[data-mailto]');
    const copyBtn = sendOptions.querySelector('[data-copy]');

    gmailLink.href = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(CONTACT_EMAIL)}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(bodyText)}`;
    mailtoLink.href = mailtoUrl;

    const copyLabel = copyBtn.textContent;
    copyBtn.onclick = () => {
      const fullText = `Do: ${CONTACT_EMAIL}\nTemat: ${subject}\n\n${bodyText}`;
      navigator.clipboard.writeText(fullText).then(() => {
        copyBtn.textContent = 'Skopiowano ✓';
        setTimeout(() => { copyBtn.textContent = copyLabel; }, 2500);
      });
    };

    // Try the silent, single-click path first: trigger the default mail app.
    // If the OS/browser has one configured, the tab loses focus almost
    // immediately as the app opens. Only if that DOESN'T happen within
    // ~1.2s do we assume there's no mail app and reveal the alternatives.
    let handled = false;
    const markHandled = () => { handled = true; cleanup(); };
    const cleanup = () => {
      window.removeEventListener('blur', markHandled);
      document.removeEventListener('visibilitychange', onVisibility);
    };
    const onVisibility = () => { if (document.hidden) markHandled(); };

    window.addEventListener('blur', markHandled);
    document.addEventListener('visibilitychange', onVisibility);
    if (statusMsg) statusMsg.textContent = 'Otwieram program pocztowy…';

    window.location.href = mailtoUrl;

    setTimeout(() => {
      cleanup();
      if (handled) {
        if (statusMsg) statusMsg.textContent = '';
        return;
      }
      if (statusMsg) statusMsg.textContent = 'Nie udało się otworzyć programu pocztowego — wybierz inny sposób:';
      sendOptions.hidden = false;
      sendOptions.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 1200);
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
