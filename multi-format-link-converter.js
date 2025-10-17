document.addEventListener('DOMContentLoaded', () => {

  // --- GLOBAL STATE & ELEMENTS ---
  let activeSectionId = 1;
  let lastSelection = { range: null, sectionId: null };
  let debounceTimer;
  const statusMessage = document.getElementById('statusMessage');

  // Global action buttons
  const btnMakeLink = document.getElementById('makeLinkBtn');
  const btnClear = document.getElementById('clearBtn');
  const btnPreview = document.getElementById('previewBtn');
  const btnDownload = document.getElementById('downloadBtn');

  // Preview Modal elements
  const previewModal = document.getElementById('preview-modal');
  const closePreview = document.getElementById('close-preview');
  const previewContentArea = document.getElementById('preview-content-area');

  // --- UTILITY FUNCTIONS ---
  const showStatus = (msg, type = 'success', duration = 3000) => {
    statusMessage.textContent = msg;
    statusMessage.className = `status-${type}`;
    setTimeout(() => {
        statusMessage.textContent = '';
        statusMessage.className = '';
    }, duration);
  };

  const decodeHTML = (str) => {
    const txt = document.createElement('textarea');
    txt.innerHTML = str;
    return txt.value;
  };

  const isValidURL = (string) => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  };
  
  // --- START OF COPY FIX ---
  const fallbackCopyTextToClipboard = (text) => {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.top = 0;
    textarea.style.left = 0;
    textarea.style.opacity = 0;
    document.body.appendChild(textarea);
    textarea.focus();
    textarea.select();
    try {
      document.execCommand('copy');
      showStatus('Copied to clipboard.');
    } catch (err) {
      showStatus('Copy failed.', 'error');
    }
    document.body.removeChild(textarea);
  };

  const copyCode = (element) => {
    const text = element.textContent.trim();
    if (text === 'Click to copy' || text === '') {
      showStatus('Nothing to copy yet.', 'info');
      return;
    }
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text).then(() => {
        showStatus('Copied to clipboard.');
      }).catch(err => {
        console.warn('Modern clipboard API failed, trying fallback:', err);
        fallbackCopyTextToClipboard(text);
      });
    } else {
      fallbackCopyTextToClipboard(text);
    }
  };
  // --- END OF COPY FIX ---


  // --- CORE CONVERTER LOGIC ---
  const convertContent = (sectionId) => {
    const editor = document.getElementById(`editor-${sectionId}`);
    const outputSection = document.getElementById(`output-section-${sectionId}`);
    
    if (!editor || !outputSection) return;

    const allPre = outputSection.querySelectorAll('pre');
    if (editor.innerText.trim() === '') {
        outputSection.classList.remove('visible');
        allPre.forEach(pre => pre.textContent = 'Click to copy');
        return;
    }
    
    let content = editor.innerHTML;

    content = content.replace(/<(div|p|br)[^>]*>/gi, '\n').replace(/<\/(div|p)>/gi, '\n\n');
    content = content.replace(/\s*target=["']?_blank["']?/gi, '');
    content = content.replace(/<(?!a\s|\/a)[^>]+>/gi, '');

    const anchorRegex = /<a\s+href=["']([^"']+)["'][^>]*>(.*?)<\/a>/gi;
    let refCounter = 1;
    let refList = '';
    const linksArray = [];

    let match;
    while ((match = anchorRegex.exec(content)) !== null) {
        linksArray.push({ url: decodeHTML(match[1]), text: decodeHTML(match[2].trim() || match[1]) });
    }
    anchorRegex.lastIndex = 0;

    const htmlVersion = decodeHTML(content);
    const markdownVersion = content.replace(anchorRegex, (_, href, text) => `[${decodeHTML(text.trim() || href)}](${decodeHTML(href)})`);
    const bbcodeVersion = content.replace(anchorRegex, (_, href, text) => `[url=${decodeHTML(href)}]${decodeHTML(text.trim() || href)}[/url]`);
    const rawVersion = decodeHTML(content.replace(anchorRegex, (_, href, text) => `${decodeHTML(text.trim() || href)} (${decodeHTML(href)})`)).replace(/<[^>]+>/gi, '');
    const slackVersion = content.replace(anchorRegex, (_, href, text) => `<${decodeHTML(href)}|${decodeHTML(text.trim() || href)}>`);
    const jsonVersion = JSON.stringify(linksArray, null, 2);
    
    const refMarkdownVersion = content.replace(anchorRegex, (_, href, text) => {
        const label = refCounter++;
        refList += `[${label}]: ${decodeHTML(href)}\n`;
        return `[${decodeHTML(text.trim() || href)}][${label}]`;
    });
    
    document.querySelector(`#html-panel-${sectionId} pre`).textContent = htmlVersion;
    document.querySelector(`#markdown-panel-${sectionId} pre`).textContent = decodeHTML(markdownVersion);
    document.querySelector(`#bbcode-panel-${sectionId} pre`).textContent = decodeHTML(bbcodeVersion);
    document.querySelector(`#raw-panel-${sectionId} pre`).textContent = rawVersion;
    document.querySelector(`#slack-panel-${sectionId} pre`).textContent = decodeHTML(slackVersion);
    document.querySelector(`#json-panel-${sectionId} pre`).textContent = jsonVersion;
    document.querySelector(`#refmd-panel-${sectionId} pre`).textContent = decodeHTML(refMarkdownVersion + "\n\n" + refList.trim());

    outputSection.classList.add('visible');
  };

  // --- INITIALIZATION FOR EACH SECTION ---
  const initializeConverterSection = (sectionId) => {
    const editor = document.getElementById(`editor-${sectionId}`);
    const charCounter = document.getElementById(`char-counter-${sectionId}`);
    const tabButtons = document.querySelectorAll(`#section-${sectionId} .tab-button`);
    const tabContents = document.querySelectorAll(`#section-${sectionId} .tab-content`);
    const outputPres = document.querySelectorAll(`#section-${sectionId} pre`);

    if (!editor) return;

    const saveSelection = () => {
        const selection = window.getSelection();
        if (selection.rangeCount > 0 && editor.contains(selection.anchorNode)) {
            lastSelection.range = selection.getRangeAt(0);
            lastSelection.sectionId = sectionId;
        }
    };
    editor.addEventListener('keyup', saveSelection);
    editor.addEventListener('mouseup', saveSelection);
    editor.addEventListener('focus', saveSelection);

    editor.addEventListener('focus', () => {
        document.querySelectorAll('.editor').forEach(ed => ed.classList.remove('active'));
        editor.classList.add('active');
        activeSectionId = sectionId;
    });

    editor.addEventListener('input', () => {
      charCounter.textContent = `${editor.innerText.length} characters`;
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => convertContent(sectionId), 300);
    });
    
    editor.addEventListener('paste', (e) => {
      e.preventDefault();
      const clipboardData = e.clipboardData || window.clipboardData;
      const pastedHTML = clipboardData.getData('text/html');
      const pastedText = clipboardData.getData('text/plain');
      if (pastedHTML) {
        document.execCommand('insertHTML', false, pastedHTML);
      } else if (pastedText) {
        const htmlWithLineBreaks = pastedText.replace(/\n/g, '<br>');
        document.execCommand('insertHTML', false, htmlWithLineBreaks);
      }
    });

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const tabId = button.getAttribute('data-tab');
            tabButtons.forEach(btn => {
              btn.classList.remove('active');
              btn.setAttribute('aria-selected', 'false');
            });
            button.classList.add('active');
            button.setAttribute('aria-selected', 'true');
            tabContents.forEach(content => content.classList.remove('active'));
            document.getElementById(`${tabId}-panel-${sectionId}`).classList.add('active');
        });
    });
    
    outputPres.forEach(pre => pre.addEventListener('click', () => copyCode(pre)));
  };

  // --- GLOBAL ACTION FUNCTIONS ---
  const makeLink = () => {
    if (!lastSelection.range || !lastSelection.sectionId) {
        showStatus('Please select text in an editor first.', 'error');
        return;
    }
    const url = prompt("Enter the URL for the hyperlink:");
    if (!url) return;
    if (!isValidURL(url)) {
        showStatus('Please enter a valid URL', 'error');
        return;
    }
    const selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(lastSelection.range);
    document.execCommand('createLink', false, url);
    convertContent(lastSelection.sectionId);
    showStatus('Hyperlink added.');
  };

  const clearEditor = () => {
    const editor = document.getElementById(`editor-${activeSectionId}`);
    const outputSection = document.getElementById(`output-section-${activeSectionId}`);
    const charCounter = document.getElementById(`char-counter-${activeSectionId}`);
    if (editor.innerText.trim() !== '' && !confirm(`Are you sure you want to clear editor ${activeSectionId}?`)) {
      return;
    }
    editor.innerHTML = '';
    outputSection.classList.remove('visible');
    charCounter.textContent = '0 characters';
    outputSection.querySelectorAll('pre').forEach(pre => pre.textContent = 'Click to copy');
    showStatus(`Editor ${activeSectionId} cleared.`);
  };

  const previewLinks = () => {
    const editor = document.getElementById(`editor-${activeSectionId}`);
    const content = editor.innerHTML;
    const anchorRegex = /<a\s+href=["']([^"']+)["'][^>]*>(.*?)<\/a>/gi;
    let previewHTML = '';
    let hasLinks = false;
    let match;
    while ((match = anchorRegex.exec(content)) !== null) {
      hasLinks = true;
      const url = decodeHTML(match[1]);
      const text = decodeHTML(match[2]);
      previewHTML += `<div style="margin-bottom: 1rem; padding: 1rem; border: 1px solid #ddd; border-radius: 4px;">
          <h4>${text || 'No Text'}</h4>
          <a href="${url}" target="_blank" rel="noopener noreferrer">${url}</a>
        </div>`;
    }
    previewContentArea.innerHTML = !hasLinks ? '<p>No links found in the active editor.</p>' : previewHTML;
    previewModal.style.display = 'flex';
  };
  
  const downloadOutput = () => {
      const section = document.getElementById(`section-${activeSectionId}`);
      const activeTab = section.querySelector('.tab-button.active');
      if(!activeTab){
          showStatus('Please generate some output first.', 'error');
          return;
      }
      const format = activeTab.dataset.tab;
      const content = section.querySelector(`#${format}-panel-${activeSectionId} pre`).textContent;
      
      if (content.trim() === 'Click to copy' || content.trim() === '') {
        showStatus('Nothing to download yet.', 'info');
        return;
      }

      const mimeTypes = { html: 'text/html', markdown: 'text/markdown', refmd: 'text/markdown', json: 'application/json' };
      const extensions = { markdown: 'md', refmd: 'md', bbcode: 'txt', raw: 'txt', slack: 'txt' };
      const filename = `links-${activeSectionId}.${extensions[format] || format}`;
      const mimeType = mimeTypes[format] || 'text/plain';
      
      const blob = new Blob([content], { type: mimeType });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      showStatus(`Downloaded ${filename}`);
  };

  // --- EVENT LISTENERS FOR GLOBAL ACTIONS ---
  btnMakeLink.addEventListener('click', makeLink);
  btnClear.addEventListener('click', clearEditor);
  btnPreview.addEventListener('click', previewLinks);
  btnDownload.addEventListener('click', downloadOutput);

  // Preview Modal Listeners
  closePreview.addEventListener('click', () => previewModal.style.display = 'none');
  previewModal.addEventListener('click', (e) => {
    if (e.target === previewModal) previewModal.style.display = 'none';
  });
  
  // Mobile Menu Toggle
  const menuToggle = document.getElementById('menuToggle');
  menuToggle.addEventListener('click', () => {
    const navMenu = document.getElementById('nav-menu');
    navMenu.classList.toggle('active');
    const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
    menuToggle.setAttribute('aria-expanded', !isExpanded);
  });
  
  // --- INITIALIZE EVERYTHING ---
  document.querySelectorAll('.converter-section').forEach(section => {
    const sectionId = parseInt(section.id.split('-')[1], 10);
    if (sectionId) {
      initializeConverterSection(sectionId);
    }
  });

  document.getElementById('editor-1').classList.add('active'); 

  // --- DARK MODE LOGIC (UPDATED) ---
  const darkModeToggle = document.getElementById('darkModeToggle');
  const themeIcon = darkModeToggle.querySelector('i');

  const applyTheme = (theme) => {
    if (theme === 'dark') {
      document.body.classList.add('dark-mode');
      themeIcon.classList.remove('fa-moon');
      themeIcon.classList.add('fa-sun');
    } else {
      document.body.classList.remove('dark-mode');
      themeIcon.classList.remove('fa-sun');
      themeIcon.classList.add('fa-moon');
    }
  };

  darkModeToggle.addEventListener('click', () => {
    const isDarkMode = document.body.classList.contains('dark-mode');
    const newTheme = isDarkMode ? 'light' : 'dark';
    try { // <-- ADDED
      localStorage.setItem('theme', newTheme);
    } catch (e) { // <-- ADDED
      console.warn('Could not save theme to localStorage due to browser restrictions.'); // <-- ADDED
    } // <-- ADDED
    applyTheme(newTheme);
  });
  
  // Apply saved theme on initial load
  let savedTheme = 'light'; // <-- MODIFIED
  try { // <-- ADDED
    savedTheme = localStorage.getItem('theme') || 'light';
  } catch (e) { // <-- ADDED
     console.warn('Could not read theme from localStorage due to browser restrictions.'); // <-- ADDED
  } // <-- ADDED
  applyTheme(savedTheme);
  
});
