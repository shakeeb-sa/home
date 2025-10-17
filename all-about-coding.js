/**
 * All About Coding - Main Application Logic
 *
 * This script handles:
 * - Dynamically rendering video content from videos.js
 * - Theme switching (light/dark mode) with localStorage persistence
 * - Mobile navigation toggle
 * - Filtering videos by sub-category
 * - Back-to-top button functionality
 * - Saving videos for later using localStorage
 * - Toast notifications for user feedback
 * - Thumbnail error handling
 * - Category navigation scrolling
 * - Sticky category nav positioning
 */

document.addEventListener("DOMContentLoaded", () => {
  // --- DOM Element References ---
  const elements = {
    themeToggle: document.getElementById("themeToggle"),
    menuToggle: document.getElementById("menuToggle"),
    navMenu: document.getElementById("nav-menu"),
    backToTopBtn: document.getElementById("backToTop"),
    toast: document.getElementById("toast"),
    categoryList: document.getElementById("categoryList"),
    scrollLeftBtn: document.getElementById("scroll-left-btn"),
    scrollRightBtn: document.getElementById("scroll-right-btn"),
  };

  // --- State Management ---
  const state = {
    savedVideos: JSON.parse(localStorage.getItem("savedVideos")) || [],
    currentTheme: localStorage.getItem("theme") || "light",
  };

  // --- Mapping Categories to Container IDs ---
  const categoryContainerMap = {
    js: "js-videos",
    css: "css-videos",
    html: "html-videos",
    other: "other-videos",
    docker: "docker-videos",
    "mern-stack": "mern-stack-videos",
    "web-development": "web-development-videos",
    "syntax-and-coding": "syntax-and-coding-videos",
    devops: "devops-videos",
    api: "api-videos",
    "git-and-github": "git-and-github-videos",
    linux: "linux-videos",
    frontend: "frontend-videos",
    wordpress: "wordpress-videos",
    backend: "backend-videos",
    dsa: "dsa-videos",
    cybersecurity: "cybersecurity-videos",
    coding: "coding-videos",
    cms: "cms-videos",
    cmd: "cmd-videos",
  };

  // --- Initialization ---
  function init() {
    applyTheme();
    renderAllVideos();
    setupEventListeners();
    setupCategoryNavScroll();
    updateStickyNavOffset(); // Set initial offset for sticky nav
  }

  // --- Theme Handling ---
  function applyTheme() {
    document.documentElement.setAttribute("data-theme", state.currentTheme);
    elements.themeToggle.innerHTML = state.currentTheme === "dark" ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
  }

  function toggleTheme() {
    state.currentTheme = state.currentTheme === "dark" ? "light" : "dark";
    localStorage.setItem("theme", state.currentTheme);
    applyTheme();
    showToast(`Switched to ${state.currentTheme} mode`);
  }

  // --- Dynamic Video Rendering ---
  function renderAllVideos() {
    if (typeof videoData === "undefined" || videoData.length === 0) {
      console.error("Video data is not loaded or empty.");
      return;
    }

    videoData.forEach((video) => {
      const containerId = categoryContainerMap[video.category];
      const container = document.getElementById(containerId);
      if (container) {
        container.innerHTML += createVideoCardHTML(video);
      }
    });

    // After rendering, re-initialize save buttons and thumbnail handlers
    setupSaveButtons();
    setupThumbnailErrorHandling();
  }

  function createVideoCardHTML(video) {
    const isSaved = state.savedVideos.includes(video.videoId);
    return `
      <div class="video-card" data-video-id="${video.videoId}" data-category="${video.subCategory}" data-date="${video.date}">
        <div class="video-thumbnail">
          <img src="https://img.youtube.com/vi/${video.videoId}/maxresdefault.jpg" alt="${video.title}" loading="lazy" data-video-id="${video.videoId}" />
          <span class="video-duration">${video.duration}</span>
        </div>
        <div class="video-info">
          <h3 class="video-title">${video.title}</h3>
          <div class="video-meta">
            <span>${video.views} views</span>
            <span>${formatDate(video.date)}</span>
          </div>
        </div>
        <div class="video-actions">
          <button class="video-action-btn save-btn ${isSaved ? "saved" : ""}" aria-label="Save video">
            <i class="fa-solid fa-bookmark"></i>
            <span>${isSaved ? "Saved" : "Save"}</span>
          </button>
          <a href="https://youtu.be/${video.videoId}" target="_blank" class="video-action-btn" aria-label="Watch video">
            <i class="fas fa-play"></i>
            <span>Watch</span>
          </a>
        </div>
      </div>
    `;
  }

  // --- Sticky Nav Offset Calculation ---
  function updateStickyNavOffset() {
    const header = document.querySelector("header");
    if (header) {
      const headerHeight = header.offsetHeight;
      document.documentElement.style.setProperty('--header-height', `${headerHeight}px`);
    }
  }

  // --- Event Listener Setup ---
  function setupEventListeners() {
    elements.themeToggle.addEventListener("click", toggleTheme);
    elements.menuToggle.addEventListener("click", toggleMobileMenu);
    elements.backToTopBtn.addEventListener("click", scrollToTop);
    window.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", updateStickyNavOffset); // Recalculate on resize

    // Filter controls
    document.querySelectorAll(".filter-controls .control-btn").forEach((button) => {
      button.addEventListener("click", handleFilter);
    });
  }

  function setupSaveButtons() {
    document.querySelectorAll(".save-btn").forEach((button) => {
      button.addEventListener("click", handleSaveVideo);
    });
  }
  
  // --- Category Nav Scroller ---
  function setupCategoryNavScroll() {
    const { categoryList, scrollLeftBtn, scrollRightBtn } = elements;
    if (!categoryList || !scrollLeftBtn || !scrollRightBtn) return;

    const SCROLL_AMOUNT = 300;

    function updateScrollButtons() {
        // A small buffer is added to account for sub-pixel rendering issues
        const buffer = 1;
        const { scrollLeft, scrollWidth, clientWidth } = categoryList;
        scrollLeftBtn.classList.toggle("visible", scrollLeft > buffer);
        scrollRightBtn.classList.toggle("visible", scrollLeft < scrollWidth - clientWidth - buffer);
    }
    
    scrollLeftBtn.addEventListener("click", () => {
        categoryList.scrollLeft -= SCROLL_AMOUNT;
    });

    scrollRightBtn.addEventListener("click", () => {
        categoryList.scrollLeft += SCROLL_AMOUNT;
    });

    categoryList.addEventListener("scroll", updateScrollButtons);
    
    // Check on load and resize
    window.addEventListener("resize", updateScrollButtons);
    // Use a small timeout to ensure layout is final before checking
    setTimeout(updateScrollButtons, 100);
  }

  // --- Core Functionality ---
  function toggleMobileMenu() {
    elements.navMenu.classList.toggle("active");
    const isExpanded = elements.navMenu.classList.contains("active");
    elements.menuToggle.setAttribute("aria-expanded", isExpanded);
    elements.menuToggle.innerHTML = isExpanded ? '<i class="fas fa-times"></i>' : '<i class="fas fa-bars"></i>';
  }

  function handleScroll() {
    elements.backToTopBtn.classList.toggle("visible", window.scrollY > 300);
  }

  function scrollToTop() {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function handleFilter(e) {
    const button = e.currentTarget;
    const filter = button.dataset.filter;
    const section = button.closest(".video-section");
    const videoCards = section.querySelectorAll(".video-card");

    // Update active button state
    section.querySelectorAll(".filter-controls .control-btn").forEach(btn => btn.classList.remove("active"));
    button.classList.add("active");

    // Show/hide videos
    videoCards.forEach((card) => {
      card.style.display = (filter === "all" || card.dataset.category === filter) ? "" : "none";
    });
  }

  function handleSaveVideo(e) {
    const button = e.currentTarget;
    const videoCard = button.closest(".video-card");
    const videoId = videoCard.dataset.videoId;
    const isSaved = button.classList.contains("saved");

    if (isSaved) {
      state.savedVideos = state.savedVideos.filter(id => id !== videoId);
      button.classList.remove("saved");
      button.querySelector("span").textContent = "Save";
      showToast("Removed from saved videos");
    } else {
      state.savedVideos.push(videoId);
      button.classList.add("saved");
      button.querySelector("span").textContent = "Saved";
      showToast("Saved for later");
    }

    localStorage.setItem("savedVideos", JSON.stringify(state.savedVideos));
  }

  // --- Thumbnail Error Handling ---
  function setupThumbnailErrorHandling() {
    document.querySelectorAll(".video-thumbnail img").forEach(img => {
      img.addEventListener('error', function() { handleThumbnailError(this); });
      if (img.naturalWidth === 0 && img.complete) { // Handle already broken images
          handleThumbnailError(img);
      }
    });
  }

  function handleThumbnailError(img) {
      const videoId = img.dataset.videoId;
      if (!videoId) return;

      const fallbackSizes = ["sddefault", "hqdefault", "mqdefault", "default"];
      const currentSrc = img.src;
      const currentSize = currentSrc.split('/').pop().replace('.jpg', '');
      const nextSizeIndex = fallbackSizes.indexOf(currentSize) + 1;

      if(nextSizeIndex < fallbackSizes.length) {
          img.src = `https://img.youtube.com/vi/${videoId}/${fallbackSizes[nextSizeIndex]}.jpg`;
      } else {
          // All fallbacks failed, use a placeholder
          img.src = `https://via.placeholder.com/320x180?text=${encodeURIComponent(img.alt)}`;
          img.onerror = null; // prevent infinite loops
      }
  }

  // --- Utility Functions ---
  function showToast(message) {
    elements.toast.textContent = message;
    elements.toast.classList.add("show");
    setTimeout(() => elements.toast.classList.remove("show"), 3000);
  }

  function formatDate(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays <= 1) return `1 day ago`;
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} week(s) ago`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} month(s) ago`;
    return `${Math.floor(diffDays / 365)} year(s) ago`;
  }

  // --- Start the application ---
  init();
});
