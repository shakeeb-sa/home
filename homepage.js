document.addEventListener("DOMContentLoaded", () => {
  // --- SET CURRENT YEAR IN FOOTER ---
  const currentYearElement = document.getElementById("currentYear");
  if (currentYearElement) {
    currentYearElement.textContent = new Date().getFullYear();
  }

  // --- MOBILE MENU TOGGLE ---
  const menuToggle = document.getElementById("menuToggle");
  const mobileNavPanel = document.getElementById("nav-menu-mobile");

  if (menuToggle && mobileNavPanel) {
    const menuIcon = menuToggle.querySelector("i");

    menuToggle.addEventListener("click", () => {
      mobileNavPanel.classList.toggle("active");
      const isExpanded = mobileNavPanel.classList.contains("active");
      
      menuToggle.setAttribute("aria-expanded", isExpanded);
      
      if (isExpanded) {
        menuIcon.classList.replace("fa-bars", "fa-times");
        document.body.style.overflow = "hidden";
      } else {
        menuIcon.classList.replace("fa-times", "fa-bars");
        document.body.style.overflow = "auto";
      }
    });

    // Close mobile menu when a link inside it is clicked
    mobileNavPanel.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        mobileNavPanel.classList.remove("active");
        menuToggle.setAttribute("aria-expanded", "false");
        menuIcon.classList.replace("fa-times", "fa-bars");
        document.body.style.overflow = "auto";
      });
    });
  }

  // --- THEME TOGGLE (DARK/LIGHT MODE) ---
  const themeToggle = document.getElementById("themeToggle");
  const htmlElement = document.documentElement;

  const updateThemeIcon = (theme) => {
    const themeIcon = themeToggle.querySelector("i");
    if (themeIcon) {
      themeIcon.classList.toggle("fa-sun", theme === "dark");
      themeIcon.classList.toggle("fa-moon", theme === "light");
    }
  };

  const applyTheme = (theme) => {
    htmlElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
    updateThemeIcon(theme);
  };
  
  const savedTheme = localStorage.getItem("theme");
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const initialTheme = savedTheme || (prefersDark ? "dark" : "light");
  applyTheme(initialTheme);
  
  themeToggle.addEventListener("click", () => {
    const currentTheme = htmlElement.getAttribute("data-theme");
    const newTheme = currentTheme === "light" ? "dark" : "light";
    applyTheme(newTheme);
  });

  // --- BACK TO TOP BUTTON ---
  const backToTopButton = document.getElementById("backToTop");
  if (backToTopButton) {
    window.addEventListener("scroll", () => {
      if (window.scrollY > 300) {
        backToTopButton.classList.add("visible");
      } else {
        backToTopButton.classList.remove("visible");
      }
    });
    backToTopButton.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  // --- SMOOTH SCROLLING FOR ANCHOR LINKS ---
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      const targetId = this.getAttribute("href");
      const targetElement = document.querySelector(targetId);
      
      if (targetElement) {
        const headerOffset = 80;
        const elementPosition = targetElement.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.scrollY - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth",
        });
      }
    });
  });
});
