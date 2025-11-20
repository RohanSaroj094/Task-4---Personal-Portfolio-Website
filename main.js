// main.js - portfolio interactions: theme, nav active, contact form -> localStorage + mailto
document.addEventListener('DOMContentLoaded', () => {
  const themeToggle = document.getElementById('themeToggle');
  const siteHeader = document.getElementById('siteHeader');
  const navLinks = document.querySelectorAll('.nav-link');
  const contactForm = document.getElementById('contactForm');
  const contactStatus = document.getElementById('contactStatus');
  const contactMail = document.getElementById('contactMail');
  const yearEl = document.getElementById('year');

  // set year
  yearEl.textContent = new Date().getFullYear();

  // THEME: persist in localStorage
  function setTheme(mode){
    if (mode === 'dark') {
      document.documentElement.style.setProperty('--bg','linear-gradient(180deg,#071029 0%, #071b2b 100%)');
      themeToggle.textContent = 'Light';
      localStorage.setItem('portfolio_theme','dark');
    } else {
      document.documentElement.style.setProperty('--bg','linear-gradient(180deg,#f0f5ff 0%, #e8f0ff 100%)');
      themeToggle.textContent = 'Dark';
      localStorage.setItem('portfolio_theme','light');
    }
  }
  // load theme
  const saved = localStorage.getItem('portfolio_theme') || 'dark';
  setTheme(saved);

  themeToggle.addEventListener('click', () => {
    const cur = localStorage.getItem('portfolio_theme') === 'dark' ? 'dark' : 'light';
    setTheme(cur === 'dark' ? 'light' : 'dark');
  });

  // sticky header style on scroll
  window.addEventListener('scroll', () => {
    if (window.scrollY > 60) siteHeader.classList.add('scrolled');
    else siteHeader.classList.remove('scrolled');
  }, { passive: true });

  // smooth scroll for nav links and active link on scroll (IntersectionObserver)
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const href = link.getAttribute('href');
      const target = document.querySelector(href);
      if (!target) return;
      const offset = siteHeader.offsetHeight + 12;
      const top = target.getBoundingClientRect().top + window.pageYOffset - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });

  const sections = document.querySelectorAll('main section[id]');
  const observerOptions = { root: null, rootMargin: '-35% 0px -35% 0px', threshold: 0 };
  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      const id = entry.target.id;
      const nav = document.querySelector(`.nav-link[href="#${id}"]`);
      if (!nav) return;
      if (entry.isIntersecting) nav.classList.add('active'); else nav.classList.remove('active');
    });
  }, observerOptions);
  sections.forEach(s => io.observe(s));

  // CONTACT FORM: save to localStorage (gathers leads) and open mailto fallback
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('cname').value.trim();
    const email = document.getElementById('cemail').value.trim();
    const message = document.getElementById('cmessage').value.trim();

    if (!name || !email) {
      contactStatus.textContent = 'Please provide name and email.';
      return;
    }

    const lead = { id: Date.now(), name, email, message, createdAt: new Date().toISOString() };
    const existing = JSON.parse(localStorage.getItem('portfolio_leads') || '[]');
    existing.unshift(lead);
    localStorage.setItem('portfolio_leads', JSON.stringify(existing));

    contactStatus.textContent = 'Thanks — message saved. You can also send via email.';
    contactForm.reset();
  });

  contactMail.addEventListener('click', () => {
    const name = document.getElementById('cname').value.trim();
    const email = document.getElementById('cemail').value.trim();
    const message = document.getElementById('cmessage').value.trim();
    const subject = encodeURIComponent('Portfolio Contact');
    const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\nMessage:\n${message}`);
    window.location.href = `mailto:rohan@example.com?subject=${subject}&body=${body}`;
  });

  // helper: replace sample project links with actual later - no action required now

  // small accessibility: allow Enter to submit on focused send button
  document.querySelectorAll('.btn').forEach(b => b.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') e.target.click();
  }));
});
