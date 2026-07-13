// Hero carousel
const track = document.getElementById('heroTrack');
const slides = track ? track.querySelectorAll('.hero-slide') : [];
let current = 0;

function goTo(n) {
  current = ((n % slides.length) + slides.length) % slides.length;
  track.style.transform = `translateX(-${current * 100}%)`;
}

const prevBtn = document.getElementById('heroPrev');
const nextBtn = document.getElementById('heroNext');
if (prevBtn) prevBtn.addEventListener('click', () => goTo(current - 1));
if (nextBtn) nextBtn.addEventListener('click', () => goTo(current + 1));

// Auto-advance every 5 seconds
if (slides.length > 1) setInterval(() => goTo(current + 1), 5000);

// Hamburger / mobile nav
const hamburger = document.getElementById('hamburger');
const mobileNav  = document.getElementById('mobileNav');

if (hamburger && mobileNav) {
  hamburger.addEventListener('click', () => {
    const open = mobileNav.classList.toggle('open');
    hamburger.classList.toggle('open', open);
    hamburger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  });

  mobileNav.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      mobileNav.classList.remove('open');
      hamburger.classList.remove('open');
    });
  });
}

// Treatment accordion
document.querySelectorAll('.accordion-trigger').forEach(trigger => {
  trigger.addEventListener('click', () => {
    const item = trigger.closest('.accordion-item');
    const isOpen = item.classList.contains('open');
    item.closest('.treatment-accordion').querySelectorAll('.accordion-item').forEach(i => {
      i.classList.remove('open');
      i.querySelector('.accordion-trigger').setAttribute('aria-expanded', 'false');
    });
    if (!isOpen) {
      item.classList.add('open');
      trigger.setAttribute('aria-expanded', 'true');
    }
  });
});

// Video modal
const videoModal    = document.getElementById('videoModal');
const videoFrame    = document.getElementById('videoModalFrame');
const videoClose    = document.getElementById('videoModalClose');
const videoBackdrop = document.getElementById('videoModalBackdrop');

function openVideoModal(id, start) {
  let src = `https://www.youtube.com/embed/${id}?autoplay=1`;
  if (start) src += `&start=${start}`;
  videoFrame.src = src;
  videoModal.classList.add('open');
  videoModal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}

function closeVideoModal() {
  videoModal.classList.remove('open');
  videoModal.setAttribute('aria-hidden', 'true');
  videoFrame.src = '';
  document.body.style.overflow = '';
}

document.querySelectorAll('.video-thumb[data-video-src], .video-thumb[data-video-id]').forEach(thumb => {
  thumb.addEventListener('click', e => {
    e.preventDefault();
    if (thumb.dataset.videoSrc) {
      let src = thumb.dataset.videoSrc + '&autoplay=1';
      videoFrame.src = src;
      videoModal.classList.add('open');
      videoModal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    } else {
      openVideoModal(thumb.dataset.videoId, thumb.dataset.videoStart);
    }
  });
});

if (videoClose)    videoClose.addEventListener('click', closeVideoModal);
if (videoBackdrop) videoBackdrop.addEventListener('click', closeVideoModal);
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeVideoModal(); });

// Drag-to-scroll accreditation track
const accredTrack = document.querySelector('.accred-track');
if (accredTrack) {
  let isDown = false, startX, scrollLeft;
  accredTrack.addEventListener('mousedown', e => {
    isDown = true;
    startX = e.pageX - accredTrack.offsetLeft;
    scrollLeft = accredTrack.scrollLeft;
  });
  accredTrack.addEventListener('mouseleave', () => isDown = false);
  accredTrack.addEventListener('mouseup', () => isDown = false);
  accredTrack.addEventListener('mousemove', e => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - accredTrack.offsetLeft;
    accredTrack.scrollLeft = scrollLeft - (x - startX);
  });
}

// AJAX form submission — sends to Formspree + adds subscriber to MailerLite
document.querySelectorAll('form[action*="formspree.io"]').forEach(form => {
  form.addEventListener('submit', async e => {
    e.preventDefault();
    const btn = form.querySelector('[type="submit"]');
    const originalText = btn ? btn.textContent : '';
    if (btn) { btn.disabled = true; btn.textContent = 'Sending…'; }

    const formData = new FormData(form);

    try {
      const res = await fetch(form.action, {
        method: 'POST',
        body: formData,
        headers: { 'Accept': 'application/json' }
      });

      if (res.ok) {
        // Add to MailerLite in the background (non-blocking)
        fetch('/api/subscribe', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: formData.get('email'),
            name: formData.get('name'),
            marketing_consent: formData.get('marketing_consent') || '',
            source: formData.get('source') || '',
          }),
        }).catch(() => {});

        const name = encodeURIComponent(formData.get('name') || '');
        const email = encodeURIComponent(formData.get('email') || '');
        window.location.href = `https://www.luxebeautytrip.com/thankyou.html?name=${name}&email=${email}`;
      } else {
        if (btn) { btn.disabled = false; btn.textContent = originalText; }
        alert('Something went wrong. Please try again or email us at info@luxebeautytrip.com');
      }
    } catch {
      if (btn) { btn.disabled = false; btn.textContent = originalText; }
      alert('Something went wrong. Please try again or email us at info@luxebeautytrip.com');
    }
  });
});

// Shrink header on scroll
const header = document.getElementById('header');
if (header) {
  window.addEventListener('scroll', () => {
    header.style.boxShadow = window.scrollY > 10
      ? '0 2px 20px rgba(0,0,0,0.12)'
      : '0 1px 16px rgba(0,0,0,0.07)';
  }, { passive: true });
}
