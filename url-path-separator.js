// Define all URL categories
const urlCategories = [
  {
    id: "profile",
    label: "/profile/",
    buttonId: "profileButton",
  },
  {
    id: "forum",
    label: "/forum/",
    buttonId: "forumButton",
  },
  {
    id: "employer",
    label: "/employer/",
    buttonId: "employerButton",
  },
  {
    id: "readblog",
    label: "/read-blog/",
    buttonId: "readblogButton",
  },
  {
    id: "other",
    label: "/other/",
    buttonId: "otherButton",
  },
  {
    id: "question",
    label: "/question/",
    buttonId: "questionButton",
  },
  {
    id: "communityProfile",
    label: "/community/profile/",
    buttonId: "communityProfileButton",
  },
  {
    id: "user",
    label: "/user/",
    buttonId: "userButton",
  },
  {
    id: "discussions",
    label: "/discussions/",
    buttonId: "discussionsButton",
  },
  {
    id: "u",
    label: "/u/",
    buttonId: "uButton",
  },
  {
    id: "snippets",
    label: "/snippets/",
    buttonId: "snippetsButton",
  },
  {
    id: "issues",
    label: "/issues/",
    buttonId: "issuesButton",
  },
  {
    id: "projects",
    label: "-/projects",
    buttonId: "projectsButton",
  },
  {
    id: "tabFieldCorePfield",
    label: "?tab=field_core_pfield",
    buttonId: "tabFieldCorePfieldButton",
  },
  {
    id: "people",
    label: "/people/",
    buttonId: "peopleButton",
  },
  {
    id: "ideas",
    label: "/ideas/",
    buttonId: "ideasButton",
  },
  {
    id: "board",
    label: "/board/board_topic/",
    buttonId: "boardButton",
  },
  {
    id: "forumThread",
    label: "/forum/thread/",
    buttonId: "forumThreadButton",
  },
  {
    id: "blogs",
    label: "/blogs/",
    buttonId: "blogsButton",
  },
  {
    id: "listing",
    label: "/listing/",
    buttonId: "listingButton",
  },
  {
    id: "mysiteGroup",
    label: "mysite-200-group",
    buttonId: "mysiteGroupButton",
  },
  {
    id: "group",
    label: "/group/",
    buttonId: "groupButton",
  },
  {
    id: "forumsTopic",
    label: "/forums/topic/",
    buttonId: "forumsTopicButton",
  },
  {
    id: "mncoPosts",
    label: "mn.co/posts/",
    buttonId: "mncoPostsButton",
  },
  {
    id: "member",
    label: "/member/",
    buttonId: "memberButton",
  },
  {
    id: "candidate",
    label: "/candidate/",
    buttonId: "candidateButton",
  },
  {
    id: "author",
    label: "/author/",
    buttonId: "authorButton",
  },
  {
    id: "company",
    label: "/company/",
    buttonId: "companyButton",
  },
  {
    id: "companies",
    label: "/companies/",
    buttonId: "companiesButton",
  },
  {
    id: "forumsUsers",
    label: "/forums/users/",
    buttonId: "forumsUsersButton",
  },
  {
    id: "classifieds",
    label: "/classifieds/",
    buttonId: "classifiedsButton",
  },
  {
    id: "ads",
    label: "/ads/",
    buttonId: "adsButton",
  },
  {
    id: "users2",
    label: "/users/",
    buttonId: "users2Button",
  },
  {
    id: "member2",
    label: "/members/",
    buttonId: "member2Button",
  },
  {
    id: "topic",
    label: "/topic/",
    buttonId: "topicButton",
  },
  {
    id: "services",
    label: "/services/",
    buttonId: "servicesButton",
  },
  {
    id: "discuss",
    label: "/discuss/",
    buttonId: "discussButton",
  },
  {
    id: "profile2",
    label: "/profiles/",
    buttonId: "profile2Button",
  },
  {
    id: "employer2",
    label: "/employers/",
    buttonId: "employer2Button",
  },
  {
    id: "wiki",
    label: "/wiki/",
    buttonId: "wikiButton",
  },
  {
    id: "posts",
    label: "/posts/",
    buttonId: "postsButton",
  },
  {
    id: "p",
    label: "/p/",
    buttonId: "pButton",
  },
  {
    id: "page",
    label: "/page/",
    buttonId: "pageButton",
  },
  {
    id: "atSign",
    label: "/@",
    buttonId: "atSignButton",
  },
  {
    id: "media",
    label: "/media/",
    buttonId: "mediaButton",
  },
  {
    id: "webPage",
    label: "/webpage/",
    buttonId: "webPageButton",
  },
  {
    id: "blog",
    label: "/blog/",
    buttonId: "blogButton",
  },
  {
    id: "idea",
    label: "/idea/",
    buttonId: "ideaButton",
  },
  {
    id: "forums",
    label: "/forums/",
    buttonId: "forumsButton",
  },
  {
    id: "guestbook",
    label: "/guestbook.html",
    buttonId: "guestbookHtmlButton",
  },
  {
    id: "viewtopic",
    label: "/viewtopic.",
    buttonId: "viewtopicButton",
  },
];
// Initialize the page
document.addEventListener("DOMContentLoaded", function () {
  generateCategoryButtons();
  generateResultContainers();
  // Set up intro overlay timeout
  setTimeout(() => {
    document.getElementById("introOverlay").style.display = "none";
    document.getElementById("mainTool").style.display = "block";
  }, 1800); // Total animation time
});
// Generate category buttons
function generateCategoryButtons() {
  const container = document.getElementById("categoryButtons");
  urlCategories.forEach((category) => {
    const button = document.createElement("button");
    button.className = "category-button";
    button.id = category.buttonId;
    button.setAttribute("data-base-label", category.label);
    button.setAttribute("data-category-id", category.id);
    button.innerHTML = `
                    <span>${category.label}</span>
                    <span class="count">0</span>
                `;
    button.onclick = function () {
      scrollToSection(category.id + "Section");
      toggleSection(category.id + "Section");
    };
    container.appendChild(button);
  });
}
// Generate result containers
function generateResultContainers() {
  const container = document.getElementById("resultsContainer");
  urlCategories.forEach((category) => {
    const div = document.createElement("div");
    div.className = "container collapsed";
    div.id = category.id + "Section";
    div.innerHTML = `
                    <div class="container-header" onclick="toggleSection('${category.id}Section')">
                        <h3><span class="toggle-icon">▼</span> ${category.label}</h3>
                        <button class="copy-button" onclick="copyToClipboard('${category.id}Urls')">Copy URLs</button>
                    </div>
                    <div class="container-content" id="${category.id}Urls">No URLs</div>
                `;
    container.appendChild(div);
  });
}
// Toggle section visibility
function toggleSection(sectionId) {
  const section = document.getElementById(sectionId);
  section.classList.toggle("collapsed");
}
// Toggle all sections
function toggleAllCategories() {
  const sections = document.querySelectorAll(".container");
  const allCollapsed = Array.from(sections).every((section) =>
    section.classList.contains("collapsed")
  );
  sections.forEach((section) => {
    if (allCollapsed) {
      section.classList.remove("collapsed");
    } else {
      section.classList.add("collapsed");
    }
  });
  const toggleBtn = document.querySelector(".toggle-all-btn");
  toggleBtn.textContent = allCollapsed ? "Collapse All" : "Expand All";
}
// Toggle mobile menu
function toggleMobileMenu() {
  const menu = document.getElementById("categoryButtons");
  const toggleBtn = document.querySelector(".mobile-menu-toggle");
  menu.classList.toggle("show");
  toggleBtn.classList.toggle("active");
  toggleBtn.innerHTML = menu.classList.contains("show")
    ? "Hide Categories ▲"
    : "Show Categories ▼";
}
// Filter categories
function filterCategories() {
  const filterValue = document
    .getElementById("categoryFilter")
    .value.toLowerCase();
  const buttons = document.querySelectorAll(".category-button");
  buttons.forEach((button) => {
    const label = button.getAttribute("data-base-label").toLowerCase();
    if (label.includes(filterValue)) {
      button.style.display = "flex";
    } else {
      button.style.display = "none";
    }
  });
}
// Separate URLs into categories
function separateUrls() {
  let urls = document.getElementById("urlInput").value.trim().split(/\r?\n/);
  // Initialize arrays for all categories
  let categories = {};
  urlCategories.forEach((category) => {
    categories[category.id] = [];
  });
  // Loop through URLs and categorize
  urls.forEach((url) => {
    let lowerUrl = url.toLowerCase();
    let categorized = false;
    // Check each category in order
    for (const category of urlCategories) {
      if (lowerUrl.includes(category.label.toLowerCase())) {
        categories[category.id].push(url);
        categorized = true;
        break;
      }
    }
    // If not categorized, add to 'other'
    if (!categorized) {
      categories.other.push(url);
    }
  });
  // Update DOM for each category
  urlCategories.forEach((category) => {
    updateCategory(category.id, categories[category.id]);
    updateButtonCount(category.buttonId, category.id);
  });
  // Show success message
  showToast("URLs have been separated successfully!");
}
// Update category display
function updateCategory(categoryId, urls) {
  const element = document.getElementById(categoryId + "Urls");
  element.textContent = urls.length ? urls.join("\n") : "No URLs";
}
// Update button count
function updateButtonCount(buttonId, categoryId) {
  const button = document.getElementById(buttonId);
  const countContainer = document.getElementById(categoryId + "Urls");
  const text = countContainer.textContent.trim();
  const urlCount =
    text === "No URLs" || text === "" ? 0 : text.split("\n").length;
  const countElement = button.querySelector(".count");
  countElement.textContent = urlCount;
}
// Reset all fields
function resetFields() {
  // Clear the input textarea
  document.getElementById("urlInput").value = "";
  // Reset all URL display areas to "No URLs"
  urlCategories.forEach((category) => {
    document.getElementById(category.id + "Urls").textContent = "No URLs";
    updateButtonCount(category.buttonId, category.id);
  });
  // Show success message
  showToast("All fields have been reset!");
}
// Scroll to section
function scrollToSection(sectionId) {
  const section = document.getElementById(sectionId);
  if (section) {
    section.scrollIntoView({
      behavior: "smooth",
    });
  }
}
// Copy to clipboard
function copyToClipboard(elementId) {
  const contentElement = document.getElementById(elementId);
  const textToCopy = contentElement.textContent.trim();
  // Fallback or enhance for better copy
  // Create a temporary textarea
  const textarea = document.createElement("textarea");
  textarea.value = textToCopy;
  document.body.appendChild(textarea);
  textarea.select();
  try {
    document.execCommand("copy"); // Older method for compatibility
    showToast("Copied to clipboard!");
  } catch (err) {
    // Fallback to navigator.clipboard
    navigator.clipboard.writeText(textToCopy).then(
      () => {
        showToast("Copied to clipboard!");
      },
      () => {
        showToast("Failed to copy!");
      }
    );
  }
  document.body.removeChild(textarea);
}
// Download results
function downloadResult() {
  let content = "";
  // Loop through all categories and append data
  urlCategories.forEach((category) => {
    const data = document
      .getElementById(category.id + "Urls")
      .textContent.trim();
    content += `=== ${category.label} ===\n`;
    content += data + "\n\n";
  });
  // Create a blob of the data
  const blob = new Blob([content], {
    type: "text/plain",
  });
  const url = URL.createObjectURL(blob);
  // Create a temporary link to trigger download
  const a = document.createElement("a");
  a.href = url;
  a.download = "categorized_urls.txt";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  // Show success message
  showToast("Results downloaded successfully!");
}
// Show toast notification
function showToast(message) {
  const toast = document.getElementById("toast");
  toast.textContent = message;
  toast.classList.add("show");
  setTimeout(() => {
    toast.classList.remove("show");
  }, 3000);
}
