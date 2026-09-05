const header = document.querySelector('[data-header]');
const menuButton = document.querySelector('.menu-button');
const nav = document.querySelector('.site-nav');
const toggles = [...document.querySelectorAll('.question-toggle')];
const expandAllButton = document.querySelector('[data-expand-all]');
const themeToggle = document.querySelector('[data-theme-toggle]');
const themeLabel = document.querySelector('[data-theme-label]');
const backToTopButton = document.querySelector('[data-back-to-top]');
const interviewSection = document.querySelector('#interview');

const readSavedTheme = () => {
  try {
    return localStorage.getItem('design-leaders-theme');
  } catch {
    return null;
  }
};

const applyTheme = (theme, save = false) => {
  const isDark = theme === 'dark';
  document.documentElement.dataset.theme = isDark ? 'dark' : 'light';
  themeToggle?.setAttribute('aria-pressed', String(isDark));
  if (themeLabel) themeLabel.textContent = isDark ? 'Light mode' : 'Dark mode';
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', isDark ? '#10130f' : '#f3f0e8');
  if (save) {
    try {
      localStorage.setItem('design-leaders-theme', isDark ? 'dark' : 'light');
    } catch {
      // The visual toggle still works when storage is unavailable.
    }
  }
};

const savedTheme = readSavedTheme();
const preferredTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
applyTheme(savedTheme === 'dark' || savedTheme === 'light' ? savedTheme : preferredTheme);

themeToggle?.addEventListener('click', () => {
  const nextTheme = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
  applyTheme(nextTheme, true);
});

document.addEventListener('contextmenu', (event) => {
  event.preventDefault();
});

const setQuestionState = (toggle, open) => {
  const answer = document.getElementById(toggle.getAttribute('aria-controls'));
  const mark = toggle.querySelector('.toggle-mark');
  toggle.setAttribute('aria-expanded', String(open));
  if (answer) answer.hidden = !open;
  if (mark) mark.textContent = open ? '−' : '+';
};

toggles.forEach((toggle) => {
  toggle.addEventListener('click', () => {
    const open = toggle.getAttribute('aria-expanded') !== 'true';
    setQuestionState(toggle, open);
    const allOpen = toggles.every((item) => item.getAttribute('aria-expanded') === 'true');
    expandAllButton?.setAttribute('aria-pressed', String(allOpen));
    if (expandAllButton) expandAllButton.textContent = allOpen ? 'Collapse all' : 'Expand all';
  });
});

expandAllButton?.addEventListener('click', () => {
  const shouldOpen = expandAllButton.getAttribute('aria-pressed') !== 'true';
  toggles.forEach((toggle) => setQuestionState(toggle, shouldOpen));
  expandAllButton.setAttribute('aria-pressed', String(shouldOpen));
  expandAllButton.textContent = shouldOpen ? 'Collapse all' : 'Expand all';
});

menuButton?.addEventListener('click', () => {
  const open = menuButton.getAttribute('aria-expanded') !== 'true';
  menuButton.setAttribute('aria-expanded', String(open));
  nav?.classList.toggle('is-open', open);
  const mark = menuButton.querySelector('[aria-hidden]');
  if (mark) mark.textContent = open ? '−' : '+';
});

nav?.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => {
  menuButton?.setAttribute('aria-expanded', 'false');
  nav.classList.remove('is-open');
}));

backToTopButton?.addEventListener('click', () => {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  window.scrollTo({ top: 0, behavior: reducedMotion ? 'auto' : 'smooth' });
});

const updateScrollState = () => {
  header?.classList.toggle('is-scrolled', window.scrollY > 24);
  const showBackToTop = Boolean(interviewSection && interviewSection.getBoundingClientRect().top <= window.innerHeight * 0.25);
  backToTopButton?.classList.toggle('is-visible', showBackToTop);
  backToTopButton?.setAttribute('aria-hidden', String(!showBackToTop));
  if (backToTopButton) backToTopButton.tabIndex = showBackToTop ? 0 : -1;
};

window.addEventListener('scroll', updateScrollState, { passive: true });
window.addEventListener('resize', updateScrollState);
updateScrollState();
