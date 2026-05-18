const navToggle = document.getElementById("navToggle");
const navMenu = document.getElementById("navMenu");
const themeBtn = document.getElementById("themeBtn");
const cursorGlow = document.getElementById("cursorGlow");
const year = document.getElementById("year");
const form = document.getElementById("contactForm");
const formMessage = document.getElementById("formMessage");
const filters = document.querySelectorAll(".filter");
const skills = document.querySelectorAll(".skill");
const revealItems = document.querySelectorAll(".reveal");
const statNumbers = document.querySelectorAll("[data-count]");

if (year) year.textContent = new Date().getFullYear();

navToggle?.addEventListener("click", () => {
  const isOpen = navMenu.classList.toggle("open");
  navToggle.setAttribute("aria-expanded", String(isOpen));
});

document.querySelectorAll(".nav-menu a").forEach((link) => {
  link.addEventListener("click", () => {
    navMenu.classList.remove("open");
    navToggle.setAttribute("aria-expanded", "false");
  });
});

const savedTheme = localStorage.getItem("portfolio-theme") || "dark";
document.documentElement.dataset.theme = savedTheme;
updateThemeIcon(savedTheme);

themeBtn?.addEventListener("click", () => {
  const current = document.documentElement.dataset.theme;
  const next = current === "dark" ? "light" : "dark";
  document.documentElement.dataset.theme = next;
  localStorage.setItem("portfolio-theme", next);
  updateThemeIcon(next);
});

function updateThemeIcon(theme) {
  if (!themeBtn) return;
  themeBtn.innerHTML = theme === "dark" ? '<i class="fa-solid fa-sun"></i>' : '<i class="fa-solid fa-moon"></i>';
}

window.addEventListener("mousemove", (event) => {
  if (!cursorGlow) return;
  cursorGlow.style.left = `${event.clientX}px`;
  cursorGlow.style.top = `${event.clientY}px`;
});

filters.forEach((button) => {
  button.addEventListener("click", () => {
    filters.forEach((btn) => btn.classList.remove("active"));
    button.classList.add("active");

    const selected = button.dataset.filter;
    skills.forEach((skill) => {
      const match = selected === "all" || skill.dataset.category === selected;
      skill.classList.toggle("hide", !match);
    });
  });
});

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("show");
      if (entry.target.classList.contains("stats")) animateCounters();
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.18 });

revealItems.forEach((item) => observer.observe(item));

let countersStarted = false;
function animateCounters() {
  if (countersStarted) return;
  countersStarted = true;

  statNumbers.forEach((number) => {
    const target = Number(number.dataset.count);
    let current = 0;
    const increment = Math.max(1, Math.ceil(target / 80));

    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        current = target;
        clearInterval(timer);
      }
      number.textContent = target === 100 ? `${current}%` : current;
    }, 18);
  });
}

const sections = document.querySelectorAll("section[id]");
const navLinks = document.querySelectorAll(".nav-menu a");

window.addEventListener("scroll", () => {
  let currentId = "";
  sections.forEach((section) => {
    const sectionTop = section.offsetTop - 130;
    if (window.scrollY >= sectionTop) currentId = section.id;
  });

  navLinks.forEach((link) => {
    link.classList.toggle("active", link.getAttribute("href") === `#${currentId}`);
  });
});

form?.addEventListener("submit", (event) => {
  event.preventDefault();

  const name = form.name.value.trim();
  const email = form.email.value.trim();
  const message = form.message.value.trim();
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!name || !email || !message) {
    showMessage("Please fill all fields.", "error");
    return;
  }

  if (!emailPattern.test(email)) {
    showMessage("Please enter a valid email address.", "error");
    return;
  }

  const mailSubject = encodeURIComponent(`Portfolio contact from ${name}`);
  const mailBody = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`);
  window.location.href = `mailto:hariharank302@gmail.com?subject=${mailSubject}&body=${mailBody}`;
  showMessage("Opening your email app...", "success");
  form.reset();
});

function showMessage(text, type) {
  if (!formMessage) return;
  formMessage.textContent = text;
  formMessage.style.color = type === "success" ? "var(--accent)" : "var(--danger)";
  setTimeout(() => { formMessage.textContent = ""; }, 4500);
}
