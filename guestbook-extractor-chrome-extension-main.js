document.addEventListener("DOMContentLoaded", () => {
  const htmlElement = document.documentElement;
  const menuToggle = document.getElementById("menuToggle");
  const navMenu = document.getElementById("nav-menu");
  const themeToggle = document.getElementById("themeToggle");
  const themeIcon = themeToggle.querySelector("i");
  const backToTopButton = document.getElementById("backToTop");
  const downloadButton = document.getElementById("downloadBtn");

  // --- 1. Dynamic Copyright Year ---
  document.getElementById("currentYear").textContent = new Date().getFullYear();

  // --- 2. Mobile Menu Toggle ---
  menuToggle.addEventListener("click", () => {
    const isExpanded = menuToggle.getAttribute("aria-expanded") === "true";
    navMenu.classList.toggle("active");
    menuToggle.setAttribute("aria-expanded", !isExpanded);
  });

  // Close mobile menu when a link is clicked
  document.querySelectorAll('#nav-menu a, .logo').forEach((link) => {
    link.addEventListener("click", () => {
      if (navMenu.classList.contains('active')) {
        navMenu.classList.remove("active");
        menuToggle.setAttribute("aria-expanded", "false");
      }
    });
  });

  // --- 3. Dark/Light Theme Toggle ---
  const updateThemeIcon = (theme) => {
    themeIcon.classList.toggle("fa-sun", theme === "dark");
    themeIcon.classList.toggle("fa-moon", theme === "light");
  };

  const applyTheme = (theme) => {
    htmlElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
    updateThemeIcon(theme);
  };

  themeToggle.addEventListener("click", () => {
    const currentTheme = htmlElement.getAttribute("data-theme") || "light";
    const newTheme = currentTheme === "light" ? "dark" : "light";
    applyTheme(newTheme);
  });

  // Load saved theme from localStorage or user preference
  const savedTheme = localStorage.getItem("theme");
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  
  if (savedTheme) {
    applyTheme(savedTheme);
  } else {
    applyTheme(prefersDark ? 'dark' : 'light');
  }

  // --- 4. "Back to Top" Button ---
  window.addEventListener("scroll", () => {
    if (window.pageYOffset > 300) {
      backToTopButton.classList.add("visible");
    } else {
      backToTopButton.classList.remove("visible");
    }
  });

  backToTopButton.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  });
  
  // --- 5. Download Button Functionality ---
  if (downloadButton) {
      downloadButton.addEventListener("click", () => {
          window.open('https://mega.nz/file/XI0TCbBQ#4DWE-VCmCo8Qr05owNB27hZDHsk2F8aG0qfmJr_QqzY', '_blank', 'noopener,noreferrer');
      });
  }

  // --- 6. Smooth Scrolling for Anchor Links ---
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      const targetId = this.getAttribute("href");
      if (targetId.length <= 1) return;

      e.preventDefault();
      const targetElement = document.querySelector(targetId);
      
      if (targetElement) {
        targetElement.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });
      }
    });
  });
});
