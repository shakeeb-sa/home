document.addEventListener("DOMContentLoaded", () => {
  // --- SET CURRENT YEAR IN FOOTER ---
  const currentYearElement = document.getElementById("currentYear");
  if (currentYearElement) {
    currentYearElement.textContent = new Date().getFullYear();
  }

  // --- THEME TOGGLE (DARK/LIGHT MODE) ---
  const themeToggle = document.getElementById("themeToggle");
  const htmlElement = document.documentElement;

  if (themeToggle && htmlElement) {
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
  }

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
      // Don't prevent default for the skip link
      if (this.getAttribute("href") === "#main-content") {
        return;
      }

      e.preventDefault();
      const targetId = this.getAttribute("href");
      
      try {
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
          const headerOffset = 80; // Height of the sticky header
          const elementPosition = targetElement.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.scrollY - headerOffset;

          window.scrollTo({
            top: offsetPosition,
            behavior: "smooth",
          });
        }
      } catch (error) {
        console.error("Error finding element for smooth scroll:", error);
      }
    });
  });
});
