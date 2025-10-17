document.addEventListener("DOMContentLoaded", () => {
  // Get current year for footer
  document.getElementById("currentYear").textContent = new Date().getFullYear();
  // Mobile menu toggle
  const menuToggle = document.getElementById("menuToggle");
  const navMenu = document.getElementById("nav-menu");
  menuToggle.addEventListener("click", () => {
    navMenu.classList.toggle("active");
    const isExpanded = navMenu.classList.contains("active");
    menuToggle.setAttribute("aria-expanded", isExpanded);
  });
  // Close mobile menu when clicking on a link
  const navLinks = navMenu.querySelectorAll("a");
  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      navMenu.classList.remove("active");
      menuToggle.setAttribute("aria-expanded", "false");
    });
  });
  // Theme toggle
  const themeToggle = document.getElementById("themeToggle");
  const htmlElement = document.documentElement;
  const themeIcon = themeToggle.querySelector("i");
  // Check for saved theme preference or default to light mode
  const currentTheme = localStorage.getItem("theme") || "light";
  htmlElement.setAttribute("data-theme", currentTheme);
  updateThemeIcon(currentTheme);
  themeToggle.addEventListener("click", () => {
    const currentTheme = htmlElement.getAttribute("data-theme");
    const newTheme = currentTheme === "light" ? "dark" : "light";
    htmlElement.setAttribute("data-theme", newTheme);
    localStorage.setItem("theme", newTheme);
    updateThemeIcon(newTheme);
  });
  function updateThemeIcon(theme) {
    if (theme === "dark") {
      themeIcon.classList.remove("fa-moon");
      themeIcon.classList.add("fa-sun");
    } else {
      themeIcon.classList.remove("fa-sun");
      themeIcon.classList.add("fa-moon");
    }
  }
  // Back to top button
  const backToTopButton = document.getElementById("backToTop");
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
  // Search functionality
  const searchBar = document.getElementById("searchBar");
  const searchBtn = document.getElementById("searchBtn");
  const toolCards = document.querySelectorAll(".tool-card");
  function performSearch() {
    const searchTerm = searchBar.value.toLowerCase().trim();
    toolCards.forEach((card) => {
      const title = card.querySelector(".tool-title").textContent.toLowerCase();
      const description = card
        .querySelector(".tool-desc")
        .textContent.toLowerCase();
      if (title.includes(searchTerm) || description.includes(searchTerm)) {
        card.style.display = "flex";
      } else {
        card.style.display = "none";
      }
    });
    // Show all cards if search is empty
    if (searchTerm === "") {
      toolCards.forEach((card) => {
        card.style.display = "flex";
      });
    }
  }
  searchBtn.addEventListener("click", performSearch);
  searchBar.addEventListener("keyup", (event) => {
    if (event.key === "Enter") {
      performSearch();
    }
  });
  // Tool buttons functionality
  const buttons = [
    {
      id: "splitUrlBtn",
      url: "https://shakeeb-sa.github.io/url-path-separator",
    },
    {
      id: "convertLinksBtn",
      url: "https://shakeeb-sa.github.io/multi-format-link-converter/",
    },
    {
      id: "exploreCodingBtn",
      url: "https://shakeeb-sa.github.io/all-about-coding/",
    },
  ];
  buttons.forEach(({ id, url }) => {
    const btn = document.getElementById(id);
    if (btn) {
      btn.addEventListener("click", () => {
        window.open(url, "_blank", "noopener,noreferrer");
      });
    }
  });
  // Smooth scrolling for navigation links
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      const targetId = this.getAttribute("href");
      if (targetId === "#") return;
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        const offsetTop = targetElement.offsetTop - 80;
        window.scrollTo({
          top: offsetTop,
          behavior: "smooth",
        });
      }
    });
  });
});





