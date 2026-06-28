
/* ========== LOADER ========== */
window.addEventListener('load', function() {
  setTimeout(function() {
    document.getElementById('loader').classList.add('hidden');
  }, 1400);
});

/* ========== SCROLL PROGRESS ========== */
var scrollProgress = document.getElementById('scrollProgress');
function updateScrollProgress() {
  var scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
  var scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
  var progress = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;
  scrollProgress.style.width = progress + '%';
}

/* ========== NAVBAR SCROLL ========== */
var navbar = document.getElementById('navbar');
var backToTop = document.getElementById('backToTop');
function updateNavbar() {
  if (window.scrollY > 60) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
  if (window.scrollY > 600) {
    backToTop.classList.add('visible');
  } else {
    backToTop.classList.remove('visible');
  }
}

/* Combined scroll listener */
var ticking = false;
window.addEventListener('scroll', function() {
  if (!ticking) {
    requestAnimationFrame(function() {
      updateScrollProgress();
      updateNavbar();
      updateActiveNav();
      ticking = false;
    });
    ticking = true;
  }
});

/* ========== BACK TO TOP ========== */
backToTop.addEventListener('click', function() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

/* ========== MOBILE MENU ========== */
var mobileToggle = document.getElementById('mobileToggle');
var mobileMenu = document.getElementById('mobileMenu');
mobileToggle.addEventListener('click', function() {
  mobileToggle.classList.toggle('active');
  mobileMenu.classList.toggle('open');
  document.body.style.overflow = mobileMenu.classList.contains('open') ? 'hidden' : '';
});
function closeMobile() {
  mobileToggle.classList.remove('active');
  mobileMenu.classList.remove('open');
  document.body.style.overflow = '';
}
/* Close on link click */
mobileMenu.querySelectorAll('a').forEach(function(link) {
  link.addEventListener('click', closeMobile);
});

/* ========== SCROLL REVEAL ========== */
var revealElements = document.querySelectorAll('.reveal');
var revealObserver = new IntersectionObserver(function(entries) {
  entries.forEach(function(entry) {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -30px 0px' });
revealElements.forEach(function(el) { revealObserver.observe(el); });

/* ========== COUNTER ANIMATION ========== */
var counters = document.querySelectorAll('.counter');
var countersStarted = false;
var counterObserver = new IntersectionObserver(function(entries) {
  entries.forEach(function(entry) {
    if (entry.isIntersecting && !countersStarted) {
      countersStarted = true;
      counters.forEach(function(counter) {
        var target = parseInt(counter.getAttribute('data-target'), 10);
        var duration = 2000;
        var startTime = null;
        function animate(timestamp) {
          if (!startTime) startTime = timestamp;
          var elapsed = timestamp - startTime;
          var progress = Math.min(elapsed / duration, 1);
          /* Ease out cubic */
          var eased = 1 - Math.pow(1 - progress, 3);
          var current = Math.floor(eased * target);
          counter.textContent = current.toLocaleString('en-IN');
          if (progress < 1) {
            requestAnimationFrame(animate);
          } else {
            counter.textContent = target.toLocaleString('en-IN');
          }
        }
        requestAnimationFrame(animate);
      });
    }
  });
}, { threshold: 0.4 });
counters.forEach(function(c) { counterObserver.observe(c); });

/* ========== PRICING TILT EFFECT ========== */
document.querySelectorAll('.pricing-card').forEach(function(card) {
  card.addEventListener('mousemove', function(e) {
    if (window.innerWidth < 1024) return;
    if (card.classList.contains('featured')) return;
    var rect = card.getBoundingClientRect();
    var x = e.clientX - rect.left;
    var y = e.clientY - rect.top;
    var centerX = rect.width / 2;
    var centerY = rect.height / 2;
    var rotateX = ((y - centerY) / centerY) * -4;
    var rotateY = ((x - centerX) / centerX) * 4;
    card.style.transform = 'perspective(800px) rotateX(' + rotateX + 'deg) rotateY(' + rotateY + 'deg)';
  });
  card.addEventListener('mouseleave', function() {
    if (card.classList.contains('featured')) return;
    card.style.transform = 'perspective(800px) rotateX(0) rotateY(0)';
  });
});

/* ========== TESTIMONIALS CAROUSEL ========== */
var track = document.getElementById('testimonialsTrack');
var slides = track.querySelectorAll('.testimonial-slide');
var dotsContainer = document.getElementById('testimonialDots');
var currentSlide = 0;
var autoSlideInterval;

slides.forEach(function(_, i) {
  var dot = document.createElement('button');
  dot.className = 'testimonial-dot' + (i === 0 ? ' active' : '');
  dot.setAttribute('aria-label', 'Go to review ' + (i + 1));
  dot.addEventListener('click', function() { goToSlide(i); });
  dotsContainer.appendChild(dot);
});
var dots = dotsContainer.querySelectorAll('.testimonial-dot');

function goToSlide(index) {
  currentSlide = index;
  track.style.transform = 'translateX(-' + (currentSlide * 100) + '%)';
  dots.forEach(function(d, i) {
    d.classList.toggle('active', i === currentSlide);
  });
  resetAutoSlide();
}
document.getElementById('nextBtn').addEventListener('click', function() {
  goToSlide((currentSlide + 1) % slides.length);
});
document.getElementById('prevBtn').addEventListener('click', function() {
  goToSlide((currentSlide - 1 + slides.length) % slides.length);
});
function resetAutoSlide() {
  clearInterval(autoSlideInterval);
  autoSlideInterval = setInterval(function() {
    goToSlide((currentSlide + 1) % slides.length);
  }, 5000);
}
resetAutoSlide();

/* Touch swipe */
var touchStartX = 0;
var touchStartY = 0;
var testimonialsWrapper = document.querySelector('.testimonials-wrapper');
testimonialsWrapper.addEventListener('touchstart', function(e) {
  touchStartX = e.changedTouches[0].screenX;
  touchStartY = e.changedTouches[0].screenY;
}, { passive: true });
testimonialsWrapper.addEventListener('touchend', function(e) {
  var touchEndX = e.changedTouches[0].screenX;
  var touchEndY = e.changedTouches[0].screenY;
  var diffX = touchStartX - touchEndX;
  var diffY = touchStartY - touchEndY;
  /* Only trigger if horizontal swipe is dominant */
  if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 50) {
    if (diffX > 0) goToSlide((currentSlide + 1) % slides.length);
    else goToSlide((currentSlide - 1 + slides.length) % slides.length);
  }
}, { passive: true });

/* ========== HERO PARALLAX (mouse) ========== */
var heroGlow = document.querySelector('.hero-glow');
document.addEventListener('mousemove', function(e) {
  if (window.innerWidth < 768 || !heroGlow) return;
  var x = (e.clientX / window.innerWidth - 0.5) * 2;
  var y = (e.clientY / window.innerHeight - 0.5) * 2;
  heroGlow.style.transform = 'translate(' + (x * 25) + 'px, ' + (y * 25) + 'px)';
});

/* ========== ACTIVE NAV LINK ========== */
var sectionIds = ['about', 'services', 'trainers', 'pricing', 'gallery', 'contact'];
var navLinks = document.querySelectorAll('.nav-links a');
function updateActiveNav() {
  var scrollPos = window.scrollY + 160;
  var current = '';
  sectionIds.forEach(function(id) {
    var section = document.getElementById(id);
    if (section && section.offsetTop <= scrollPos) {
      current = id;
    }
  });
  navLinks.forEach(function(link) {
    var href = link.getAttribute('href').replace('#', '');
    link.classList.toggle('active', href === current);
  });
}

/* ========== SMOOTH SCROLL ========== */
document.querySelectorAll('a[href^="#"]').forEach(function(link) {
  link.addEventListener('click', function(e) {
    var href = link.getAttribute('href');
    if (href === '#') return;
    var target = document.querySelector(href);
    if (target) {
      e.preventDefault();
      var offset = 72;
      var top = target.getBoundingClientRect().top + window.pageYOffset - offset;
      window.scrollTo({ top: top, behavior: 'smooth' });
    }
  });
});

/* ========== PREVENT LAYOUT SHIFT ON LOAD ========== */
document.documentElement.style.opacity = '0';
document.documentElement.style.transition = 'opacity 0.3s ease';
window.addEventListener('load', function() {
  requestAnimationFrame(function() {
    document.documentElement.style.opacity = '1';
  });
});

