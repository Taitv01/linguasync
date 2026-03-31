/**
 * LinguaSync — Main JavaScript
 * Handles: Navigation, Language Toggle, Scroll Animations, FAQ, Form, Toast
 */

document.addEventListener('DOMContentLoaded', () => {

  // ============================================================
  // LANGUAGE TOGGLE (EN/VN)
  // ============================================================
  const langToggle = document.getElementById('langToggle');
  const langButtons = langToggle.querySelectorAll('button');

  function setLanguage(lang) {
    document.documentElement.setAttribute('data-lang', lang);
    
    // Update toggle active state
    langButtons.forEach(btn => {
      btn.classList.toggle('active', btn.dataset.lang === lang);
    });

    // Update all translatable elements
    document.querySelectorAll('[data-en][data-vi]').forEach(el => {
      const text = el.getAttribute(`data-${lang}`);
      if (text) {
        if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
          el.placeholder = text;
        } else {
          el.textContent = text;
        }
      }
    });

    // Update calculator if available
    if (window.calculatorUI) {
      window.calculatorUI.updateQuote();
    }

    // Save preference
    localStorage.setItem('linguasync-lang', lang);
  }

  langButtons.forEach(btn => {
    btn.addEventListener('click', () => setLanguage(btn.dataset.lang));
  });

  // Load saved language
  const savedLang = localStorage.getItem('linguasync-lang') || 'en';
  setLanguage(savedLang);

  // ============================================================
  // NAVBAR SCROLL EFFECT
  // ============================================================
  const navbar = document.getElementById('navbar');
  let lastScroll = 0;

  window.addEventListener('scroll', () => {
    const currentScroll = window.scrollY;
    navbar.classList.toggle('scrolled', currentScroll > 50);
    lastScroll = currentScroll;
  }, { passive: true });

  // ============================================================
  // MOBILE MENU
  // ============================================================
  const hamburger = document.getElementById('navHamburger');
  const navLinks = document.getElementById('navLinks');

  hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('mobile-open');
    const spans = hamburger.querySelectorAll('span');
    if (navLinks.classList.contains('mobile-open')) {
      spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
      spans[1].style.opacity = '0';
      spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
    } else {
      spans[0].style.transform = '';
      spans[1].style.opacity = '';
      spans[2].style.transform = '';
    }
  });

  // Close mobile menu on link click
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('mobile-open');
      const spans = hamburger.querySelectorAll('span');
      spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
    });
  });

  // ============================================================
  // SMOOTH SCROLL
  // ============================================================
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // ============================================================
  // SCROLL REVEAL ANIMATIONS
  // ============================================================
  const revealElements = document.querySelectorAll('.reveal');
  
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });

  revealElements.forEach(el => revealObserver.observe(el));

  // ============================================================
  // FAQ ACCORDION
  // ============================================================
  document.querySelectorAll('.faq-question').forEach(button => {
    button.addEventListener('click', () => {
      const item = button.parentElement;
      const answer = item.querySelector('.faq-answer');
      const isActive = item.classList.contains('active');

      // Close all
      document.querySelectorAll('.faq-item').forEach(faq => {
        faq.classList.remove('active');
        faq.querySelector('.faq-answer').style.maxHeight = '0';
      });

      // Open clicked (if wasn't active)
      if (!isActive) {
        item.classList.add('active');
        answer.style.maxHeight = answer.scrollHeight + 'px';
      }
    });
  });

  // ============================================================
  // CONTACT FORM
  // ============================================================
  const contactForm = document.getElementById('contactForm');
  
  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const submitBtn = document.getElementById('contactSubmitBtn');
    const originalText = submitBtn.textContent;
    const lang = document.documentElement.getAttribute('data-lang');
    
    submitBtn.textContent = lang === 'vi' ? '⏳ Đang gửi...' : '⏳ Sending...';
    submitBtn.disabled = true;

    try {
      const payload = {
        name: document.getElementById('contactName').value,
        email: document.getElementById('contactEmail').value,
        video_url: document.getElementById('contactVideoUrl').value,
        target_languages: document.getElementById('contactLangs').value,
        budget: document.getElementById('contactBudget').value,
        message: document.getElementById('contactMessage').value,
      };

      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        showToast(
          lang === 'vi' 
            ? '✅ Đã gửi thành công! Chúng tôi sẽ phản hồi trong 2 giờ.' 
            : '✅ Sent successfully! We\'ll reply within 2 hours.', 
          'success'
        );
        contactForm.reset();
      } else {
        throw new Error(result.error || 'Form submission failed');
      }
    } catch (error) {
      showToast(
        lang === 'vi' 
          ? '❌ Gửi thất bại. Vui lòng email trực tiếp: hello@linguasync.io' 
          : '❌ Failed to send. Please email directly: hello@linguasync.io', 
        'error'
      );
    } finally {
      submitBtn.textContent = originalText;
      submitBtn.disabled = false;
    }
  });

  // ============================================================
  // TOAST NOTIFICATION
  // ============================================================
  function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.className = `toast ${type} show`;
    
    setTimeout(() => {
      toast.classList.remove('show');
    }, 5000);
  }

  // Make showToast globally available
  window.showToast = showToast;

  // ============================================================
  // ACTIVE NAV LINK HIGHLIGHTING
  // ============================================================
  const sections = document.querySelectorAll('section[id]');
  
  const navObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        document.querySelectorAll('.nav-links a').forEach(link => {
          link.style.color = link.getAttribute('href') === `#${id}` 
            ? 'var(--text-primary)' 
            : '';
        });
      }
    });
  }, { threshold: 0.3 });

  sections.forEach(section => navObserver.observe(section));

  // ============================================================
  // COUNTER ANIMATION (Hero Stats)
  // ============================================================
  const counterElements = document.querySelectorAll('.hero-stat .number[data-count]');

  function animateCounter(el) {
    const target = parseInt(el.dataset.count);
    const suffix = el.dataset.suffix || '';
    const duration = 2000;
    const startTime = performance.now();

    function easeOutQuad(t) {
      return t * (2 - t);
    }

    function update(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = easeOutQuad(progress);
      const current = Math.round(easedProgress * target);

      el.textContent = current + suffix;

      if (progress < 1) {
        requestAnimationFrame(update);
      }
    }

    requestAnimationFrame(update);
  }

  if (counterElements.length > 0) {
    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          counterObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    counterElements.forEach(el => counterObserver.observe(el));
  }

  // ============================================================
  // ZALO FLOAT BUTTON — Entrance Animation
  // ============================================================
  const zaloFloat = document.getElementById('zaloFloat');
  if (zaloFloat) {
    setTimeout(() => {
      zaloFloat.classList.add('visible');
    }, 2000);
  }

});
