(function () {
  'use strict';

  const header        = document.getElementById('header');
  const burger        = document.getElementById('burger');
  const nav           = document.querySelector('.nav');
  const navLinks      = document.querySelectorAll('.nav__link');
  const sections      = document.querySelectorAll('section[id]');
  const fadeEls       = document.querySelectorAll('.fade-up');
  const countEls      = document.querySelectorAll('.numbers__value[data-count]');
  const contactForm   = document.getElementById('contactForm');
  const submitBtn     = document.getElementById('submitBtn');
  const formFeedback  = document.getElementById('formFeedback');
  const trackEl       = document.getElementById('testimonialsTrack');
  const dotsContainer = document.getElementById('testimonialsDots');

  function onScroll() {
    const scrolled = window.scrollY > 40;
    header.classList.toggle('is-scrolled', scrolled);
    highlightActiveNav();
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  function highlightActiveNav() {
    let currentId = '';
    sections.forEach(function (sec) {
      const top = sec.offsetTop - (window.innerHeight * 0.35);
      if (window.scrollY >= top) {
        currentId = sec.id;
      }
    });

    navLinks.forEach(function (link) {
      const href = link.getAttribute('href');
      link.classList.toggle('is-active', href === '#' + currentId);
    });
  }

  function openMenu() {
    burger.classList.add('is-open');
    nav.classList.add('nav--mobile-open');
    burger.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    burger.classList.remove('is-open');
    nav.classList.remove('nav--mobile-open');
    burger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  burger.addEventListener('click', function () {
    const isOpen = burger.classList.contains('is-open');
    isOpen ? closeMenu() : openMenu();
  });

  navLinks.forEach(function (link) {
    link.addEventListener('click', function () {
      closeMenu();
    });
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && burger.classList.contains('is-open')) {
      closeMenu();
      burger.focus();
    }
  });

  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href').slice(1);
      if (!targetId) return;
      const target = document.getElementById(targetId);
      if (!target) return;
      e.preventDefault();
      const headerH = header.offsetHeight;
      const top = target.getBoundingClientRect().top + window.scrollY - headerH;
      window.scrollTo({ top: top, behavior: 'smooth' });
    });
  });

  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );

    fadeEls.forEach(function (el) {
      revealObserver.observe(el);
    });
  } else {
    fadeEls.forEach(function (el) {
      el.classList.add('is-visible');
    });
  }

  function animateCount(el, target, duration) {
    var startTime = null;

    function step(timestamp) {
      if (!startTime) startTime = timestamp;
      var progress = Math.min((timestamp - startTime) / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.floor(eased * target).toLocaleString('pt-BR');
      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        el.textContent = target.toLocaleString('pt-BR');
      }
    }

    requestAnimationFrame(step);
  }

  if ('IntersectionObserver' in window && countEls.length) {
    var countObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            var el     = entry.target;
            var target = parseInt(el.getAttribute('data-count'), 10);
            animateCount(el, target, 1600);
            countObserver.unobserve(el);
          }
        });
      },
      { threshold: 0.5 }
    );

    countEls.forEach(function (el) {
      countObserver.observe(el);
    });
  }

  if (trackEl && dotsContainer) {
    var currentSlide = 0;
    var dots         = dotsContainer.querySelectorAll('.testimonials__dot');
    var totalSlides  = dots.length;
    var autoplayTimer;

    function goToSlide(index) {
      currentSlide = (index + totalSlides) % totalSlides;
      trackEl.style.transform = 'translateX(-' + currentSlide * 100 + '%)';
      dots.forEach(function (dot, i) {
        dot.classList.toggle('testimonials__dot--active', i === currentSlide);
      });
    }

    function startAutoplay() {
      autoplayTimer = setInterval(function () {
        goToSlide(currentSlide + 1);
      }, 5000);
    }

    function stopAutoplay() {
      clearInterval(autoplayTimer);
    }

    dots.forEach(function (dot, i) {
      dot.addEventListener('click', function () {
        stopAutoplay();
        goToSlide(i);
        startAutoplay();
      });
    });

    var touchStartX = 0;

    trackEl.addEventListener('touchstart', function (e) {
      touchStartX = e.changedTouches[0].clientX;
    }, { passive: true });

    trackEl.addEventListener('touchend', function (e) {
      var diff = touchStartX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 50) {
        stopAutoplay();
        goToSlide(currentSlide + (diff > 0 ? 1 : -1));
        startAutoplay();
      }
    }, { passive: true });

    trackEl.addEventListener('mouseenter', stopAutoplay);
    trackEl.addEventListener('mouseleave', startAutoplay);

    startAutoplay();
  }

  var phoneInput = document.getElementById('phone');
  if (phoneInput) {
    phoneInput.addEventListener('input', function () {
      var v = this.value.replace(/\D/g, '').slice(0, 11);
      if (v.length > 10) {
        this.value = '(' + v.slice(0,2) + ') ' + v.slice(2,7) + '-' + v.slice(7);
      } else if (v.length > 6) {
        this.value = '(' + v.slice(0,2) + ') ' + v.slice(2,6) + '-' + v.slice(6);
      } else if (v.length > 2) {
        this.value = '(' + v.slice(0,2) + ') ' + v.slice(2);
      } else if (v.length > 0) {
        this.value = '(' + v;
      }
    });
  }

  function getField(id)      { return document.getElementById(id); }
  function getError(fieldId) { return document.getElementById(fieldId + '-error'); }

  function showError(fieldId, message) {
    var field = getField(fieldId);
    var error = getError(fieldId);
    if (field)  field.classList.add('is-invalid');
    if (error)  error.textContent = message;
  }

  function clearError(fieldId) {
    var field = getField(fieldId);
    var error = getError(fieldId);
    if (field)  field.classList.remove('is-invalid');
    if (error)  error.textContent = '';
  }

  function validateForm() {
    var valid = true;

    var name = getField('name');
    clearError('name');
    if (!name || name.value.trim().length < 3) {
      showError('name', 'Por favor, informe seu nome completo.');
      valid = false;
    }

    var email = getField('email');
    clearError('email');
    var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email.value.trim())) {
      showError('email', 'Informe um e-mail válido.');
      valid = false;
    }

    var message = getField('message');
    clearError('message');
    if (!message || message.value.trim().length < 10) {
      showError('message', 'Por favor, descreva brevemente sua situação (mín. 10 caracteres).');
      valid = false;
    }

    return valid;
  }

  ['name', 'email', 'message'].forEach(function (id) {
    var el = getField(id);
    if (el) {
      el.addEventListener('input', function () { clearError(id); });
    }
  });

  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();

      formFeedback.className     = 'form__feedback';
      formFeedback.style.display = 'none';
      formFeedback.textContent   = '';

      if (!validateForm()) return;

      submitBtn.disabled    = true;
      submitBtn.textContent = 'Enviando…';

      setTimeout(function () {
        submitBtn.disabled    = false;
        submitBtn.textContent = 'Enviar Mensagem';
        contactForm.reset();

        formFeedback.textContent = '✓ Mensagem enviada com sucesso! Entraremos em contato em breve.';
        formFeedback.className   = 'form__feedback success';

        setTimeout(function () {
          formFeedback.className   = 'form__feedback';
          formFeedback.textContent = '';
        }, 6000);
      }, 1200);
    });
  }

})();
