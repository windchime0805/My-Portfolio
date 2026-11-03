(() => {
  const body = document.body;
  const themeToggle = document.querySelector('.theme-toggle');
  const themeIcon = document.querySelector('.toggle-icon');
  const themeLabel = document.querySelector('.toggle-label');
  const themeMeta = document.querySelector('meta[name="theme-color"]');
  const storedTheme = localStorage.getItem('rushika-theme');
  const preferredTheme = window.matchMedia('(prefers-color-scheme: light)').matches
    ? 'day'
    : 'night';

  function setTheme(theme, save = false) {
    body.dataset.theme = theme;
    const isNight = theme === 'night';

    themeIcon.textContent = isNight ? '☾' : '☼';
    themeLabel.textContent = isNight ? 'Night' : 'Day';
    themeToggle.setAttribute(
      'aria-label',
      `Switch to ${isNight ? 'daylight' : 'night'} theme`,
    );
    themeMeta.content = isNight ? '#102e2b' : '#c8e1e9';

    if (save) {
      localStorage.setItem('rushika-theme', theme);
    }
  }

  setTheme(storedTheme || preferredTheme);
  themeToggle.addEventListener('click', () => {
    const nextTheme = body.dataset.theme === 'night' ? 'day' : 'night';
    setTheme(nextTheme, true);
  });

  const menuToggle = document.querySelector('.menu-toggle');
  const navigation = document.querySelector('.nav-links');

  function closeNavigation() {
    navigation.classList.remove('open');
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.setAttribute('aria-label', 'Open navigation');
  }

  menuToggle.addEventListener('click', () => {
    const isOpen = menuToggle.getAttribute('aria-expanded') !== 'true';
    menuToggle.setAttribute('aria-expanded', String(isOpen));
    menuToggle.setAttribute(
      'aria-label',
      isOpen ? 'Close navigation' : 'Open navigation',
    );
    navigation.classList.toggle('open', isOpen);
  });

  navigation.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', closeNavigation);
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && menuToggle.getAttribute('aria-expanded') === 'true') {
      closeNavigation();
      menuToggle.focus();
    }
  });

  const roles = [
    'an AI/ML enthusiast',
    'a Generative AI explorer',
    'a software developer',
    'a creative problem solver',
  ];
  const roleElement = document.getElementById('typed-role');
  let roleIndex = 0;
  let letterIndex = roles[0].length;
  let deleting = true;

  function typeRole() {
    const role = roles[roleIndex];
    roleElement.textContent = role.slice(0, letterIndex);

    if (!deleting && letterIndex < role.length) {
      letterIndex += 1;
    } else if (deleting && letterIndex > 0) {
      letterIndex -= 1;
    } else if (deleting) {
      deleting = false;
      roleIndex = (roleIndex + 1) % roles.length;
    } else {
      deleting = true;
    }

    window.setTimeout(typeRole, deleting ? 55 : 92);
  }

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (!reducedMotion.matches) {
    window.setTimeout(typeRole, 1800);
  }

  const revealItems = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && !reducedMotion.matches) {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 },
    );

    revealItems.forEach((item) => revealObserver.observe(item));
  } else {
    revealItems.forEach((item) => item.classList.add('is-visible'));
  }

  const topButton = document.querySelector('.to-top');
  window.addEventListener(
    'scroll',
    () => topButton.classList.toggle('visible', window.scrollY > 550),
    { passive: true },
  );
  topButton.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  const pageSections = [...document.querySelectorAll('main > section')];
  let activeSection = null;
  let sectionFrame = 0;

  function updateOrbDirection() {
    sectionFrame = 0;
    const centerY = window.innerHeight / 2;
    const nearestSection = pageSections.reduce((nearest, section) => {
      const rect = section.getBoundingClientRect();
      const distance = centerY < rect.top
        ? rect.top - centerY
        : centerY > rect.bottom
          ? centerY - rect.bottom
          : 0;

      return !nearest || distance < nearest.distance
        ? { section, distance }
        : nearest;
    }, null);
    const currentSection = nearestSection?.section;

    if (currentSection && currentSection !== activeSection) {
      if (activeSection) {
        body.classList.toggle('orb-reverse');
      }
      activeSection = currentSection;
    }
  }

  function queueOrbDirectionUpdate() {
    if (!sectionFrame) {
      sectionFrame = window.requestAnimationFrame(updateOrbDirection);
    }
  }

  window.addEventListener('scroll', queueOrbDirectionUpdate, { passive: true });
  window.addEventListener('resize', queueOrbDirectionUpdate);
  updateOrbDirection();

  document.getElementById('year').textContent = new Date().getFullYear();

  document.getElementById('contact-form').addEventListener('submit', (event) => {
    event.preventDefault();

    const form = new FormData(event.currentTarget);
    const name = String(form.get('name')).trim();
    const email = String(form.get('email')).trim();
    const message = String(form.get('message')).trim();
    const subject = encodeURIComponent(`Portfolio note from ${name}`);
    const bodyText = encodeURIComponent(`${message}\n\n— ${name}\n${email}`);

    window.location.href =
      `mailto:rushikaramadugu@gmail.com?subject=${subject}&body=${bodyText}`;
  });
})();
