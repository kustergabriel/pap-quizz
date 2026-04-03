(function () {
  const icons = {
    user: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 21a8 8 0 0 0-16 0"></path><circle cx="12" cy="8" r="4.5"></circle></svg>',
    'user-round': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="8" r="4"></circle><path d="M5 20a7 7 0 0 1 14 0"></path></svg>',
    lock: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="4" y="11" width="16" height="10" rx="2.5"></rect><path d="M8 11V8a4 4 0 1 1 8 0v3"></path></svg>',
    eye: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M2.5 12s3.7-6.8 9.5-6.8S21.5 12 21.5 12s-3.7 6.8-9.5 6.8S2.5 12 2.5 12Z"></path><circle cx="12" cy="12" r="2.8"></circle></svg>',
    'eye-off': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 3l18 18"></path><path d="M10.6 10.6a2 2 0 0 0 2.8 2.8"></path><path d="M9.3 5.2A10.7 10.7 0 0 1 12 4.8c5.8 0 9.5 7.2 9.5 7.2a15.6 15.6 0 0 1-4 4.7"></path><path d="M6.2 6.2A15.8 15.8 0 0 0 2.5 12s3.7 6.8 9.5 6.8a10.8 10.8 0 0 0 4-.7"></path></svg>',
    badge: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3.5" y="5" width="17" height="14" rx="2.5"></rect><circle cx="8.5" cy="10" r="1.8"></circle><path d="M7 14.2a3 3 0 0 1 3-2.2"></path><path d="M13 9h4.5"></path><path d="M13 13h4.5"></path></svg>',
    mail: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="5.5" width="18" height="13" rx="2.5"></rect><path d="m4.5 7 7.5 5.5L19.5 7"></path></svg>',
    'at-sign': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="3.8"></circle><path d="M16 8.3v4.6a2 2 0 1 0 4 0V12A8 8 0 1 0 12 20"></path></svg>',
    'arrow-left': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m12 19-7-7 7-7"></path><path d="M19 12H5"></path></svg>',
    'gamepad-2': '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-gamepad2-icon lucide-gamepad-2"><line x1="6" x2="10" y1="11" y2="11"/><line x1="8" x2="8" y1="9" y2="13"/><line x1="15" x2="15.01" y1="12" y2="12"/><line x1="18" x2="18.01" y1="10" y2="10"/><path d="M17.32 5H6.68a4 4 0 0 0-3.978 3.59c-.006.052-.01.101-.017.152C2.604 9.416 2 14.456 2 16a3 3 0 0 0 3 3c1 0 1.5-.5 2-1l1.414-1.414A2 2 0 0 1 9.828 16h4.344a2 2 0 0 1 1.414.586L17 18c.5.5 1 1 2 1a3 3 0 0 0 3-3c0-1.545-.604-6.584-.685-7.258-.007-.05-.011-.1-.017-.151A4 4 0 0 0 17.32 5z"/></svg>',
    trophy: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-trophy-icon lucide-trophy"><path d="M10 14.66v1.626a2 2 0 0 1-.976 1.696A5 5 0 0 0 7 21.978"/><path d="M14 14.66v1.626a2 2 0 0 0 .976 1.696A5 5 0 0 1 17 21.978"/><path d="M18 9h1.5a1 1 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M6 9a6 6 0 0 0 12 0V3a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1z"/><path d="M6 9H4.5a1 1 0 0 1 0-5H6"/></svg>',
    'shopping-bag': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6.5 8V7a5.5 5.5 0 0 1 11 0v1"></path><path d="M4.5 8h15l-1.1 10.2A2 2 0 0 1 16.4 20H7.6a2 2 0 0 1-2-1.8L4.5 8Z"></path></svg>',
    'book-open-check': '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-book-marked-icon lucide-book-marked"><path d="M10 2v8l3-3 3 3V2"/><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H19a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H6.5a1 1 0 0 1 0-5H20"/></svg>',
    lightbulb: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 18h6"></path><path d="M10 22h4"></path><path d="M8.5 14.8A6 6 0 1 1 15.5 14.8c-.8.6-1.5 1.5-1.5 2.5v.7h-4v-.7c0-1-.7-1.9-1.5-2.5Z"></path></svg>',
    star: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polygon points="12 2.8 14.9 8.6 21.3 9.5 16.6 14.1 17.7 20.5 12 17.5 6.3 20.5 7.4 14.1 2.7 9.5 9.1 8.6 12 2.8"></polygon></svg>'
  };

  function replaceElement(element) {
    if (!element) return;
    const iconName = element.getAttribute('data-lucide');
    const svg = icons[iconName];
    if (!svg) return;
    element.classList.add('ui-icon');
    element.setAttribute('aria-hidden', 'true');
    element.innerHTML = svg;
  }

  window.lucide = {
    icons,
    createIcons() {
      document.querySelectorAll('[data-lucide]').forEach(replaceElement);
    },
    replaceElement
  };
})();
