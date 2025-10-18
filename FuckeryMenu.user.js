// ==UserScript==
// @name         FuckeryMenu
// @namespace    http://tampermonkey.net/
// @version      9.0.0-bugfix2
// @description  Injector modmenu
// @author       1st
// @match        *://*/*
// @grant        none
// @require      https://cdn.jsdelivr.net/npm/pako@2.1.0/dist/pako.min.js
// @downloadURL  3j53dm6mz8p0w3ixr_2h.c.websim.com/FuckeryMenu.user.js
// @updateURL    3j53dm6mz8p0w3ixr_2h.c.websim.com/FuckeryMenu.user.js
// ==/UserScript==

// FuckeryMenu - A chaotic web injector for creative website modification
// Copyright (C) 2025
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
// GNU General Public License for more details.
//
// ============================================================
// NO WARRANTY
// ============================================================
//
// THERE IS NO WARRANTY FOR THE PROGRAM, TO THE EXTENT PERMITTED BY
// APPLICABLE LAW. EXCEPT WHEN OTHERWISE STATED IN WRITING THE COPYRIGHT
// HOLDERS AND/OR OTHER PARTIES PROVIDE THE PROGRAM "AS IS" WITHOUT WARRANTY
// OF ANY KIND, EITHER EXPRESSED OR IMPLIED, INCLUDING, BUT NOT LIMITED TO,
// THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR
// PURPOSE. THE ENTIRE RISK AS TO THE QUALITY AND PERFORMANCE OF THE PROGRAM
// IS WITH YOU. SHOULD THE PROGRAM PROVE DEFECTIVE, YOU ASSUME THE COST OF
// ALL NECESSARY SERVICING, REPAIR OR CORRECTION.
//
// ============================================================
// GNU GENERAL PUBLIC LICENSE - VERSION 3
// ============================================================
//
// The GNU General Public License is a free, copyleft license for software
// and other kinds of works.
//
// The licenses for most software and other practical works are designed to
// take away your freedom to share and change the works. By contrast, the
// GNU General Public License is intended to guarantee your freedom to share
// and change all versions of a program--to make sure it remains free
// software for all its users. We, the Free Software Foundation, use the
// GNU General Public License for most of our software; it applies also to
// any other work released this way by its authors. You can apply it to
// your programs, too.
//
// When we speak of free software, we are referring to freedom, not price.
// Our General Public Licenses are designed to make sure that you have the
// freedom to distribute copies of free software (and charge for them if
// you wish), that you receive source code or can get it if you want it,
// that you can change the software or use pieces of it in new free programs,
// and that you know you can do these things.
//
// To protect your rights, we need to prevent others from denying you these
// rights or asking you to surrender the rights. Therefore, you have certain
// responsibilities if you distribute copies of the software, or if you
// modify it: responsibilities to respect the freedom of others.
//
// For example, if you distribute copies of such a program, whether gratis
// or for a fee, you must pass on to the recipients the same freedoms that
// you received. You must make sure that they, too, receive or can get the
// source code. And you must show them these terms so they know their rights.
//
// Developers that use the GNU GPL protect your rights with two steps:
// (1) assert copyright on the software, and (2) offer you this License
// giving you legal permission to copy, distribute and/or modify it.
//
// For the developers' and authors' protection, the GPL clearly explains
// that there is no warranty for this free software. For both users' and
// authors' sake, the GPL requires that modified versions be marked as
// changed, so that their problems will not be attributed erroneously to
// authors of previous versions.
//
// Some devices are designed to deny users access to install or run modified
// versions of the software inside them, although the manufacturer can do so.
// This is fundamentally incompatible with the aim of protecting users'
// freedom to change the software. The systematic pattern of such abuse
// occurs in the area of products for individuals to use, which is precisely
// where it is most unacceptable. Therefore, we have designed this version
// of the GPL to prohibit the practice for those products. If such problems
// arise substantially in other domains, we stand ready to extend this
// provision to those domains in future versions of the GPL, as needed to
// protect the freedom of users.
//
// Finally, every program is threatened constantly by software patents.
// States should not allow patents to restrict development and use of
// software on general-purpose computers, but in those that do, we wish to
// avoid the special danger that patents applied to a free program could
// make it effectively proprietary. To prevent this, the GPL assures that
// patents cannot be used to render the program non-free.
//
// (GNU Public License 3.0 shenanegains)
//
// You should have received a copy of the GNU General Public License
// along with this program. If not, see <https://www.gnu.org/licenses/>.

(() => {

  const CONFIG = {
    VER: '9.0.0-bugfix2',
    UPDATE_URL: 'https://3j53dm6mz8p0w3ixr_2h.c.websim.com/FuckeryMenu.user.js',
    COPYRIGHT_YEAR: '2025'
  };

  // Prevent multiple instances
  if (window.fuckeryLoaded) {
    if (window.__FuckeryMenu?.isOpen()) {
      window.__FuckeryMenu.toggle();
      return;
    }
  }

  const CURRENT_VERSION = CONFIG.VER;
  const UPDATE_URL = CONFIG.UPDATE_URL;

  // --- UPDATE CHECKER ---
  const UpdateChecker = {
    isVersionHigher: (newVersion, oldVersion) => {
      // Improved version comparison to handle suffixes like -bugfix1
      const parseVersion = (v) => {
        const parts = v.split('-');
        const main = parts[0].split('.').map(Number);
        const suffix = parts[1] || '';

        let bugfix = 0;
        if (suffix.startsWith('bugfix')) {
          bugfix = parseInt(suffix.replace('bugfix', ''), 10) || 0;
        }

        return { main, bugfix };
      };

      const newV = parseVersion(newVersion);
      const oldV = parseVersion(oldVersion);

      // Compare main version parts (e.g., 9.0.0)
      for (let i = 0; i < Math.max(newV.main.length, oldV.main.length); i++) {
        const newPart = newV.main[i] || 0;
        const oldPart = oldV.main[i] || 0;
        if (newPart > oldPart) return true;
        if (newPart < oldPart) return false;
      }

      // If main versions are the same, compare bugfix number
      if (newV.bugfix > oldV.bugfix) return true;
      if (newV.bugfix < oldV.bugfix) return false;

      return false; // Versions are equal or old is newer in some other way
    },

    showUpdateBanner: (newVersion) => {
      console.log(`FuckeryMenu: New version available: ${newVersion}`);

      const createBanner = () => {
        const fuckeryMenu = window.__FuckeryMenu;
        if (fuckeryMenu && fuckeryMenu.container && fuckeryMenu.header) {
          // Check if banner already exists
          if (fuckeryMenu.container.querySelector('.fuckery-update-banner')) {
            return;
          }

          const banner = document.createElement('div');
          banner.className = 'fuckery-element fuckery-update-banner';
          Object.assign(banner.style, {
            width: '100%',
            backgroundColor: '#1e4d32',
            color: '#e0e0e0',
            padding: '12px',
            textAlign: 'center',
            zIndex: '10',
            borderBottom: '1px solid #28a745',
            fontSize: '14px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '15px'
          });

          const text = document.createElement('span');
          text.innerHTML = `A new version of FuckeryMenu (<strong>${newVersion}</strong>) is out. <a href="${UPDATE_URL}" target="_blank" rel="noopener noreferrer" style="color: #4CAF50; font-weight: bold; text-decoration: underline;">Update Now</a>.`;

          const closeBtn = document.createElement('button');
          closeBtn.textContent = '✕';
          Object.assign(closeBtn.style, {
            background: 'transparent',
            border: '1px solid #28a745',
            color: '#e0e0e0',
            cursor: 'pointer',
            padding: '4px 8px',
            borderRadius: '4px'
          });
          closeBtn.onclick = () => banner.remove();

          banner.appendChild(text);
          banner.appendChild(closeBtn);

          // Insert banner after the header in the menu
          fuckeryMenu.container.insertBefore(banner, fuckeryMenu.header.nextSibling);
        } else {
          // If menu isn't ready, try again shortly.
          setTimeout(createBanner, 500);
        }
      };

      createBanner();
    },

    run: async () => {
      try {
        const response = await fetch(`${UPDATE_URL}?t=${Date.now()}`); // Cache bust
        if (!response.ok) {
          console.warn('FuckeryMenu: Update check failed, response not OK.');
          return;
        }
        const scriptText = await response.text();
        const versionMatch = scriptText.match(/@version\s+([^\s]+)/);

        if (versionMatch && versionMatch[1]) {
          const latestVersion = versionMatch[1];
          if (UpdateChecker.isVersionHigher(latestVersion, CURRENT_VERSION)) {
            UpdateChecker.showUpdateBanner(latestVersion);
          } else {
            console.log('FuckeryMenu: You are on the latest version.');
          }
        }
      } catch (e) {
        console.warn('FuckeryMenu: Update check failed.', e);
      }
    }
  };

  // Run update check
  UpdateChecker.run();

  console.log(`🔥 FuckeryMenu v${CONFIG.VER}: Initializing...`);
  window.fuckeryLoaded = true;

  // Core utilities
  const Utils = {
    $: (s, root = document) => root.querySelector(s),
 $$: (s, root = document) => Array.from(root.querySelectorAll(s)),

 createElement: (tag, options = {}) => {
   const el = document.createElement(tag);
   if (options.className) el.className = options.className;
   if (options.textContent) el.textContent = options.textContent;
   if (options.innerHTML) {
     // Use textContent for simple text, DOM methods for HTML
     if (options.innerHTML.indexOf('<') === -1) {
       el.textContent = options.innerHTML;
     } else {
       // Use DOM parser to avoid TrustedHTML issues
       const template = document.createElement('template');
       template.innerHTML = options.innerHTML;
       el.appendChild(template.content.cloneNode(true));
     }
   }
   if (options.style) Object.assign(el.style, options.style);
   if (options.attributes) {
     Object.entries(options.attributes).forEach(([k, v]) => el.setAttribute(k, v));
   }
   if (options.events) {
     Object.entries(options.events).forEach(([event, handler]) => {
       el.addEventListener(event, handler);
     });
   }
   return el;
 },

 isFuckeryElement: (element) => {
   if (!element || !element.nodeType) return false;

   // Check if element is the fuckery container or any descendant
   if (element.id === '__FuckeryMenuContainer' || element.id === '__FuckeryMenuPanel') return true;
   if (element.closest && element.closest('#__FuckeryMenuContainer')) return true;
   if (element.className && typeof element.className === 'string' && element.className.includes('fuckery-element')) return true;

   // Check all ancestors for fuckery markers
   let current = element;
   while (current && current !== document && current !== document.documentElement) {
     if (current.id === '__FuckeryMenuContainer' || current.id === '__FuckeryMenuPanel') return true;
     if (current.className && typeof current.className === 'string' && current.className.includes('fuckery-element')) return true;
     current = current.parentNode;
   }

   return false;
 },

 getNonFuckeryElements: (selector = '*') => {
   try {
     const searchRoot = document.body || document.documentElement || document;
     const elements = Array.from(searchRoot.querySelectorAll(selector));

     const filtered = elements.filter(el => {
       if (!(el instanceof Element)) return false;
       if (Utils.isFuckeryElement(el)) return false;
       if (['SCRIPT', 'STYLE', 'META', 'LINK', 'TITLE', 'HEAD'].includes(el.tagName)) return false;
       if (el.offsetWidth === 0 && el.offsetHeight === 0 && !el.textContent?.trim()) return false;

       return true;
     });
     return filtered;
   } catch (e) {
     Logger.error('UTILS', 'Failed to get elements', { error: e.message });
     return [];
   }
 },

 random: {
   int: (min, max) => Math.floor(Math.random() * (max - min + 1)) + min,
 color: () => `rgb(${Utils.random.int(0, 255)}, ${Utils.random.int(0, 255)}, ${Utils.random.int(0, 255)})`,
 text: (length = 8) => Array.from({length}, () => String.fromCharCode(Utils.random.int(97, 122))).join(''),
 choice: (array) => array[Utils.random.int(0, array.length - 1)]
 },

 debounce: (func, wait) => {
   let timeout;
   return function executedFunction(...args) {
     const later = () => {
       clearTimeout(timeout);
       func(...args);
     };
     clearTimeout(timeout);
     timeout = setTimeout(later, wait);
   };
 },

 clamp: (value, min, max) => Math.min(max, Math.max(min, value))
  };

  // Logger class for verbose output
  const Logger = {
    logs: [],
    maxLogs: 100,
    widget: null,
    isVerbose: true,

    log: (level, category, message, data = null) => {
      const timestamp = new Date().toLocaleTimeString();
      const logEntry = {
        timestamp,
        level,
        category,
        message,
        data,
        id: Date.now() + Math.random()
      };

      Logger.logs.push(logEntry);
      if (Logger.logs.length > Logger.maxLogs) {
        Logger.logs.shift();
      }

      const styles = {
        INFO: 'color: #28a745; font-weight: bold',
        WARN: 'color: #ffc107; font-weight: bold',
        ERROR: 'color: #dc3545; font-weight: bold',
        DEBUG: 'color: #007bff; font-weight: bold',
        INJECT: 'color: #fd7e14; font-weight: bold',
        UI: 'color: #6f42c1; font-weight: bold'
      };

      console.log(
        `%c[FuckeryMenu ${level}]%c [${category}] %c${timestamp}%c ${message}`,
        styles[level] || 'color: #888',
        'color: #666',
        'color: #999; font-style: italic',
        'color: inherit',
        data ? data : ''
      );

      if (data) {
        console.log('📊 Additional data:', data);
      }

      if (window.__FuckeryMenu?.updateIntegratedLogs) {
        window.__FuckeryMenu.updateIntegratedLogs();
      }
    },

    info: (category, message, data) => Logger.log('INFO', category, message, data),
 warn: (category, message, data) => Logger.log('WARN', category, message, data),
 error: (category, message, data) => Logger.log('ERROR', category, message, data),
 debug: (category, message, data) => Logger.log('DEBUG', category, message, data),
 inject: (category, message, data) => Logger.log('INJECT', category, message, data),
 ui: (category, message, data) => Logger.log('UI', category, message, data),

 clear: () => {
   Logger.logs = [];
   if (window.__FuckeryMenu?.updateIntegratedLogs) {
     window.__FuckeryMenu.updateIntegratedLogs();
   }
   console.clear();
   Logger.info('LOGGER', 'Logs cleared');
 },

 updateWidget: () => {
   // Legacy method - now handled by integrated log display
   if (window.__FuckeryMenu?.updateIntegratedLogs) {
     window.__FuckeryMenu.updateIntegratedLogs();
   }
 },

 getLogColor: (level) => {
   const colors = {
     INFO: '#1e4d32',
     WARN: '#4d3d1e',
     ERROR: '#4d1e1e',
     DEBUG: '#1e3a4d',
     INJECT: '#4d2e1e',
     UI: '#3e1e4d'
   };
   return colors[level] || '#333';
 },

 getLogBorderColor: (level) => {
   const colors = {
     INFO: '#28a745',
     WARN: '#ffc107',
     ERROR: '#dc3545',
     DEBUG: '#007bff',
     INJECT: '#fd7e14',
     UI: '#6f42c1'
   };
   return colors[level] || '#666';
 },

 // Remove old widget methods since logs are now integrated
 createWidget: () => {
   Logger.info('LOGGER', 'Log widget is now integrated into main menu');
   return null;
 },

 showWidget: () => {
   Logger.info('LOGGER', 'Logs are now integrated into main menu');
   if (window.__FuckeryMenu && !window.__FuckeryMenu.isVisible) {
     window.__FuckeryMenu.show();
   }
 },

 hideWidget: () => {
   Logger.info('LOGGER', 'Logs are integrated - use main menu to hide');
 },

 toggleWidget: () => {
   Logger.info('LOGGER', 'Logs are integrated - use main menu toggle');
   if (window.__FuckeryMenu) {
     window.__FuckeryMenu.toggle();
   }
 }
  };

  // Settings manager
  const Settings = {
    key: 'fuckeryMenuSettings',
    defaults: {
      autoOpen: false,
      hotkey: 'F8',
      theme: 'dark',
      enableAnimations: true,
      debugMode: false
    },

    get: (key) => {
      try {
        const settings = JSON.parse(localStorage.getItem(Settings.key) || '{}');
        return settings[key] ?? Settings.defaults[key];
      } catch {
        return Settings.defaults[key];
      }
    },

    set: (key, value) => {
      try {
        const settings = JSON.parse(localStorage.getItem(Settings.key) || '{}');
        settings[key] = value;
        localStorage.setItem(Settings.key, JSON.stringify(settings));
      } catch (e) {
        console.warn('Failed to save setting:', e);
      }
    },

    getAll: () => {
      try {
        return { ...Settings.defaults, ...JSON.parse(localStorage.getItem(Settings.key) || '{}') };
      } catch {
        return Settings.defaults;
      }
    },

    clear: () => {
      localStorage.removeItem(Settings.key);
      localStorage.removeItem('fuckeryCustomActions');
    }
  };

  // Inject manager for tracking running effects
  const InjectManager = {
    running: new Map(),

 add: (name, stopFunction, options = {}) => {
   InjectManager.running.set(name, {
     stop: stopFunction,
     startTime: Date.now(),
                             ...options
   });
   Logger.inject('INJECT', `Started inject: ${name}`, {
     totalRunning: InjectManager.running.size,
     options
   });
   EventBus.emit('inject:started', { name });
 },

 remove: (name) => {
   const inject = InjectManager.running.get(name);
   if (inject) {
     try {
       inject.stop();
       const duration = Date.now() - inject.startTime;
       Logger.inject('INJECT', `Stopped inject: ${name}`, {
         duration: `${duration}ms`,
         totalRunning: InjectManager.running.size - 1
       });
     } catch (e) {
       Logger.error('INJECT', `Error stopping inject ${name}`, { error: e.message });
     }
     InjectManager.running.delete(name);
     EventBus.emit('inject:stopped', { name });
   }
 },

 removeAll: () => {
   const count = InjectManager.running.size;
   Logger.info('INJECT', `Stopping all ${count} running injects`);
   InjectManager.running.forEach((inject, name) => {
     InjectManager.remove(name);
   });
   Logger.info('INJECT', 'All injects stopped');
 },

 list: () => Array.from(InjectManager.running.keys()),

 get: (name) => InjectManager.running.get(name),

 isRunning: (name) => InjectManager.running.has(name)
  };

  // Event bus for component communication
  const EventBus = {
    events: new Map(),

 on: (event, callback) => {
   if (!EventBus.events.has(event)) {
     EventBus.events.set(event, new Set());
   }
   EventBus.events.get(event).add(callback);
 },

 off: (event, callback) => {
   EventBus.events.get(event)?.delete(callback);
 },

 emit: (event, data = {}) => {
   EventBus.events.get(event)?.forEach(callback => {
     try {
       callback(data);
     } catch (e) {
       console.warn('EventBus callback error:', e);
     }
   });
 }
  };

  // Modal system
  const Modal = {
    zIndex: 2147483647,

    create: (title, content, options = {}) => {
      Logger.ui('MODAL', `Creating modal: ${title}`, options);
      return new Promise((resolve) => {
        const {
          buttons = [{ text: 'OK', value: true }],
          width = '400px',
          height = 'auto',
          draggable = true
        } = options;

        const overlay = Utils.createElement('div', {
          className: 'fuckery-element',
          style: {
            position: 'fixed',
            top: '0',
            left: '0',
            width: '100vw',
            height: '100vh',
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
                                            display: 'flex',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            zIndex: Modal.zIndex++,
                                            fontFamily: 'system-ui, -apple-system, sans-serif'
          }
        });

        const modal = Utils.createElement('div', {
          style: {
            width,
            height,
            backgroundColor: '#1e1e1e',
            border: '1px solid #444',
            borderRadius: '8px',
            boxShadow: '0 16px 48px rgba(0, 0, 0, 0.8)',
                                          display: 'flex',
                                          flexDirection: 'column',
                                          overflow: 'hidden',
                                          color: '#fff'
          }
        });

        const header = Utils.createElement('div', {
          textContent: title,
          style: {
            padding: '16px',
            backgroundColor: '#2d2d2d',
            borderBottom: '1px solid #444',
            fontWeight: '600',
            cursor: draggable ? 'move' : 'default'
          }
        });

        const body = Utils.createElement('div', {
          style: {
            padding: '20px',
            flex: '1',
            overflow: 'auto'
          }
        });

        if (typeof content === 'string') {
          body.innerHTML = content;
        } else {
          body.appendChild(content);
        }

        const footer = Utils.createElement('div', {
          style: {
            padding: '16px',
            borderTop: '1px solid #444',
            display: 'flex',
            gap: '8px',
            justifyContent: 'flex-end'
          }
        });

        buttons.forEach(button => {
          const btn = Utils.createElement('button', {
            textContent: button.text,
            style: {
              padding: '8px 16px',
              border: '1px solid #555',
              borderRadius: '4px',
              backgroundColor: button.primary ? '#007bff' : '#6c757d',
              color: '#fff',
              cursor: 'pointer',
              fontSize: '14px'
            },
            events: {
              click: () => {
                overlay.remove();
                resolve(button.value);
              }
            }
          });
          footer.appendChild(btn);
        });

        // Drag functionality
        if (draggable) {
          let isDragging = false;
          let startX, startY, startLeft, startTop;

          header.addEventListener('mousedown', (e) => {
            isDragging = true;
            startX = e.clientX;
            startY = e.clientY;
            const rect = modal.getBoundingClientRect();
            startLeft = rect.left;
            startTop = rect.top;
            modal.style.position = 'fixed';
            modal.style.left = startLeft + 'px';
            modal.style.top = startTop + 'px';
            modal.style.margin = '0';
          });

          document.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            const newLeft = startLeft + (e.clientX - startX);
            const newTop = startTop + (e.clientY - startY);
            modal.style.left = Utils.clamp(newLeft, 0, window.innerWidth - modal.offsetWidth) + 'px';
            modal.style.top = Utils.clamp(newTop, 0, window.innerHeight - modal.offsetHeight) + 'px';
          });

          document.addEventListener('mouseup', (e) => {
            if (isDragging) {
              e.stopPropagation();
              isDragging = false;
              document.body.style.userSelect = '';
            }
          });
        }

        modal.appendChild(header);
        modal.appendChild(body);
        if (buttons.length > 0) modal.appendChild(footer);
        overlay.appendChild(modal);
        document.body.appendChild(overlay);

        // Focus management
        overlay.addEventListener('click', (e) => {
          if (e.target === overlay) {
            overlay.remove();
            Logger.ui('MODAL', `Modal dismissed: ${title}`);
            resolve(false);
          }
        });
      });
    },

    alert: (message, title = 'FuckeryMenu') => {
      Logger.ui('MODAL', `Showing alert: ${title}`, { message });
      return Modal.create(title, message, {
        buttons: [{ text: 'OK', value: true, primary: true }]
      });
    },

    confirm: (message, title = 'Confirm') => {
      Logger.ui('MODAL', `Showing confirm: ${title}`, { message });
      return Modal.create(title, message, {
        buttons: [
          { text: 'Cancel', value: false },
          { text: 'Confirm', value: true, primary: true }
        ]
      });
    }
  };

  // Injects library
  const Injects = {
    // Text injects
    allCaps: () => {
      Logger.inject('INJECTS', 'Executing inject: allCaps');
      const originalTexts = new Map();

      const processTextNodes = () => {
        try {
          const searchRoot = document.body || document.documentElement || document;
          const walker = document.createTreeWalker(
            searchRoot,
            NodeFilter.SHOW_TEXT,
            {
              acceptNode: (node) => {
                try {
                  return Utils.isFuckeryElement(node.parentElement) ?
                  NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT;
                } catch (e) {
                  return NodeFilter.FILTER_REJECT;
                }
              }
            }
          );

          const textNodes = [];
          let node;
          while (node = walker.nextNode()) {
            if (node.textContent && node.textContent.trim()) {
              textNodes.push(node);
            }
          }

          textNodes.forEach(textNode => {
            try {
              if (!originalTexts.has(textNode)) {
                originalTexts.set(textNode, textNode.textContent);
              }
              textNode.textContent = originalTexts.get(textNode).toUpperCase();
            } catch (e) {
              // Skip problematic nodes
            }
          });
        } catch (e) {
          Logger.error('INJECTS', 'Error in allCaps processTextNodes', { error: e.message });
        }
      };

      processTextNodes();
      const interval = setInterval(processTextNodes, 500);
      InjectManager.add('ALL CAPS INJECT', () => {
        clearInterval(interval);
        originalTexts.forEach((originalText, node) => {
          try {
            if (node.parentNode) {
              node.textContent = originalText;
            }
          } catch (e) {
            // Skip restoration if node is no longer valid
          }
        });
      });
    },

    lowercase: () => {
      Logger.inject('INJECTS', 'Executing inject: lowercase');
      const originalTexts = new Map();

      const walker = document.createTreeWalker(
        document.body, // Only walk through document.body
        NodeFilter.SHOW_TEXT,
        {
          acceptNode: (node) => {
            return Utils.isFuckeryElement(node.parentElement) ?
            NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT;
          }
        }
      );

      let node;
      while (node = walker.nextNode()) {
        if (node.textContent.trim()) {
          originalTexts.set(node, node.textContent);
          node.textContent = node.textContent.toLowerCase();
        }
      }

      InjectManager.add('Lowercase Inject', () => {
        originalTexts.forEach((originalText, node) => {
          if (node.parentNode) {
            node.textContent = originalText;
          }
        });
      });
    },

    gibberish: () => {
      Logger.inject('INJECTS', 'Executing inject: gibberish');
      const originalTexts = new Map();

      const walker = document.createTreeWalker(
        document.body, // Only walk through document.body
        NodeFilter.SHOW_TEXT,
        {
          acceptNode: (node) => {
            return Utils.isFuckeryElement(node.parentElement) ?
            NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT;
          }
        }
      );

      let node;
      while (node = walker.nextNode()) {
        if (node.textContent.trim()) {
          originalTexts.set(node, node.textContent);
          node.textContent = Utils.random.text(node.textContent.length);
        }
      }

      InjectManager.add('Gibberish Inject', () => {
        originalTexts.forEach((originalText, node) => {
          if (node.parentNode) {
            node.textContent = originalText;
          }
        });
      });
    },

    randomText: () => {
      Logger.inject('INJECTS', 'Executing inject: randomText');
      const processTextNodes = () => {
        const walker = document.createTreeWalker(
          document.body, // Only walk through document.body
          NodeFilter.SHOW_TEXT,
          {
            acceptNode: (node) => {
              return Utils.isFuckeryElement(node.parentElement) ?
              NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT;
            }
          }
        );

        let node;
        while (node = walker.nextNode()) {
          if (node.textContent.trim() && Math.random() > 0.95) {
            node.textContent = Utils.random.text(node.textContent.length);
          }
        }
      };

      const interval = setInterval(processTextNodes, 200);
      InjectManager.add('Random Text Inject', () => {
        clearInterval(interval);
        originalTexts.forEach((originalText, node) => {
          if (node.parentNode) {
            node.textContent = originalText;
          }
        });
      });
    },

    invertText: () => {
      Logger.inject('INJECTS', 'Executing inject: invertText');
      const originalTexts = new Map();

      const walker = document.createTreeWalker(
        document.body, // Only walk through document.body
        NodeFilter.SHOW_TEXT,
        {
          acceptNode: (node) => {
            return Utils.isFuckeryElement(node.parentElement) ?
            NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT;
          }
        }
      );

      let node;
      while (node = walker.nextNode()) {
        if (node.textContent.trim()) {
          originalTexts.set(node, node.textContent);
          node.textContent = node.textContent.split('').reverse().join('');
        }
      }

      InjectManager.add('Invert Text Inject', () => {
        originalTexts.forEach((originalText, node) => {
          if (node.parentNode) {
            node.textContent = originalText;
          }
        });
      });
    },

    rainbowText: () => {
      Logger.inject('INJECTS', 'Executing inject: rainbowText');
      const interval = setInterval(() => {
        Utils.getNonFuckeryElements().forEach(el => {
          if (el instanceof HTMLElement && Math.random() > 0.8) {
            el.style.color = Utils.random.color();
          }
        });
      }, 100);
      InjectManager.add('Rainbow Text Inject', () => {
        clearInterval(interval);
        originalStyles.forEach((style, el) => {
          if (el && el.style) {
            el.style.color = style.color;
          }
        });
      });
    },

    michaelCheese: () => {
      Logger.inject('INJECTS', 'Executing inject: michaelCheese');
      const cheeseTexts = [
        "MICHAEL CHEESE!",
        "🧀 CHEESE TIME 🧀",
        "MICHAEL'S CHEESE FACTORY",
        "CHEESE OVERLOAD",
        "THE CHEESE IS REAL",
        "MICHAEL DEMANDS CHEESE",
        "CHEESE OR DIE",
        "🧀🧀🧀 CHEESE 🧀🧀🧀",
        "MICHAEL CHEESE SUPREME",
        "CHEESE INVASION",
        "ALL HAIL MICHAEL CHEESE"
      ];

      const processCheeseification = () => {
        const walker = document.createTreeWalker(
          document.body, // Only walk through document.body
          NodeFilter.SHOW_TEXT,
          {
            acceptNode: (node) => {
              return Utils.isFuckeryElement(node.parentElement) ?
              NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT;
            }
          }
        );

        let node;
        while (node = walker.nextNode()) {
          if (node.textContent.trim() && Math.random() > 0.85) {
            node.textContent = Utils.random.choice(cheeseTexts);
          }
        }

        // Change page title randomly
        if (Math.random() > 0.9) {
          document.title = Utils.random.choice(cheeseTexts);
        }

        // Random cheese background - only apply to body
        if (Math.random() > 0.95) {
          document.body.style.background = 'linear-gradient(45deg, #FFD700, #FFA500, #FF8C00, #FFFF00)';
          document.body.style.backgroundSize = '400% 400%';
          document.body.style.animation = 'cheeseGradient 3s ease infinite';
        }

        // Add cheese particles - append to body, not fuckery container
        if (Math.random() > 0.98) {
          const cheese = Utils.createElement('div', {
            textContent: '🧀',
            className: 'fuckery-element',
            style: {
              position: 'fixed',
              top: '-50px',
              left: Math.random() * window.innerWidth + 'px',
                                             fontSize: '30px',
                                             zIndex: '999999',
                                             pointerEvents: 'none',
                                             animation: 'cheeseFall 3s linear forwards'
            }
          });
          document.body.appendChild(cheese);
          setTimeout(() => cheese.remove(), 3000);
        }
      };

      // Add cheese animations
      Styles.addGlobal('michaelcheese', `
      @keyframes cheeseGradient {
        0% { background-position: 0% 50%; }
        50% { background-position: 100% 50%; }
        100% { background-position: 0% 50%; }
      }
      @keyframes cheeseFall {
        to {
          top: 100vh;
          transform: rotate(360deg);
        }
      }
      `);

      const interval = setInterval(processCheeseification, 150);

      InjectManager.add('MICHAEL CHEESE INJECT', () => {
        clearInterval(interval);
        document.title = 'Page Restored from Cheese Madness';
        document.body.style.background = '';
        document.body.style.backgroundSize = '';
        document.body.style.animation = '';
        Utils.$$('.fuckery-element').forEach(el => {
          if (el.textContent === '🧀') el.remove();
        });
          Styles.removeGlobal('michaelcheese');
      });
    },

    comicSans: () => {
      Logger.inject('INJECTS', 'Executing inject: comicSans');
      const processComicSans = () => {
        Utils.getNonFuckeryElements().forEach(el => {
          if (el instanceof HTMLElement) {
            el.style.fontFamily = 'Comic Sans MS, cursive, sans-serif';
          }
        });
      };

      processComicSans();
      const interval = setInterval(processComicSans, 100);
      InjectManager.add('Comic Sans Inject', () => {
        clearInterval(interval);
        Utils.getNonFuckeryElements().forEach(el => {
          if (el instanceof HTMLElement) {
            el.style.fontFamily = '';
          }
        });
      });
    },

    textToEmoji: () => {
      Logger.inject('INJECTS', 'Executing inject: textToEmoji');
      const emojiMap = {
        'love': '❤️', 'happy': '😄', 'sad': '😢', 'cool': '😎', 'money': '💰', 'fire': '🔥',
        'cat': '🐱', 'dog': '🐶', 'food': '🍕', 'world': '🌍', 'time': '⏰', 'star': '⭐',
        'lol': '😂', 'omg': '😱', 'win': '🏆', 'ok': '👌', 'yes': '✅', 'no': '❌', 'idea': '💡'
      };
      const originalTexts = new Map();

      const processNodes = () => {
        const walker = document.createTreeWalker(
          document.body,
          NodeFilter.SHOW_TEXT,
          {
            acceptNode: (node) => {
              return Utils.isFuckeryElement(node.parentElement) ?
              NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT;
            }
          }
        );

        let node;
        while (node = walker.nextNode()) {
          if (node.textContent.trim()) {
            if (!originalTexts.has(node)) {
              originalTexts.set(node, node.textContent);
            }
            let newText = originalTexts.get(node);
            Object.entries(emojiMap).forEach(([word, emoji]) => {
              const regex = new RegExp(`\\b${word}\\b`, 'gi');
              newText = newText.replace(regex, emoji);
            });
            node.textContent = newText;
          }
        }
      };

      processNodes();
      const interval = setInterval(processNodes, 1000);

      InjectManager.add('Text to Emoji Inject', () => {
        clearInterval(interval);
        originalTexts.forEach((originalText, node) => {
          if (node.parentNode) {
            node.textContent = originalText;
          }
        });
      });
    },

    asciiArt: () => {
      Logger.inject('INJECTS', 'Executing inject: asciiArt');
      const asciiChars = ['@', '#', '$', '%', '&', '*', '+', '=', '-', '~'];
      const originalTexts = new Map();

      const walker = document.createTreeWalker(
        document.body,
        NodeFilter.SHOW_TEXT,
        {
          acceptNode: (node) => {
            return Utils.isFuckeryElement(node.parentElement) ?
            NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT;
          }
        }
      );

      let node;
      while (node = walker.nextNode()) {
        if (node.textContent.trim()) {
          originalTexts.set(node, node.textContent);
          node.textContent = node.textContent.split('').map(() =>
          Utils.random.choice(asciiChars)
          ).join('');
        }
      }

      InjectManager.add('ASCII Art Inject', () => {
        originalTexts.forEach((originalText, node) => {
          if (node.parentNode) {
            node.textContent = originalText;
          }
        });
      });
    },

    shuffleElements: () => {
      Logger.inject('INJECTS', 'Executing inject: shuffleElements');
      const elements = Utils.getNonFuckeryElements();
      const parents = new Map();

      elements.forEach(el => {
        if (el.parentNode && el !== document.body && el !== document.documentElement) {
          parents.set(el, {
            parent: el.parentNode,
            nextSibling: el.nextSibling
          });
        }
      });

      const shuffled = [...elements].sort(() => Math.random() - 0.5);

      shuffled.forEach(el => {
        const info = parents.get(el);
        if (info && info.parent) {
          const randomParent = Utils.random.choice([...parents.values()]).parent;
          if (randomParent && randomParent.appendChild) {
            try {
              randomParent.appendChild(el);
            } catch (e) {
              // Skip if can't append
            }
          }
        }
      });

      InjectManager.add('Shuffle Elements Inject', () => {
        parents.forEach((info, el) => {
          if (el && info.parent) {
            try {
              if (info.nextSibling) {
                info.parent.insertBefore(el, info.nextSibling);
              } else {
                info.parent.appendChild(el);
              }
            } catch (e) {
              // Skip restoration if fails
            }
          }
        });
      });
    },

    invertColorsCycle: () => {
      Logger.inject('INJECTS', 'Executing inject: invertColorsCycle');
      const body = document.body || document.documentElement;
      const originalFilter = body.style.filter;
      let hue = 0;

      const cycle = () => {
        hue = (hue + 5) % 360;
        body.style.filter = `invert(1) hue-rotate(${hue}deg)`;
      };

      const interval = setInterval(cycle, 50);

      InjectManager.add('Invert Colors Cycle Inject', () => {
        clearInterval(interval);
        body.style.filter = originalFilter;
      });
    },

    zoomChaos: () => {
      Logger.inject('INJECTS', 'Executing inject: zoomChaos');
      const originalZooms = new Map();

      const applyZoom = () => {
        Utils.getNonFuckeryElements().forEach(el => {
          if (el instanceof HTMLElement) {
            if (!originalZooms.has(el)) {
              originalZooms.set(el, el.style.zoom || '1');
            }
            el.style.zoom = (0.5 + Math.random() * 1.5).toFixed(2);
          }
        });
      };

      applyZoom();
      const interval = setInterval(applyZoom, 500);

      InjectManager.add('Zoom Chaos Inject', () => {
        clearInterval(interval);
        originalZooms.forEach((zoom, el) => {
          if (el && el.style) {
            el.style.zoom = zoom;
          }
        });
      });
    },

    flashbang: () => {
      Logger.inject('INJECTS', 'Executing inject: flashbang');
      let isWhite = true;

      const flash = () => {
        document.body.style.backgroundColor = isWhite ? '#ffffff' : '#000000';
        document.body.style.color = isWhite ? '#000000' : '#ffffff';
        isWhite = !isWhite;
      };

      const interval = setInterval(flash, 100);

      InjectManager.add('Flashbang Inject', () => {
        clearInterval(interval);
        document.body.style.backgroundColor = '';
        document.body.style.color = '';
      });
    },

    elementRain: () => {
      Logger.inject('INJECTS', 'Executing inject: elementRain');
      const elements = Utils.getNonFuckeryElements();
      const originalPositions = new Map();

      elements.forEach(el => {
        if (el instanceof HTMLElement && el !== document.body && el !== document.documentElement) {
          originalPositions.set(el, {
            position: el.style.position,
            top: el.style.top,
            left: el.style.left,
            transform: el.style.transform
          });

          el.style.position = 'fixed';
          el.style.top = '-100px';
          el.style.left = Utils.random.int(0, window.innerWidth) + 'px';
          el.style.transition = 'all 3s ease-in';

          setTimeout(() => {
            el.style.top = window.innerHeight + 'px';
          }, Math.random() * 1000);
        }
      });

      InjectManager.add('Element Rain Inject', () => {
        originalPositions.forEach((pos, el) => {
          if (el && el.style) {
            Object.assign(el.style, pos);
          }
        });
      });
    },

    rotateScreen: () => {
      Logger.inject('INJECTS', 'Executing inject: rotateScreen');
      const originalTransform = document.body.style.transform;
      let rotation = 0;

      const rotate = () => {
        rotation = (rotation + 1) % 360;
        document.body.style.transform = `rotate(${rotation}deg)`;
      };

      const interval = setInterval(rotate, 50);

      InjectManager.add('Rotate Screen Inject', () => {
        clearInterval(interval);
        document.body.style.transform = originalTransform;
      });
    },

    mirrorPage: () => {
      Logger.inject('INJECTS', 'Executing inject: mirrorPage');
      const originalTransform = document.body.style.transform;
      document.body.style.transform = 'scaleX(-1)';

      InjectManager.add('Mirror Page Inject', () => {
        document.body.style.transform = originalTransform;
      });
    },

    replaceWithDogs: () => {
      Logger.inject('INJECTS', 'Executing inject: replaceWithDogs');
      const dogWords = ['woof', 'bark', 'arf', 'ruff', 'bow wow', '🐕', '🐶'];
      const originalTexts = new Map();

      const walker = document.createTreeWalker(
        document.body,
        NodeFilter.SHOW_TEXT,
        {
          acceptNode: (node) => {
            return Utils.isFuckeryElement(node.parentElement) ?
            NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT;
          }
        }
      );

      let node;
      while (node = walker.nextNode()) {
        if (node.textContent.trim()) {
          originalTexts.set(node, node.textContent);
          const words = node.textContent.split(' ').length;
          node.textContent = Array(words).fill().map(() => Utils.random.choice(dogWords)).join(' ');
        }
      }

      InjectManager.add('Replace With Dogs Inject', () => {
        originalTexts.forEach((originalText, node) => {
          if (node.parentNode) {
            node.textContent = originalText;
          }
        });
      });
    },

    bouncyElements: () => {
      Logger.inject('INJECTS', 'Executing inject: bouncyElements');
      Styles.addGlobal('bouncy', `
      @keyframes bounce-element {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-30px); }
      }
      `);

      Utils.getNonFuckeryElements().forEach((el, index) => {
        if (el instanceof HTMLElement) {
          el.style.animation = `bounce-element ${0.5 + Math.random()}s ease-in-out infinite`;
          el.style.animationDelay = `${index * 0.05}s`;
        }
      });

      InjectManager.add('Bouncy Elements Inject', () => {
        Utils.getNonFuckeryElements().forEach(el => {
          if (el instanceof HTMLElement) {
            el.style.animation = '';
            el.style.animationDelay = '';
          }
        });
        Styles.removeGlobal('bouncy');
      });
    },

    vaporwave: () => {
      Logger.inject('INJECTS', 'Executing inject: vaporwave');
      const originalStyles = new Map();

      Utils.getNonFuckeryElements().forEach(el => {
        if (el instanceof HTMLElement) {
          originalStyles.set(el, {
            color: el.style.color,
            textShadow: el.style.textShadow,
            fontFamily: el.style.fontFamily
          });

          el.style.color = Utils.random.choice(['#ff71ce', '#01cdfe', '#05ffa1', '#b967ff', '#fffb96']);
          el.style.textShadow = '2px 2px 0px #ff71ce, 4px 4px 0px #01cdfe';
          el.style.fontFamily = 'Impact, fantasy';
        }
      });

      document.body.style.background = 'linear-gradient(45deg, #ff71ce 0%, #01cdfe 100%)';

      InjectManager.add('Vaporwave Inject', () => {
        originalStyles.forEach((style, el) => {
          if (el && el.style) {
            Object.assign(el.style, style);
          }
        });
        document.body.style.background = '';
      });
    },

    deepFry: () => {
      Logger.inject('INJECTS', 'Executing inject: deepFry');
      const originalFilter = document.body.style.filter;
      document.body.style.filter = 'contrast(200%) saturate(300%) brightness(150%) hue-rotate(180deg)';

      InjectManager.add('Deep Fry Inject', () => {
        document.body.style.filter = originalFilter;
      });
    },

    // NEW TEXT INJECTS
    cursiveFont: () => {
      Logger.inject('INJECTS', 'Executing inject: cursiveFont');
      const applyFont = () => {
        Utils.getNonFuckeryElements().forEach(el => {
          if (el instanceof HTMLElement) {
            el.style.fontFamily = 'cursive, "Brush Script MT", "Lucida Handwriting", fantasy';
            el.style.fontStyle = 'italic';
          }
        });
      };

      applyFont();
      const interval = setInterval(applyFont, 100);
      InjectManager.add('Cursive Font Inject', () => {
        clearInterval(interval);
        Utils.getNonFuckeryElements().forEach(el => {
          if (el instanceof HTMLElement) {
            el.style.fontFamily = '';
            el.style.fontStyle = '';
          }
        });
      });
    },

    upsideDown: () => {
      Logger.inject('INJECTS', 'Executing inject: upsideDown');
      const originalTexts = new Map();

      const walker = document.createTreeWalker(
        document.body,
        NodeFilter.SHOW_TEXT,
        {
          acceptNode: (node) => {
            return Utils.isFuckeryElement(node.parentElement) ?
            NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT;
          }
        }
      );

      let node;
      while (node = walker.nextNode()) {
        if (node.textContent.trim()) {
          originalTexts.set(node, node.textContent);
          node.textContent = node.textContent.split('').reverse().join('').replace(/[a-z]/gi, char => {
            const flipped = {
              'a': 'ɐ', 'b': 'q', 'c': 'ɔ', 'd': 'p', 'e': 'ǝ', 'f': 'ɟ', 'g': 'ƃ', 'h': 'ɥ',
              'i': 'ᴉ', 'j': 'ɾ', 'k': 'ʞ', 'l': 'l', 'm': 'ɯ', 'n': 'u', 'o': 'o', 'p': 'd',
              'q': 'b', 'r': 'ɹ', 's': 's', 't': 'ʇ', 'u': 'n', 'v': 'ʌ', 'w': 'ʍ', 'x': 'x',
              'y': 'ʎ', 'z': 'z'
            };
            return flipped[char.toLowerCase()] || char;
          });
        }
      }

      InjectManager.add('Upside Down Inject', () => {
        originalTexts.forEach((originalText, node) => {
          if (node.parentNode) {
            node.textContent = originalText;
          }
        });
      });
    },

    leetSpeak: () => {
      Logger.inject('INJECTS', 'Executing inject: leetSpeak');
      const originalTexts = new Map();

      const walker = document.createTreeWalker(
        document.body,
        NodeFilter.SHOW_TEXT,
        {
          acceptNode: (node) => {
            return Utils.isFuckeryElement(node.parentElement) ?
            NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT;
          }
        }
      );

      let node;
      while (node = walker.nextNode()) {
        if (node.textContent.trim()) {
          originalTexts.set(node, node.textContent);
          node.textContent = node.textContent.replace(/[aeilost]/gi, char => {
            const leet = {
              'a': '4', 'e': '3', 'i': '1', 'l': '1', 'o': '0', 's': '5', 't': '7'
            };
            return leet[char.toLowerCase()] || char;
          });
        }
      }

      InjectManager.add('Leet Speak Inject', () => {
        originalTexts.forEach((originalText, node) => {
          if (node.parentNode) {
            node.textContent = originalText;
          }
        });
      });
    },

    shadowText: () => {
      Logger.inject('INJECTS', 'Executing inject: shadowText');
      const applyEffect = () => {
        Utils.getNonFuckeryElements().forEach(el => {
          if (el instanceof HTMLElement) {
            el.style.textShadow = '2px 2px 4px rgba(0,0,0,0.8), 4px 4px 8px rgba(0,0,0,0.6)';
          }
        });
      };

      applyEffect();
      const interval = setInterval(applyEffect, 100);
      InjectManager.add('Shadow Text Inject', () => {
        clearInterval(interval);
        Utils.getNonFuckeryElements().forEach(el => {
          if (el instanceof HTMLElement) {
            el.style.textShadow = '';
          }
        });
      });
    },

    typewriterText: () => {
      Logger.inject('INJECTS', 'Executing inject: typewriterText');
      const applyFont = () => {
        Utils.getNonFuckeryElements().forEach(el => {
          if (el instanceof HTMLElement) {
            el.style.fontFamily = '"Courier New", monospace';
            el.style.letterSpacing = '0.1em';
            el.style.animation = 'typewriter-cursor 1s step-end infinite';
          }
        });
      };

      Styles.addGlobal('typewriter', `
      @keyframes typewriter-cursor {
        0%, 50% { border-right: 2px solid transparent; }
        51%, 100% { border-right: 2px solid currentColor; }
      }
      `);

      applyFont();
      const interval = setInterval(applyFont, 100);
      InjectManager.add('Typewriter Text Inject', () => {
        clearInterval(interval);
        Utils.getNonFuckeryElements().forEach(el => {
          if (el instanceof HTMLElement) {
            el.style.fontFamily = '';
            el.style.letterSpacing = '';
            el.style.animation = '';
          }
        });
        Styles.removeGlobal('typewriter');
      });
    },

    // NEW VISUAL INJECTS
    matrix: () => {
      Logger.info('INJECTS', 'Matrix inject has been removed');
      Modal.alert('Matrix inject has been removed from this version');
    },

    spinningFishBackground: () => {
      Logger.inject('INJECTS', 'Executing inject: spinningFishBackground');
      const fishGifUrl = 'https://c.tenor.com/R5IECfIf34YAAAAd/tenor.gif';
      const originalBackgrounds = new Map();

      const applyFishBackground = () => {
        Utils.getNonFuckeryElements().forEach(el => {
          if (el instanceof HTMLElement) {
            if (!originalBackgrounds.has(el)) {
              originalBackgrounds.set(el, {
                backgroundImage: el.style.backgroundImage,
                backgroundSize: el.style.backgroundSize,
                backgroundPosition: el.style.backgroundPosition,
                backgroundRepeat: el.style.backgroundRepeat
              });
            }

            el.style.backgroundImage = `url("${fishGifUrl}")`;
            el.style.backgroundSize = 'cover';
            el.style.backgroundPosition = 'center';
            el.style.backgroundRepeat = 'repeat';
          }
        });
      };

      applyFishBackground();
      const interval = setInterval(applyFishBackground, 500); // Reapply to new elements

      InjectManager.add('Spinning Fish Background Inject', () => {
        clearInterval(interval);
        originalBackgrounds.forEach((originalStyle, el) => {
          if (el && el.style) {
            Object.assign(el.style, originalStyle);
          }
        });
      });
    },

    disco: () => {
      Logger.inject('INJECTS', 'Executing inject: disco');
      const colors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff'];

      const discoEffect = () => {
        document.body.style.backgroundColor = Utils.random.choice(colors);
        Utils.getNonFuckeryElements().forEach(el => {
          if (el instanceof HTMLElement && Math.random() > 0.7) {
            el.style.backgroundColor = Utils.random.choice(colors);
            el.style.color = Utils.random.choice(colors);
          }
        });
      };

      const interval = setInterval(discoEffect, 200);
      InjectManager.add('Disco Inject', () => {
        clearInterval(interval);
        document.body.style.backgroundColor = '';
        Utils.getNonFuckeryElements().forEach(el => {
          if (el instanceof HTMLElement) {
            el.style.backgroundColor = '';
            el.style.color = '';
          }
        });
      });
    },

    pixelate: () => {
      Logger.inject('INJECTS', 'Executing inject: pixelate');
      const originalStyles = new Map();

      const applyPixelation = () => {
        Utils.getNonFuckeryElements().forEach(el => {
          if (el instanceof HTMLElement) {
            if (!originalStyles.has(el)) {
              originalStyles.set(el, {
                backgroundColor: el.style.backgroundColor,
                color: el.style.color
              });
            }
            el.style.backgroundColor = '';
            el.style.color = '';
            el.style.imageRendering = 'pixelated';
            el.style.filter = 'blur(0.5px) contrast(1.2) saturate(1.5)';
            el.style.transform = el.style.transform + ' scale(0.98)';
          }
        });
      };

      applyPixelation();
      const interval = setInterval(applyPixelation, 1000);

      InjectManager.add('Pixelate Inject', () => {
        clearInterval(interval);
        originalStyles.forEach((originalStyle, el) => {
          if (el && el.style) {
            Object.assign(el.style, originalStyle);
          }
        });
      });
    },

    waveMotion: () => {
      Logger.inject('INJECTS', 'Executing inject: waveMotion');
      const startTime = Date.now();

      const waveEffect = () => {
        const time = (Date.now() - startTime) / 1000;
        Utils.getNonFuckeryElements().forEach((el, index) => {
          if (el instanceof HTMLElement) {
            const offset = Math.sin(time * 2 + index * 0.1) * 20;
            el.style.transform = `translateY(${offset}px)`;
          }
        });
      };

      const interval = setInterval(waveEffect, 50);
      InjectManager.add('Wave Motion Inject', () => {
        clearInterval(interval);
        Utils.getNonFuckeryElements().forEach(el => {
          if (el instanceof HTMLElement) {
            el.style.transform = '';
          }
        });
      });
    },

    shrinkGrow: () => {
      Logger.inject('INJECTS', 'Executing inject: shrinkGrow');
      const startTime = Date.now();

      const scaleEffect = () => {
        const time = (Date.now() - startTime) / 1000;
        Utils.getNonFuckeryElements().forEach((el, index) => {
          if (el instanceof HTMLElement) {
            const scale = 0.8 + Math.sin(time * 3 + index * 0.2) * 0.3;
            el.style.transform = `scale(${scale})`;
          }
        });
      };

      const interval = setInterval(scaleEffect, 50);
      InjectManager.add('Shrink & Grow Inject', () => {
        clearInterval(interval);
        Utils.getNonFuckeryElements().forEach(el => {
          if (el instanceof HTMLElement) {
            el.style.transform = '';
          }
        });
      });
    },

    // NEW INTERACTIVE INJECTS
    clickExplode: () => {
      Logger.inject('INJECTS', 'Executing inject: clickExplode');
      const handleClick = (e) => {
        if (Utils.isFuckeryElement(e.target)) return;

        for (let i = 0; i < 10; i++) {
          const particle = Utils.createElement('div', {
            textContent: ['💥', '✨', '⭐', '🎆', '🎇'][Utils.random.int(0, 4)],
                                               className: 'fuckery-element',
                                               style: {
                                                 position: 'fixed',
                                                 left: e.clientX + 'px',
                                                 top: e.clientY + 'px',
                                                 fontSize: '20px',
                                                 pointerEvents: 'none',
                                                 zIndex: '999999',
                                                 animation: `explodeParticle 1s ease-out forwards`
                                               }
          });

          const angle = (i / 10) * Math.PI * 2;
          const distance = 100 + Math.random() * 100;
          particle.style.setProperty('--end-x', Math.cos(angle) * distance + 'px');
          particle.style.setProperty('--end-y', Math.sin(angle) * distance + 'px');

          document.body.appendChild(particle); // Append to body, not fuckery container
          setTimeout(() => particle.remove(), 1000);
        }
      };

      Styles.addGlobal('clickexplode', `
      @keyframes explodeParticle {
        to {
          transform: translate(var(--end-x), var(--end-y)) rotate(360deg);
          opacity: 0;
          scale: 0;
        }
      }
      `);

      document.addEventListener('click', handleClick);
      InjectManager.add('Click Explode Inject', () => {
        document.removeEventListener('click', handleClick);
        Styles.removeGlobal('clickexplode');
      });
    },

    mouseTrail: () => {
      Logger.inject('INJECTS', 'Executing inject: mouseTrail');
      const trail = [];
      const maxTrail = 20;

      const handleMouseMove = (e) => {
        const particle = Utils.createElement('div', {
          className: 'fuckery-element',
          style: {
            position: 'fixed',
            left: e.clientX + 'px',
            top: e.clientY + 'px',
            width: '10px',
            height: '10px',
            backgroundColor: Utils.random.color(),
                                             borderRadius: '50%',
                                             pointerEvents: 'none',
                                             zIndex: '999999',
                                             animation: 'trailFade 0.5s ease-out forwards'
          }
        });

        document.body.appendChild(particle); // Append to body, not fuckery container
        trail.push(particle);

        if (trail.length > maxTrail) {
          const old = trail.shift();
          if (old.parentNode) old.remove();
        }

        setTimeout(() => particle.remove(), 500);
      };

      Styles.addGlobal('mousetrail', `
      @keyframes trailFade {
        to {
          opacity: 0;
          transform: scale(0);
        }
      }
      `);

      document.addEventListener('mousemove', handleMouseMove);
      InjectManager.add('Mouse Trail Inject', () => {
        document.removeEventListener('mousemove', handleMouseMove);
        trail.forEach(p => p.remove());
        Styles.removeGlobal('mousetrail');
      });
    },

    hideCursor: () => {
      Logger.inject('INJECTS', 'Executing inject: hideCursor');
      const originalCursor = document.body.style.cursor;
      document.body.style.cursor = 'none';
      InjectManager.add('Hide Cursor Inject', () => {
        document.body.style.cursor = originalCursor;
      });
    },

    konami: () => {
      Logger.inject('INJECTS', 'Executing inject: konami');
      const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'KeyB', 'KeyA'];
      let konamiIndex = 0;

      const handleKeyDown = (e) => {
        if (e.code === konamiCode[konamiIndex]) {
          konamiIndex++;
          if (konamiIndex === konamiCode.length) {
            Injects.michaelCheese();
            Injects.disco();
            Modal.alert('🎉 KONAMI CODE ACTIVATED! MAXIMUM FUCKERY ENGAGED! 🎉');
            konamiIndex = 0;
          }
        } else {
          konamiIndex = 0;
        }
      };

      document.addEventListener('keydown', handleKeyDown);
      InjectManager.add('Konami Code Inject', () => {
        document.removeEventListener('keydown', handleKeyDown);
      });
    },

    // NEW AUDIO/SENSORY INJECTS
    // Remove speech synthesis (doesn't work reliably)
    // Remove vibrate (mobile only, limited effect)

    // NEW VISUAL EFFECTS
    randomPositions: () => {
      Logger.inject('INJECTS', 'Executing inject: randomPositions');
      const originalPositions = new Map();
      Utils.getNonFuckeryElements().forEach(el => {
        if (el instanceof HTMLElement) {
          originalPositions.set(el, {
            position: el.style.position,
            top: el.style.top,
            left: el.style.left,
            transform: el.style.transform,
            zIndex: el.style.zIndex
          });
          el.style.position = 'absolute';
          el.style.top = `${Utils.random.int(0, window.innerHeight - el.offsetHeight)}px`;
          el.style.left = `${Utils.random.int(0, window.innerWidth - el.offsetWidth)}px`;
          el.style.zIndex = '99999';
        }
      });
      InjectManager.add('Random Positions Inject', () => {
        originalPositions.forEach((style, el) => {
          if (el && el.style) {
            Object.assign(el.style, style);
          }
        });
      });
    },

    replaceImagesWithFish: () => {
      Logger.inject('INJECTS', 'Executing inject: replaceImagesWithFish');
      const fishGifUrl = 'https://c.tenor.com/R5IECfIf34YAAAAd/tenor.gif';
      const originalSources = new Map();
      const processImages = () => {
        Utils.getNonFuckeryElements('img').forEach(img => {
          if (!originalSources.has(img)) {
            originalSources.set(img, img.src);
          }
          img.src = fishGifUrl;
        });
      };
      processImages();
      const interval = setInterval(processImages, 500);
      InjectManager.add('Replace Images with Fish Inject', () => {
        clearInterval(interval);
        originalSources.forEach((src, img) => {
          if (img) {
            img.src = src;
          }
        });
      });
    },

    // Visual injects
    shake: () => {
      Logger.inject('INJECTS', 'Executing inject: shake');
      Styles.addGlobal('shake', `
      @keyframes fuckery-shake {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-5px) rotate(1deg); }
        75% { transform: translateX(5px) rotate(-1deg); }
      }
      `);

      const originalStyles = new Map();

      Utils.getNonFuckeryElements().forEach(el => {
        if (el instanceof HTMLElement) {
          try {
            originalStyles.set(el, {
              animation: el.style.animation
            });
            el.style.animation = 'fuckery-shake 0.1s ease-in-out infinite';
          } catch (e) {
            // Skip problematic elements
          }
        }
      });

      InjectManager.add('Shake Inject', () => {
        originalStyles.forEach((originalStyle, el) => {
          try {
            if (el && el.style) {
              Object.assign(el.style, originalStyle);
            }
          } catch (e) {
            // Element might have been removed
          }
        });
        Styles.removeGlobal('shake');
      });
    },

    spin: () => {
      Logger.inject('INJECTS', 'Executing inject: spin');
      Styles.addGlobal('spin', `
      @keyframes fuckery-spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
      }
      `);

      const originalStyles = new Map();

      Utils.getNonFuckeryElements().forEach(el => {
        if (el instanceof HTMLElement) {
          try {
            originalStyles.set(el, {
              animation: el.style.animation
            });
            el.style.animation = 'fuckery-spin 2s linear infinite';
          } catch (e) {
            // Skip problematic elements
          }
        }
      });

      InjectManager.add('Spin Inject', () => {
        originalStyles.forEach((originalStyle, el) => {
          try {
            if (el && el.style) {
              Object.assign(el.style, originalStyle);
            }
          } catch (e) {
            // Element might have been removed
          }
        });
        Styles.removeGlobal('spin');
      });
    },

    glitch: () => {
      Logger.inject('INJECTS', 'Executing inject: glitch');
      const intervals = [];
      const originalStyles = new Map();

      Utils.getNonFuckeryElements().forEach(el => {
        if (!(el instanceof HTMLElement)) return;

        try {
          // Store original styles
          originalStyles.set(el, {
            transform: el.style.transform,
            filter: el.style.filter
          });

          const interval = setInterval(() => {
            try {
              if (Math.random() > 0.7) {
                el.style.transform = `translate(${Utils.random.int(-5, 5)}px, ${Utils.random.int(-5, 5)}px) skew(${Utils.random.int(-2, 2)}deg)`;
                el.style.filter = `hue-rotate(${Utils.random.int(0, 360)}deg) contrast(${Utils.random.int(50, 200)}%)`;
                setTimeout(() => {
                  try {
                    el.style.transform = originalStyles.get(el)?.transform || '';
                    el.style.filter = originalStyles.get(el)?.filter || '';
                  } catch (e) {
                    // Element might have been removed
                  }
                }, Utils.random.int(50, 200));
              }
            } catch (e) {
              // Element might have been removed, clear this interval
              clearInterval(interval);
            }
          }, Utils.random.int(100, 500));
          intervals.push(interval);
        } catch (e) {
          Logger.error('INJECTS', 'Error setting up glitch for element', { error: e.message });
        }
      });

      InjectManager.add('Glitch Inject', () => {
        intervals.forEach(i => clearInterval(i));
        originalStyles.forEach((originalStyle, el) => {
          try {
            if (el && el.style) {
              Object.assign(el.style, originalStyle);
            }
          } catch (e) {
            // Element might have been removed
          }
        });
      });
    },

    colorChaos: () => {
      Logger.inject('INJECTS', 'Executing inject: colorChaos');
      const originalStyles = new Map();

      const applyColorChaos = () => {
        try {
          Utils.getNonFuckeryElements().forEach(el => {
            if (!(el instanceof HTMLElement)) return;

            try {
              if (!originalStyles.has(el)) {
                originalStyles.set(el, {
                  backgroundColor: el.style.backgroundColor,
                  color: el.style.color
                });
              }

              if (Math.random() > 0.8) {
                el.style.backgroundColor = Utils.random.color();
                el.style.color = Utils.random.color();
              }
            } catch (e) {
              // Skip problematic elements
            }
          });
        } catch (e) {
          Logger.error('INJECTS', 'Error in colorChaos', { error: e.message });
        }
      };

      const interval = setInterval(applyColorChaos, 200);

      InjectManager.add('Color Chaos Inject', () => {
        clearInterval(interval);
        originalStyles.forEach((originalStyle, el) => {
          try {
            if (el && el.style) {
              Object.assign(el.style, originalStyle);
            }
          } catch (e) {
            // Element might have been removed
          }
        });
      });
    },

    invertColors: () => {
      Logger.inject('INJECTS', 'Executing inject: invertColors');
      try {
        const body = document.body || document.documentElement;
        const originalFilter = body.style.filter;

        body.style.filter = 'invert(1) hue-rotate(180deg)';

        InjectManager.add('Invert Colors Inject', () => {
          try {
            body.style.filter = originalFilter;
          } catch (e) {
            Logger.error('INJECTS', 'Error restoring invert colors', { error: e.message });
          }
        });
      } catch (e) {
        Logger.error('INJECTS', 'Error applying invert colors', { error: e.message });
      }
    },

    runFromMouse: () => {
      Logger.inject('INJECTS', 'Executing inject: runFromMouse');
      let mouseX = 0, mouseY = 0;
      const handleMouseMove = (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        Utils.getNonFuckeryElements().forEach(el => {
          if (!(el instanceof HTMLElement) || el === document.body || el === document.documentElement) return;
          const rect = el.getBoundingClientRect();
          const centerX = rect.left + rect.width / 2;
          const centerY = rect.top + rect.height / 2;
          const distance = Math.sqrt((mouseX - centerX) ** 2 + (mouseY - centerY) ** 2);
          if (distance < 150) {
            const angle = Math.atan2(centerY - mouseY, centerX - mouseX);
            const force = Math.max(0, 150 - distance) / 150;
            const moveX = Math.cos(angle) * force * 30;
            const moveY = Math.sin(angle) * force * 30;
            el.style.transform = `translate(${moveX}px, ${moveY}px)`;
            el.style.transition = 'transform 0.2s ease-out';
          }
        });
      };
      document.addEventListener('mousemove', handleMouseMove);
      InjectManager.add('Run From Mouse Inject', () => {
        document.removeEventListener('mousemove', handleMouseMove);
        Utils.getNonFuckeryElements().forEach(el => {
          if (el instanceof HTMLElement) {
            el.style.transform = '';
            el.style.transition = '';
          }
        });
      });
    },

    flingExplode: () => {
      Logger.inject('INJECTS', 'Executing inject: flingExplode');
      const originalCursors = new Map();
      const flinggedElements = new Set();

      // Add styles for fling effects
      Styles.addGlobal('flingexplode', `
      @keyframes fling-out {
        0% {
          transform: scale(1) rotate(0deg);
          opacity: 1;
        }
        100% {
          transform: scale(0.1) rotate(720deg) translate(var(--fling-x, 2000px), var(--fling-y, -1000px));
          opacity: 0;
        }
      }
      @keyframes explode-out {
        0% {
          transform: scale(1);
          opacity: 1;
          filter: brightness(1);
        }
        50% {
          transform: scale(1.5);
          filter: brightness(3) hue-rotate(180deg);
        }
        100% {
          transform: scale(0) rotate(360deg);
          opacity: 0;
          filter: brightness(0);
        }
      }
      .fling-cursor {
        cursor: crosshair !important;
      }
      `);

      const handleClick = (e) => {
        if (Utils.isFuckeryElement(e.target)) return;
        e.preventDefault();
        e.stopPropagation();

        const element = e.target;
        if (flinggedElements.has(element)) return;

        flinggedElements.add(element);

        if (e.button === 2 || e.ctrlKey) {
          // Right click or Ctrl+click = explode
          element.style.animation = 'explode-out 0.8s ease-in forwards';

          // Create explosion particles
          for (let i = 0; i < 8; i++) {
            const particle = Utils.createElement('div', {
              textContent: '💥',
              className: 'fuckery-element',
              style: {
                position: 'fixed',
                left: e.clientX + 'px',
                top: e.clientY + 'px',
                fontSize: '20px',
                pointerEvents: 'none',
                zIndex: '999999',
                animation: `explode-out 1s ease-out ${i * 0.1}s forwards`
              }
            });
            particle.style.setProperty('--fling-x', (Math.random() - 0.5) * 400 + 'px');
            particle.style.setProperty('--fling-y', (Math.random() - 0.5) * 400 + 'px');
            document.body.appendChild(particle);
            setTimeout(() => particle.remove(), 1100);
          }
        } else {
          // Left click = fling
          const direction = Math.random() * Math.PI * 2;
          const distance = 1500 + Math.random() * 1000;
          const flingX = Math.cos(direction) * distance;
          const flingY = Math.sin(direction) * distance - 500; // Add upward bias

          element.style.setProperty('--fling-x', flingX + 'px');
          element.style.setProperty('--fling-y', flingY + 'px');
          element.style.animation = 'fling-out 1.5s ease-in forwards';
          element.style.zIndex = '999998';
        }

        setTimeout(() => {
          if (element.parentNode) {
            element.remove();
          }
        }, 1600);
      };

      const handleRightClick = (e) => {
        if (Utils.isFuckeryElement(e.target)) return;
        e.preventDefault();
        handleClick(e);
      };

      // Add cursor styling to all non-fuckery elements
      Utils.getNonFuckeryElements().forEach(el => {
        if (el instanceof HTMLElement) {
          originalCursors.set(el, el.style.cursor);
          el.classList.add('fling-cursor');
        }
      });

      // Add event listeners
      document.addEventListener('click', handleClick, true);
      document.addEventListener('contextmenu', handleRightClick, true);
      document.addEventListener('mousedown', handleClick, true);

      InjectManager.add('Fling & Explode Inject', () => {
        document.removeEventListener('click', handleClick, true);
        document.removeEventListener('contextmenu', handleRightClick, true);
        document.removeEventListener('mousedown', handleClick, true);

        // Restore original cursors
        originalCursors.forEach((cursor, el) => {
          if (el && el.style) {
            el.style.cursor = cursor;
            el.classList.remove('fling-cursor');
          }
        });

        // Clear any remaining animations
        flinggedElements.forEach(el => {
          if (el && el.style) {
            el.style.animation = '';
            el.style.zIndex = '';
          }
        });

        Styles.removeGlobal('flingexplode');
      });
    },

    // NEW VISUAL EFFECTS
    neonGlow: () => {
      Logger.inject('INJECTS', 'Executing inject: neonGlow');
      const applyGlow = () => {
        Utils.getNonFuckeryElements().forEach(el => {
          if (el instanceof HTMLElement) {
            const color = Utils.random.color();
            el.style.textShadow = `0 0 10px ${color}, 0 0 20px ${color}, 0 0 30px ${color}`;
            el.style.boxShadow = `0 0 15px ${color}, inset 0 0 15px ${color}`;
          }
        });
      };

      const interval = setInterval(applyGlow, 500);
      InjectManager.add('Neon Glow Inject', () => {
        clearInterval(interval);
        Utils.getNonFuckeryElements().forEach(el => {
          if (el instanceof HTMLElement) {
            el.style.textShadow = '';
            el.style.boxShadow = '';
          }
        });
      });
    },

    drunkMode: () => {
      Logger.inject('INJECTS', 'Executing inject: drunkMode');
      const startTime = Date.now();
      const applyDrunkFX = () => {
        const time = (Date.now() - startTime) / 1000;
        const swayX = Math.sin(time * 0.5) * 50;
        const swayY = Math.cos(time * 0.3) * 30;
        document.body.style.transform = `translateX(${swayX}px) translateY(${swayY}px) rotate(${Math.sin(time * 0.2)}deg)`;
        document.body.style.filter = `blur(1px) contrast(1.1)`;
        document.body.style.transition = 'transform 0.5s linear';
        document.body.style.overflowX = 'hidden';
      };
      const interval = setInterval(applyDrunkFX, 50);
      InjectManager.add('Drunk Mode Inject', () => {
        clearInterval(interval);
        document.body.style.transform = '';
        document.body.style.filter = '';
        document.body.style.transition = '';
        document.body.style.overflowX = '';
      });
    },

    sepiaFilter: () => {
      Logger.inject('INJECTS', 'Executing inject: sepiaFilter');
      const body = document.body;
      const originalFilter = body.style.filter;

      body.style.filter = 'sepia(1) contrast(1.2) brightness(1.1)';

      InjectManager.add('Sepia Filter Inject', () => {
        body.style.filter = originalFilter;
      });
    },

    blurBomb: () => {
      Logger.inject('INJECTS', 'Executing inject: blurBomb');
      const originalFilters = new Map();

      Utils.getNonFuckeryElements().forEach(el => {
        if (el instanceof HTMLElement) {
          originalFilters.set(el, el.style.filter);
          el.style.filter = `blur(${Utils.random.int(2, 8)}px)`;
        }
      });

      InjectManager.add('Blur Bomb Inject', () => {
        originalFilters.forEach((originalFilter, el) => {
          if (el && el.style) {
            el.style.filter = originalFilter;
          }
        });
      });
    },

    gravityFall: () => {
      Logger.inject('INJECTS', 'Executing inject: gravityFall');
      const originalStyles = new Map();

      Utils.getNonFuckeryElements().forEach(el => {
        if (!(el instanceof HTMLElement) || el === document.body || el === document.documentElement) return;

        originalStyles.set(el, {
          position: el.style.position,
          top: el.style.top,
          left: el.style.left,
          transform: el.style.transform,
          transition: el.style.transition
        });

        el.style.position = 'relative';
        el.style.transition = 'transform 2s ease-in';
        el.style.transform = `translateY(${window.innerHeight}px) rotate(${Utils.random.int(-180, 180)}deg)`;
      });

      InjectManager.add('Gravity Fall Inject', () => {
        originalStyles.forEach((originalStyle, el) => {
          if (el && el.style) {
            Object.assign(el.style, originalStyle);
          }
        });
      });
    },

    perspectiveFlip: () => {
      Logger.inject('INJECTS', 'Executing inject: perspectiveFlip');
      Styles.addGlobal('perspective', `
      @keyframes perspective-flip {
        0% { transform: perspective(1000px) rotateY(0deg); }
        50% { transform: perspective(1000px) rotateY(180deg); }
        100% { transform: perspective(1000px) rotateY(360deg); }
      }
      `);

      Utils.getNonFuckeryElements().forEach(el => {
        if (el instanceof HTMLElement) {
          try {
            el.style.animation = 'perspective-flip 3s ease-in-out infinite';
            el.style.transformStyle = 'preserve-3d';
          } catch (e) {
            // Skip problematic elements
          }
        }
      });

      InjectManager.add('Perspective Flip Inject', () => {
        Utils.getNonFuckeryElements().forEach(el => {
          if (el instanceof HTMLElement) {
            el.style.animation = '';
            el.style.transformStyle = '';
          }
        });
        Styles.removeGlobal('perspective');
      });
    },

    xrayMode: () => {
      Logger.inject('INJECTS', 'Executing inject: xrayMode');
      const originalStyles = new Map();

      Utils.getNonFuckeryElements().forEach(el => {
        if (el instanceof HTMLElement) {
          originalStyles.set(el, {
            backgroundColor: el.style.backgroundColor,
            color: el.style.color,
            border: el.style.border
          });

          el.style.backgroundColor = 'rgba(255,255,255,0.1)';
          el.style.color = '#007bff';
          el.style.border = '1px solid #007bff';
        }
      });

      document.body.style.backgroundColor = '#000';

      InjectManager.add('X-Ray Mode Inject', () => {
        originalStyles.forEach((originalStyle, el) => {
          if (el && el.style) {
            Object.assign(el.style, originalStyle);
          }
        });
        document.body.style.backgroundColor = '';
      });
    },

    hueCycle: () => {
      Logger.inject('INJECTS', 'Executing inject: hueCycle');
      const startTime = Date.now();

      const cycleHue = () => {
        const time = (Date.now() - startTime) / 100;
        const hue = (time % 360);
        document.body.style.filter = `hue-rotate(${hue}deg)`;
      };

      const interval = setInterval(cycleHue, 50);
      InjectManager.add('Hue Cycle Inject', () => {
        clearInterval(interval);
        document.body.style.filter = '';
      });
    },

    outlineMode: () => {
      Logger.inject('INJECTS', 'Executing inject: outlineMode');
      const originalStyles = new Map();

      Utils.getNonFuckeryElements().forEach(el => {
        if (el instanceof HTMLElement) {
          originalStyles.set(el, {
            backgroundColor: el.style.backgroundColor,
            color: el.style.color,
            outline: el.style.outline
          });

          el.style.backgroundColor = 'transparent';
          el.style.color = Utils.random.color();
          el.style.outline = `2px solid ${Utils.random.color()}`;
        }
      });

      InjectManager.add('Outline Mode Inject', () => {
        originalStyles.forEach((originalStyle, el) => {
          if (el && el.style) {
            Object.assign(el.style, originalStyle);
          }
        });
      });
    },

    // NEW INTERACTIVE INJECTS
    hoverMagnet: () => {
      Logger.inject('INJECTS', 'Executing inject: hoverMagnet');
      let mouseX = 0, mouseY = 0;
      const originalPositions = new Map();

      const handleMouseMove = (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;

        Utils.getNonFuckeryElements().forEach(el => {
          if (!(el instanceof HTMLElement) || el === document.body || el === document.documentElement) return;

          const rect = el.getBoundingClientRect();
          const centerX = rect.left + rect.width / 2;
          const centerY = rect.top + rect.height / 2;
          const distance = Math.sqrt((mouseX - centerX) ** 2 + (mouseY - centerY) ** 2);

          if (distance < 200) {
            const angle = Math.atan2(mouseY - centerY, mouseX - centerX);
            const force = Math.max(0, 200 - distance) / 200;
            const moveX = Math.cos(angle) * force * 50;
            const moveY = Math.sin(angle) * force * 50;
            el.style.transform = `translate(${moveX}px, ${moveY}px)`;
            el.style.transition = 'transform 0.1s ease-out';
          } else {
            el.style.transform = '';
          }
        });
      };

      document.addEventListener('mousemove', handleMouseMove);
      InjectManager.add('Hover Magnet Inject', () => {
        document.removeEventListener('mousemove', handleMouseMove);
        Utils.getNonFuckeryElements().forEach(el => {
          if (el instanceof HTMLElement) {
            el.style.transform = '';
            el.style.transition = '';
          }
        });
      });
    },

    clickTeleport: () => {
      Logger.inject('INJECTS', 'Executing inject: clickTeleport');
      const handleClick = (e) => {
        if (Utils.isFuckeryElement(e.target)) return;

        const element = e.target;
        if (element instanceof HTMLElement) {
          const newX = Utils.random.int(0, window.innerWidth - element.offsetWidth);
          const newY = Utils.random.int(0, window.innerHeight - element.offsetHeight);

          element.style.position = 'fixed';
          element.style.left = newX + 'px';
          element.style.top = newY + 'px';
          element.style.transition = 'all 0.3s ease';
          element.style.zIndex = '999999';
        }
      };

      document.addEventListener('click', handleClick);
      InjectManager.add('Click Teleport Inject', () => {
        document.removeEventListener('click', handleClick);
      });
    },

    keyboardDJ: () => {
      Logger.inject('INJECTS', 'Executing inject: keyboardDJ');
      const sounds = {
        'KeyA': 100, 'KeyS': 150, 'KeyD': 200, 'KeyF': 250,
        'KeyG': 300, 'KeyH': 350, 'KeyJ': 400, 'KeyK': 450
      };

      const handleKeyPress = (e) => {
        if (sounds[e.code]) {
          const audio = new AudioContext();
          const oscillator = audio.createOscillator();
          const gainNode = audio.createGain();

          oscillator.connect(gainNode);
          gainNode.connect(audio.destination);

          oscillator.frequency.value = sounds[e.code];
          gainNode.gain.setValueAtTime(0.3, audio.currentTime);
          gainNode.gain.exponentialRampToValueAtTime(0.01, audio.currentTime + 0.5);

          oscillator.start();
          oscillator.stop(audio.currentTime + 0.5);

          // Visual feedback
          document.body.style.backgroundColor = Utils.random.color();
          setTimeout(() => {
            document.body.style.backgroundColor = '';
          }, 100);
        }
      };

      document.addEventListener('keydown', handleKeyPress);
      InjectManager.add('Keyboard DJ Inject', () => {
        document.removeEventListener('keydown', handleKeyPress);
      });
    },

    mouseRepel: () => {
      Logger.inject('INJECTS', 'Executing inject: mouseRepel');
      let mouseX = 0, mouseY = 0;

      const handleMouseMove = (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;

        Utils.getNonFuckeryElements().forEach(el => {
          if (!(el instanceof HTMLElement) || el === document.body || el === document.documentElement) return;

          const rect = el.getBoundingClientRect();
          const centerX = rect.left + rect.width / 2;
          const centerY = rect.top + rect.height / 2;
          const distance = Math.sqrt((mouseX - centerX) ** 2 + (mouseY - centerY) ** 2);

          if (distance < 100) {
            const angle = Math.atan2(centerY - mouseY, centerX - mouseX);
            const force = Math.max(0, 100 - distance) / 100;
            const moveX = Math.cos(angle) * force * 100;
            const moveY = Math.sin(angle) * force * 100;
            el.style.transform = `translate(${moveX}px, ${moveY}px)`;
            el.style.transition = 'transform 0.2s ease-out';
          }
        });
      };

      document.addEventListener('mousemove', handleMouseMove);
      InjectManager.add('Mouse Repel Inject', () => {
        document.removeEventListener('mousemove', handleMouseMove);
        Utils.getNonFuckeryElements().forEach(el => {
          if (el instanceof HTMLElement) {
            el.style.transform = '';
            el.style.transition = '';
          }
        });
      });
    },

    doubleClickNuke: () => {
      Logger.inject('INJECTS', 'Executing inject: doubleClickNuke');
      let clickCount = 0;
      let clickTimer = null;

      const handleClick = (e) => {
        if (Utils.isFuckeryElement(e.target)) return;

        clickCount++;

        if (clickCount === 1) {
          clickTimer = setTimeout(() => {
            clickCount = 0;
          }, 300);
        } else if (clickCount === 2) {
          clearTimeout(clickTimer);
          clickCount = 0;

          // Nuke the clicked element
          if (e.target && e.target.parentNode) {
            e.target.style.animation = 'explode-out 0.5s ease-in forwards';
            setTimeout(() => {
              if (e.target.parentNode) {
                e.target.remove();
              }
            }, 500);
          }
        }
      };

      document.addEventListener('click', handleClick);
      InjectManager.add('Double Click Nuke Inject', () => {
        document.removeEventListener('click', handleClick);
      });
    },

    scrollChaos: () => {
      Logger.inject('INJECTS', 'Executing inject: scrollChaos');
      const handleScroll = () => {
        Utils.getNonFuckeryElements().forEach(el => {
          if (el instanceof HTMLElement && Math.random() > 0.9) {
            el.style.transform = `rotate(${Utils.random.int(-10, 10)}deg) scale(${0.8 + Math.random() * 0.4})`;
            el.style.backgroundColor = Utils.random.color();
          }
        });
      };

      document.addEventListener('scroll', handleScroll);
      InjectManager.add('Scroll Chaos Inject', () => {
        document.removeEventListener('scroll', handleScroll);
        Utils.getNonFuckeryElements().forEach(el => {
          if (el instanceof HTMLElement) {
            el.style.transform = '';
            el.style.backgroundColor = '';
          }
        });
      });
    },

    clickSoundFX: () => {
      Logger.inject('INJECTS', 'Executing inject: clickSoundFX');
      const handleClick = (e) => {
        if (Utils.isFuckeryElement(e.target)) return;

        try {
          const audio = new AudioContext();
          const oscillator = audio.createOscillator();
          const gainNode = audio.createGain();

          oscillator.connect(gainNode);
          gainNode.connect(audio.destination);

          oscillator.frequency.value = Utils.random.int(200, 800);
          oscillator.type = Utils.random.choice(['sine', 'square', 'triangle', 'sawtooth']);
          gainNode.gain.setValueAtTime(0.1, audio.currentTime);
          gainNode.gain.exponentialRampToValueAtTime(0.01, audio.currentTime + 0.2);

          oscillator.start();
          oscillator.stop(audio.currentTime + 0.2);
        } catch (e) {
          // Audio might not be available
        }
      };

      document.addEventListener('click', handleClick);
      InjectManager.add('Click Sound FX Inject', () => {
        document.removeEventListener('click', handleClick);
      });
    },

    // NEW CHAOS & FUN INJECTS
    chaos: () => {
      Logger.inject('INJECTS', 'Executing inject: chaos');
      const effects = [
        () => Utils.getNonFuckeryElements().forEach(n => {
          if (n instanceof HTMLElement && Math.random() > 0.8) {
            n.style.backgroundColor = Utils.random.color();
            n.style.color = Utils.random.color();
            n.style.transform = `rotate(${Math.random() * 360}deg)`;
          }
        }),
        () => Utils.getNonFuckeryElements().forEach(n => {
          if (n.nodeType === 3 && n.textContent.trim() && Math.random() > 0.95) {
            n.textContent = Utils.random.text(n.textContent.length);
          }
        }),
        () => {
          const body = Utils.getNonFuckeryElements('body')[0];
          if (body) body.style.filter = `hue-rotate(${Math.random() * 360}deg) saturate(${1 + Math.random() * 2})`;
        }
      ];
      const interval = setInterval(() => {
        Utils.random.choice(effects)();
      }, 100);
      InjectManager.add('Chaos Mode Inject', () => clearInterval(interval));
      setTimeout(() => InjectManager.remove('Chaos Mode Inject'), 10000);
    },

    cssMeltdown: () => {
      Logger.inject('INJECTS', 'Executing inject: cssMeltdown');
      const originalRules = new Map();
      try {
        for (const sheet of document.styleSheets) {
          try {
            for (const rule of sheet.cssRules) {
              if (rule.style) {
                originalRules.set(rule, rule.style.cssText);
                const propertiesToMelt = ['color', 'backgroundColor', 'fontSize', 'transform', 'borderRadius', 'opacity', 'filter', 'border', 'padding', 'margin'];
                propertiesToMelt.forEach(prop => {
                  if (rule.style[prop] !== undefined) {
                    let randomValue = '';
                    switch (prop) {
                      case 'color':
                      case 'backgroundColor':
                        randomValue = Utils.random.color(); break;
                      case 'fontSize':
                        randomValue = `${Utils.random.int(5, 40)}px`; break;
                      case 'transform':
                        randomValue = `rotate(${Utils.random.int(-360, 360)}deg) scale(${Math.random() * 2}) skew(${Utils.random.int(-45, 45)}deg)`; break;
                      case 'borderRadius':
                        randomValue = `${Utils.random.int(0, 50)}%`; break;
                      case 'opacity':
                        randomValue = Math.random().toFixed(2); break;
                      case 'filter':
                        randomValue = `hue-rotate(${Utils.random.int(0, 360)}deg) blur(${Utils.random.int(0, 5)}px) saturate(${Math.random() * 5})`; break;
                      case 'border':
                        randomValue = `${Utils.random.int(1, 10)}px ${Utils.random.choice(['solid', 'dotted', 'dashed'])} ${Utils.random.color()}`; break;
                      case 'padding':
                      case 'margin':
                        randomValue = `${Utils.random.int(0, 50)}px`; break;

                    }
                    try {
                      rule.style[prop] = randomValue;
                    } catch (e) { /* Some properties might be readonly */ }
                  }
                });
              }
            }
          } catch (e) {
            Logger.warn('INJECTS', 'Could not access stylesheet due to CORS', { href: sheet.href });
          }
        }
      } catch (e) {
        Logger.error('INJECTS', 'Error during CSS Meltdown', { error: e.message });
      }

      InjectManager.add('CSS Meltdown Inject', () => {
        originalRules.forEach((cssText, rule) => {
          try {
            rule.style.cssText = cssText;
          } catch (e) {
            // Can't restore, oh well
          }
        });
      });
    },

    pureChaos: () => {
      Logger.inject('INJECTS', 'Executing inject: pureChaos');
      const interval = setInterval(() => {
        const injects = [Injects.colorChaos, Injects.gibberish, () => {
          const body = Utils.getNonFuckeryElements('body')[0];
          if (body) body.style.filter = `hue-rotate(${Math.random() * 360}deg) saturate(${1 + Math.random() * 3}) brightness(${0.5 + Math.random()})`;
        }];
        Utils.random.choice(injects)();
      }, 50);
      InjectManager.add('Pure Chaos Inject', () => clearInterval(interval));
    },

    // Destructive injects
    nuke: () => {
      Logger.inject('INJECTS', 'Executing inject: nuke');
      try {
        Utils.getNonFuckeryElements().forEach(el => {
          try {
            if (el !== document.body && el !== document.documentElement && el.parentNode) {
              el.remove();
            }
          } catch (e) {
            // Skip elements that can't be removed
          }
        });
      } catch (e) {
        Logger.error('INJECTS', 'Error in nuke', { error: e.message });
      }
    },

    hijackLinks: () => {
      Logger.inject('INJECTS', 'Executing inject: hijackLinks');
      const rickrollUrl = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ';
      const originalHrefs = new Map();
      const applyHijack = () => {
        Utils.getNonFuckeryElements('a').forEach(link => {
          if (!originalHrefs.has(link)) {
            originalHrefs.set(link, link.href);
          }
          link.href = rickrollUrl;
          link.target = '_blank';
        });
      };
      applyHijack();
      const interval = setInterval(applyHijack, 1000);
      InjectManager.add('Link Hijack Inject', () => {
        clearInterval(interval);
        originalHrefs.forEach((original, link) => {
          if (link) {
            link.href = original;
            link.target = '';
          }
        });
      });
    },

    deleteEverything: async () => {
      Logger.inject('INJECTS', 'Executing inject: deleteEverything');
      const confirmed = await Modal.confirm('This will delete everything on the page except FuckeryMenu. Continue?');
      if (confirmed) {
        Utils.getNonFuckeryElements().forEach(el => {
          if (el !== document.body && el !== document.documentElement) {
            el.remove();
          }
        });
        document.body.innerHTML = '<h1 style="text-align:center;color:red;font-size:3rem;margin-top:20vh;">EVERYTHING HAS BEEN DELETED LOL</h1>' +
        document.getElementById('__FuckeryMenuPanel').outerHTML;
      }
    },

    // Fun injects
    rickroll: () => {
      Logger.inject('INJECTS', 'Executing inject: rickroll');
      const overlay = document.createElement('div');
      overlay.style.cssText = `
      position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
      background: rgba(0,0,0,0.9); z-index: 2147483646;
      display: flex; justify-content: center; align-items: center; flex-direction: column;
      `;

      const iframe = document.createElement('iframe');
      iframe.src = 'https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1';
      iframe.style.cssText = 'width: 80%; height: 60%; border: none;';

      const closeBtn = document.createElement('button');
      closeBtn.textContent = 'Close (You got rickrolled!)';
      closeBtn.style.cssText = `
      margin-top: 20px; padding: 12px 24px; background: #ff4444; color: white;
      border: none; border-radius: 6px; cursor: pointer; font-size: 16px;
      `;
      closeBtn.onclick = () => overlay.remove();

      overlay.appendChild(iframe);
      overlay.appendChild(closeBtn);
      document.body.appendChild(overlay);

      setTimeout(() => overlay.remove(), 30000);
      console.log('Rickrolled!');
    },

    damnIs: () => {
      Logger.inject('INJECTS', 'Executing inject: damn is 😂🎉');
      const newText = "damn is 😂🎉";
      const newImage = "https://tse4.mm.bing.net/th/id/OIP.TXbl9mWCuqhnvOX94G_YKgAAAA?pid=ImgDet&w=198&h=157&c=7&o=7&rm=3";

      const originalTexts = new Map();
      const originalImages = new Map();

      const processElements = () => {
        // Process text
        const walker = document.createTreeWalker(
          document.body,
          NodeFilter.SHOW_TEXT,
          {
            acceptNode: (node) => {
              return Utils.isFuckeryElement(node.parentElement) ?
              NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT;
            }
          }
        );

        let node;
        while (node = walker.nextNode()) {
          if (node.textContent.trim()) {
            if (!originalTexts.has(node)) {
              originalTexts.set(node, node.textContent);
            }
            node.textContent = newText;
          }
        }

        // Process images
        Utils.getNonFuckeryElements('img').forEach(img => {
          if (!originalImages.has(img)) {
            originalImages.set(img, img.src);
          }
          img.src = newImage;
        });
      };

      processElements();
      const interval = setInterval(processElements, 200);

      InjectManager.add('damn is 😂🎉 Inject', () => {
        clearInterval(interval);
        originalTexts.forEach((original, node) => {
          if (node && node.parentNode) {
            node.textContent = original;
          }
        });
        originalImages.forEach((original, img) => {
          if (img) {
            img.src = original;
          }
        });
      });
    },

    // NEW CHAOS & FUN INJECTS
    nuclearChaos: async () => {
      Logger.inject('INJECTS', 'Executing inject: nuclearChaos');

      const confirmed = await Modal.confirm(
        '⚠️ WARNING: This will activate ALL injects at once!\n\n' +
        'This may crash your browser or make the page unusable.\n\n' +
        'Continue at your own risk!',
        'Nuclear Chaos'
      );

      if (!confirmed) return;

      Logger.warn('NUCLEAR', 'Activating NUCLEAR CHAOS MODE - ALL INJECTS FIRING');

      // Activate all text injects
      Injects.allCaps();
      setTimeout(() => Injects.comicSans(), 100);
      setTimeout(() => Injects.rainbowText(), 200);
      setTimeout(() => Injects.leetSpeak(), 300);
      setTimeout(() => Injects.shadowText(), 400);
      setTimeout(() => Injects.cursiveFont(), 500);

      // Activate all visual injects
      setTimeout(() => Injects.shake(), 600);
      setTimeout(() => Injects.spin(), 700);
      setTimeout(() => Injects.glitch(), 800);
      setTimeout(() => Injects.colorChaos(), 900);
      setTimeout(() => Injects.disco(), 1000);
      setTimeout(() => Injects.waveMotion(), 1100);
      setTimeout(() => Injects.shrinkGrow(), 1200);
      setTimeout(() => Injects.neonGlow(), 1300);
      setTimeout(() => Injects.hueCycle(), 1400);
      setTimeout(() => Injects.bouncyElements(), 1500);

      // Activate interactive injects
      setTimeout(() => Injects.clickExplode(), 1600);
      setTimeout(() => Injects.mouseTrail(), 1700);
      setTimeout(() => Injects.hoverMagnet(), 1800);
      setTimeout(() => Injects.clickSoundFX(), 1900);

      // Activate fun/chaos injects
      setTimeout(() => Injects.michaelCheese(), 2000);
      setTimeout(() => Injects.spinningFishBackground(), 2100);
      setTimeout(() => Injects.vaporwave(), 2200);
      setTimeout(() => Injects.drunkMode(), 2300);
      setTimeout(() => Injects.alienInvasion(), 2400);
      setTimeout(() => Injects.partyMode(), 2500);

      // Final warning
      setTimeout(() => {
        Modal.alert(
          '💀 NUCLEAR CHAOS ACTIVATED 💀\n\n' +
          'May your browser rest in peace.\n\n' +
          'Press F8 and go to the "Injects" tab to stop individual injects,\n' +
          'or use "Reset All" from the Actions tab.'
        );
      }, 3000);

      Logger.warn('NUCLEAR', 'Nuclear Chaos Mode fully activated');
    },

    retroMode: () => {
      Logger.inject('INJECTS', 'Executing inject: retroMode');
      Styles.addGlobal('retro', `
      @keyframes retro-scan {
        0% { transform: translateY(-100vh); }
        100% { transform: translateY(100vh); }
      }
      `);

      const originalStyles = new Map();

      Utils.getNonFuckeryElements().forEach(el => {
        if (el instanceof HTMLElement) {
          try {
            originalStyles.set(el, {
              filter: el.style.filter,
              fontFamily: el.style.fontFamily
            });

            el.style.filter = 'contrast(1.5) saturate(0.8) sepia(0.3)';
            el.style.fontFamily = '"Courier New", monospace';
          } catch (e) {
            // Skip problematic elements
          }
        }
      });

      const scanline = Utils.createElement('div', {
        className: 'fuckery-element',
        style: {
          position: 'fixed',
          top: '0',
          left: '0',
          width: '100vw',
          height: '2px',
          backgroundColor: 'rgba(0, 123, 255, 0.3)',
                                           zIndex: '999999',
                                           pointerEvents: 'none',
                                           animation: 'retro-scan 2s linear infinite'
        }
      });

      document.body.appendChild(scanline);
      document.body.style.backgroundColor = '#001122';

      InjectManager.add('Retro Mode Inject', () => {
        originalStyles.forEach((originalStyle, el) => {
          try {
            if (el && el.style) {
              Object.assign(el.style, originalStyle);
            }
          } catch (e) {
            // Element might have been removed
          }
        });
        document.body.style.backgroundColor = '';
        scanline.remove();
        Styles.removeGlobal('retro');
      });
    },

    partyMode: () => {
      Logger.inject('INJECTS', 'Executing inject: partyMode');
      const colors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff'];
      let colorIndex = 0;

      const partyEffect = () => {
        document.body.style.backgroundColor = colors[colorIndex % colors.length];
        colorIndex++;

        Utils.getNonFuckeryElements().forEach(el => {
          if (el instanceof HTMLElement && Math.random() > 0.5) {
            el.style.color = Utils.random.choice(colors);
            el.style.transform = `scale(${0.8 + Math.random() * 0.4}) rotate(${Utils.random.int(-5, 5)}deg)`;
          }
        });

        // Party emojis
        if (Math.random() > 0.8) {
          const emoji = Utils.createElement('div', {
            textContent: Utils.random.choice(['🎉', '🎊', '🕺', '💃', '🎈', '🎆']),
                                            className: 'fuckery-element',
                                            style: {
                                              position: 'fixed',
                                              top: Utils.random.int(0, window.innerHeight) + 'px',
                                            left: Utils.random.int(0, window.innerWidth) + 'px',
                                            fontSize: '40px',
                                            pointerEvents: 'none',
                                            zIndex: '999999',
                                            animation: 'cheeseFall 3s linear forwards'
                                            }
          });
          document.body.appendChild(emoji);
          setTimeout(() => emoji.remove(), 3000);
        }
      };

      const interval = setInterval(partyEffect, 200);
      InjectManager.add('Party Mode Inject', () => {
        clearInterval(interval);
        document.body.style.backgroundColor = '';
        Utils.getNonFuckeryElements().forEach(el => {
          if (el instanceof HTMLElement) {
            el.style.color = '';
            el.style.transform = '';
          }
        });
      });
    },

    alienInvasion: () => {
      Logger.inject('INJECTS', 'Executing inject: alienInvasion');
      const createUFO = () => {
        const ufo = Utils.createElement('div', {
          textContent: '🛸',
          className: 'fuckery-element',
          style: {
            position: 'fixed',
            top: Utils.random.int(0, window.innerHeight / 2) + 'px',
                                        left: '-100px',
                                        fontSize: '60px',
                                        zIndex: '999999',
                                        pointerEvents: 'none',
                                        animation: 'ufo-fly 5s linear forwards'
          }
        });

        Styles.addGlobal('alien', `
        @keyframes ufo-fly {
          0% { left: -100px; }
          100% { left: ${window.innerWidth + 100}px; }
        }
        `);

        document.body.appendChild(ufo);

        // Abduction effect
        setTimeout(() => {
          const elements = Utils.getNonFuckeryElements();
          if (elements.length > 0) {
            const target = Utils.random.choice(elements);
            if (target instanceof HTMLElement) {
              target.style.transform = 'translateY(-1000px) scale(0.1)';
              target.style.transition = 'transform 2s ease-in';
              setTimeout(() => target.remove(), 2000);
            }
          }
        }, 2500);

        setTimeout(() => ufo.remove(), 5000);
      };

      const invasionInterval = setInterval(createUFO, 3000);
      document.body.style.backgroundColor = '#001133';

      InjectManager.add('Alien Invasion Inject', () => {
        clearInterval(invasionInterval);
        document.body.style.backgroundColor = '';
        Utils.$$('.fuckery-element').forEach(el => {
          if (el.textContent === '🛸') el.remove();
        });
          Styles.removeGlobal('alien');
      });
    },

    timeWarp: () => {
      Logger.inject('INJECTS', 'Executing inject: timeWarp');
      const startTime = Date.now();

      const warpEffect = () => {
        const elapsed = (Date.now() - startTime) / 1000;
        const warpFactor = Math.sin(elapsed) * 0.5 + 1;

        Utils.getNonFuckeryElements().forEach((el, index) => {
          if (el instanceof HTMLElement) {
            const delay = index * 0.1;
            const scale = warpFactor + Math.sin(elapsed + delay) * 0.3;
            const skew = Math.sin(elapsed * 2 + delay) * 10;
            el.style.transform = `scale(${scale}) skew(${skew}deg)`;
            el.style.filter = `hue-rotate(${elapsed * 50}deg)`;
          }
        });
      };

      const interval = setInterval(warpEffect, 50);
      InjectManager.add('Time Warp Inject', () => {
        clearInterval(interval);
        Utils.getNonFuckeryElements().forEach(el => {
          if (el instanceof HTMLElement) {
            el.style.transform = '';
            el.style.filter = '';
          }
        });
      });
    },

    dimensionShift: () => {
      Logger.inject('INJECTS', 'Executing inject: dimensionShift');
      Styles.addGlobal('dimension', `
      @keyframes dimension-shift {
        0% { transform: perspective(1000px) rotateX(0deg) rotateY(0deg); }
        25% { transform: perspective(1000px) rotateX(180deg) rotateY(90deg); }
        50% { transform: perspective(1000px) rotateX(360deg) rotateY(180deg); }
        75% { transform: perspective(1000px) rotateX(180deg) rotateY(270deg); }
        100% { transform: perspective(1000px) rotateX(360deg) rotateY(360deg); }
      }
      `);

      Utils.getNonFuckeryElements().forEach(el => {
        if (el instanceof HTMLElement) {
          try {
            el.style.animation = 'dimension-shift 4s ease-in-out infinite';
            el.style.transformStyle = 'preserve-3d';
          } catch (e) {
            // Skip problematic elements
          }
        }
      });

      InjectManager.add('Dimension Shift Inject', () => {
        Utils.getNonFuckeryElements().forEach(el => {
          if (el instanceof HTMLElement) {
            el.style.animation = '';
            el.style.transformStyle = '';
          }
        });
        Styles.removeGlobal('dimension');
      });
    },

    // NEW DESTRUCTIVE INJECTS
    elementVanish: () => {
      Logger.inject('INJECTS', 'Executing inject: elementVanish');
      const elements = Utils.getNonFuckeryElements();
      let index = 0;

      const vanishNext = () => {
        if (index < elements.length) {
          const el = elements[index];
          if (el && el.parentNode) {
            el.style.opacity = '0';
            el.style.transform = 'scale(0)';
            el.style.transition = 'all 0.5s ease-out';
            setTimeout(() => {
              if (el.parentNode) el.remove();
            }, 500);
          }
          index++;
        }
      };

      const interval = setInterval(vanishNext, 200);
      setTimeout(() => clearInterval(interval), elements.length * 200 + 1000);
    },

    slowDelete: () => {
      Logger.inject('INJECTS', 'Executing inject: slowDelete');
      const elements = Utils.getNonFuckeryElements();
      let index = 0;

      const deleteNext = () => {
        if (index < elements.length) {
          const el = elements[index];
          if (el && el.parentNode && el !== document.body && el !== document.documentElement) {
            el.style.backgroundColor = '#ff0000';
            el.style.color = '#ffffff';
            el.style.animation = 'pulse 0.5s ease-in-out 3';
            setTimeout(() => {
              if (el.parentNode) el.remove();
            }, 1500);
          }
          index++;
        }
      };

      Styles.addGlobal('slowdelete', `
      @keyframes pulse {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.5; }
      }
      `);

      const interval = setInterval(deleteNext, 1000);
      setTimeout(() => {
        clearInterval(interval);
        Styles.removeGlobal('slowdelete');
      }, elements.length * 1000 + 2000);
    },

    // NEW UTILITY INJECTS
    screenshotMode: () => {
      Logger.inject('INJECTS', 'Executing inject: screenshotMode');
      // Hide all fuckery elements temporarily
      Utils.$$('.fuckery-element').forEach(el => {
        el.style.display = 'none';
      });

      setTimeout(() => {
        Modal.alert('Screenshot mode activated! All FuckeryMenu elements are hidden. Refresh to restore.');
      }, 100);
    },

    performanceTest: () => {
      Logger.inject('INJECTS', 'Executing inject: performanceTest');
      const startTime = performance.now();
      let frameCount = 0;

      const testFrame = () => {
        frameCount++;
        Utils.getNonFuckeryElements().forEach(el => {
          if (el instanceof HTMLElement && Math.random() > 0.95) {
            el.style.backgroundColor = Utils.random.color();
          }
        });

        if (frameCount < 100) {
          requestAnimationFrame(testFrame);
        } else {
          const endTime = performance.now();
          const fps = Math.round(frameCount / ((endTime - startTime) / 1000));
          Modal.alert(`Performance Test Complete!\nFrames: ${frameCount}\nTime: ${Math.round(endTime - startTime)}ms\nAverage FPS: ${fps}`);
        }
      };

      requestAnimationFrame(testFrame);
    },

    elementCounter: () => {
      Logger.inject('INJECTS', 'Executing inject: elementCounter');
      const counts = {
        total: document.querySelectorAll('*').length,
 divs: document.querySelectorAll('div').length,
 spans: document.querySelectorAll('span').length,
 images: document.querySelectorAll('img').length,
 links: document.querySelectorAll('a').length,
 buttons: document.querySelectorAll('button').length,
 inputs: document.querySelectorAll('input').length,
 scripts: document.querySelectorAll('script').length,
 styles: document.querySelectorAll('style, link[rel="stylesheet"]').length
      };

      const report = Object.entries(counts)
      .map(([type, count]) => `${type}: ${count}`)
      .join('\n');

      Modal.alert(`Element Count Report:\n\n${report}`, 'Element Counter');
    },

    colorPicker: () => {
      Logger.inject('INJECTS', 'Executing inject: colorPicker');
      let isActive = false;

      const handleClick = (e) => {
        if (Utils.isFuckeryElement(e.target)) return;
        e.preventDefault;

        const computedStyle = getComputedStyle(e.target);
        const bgColor = computedStyle.backgroundColor;
        const textColor = computedStyle.color;

        Modal.alert(`Element Colors:\nBackground: ${bgColor}\nText: ${textColor}\n\nClick any element to pick its colors!`);
      };

      const toggle = () => {
        isActive = !isActive;
        document.body.style.cursor = isActive ? 'crosshair' : '';

        if (isActive) {
          document.addEventListener('click', handleClick, true);
          Modal.alert('Color Picker activated! Click any element to see its colors.');
        } else {
          document.removeEventListener('click', handleClick, true);
        }
      };

      toggle();

      InjectManager.add('Color Picker Inject', () => {
        if (isActive) {
          document.removeEventListener('click', handleClick, true);
          document.body.style.cursor = '';
        }
      });
    },

    // Utility injects
    reset: () => {
      Logger.inject('INJECTS', 'Executing inject: reset');
      InjectManager.removeAll();
      // Remove all fuckery styles - but only from body, not our container
      Utils.$$('.fuckery-element', document.body).forEach(el => {
        el.remove();
      });
      // Clear any global filters
      document.body.style.filter = '';
      document.body.style.backgroundColor = '';
      document.body.style.animation = '';
      // Refresh page if needed
      setTimeout(() => location.reload(), 1000);
    }
  };

  // Style manager
  const Styles = {
    injected: new Set(),

 addGlobal: (id, css) => {
   if (Styles.injected.has(id)) return;
   const style = Utils.createElement('style', {
     attributes: { id: `fuckery-style-${id}` },
     textContent: css
   });
   document.head.appendChild(style);
   Styles.injected.add(id);
 },

 removeGlobal: (id) => {
   const style = document.getElementById(`fuckery-style-${id}`);
   if (style) {
     style.remove();
     Styles.injected.delete(id);
   }
 }
  };

  // Snapshot manager for saving and restoring page state
  const SnapshotManager = {
    snapshots: [],
    maxSnapshots: 10,

    capture: (label = 'Auto Snapshot') => {
      Logger.info('SNAPSHOT', `Capturing snapshot: ${label}`);
      try {
        const htmlString = document.documentElement.innerHTML;
        const compressedHtml = pako.deflate(htmlString); // Compress HTML using pako

        const snapshot = {
          id: Date.now(),
 label,
 timestamp: new Date().toISOString(),
 compressedHtml: compressedHtml,
 styles: {
   body: {
     filter: document.body.style.filter,
     backgroundColor: document.body.style.backgroundColor,
     animation: document.body.style.animation,
     transform: document.body.style.transform,
     cursor: document.body.style.cursor
   }
 },
 runningInjects: Array.from(InjectManager.running.keys())
        };

        SnapshotManager.snapshots.push(snapshot);

        // Keep only the most recent snapshots
        if (SnapshotManager.snapshots.length > SnapshotManager.maxSnapshots) {
          SnapshotManager.snapshots.shift();
        }

        Logger.info('SNAPSHOT', `Snapshot captured successfully`, {
          id: snapshot.id,
          originalSize: htmlString.length,
          compressedSize: compressedHtml.length,
          compressionRatio: (htmlString.length / compressedHtml.length).toFixed(2) + 'x',
                    totalSnapshots: SnapshotManager.snapshots.length
        });

        EventBus.emit('snapshot:created', { snapshot });
        return snapshot;
      } catch (e) {
        Logger.error('SNAPSHOT', 'Failed to capture snapshot', { error: e.message });
        return null;
      }
    },

    restore: (snapshotId) => {
      Logger.info('SNAPSHOT', `Restoring snapshot: ${snapshotId}`);
      try {
        const snapshot = SnapshotManager.snapshots.find(s => s.id === snapshotId);
        if (!snapshot) {
          throw new Error('Snapshot not found');
        }

        // Stop all running injects first
        InjectManager.removeAll();

        // Decompress HTML
        if (!snapshot.compressedHtml) {
          throw new Error('Snapshot data is invalid or corrupted (missing compressed HTML)');
        }
        const restoredHtml = pako.inflate(snapshot.compressedHtml, { to: 'string' });

        // Restore HTML (preserving the FuckeryMenu)
        const fuckeryContainer = document.getElementById('__FuckeryMenuContainer');
        const fuckeryContainerHTML = fuckeryContainer ? fuckeryContainer.outerHTML : '';

        document.documentElement.innerHTML = restoredHtml;

        // Re-inject the FuckeryMenu if it was removed
        if (fuckeryContainerHTML && !document.getElementById('__FuckeryMenuContainer')) {
          document.body.insertAdjacentHTML('beforeend', fuckeryContainerHTML);
        }

        // Restore styles
        Object.assign(document.body.style, snapshot.styles.body);

        // Clear any leftover fuckery elements
        Utils.$$('.fuckery-element').forEach(el => {
          if (el.id !== '__FuckeryMenuContainer' && el.id !== '__FuckeryMenuPanel') {
            el.remove();
          }
        });

        Logger.info('SNAPSHOT', `Snapshot restored successfully`, {
          id: snapshot.id,
          label: snapshot.label
        });

        Modal.alert(`Snapshot "${snapshot.label}" restored!`);
        EventBus.emit('snapshot:restored', { snapshot });
      } catch (e) {
        Logger.error('SNAPSHOT', 'Failed to restore snapshot', { error: e.message });
        Modal.alert('Error restoring snapshot: ' + e.message);
      }
    },

    delete: (snapshotId) => {
      Logger.info('SNAPSHOT', `Deleting snapshot: ${snapshotId}`);
      const index = SnapshotManager.snapshots.findIndex(s => s.id === snapshotId);
      if (index !== -1) {
        const snapshot = SnapshotManager.snapshots[index];
        SnapshotManager.snapshots.splice(index, 1);
        Logger.info('SNAPSHOT', `Snapshot deleted`, { id: snapshotId, label: snapshot.label });
        EventBus.emit('snapshot:deleted', { snapshotId });
      }
    },

    clear: () => {
      Logger.info('SNAPSHOT', 'Clearing all snapshots');
      SnapshotManager.snapshots = [];
      EventBus.emit('snapshot:cleared');
    },

    list: () => {
      return [...SnapshotManager.snapshots];
    }
  };

  // Main UI class
  class FuckeryMenuUI {
    constructor() {
      this.container = null;
      this.fuckeryRoot = null;
      this.activeTab = 'actions';
      this.isVisible = false;
      this.zIndex = 2147483640;
      this.tabs = new Map();
      this.version = CONFIG.VER;

      Logger.ui('INIT', 'Initializing FuckeryMenu UI');
      this.init();
    }

    init() {
      Logger.debug('UI', 'Starting UI initialization');
      this.createFuckeryRoot();
      this.createContainer();
      this.setupTabs();
      this.setupDragging();
      this.setupKeyboardShortcuts();
      EventBus.on('inject:started', () => this.refreshRunningInjectsTab());
      EventBus.on('inject:stopped', () => this.refreshRunningInjectsTab());
      Logger.ui('INIT', 'UI initialization complete');
    }

    createFuckeryRoot() {
      Logger.debug('UI', 'Creating fuckery root container');

      // Create a completely separate root container
      this.fuckeryRoot = Utils.createElement('div', {
        attributes: { id: '__FuckeryMenuContainer' },
        className: 'fuckery-element',
        style: {
          position: 'fixed',
          top: '0',
          left: '0',
          width: '100vw',
          height: '100vh',
          pointerEvents: 'none',
          zIndex: '999999',
          overflow: 'visible'
        }
      });

      // Normal injection
      document.body.appendChild(this.fuckeryRoot);
      Logger.debug('UI', 'Normal injection to document.body');

      Logger.debug('UI', 'Fuckery root container created and attached');
    }

    createContainer() {
      Logger.debug('UI', 'Creating main menu container');
      this.container = Utils.createElement('div', {
        attributes: { id: '__FuckeryMenuPanel' },
        className: 'fuckery-element',
        style: {
          position: 'absolute',
          right: '20px',
          bottom: '20px',
          width: '800px',
          height: '600px',
          backgroundColor: '#1a1a1a',
          border: '1px solid #333',
          borderRadius: '12px',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.8)',
                                           zIndex: '1',
                                           display: 'none',
                                           flexDirection: 'column',
                                           fontFamily: 'system-ui, -apple-system, sans-serif',
                                           color: '#e0e0e0',
                                           overflow: 'hidden',
                                           backdropFilter: 'blur(10px)',
                                           pointerEvents: 'auto'
        }
      });

      // Header
      const header = Utils.createElement('div', {
        style: {
          padding: '16px 20px',
          background: 'linear-gradient(135deg, #2d2d2d 0%, #1e1e1e 100%)',
                                         borderBottom: '1px solid #333',
                                         display: 'flex',
                                         justifyContent: 'space-between',
                                         alignItems: 'center',
                                         cursor: 'move',
                                         userSelect: 'none'
        }
      });

      const title = Utils.createElement('div', {
        style: { fontSize: '16px', fontWeight: '600' }
      });
      const titleStrong = Utils.createElement('strong', {
        textContent: 'FuckeryMenu'
      });
      const titleVersion = Utils.createElement('span', {
        textContent: ` v${this.version}`,
        style: { color: '#666', fontSize: '12px' }
      });
      title.appendChild(titleStrong);
      title.appendChild(titleVersion);

      const headerControls = Utils.createElement('div', {
        style: {
          display: 'flex',
          gap: '8px',
          alignItems: 'center'
        }
      });

      const closeBtn = Utils.createElement('button', {
        textContent: '✕',
        style: {
          background: 'transparent',
          border: '1px solid #555',
          color: '#ccc',
          padding: '6px 10px',
          cursor: 'pointer',
          borderRadius: '4px',
          fontSize: '14px'
        },
        events: {
          click: () => {
            Logger.ui('UI', 'Menu close button clicked');
            this.hide();
          }
        }
      });

      headerControls.appendChild(closeBtn);
      header.appendChild(title);
      header.appendChild(headerControls);
      this.container.appendChild(header);
      this.header = header;

      // Main content area with log panel on left and menu on right
      const mainContent = Utils.createElement('div', {
        style: {
          flex: '1',
          display: 'flex',
          overflow: 'hidden'
        }
      });

      // Log panel on the left
      const logPanel = Utils.createElement('div', {
        attributes: { id: 'logPanel' },
        style: {
          width: '300px',
          display: 'flex',
          flexDirection: 'column',
          borderRight: '1px solid #333',
          backgroundColor: '#1e1e1e'
        }
      });

      const logHeader = Utils.createElement('div', {
        style: {
          padding: '12px 16px',
          backgroundColor: '#252525',
          borderBottom: '1px solid #333',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }
      });

      const logTitle = Utils.createElement('span', {
        textContent: '📝 Logs',
        style: {
          color: '#007bff',
          fontWeight: 'bold',
          fontSize: '14px'
        }
      });

      const logClearBtn = Utils.createElement('button', {
        textContent: '🗑️',
        style: {
          background: 'transparent',
          border: '1px solid #555',
          color: '#ccc',
          padding: '4px 8px',
          cursor: 'pointer',
          borderRadius: '3px',
          fontSize: '12px'
        },
        events: {
          click: () => Logger.clear()
        }
      });

      logHeader.appendChild(logTitle);
      logHeader.appendChild(logClearBtn);

      const logContainer = Utils.createElement('div', {
        className: 'log-entries',
        style: {
          flex: '1',
          overflow: 'auto',
          padding: '8px',
          fontSize: '11px',
          fontFamily: 'monospace'
        }
      });

      logPanel.appendChild(logHeader);
      logPanel.appendChild(logContainer);

      // Menu panel on the right
      const menuPanel = Utils.createElement('div', {
        style: {
          flex: '1',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden'
        }
      });

      // Tab container
      const tabContainer = Utils.createElement('div', {
        style: {
          display: 'flex',
          backgroundColor: '#252525',
          borderBottom: '1px solid #333',
          overflow: 'auto'
        }
      });
      menuPanel.appendChild(tabContainer);
      this.tabContainer = tabContainer;

      // Content area
      const content = Utils.createElement('div', {
        style: {
          flex: '1',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden'
        }
      });
      menuPanel.appendChild(content);
      this.content = content;

      mainContent.appendChild(logPanel);
      mainContent.appendChild(menuPanel);
      this.container.appendChild(mainContent);

      // Store reference to log container for updates
      this.logContainer = logContainer;

      // Append to fuckery root instead of document.body
      this.fuckeryRoot.appendChild(this.container);
      Logger.debug('UI', 'Main menu container created and attached');
    }

    setupTabs() {
      Logger.debug('UI', 'Setting up tabs');
      const tabDefinitions = [
        { id: 'actions', name: 'Actions', icon: '⚡' },
        { id: 'tweaker', name: 'Tweaker', icon: '🔧' },
        { id: 'injects', name: 'Injects', icon: '💉' },
        { id: 'snapshots', name: 'Snapshots', icon: '📸' },
        { id: 'custom', name: 'Custom', icon: '🛠️' },
        { id: 'utils', name: 'Utils', icon: '🔍' },
        { id: 'settings', name: 'Settings', icon: '⚙️' }
      ];

      tabDefinitions.forEach(tab => {
        const tabBtn = Utils.createElement('button', {
          innerHTML: `${tab.icon} ${tab.name}`,
          style: {
            padding: '12px 16px',
            border: 'none',
            background: 'transparent',
            color: '#999',
            cursor: 'pointer',
            fontSize: '13px',
            fontWeight: '500',
            borderBottom: '3px solid transparent',
            transition: 'all 0.2s ease'
          },
          events: {
            click: () => this.setActiveTab(tab.id)
          }
        });

        this.tabContainer.appendChild(tabBtn);
        this.tabs.set(tab.id, { element: tabBtn, ...tab });
      });

      this.setActiveTab('actions');
    }

    setActiveTab(tabId) {
      Logger.ui('TAB', `Setting active tab to: ${tabId}`);
      this.activeTab = tabId;

      // Update tab buttons
      this.tabs.forEach((tab, id) => {
        if (id === tabId) {
          Object.assign(tab.element.style, {
            color: '#fff',
            backgroundColor: '#007bff',
            borderBottomColor: '#0056b3'
          });
        } else {
          Object.assign(tab.element.style, {
            color: '#999',
            backgroundColor: 'transparent',
            borderBottomColor: 'transparent'
          });
        }
      });

      this.renderTabContent(tabId);
    }

    renderTabContent(tabId) {
      this.content.innerHTML = '';
      Logger.debug('TAB_RENDER', `Rendering content for tab: ${tabId}`);

      const contentArea = Utils.createElement('div', {
        style: {
          flex: '1',
          padding: '20px',
          overflow: 'auto'
        }
      });

      switch (tabId) {
        case 'actions':
          contentArea.appendChild(this.createActionsTab());
          break;
        case 'tweaker':
          contentArea.appendChild(this.createTweakerTab());
          break;
        case 'injects':
          contentArea.appendChild(this.createInjectsTab());
          break;
        case 'snapshots':
          contentArea.appendChild(this.createSnapshotsTab());
          break;
        case 'custom':
          contentArea.appendChild(this.createCustomTab());
          break;
        case 'utils':
          contentArea.appendChild(this.createUtilsTab());
          break;
        case 'settings':
          contentArea.appendChild(this.createSettingsTab());
          break;
      }

      this.content.appendChild(contentArea);
    }

    createActionsTab() {
      Logger.debug('TAB_RENDER', 'Creating Actions tab content');
      const container = Utils.createElement('div');

      const categories = [
        {
          name: 'Text Injects',
          actions: [
            { name: 'ALL CAPS', fn: Injects.allCaps, color: '#28a745' },
            { name: 'lowercase', fn: Injects.lowercase, color: '#17a2b8' },
            { name: 'Comic Sans', fn: Injects.comicSans, color: '#ff1493' },
            { name: 'Gibberish', fn: Injects.gibberish, color: '#ffc107' },
            { name: 'Random Text', fn: Injects.randomText, color: '#fd7e14' },
            { name: 'Invert Text', fn: Injects.invertText, color: '#6f42c1' },
            { name: 'Rainbow Text', fn: Injects.rainbowText, color: '#e83e8c' },
            { name: 'MICHAEL CHEESE', fn: Injects.michaelCheese, color: '#FFD700' },
            { name: 'Upside Down', fn: Injects.upsideDown, color: '#795548' },
            { name: 'Leet Speak', fn: Injects.leetSpeak, color: '#4caf50' },
            { name: 'Shadow Text', fn: Injects.shadowText, color: '#9c27b0' },
            { name: 'Typewriter', fn: Injects.typewriterText, color: '#607d8b' },
            { name: 'Cursive Font', fn: Injects.cursiveFont, color: '#8e24aa' },
            { name: 'Text to Emoji', fn: Injects.textToEmoji, color: '#ffc107'},
            { name: 'ASCII Art', fn: Injects.asciiArt, color: '#00ff00' },
            { name: 'Replace w/ Dogs', fn: Injects.replaceWithDogs, color: '#ff6b35' }
          ]
        },
        {
          name: 'Visual Injects',
          actions: [
            { name: 'Shake All', fn: Injects.shake, color: '#dc3545' },
            { name: 'Spin Everything', fn: Injects.spin, color: '#007bff' },
            { name: 'Glitch Inject', fn: Injects.glitch, color: '#6c757d' },
            { name: 'Color Chaos', fn: Injects.colorChaos, color: '#20c997' },
            { name: 'Invert Colors', fn: Injects.invertColors, color: '#fd7e14' },
            { name: 'Run From Mouse', fn: Injects.runFromMouse, color: '#6f42c1' },
            { name: 'Fling & Explode', fn: Injects.flingExplode, color: '#ff6b35' },
            { name: 'Random Positions', fn: Injects.randomPositions, color: '#9c27b0' },
            { name: 'Disco Mode', fn: Injects.disco, color: '#ff1493' },
            { name: 'Pixelate', fn: Injects.pixelate, color: '#8bc34a' },
            { name: 'Wave Motion', fn: Injects.waveMotion, color: '#00bcd4' },
            { name: 'Shrink & Grow', fn: Injects.shrinkGrow, color: '#ff9800' },
            { name: 'Spinning Fish BG', fn: Injects.spinningFishBackground, color: '#ff4081' },
            { name: 'Replace Images w/ Fish', fn: Injects.replaceImagesWithFish, color: '#00bcd4' },
            { name: 'Drunk Mode', fn: Injects.drunkMode, color: '#795548' },
            { name: 'Neon Glow', fn: Injects.neonGlow, color: '#e91e63' },
            { name: 'Sepia Tone', fn: Injects.sepiaFilter, color: '#8d6e63' },
            { name: 'Blur Bomb', fn: Injects.blurBomb, color: '#9e9e9e' },
            { name: 'Gravity Fall', fn: Injects.gravityFall, color: '#795548' },
            { name: 'Perspective Flip', fn: Injects.perspectiveFlip, color: '#607d8b' },
            { name: 'X-Ray Mode', fn: Injects.xrayMode, color: '#455a64' },
            { name: 'Hue Cycling', fn: Injects.hueCycle, color: '#ab47bc' },
            { name: 'Outline Mode', fn: Injects.outlineMode, color: '#26a69a' },
            { name: 'Shuffle Elements', fn: Injects.shuffleElements, color: '#ff6f00' },
            { name: 'Invert Colors Cycle', fn: Injects.invertColorsCycle, color: '#3f51b5' },
            { name: 'Zoom Chaos', fn: Injects.zoomChaos, color: '#e91e63' },
            { name: 'Flashbang', fn: Injects.flashbang, color: '#ffffff' },
            { name: 'Element Rain', fn: Injects.elementRain, color: '#2196f3' },
            { name: 'Rotate Screen', fn: Injects.rotateScreen, color: '#00bcd4' },
            { name: 'Mirror Page', fn: Injects.mirrorPage, color: '#9c27b0' },
            { name: 'Bouncy Elements', fn: Injects.bouncyElements, color: '#4caf50' },
            { name: 'Vaporwave', fn: Injects.vaporwave, color: '#ff71ce' },
            { name: 'Deep Fry', fn: Injects.deepFry, color: '#ff5722' }
          ]
        },
        {
          name: 'Interactive Injects',
          actions: [
            { name: 'Click Explode', fn: Injects.clickExplode, color: '#ff5722' },
            { name: 'Mouse Trail', fn: Injects.mouseTrail, color: '#e91e63' },
            { name: 'Hide Cursor', fn: Injects.hideCursor, color: '#6c757d' },
            { name: 'Konami Code', fn: Injects.konami, color: '#3f51b5' },
            { name: 'Hover Magnet', fn: Injects.hoverMagnet, color: '#9c27b0' },
            { name: 'Click Teleport', fn: Injects.clickTeleport, color: '#00bcd4' },
            { name: 'Keyboard DJ', fn: Injects.keyboardDJ, color: '#ff6f00' },
            { name: 'Mouse Repel', fn: Injects.mouseRepel, color: '#f44336' },
            { name: 'Double Click Nuke', fn: Injects.doubleClickNuke, color: '#d32f2f' },
            { name: 'Scroll Chaos', fn: Injects.scrollChaos, color: '#7b1fa2' },
            { name: 'Click Sound FX', fn: Injects.clickSoundFX, color: '#388e3c' }
          ]
        },
        {
          name: 'Chaos & Fun',
          actions: [
            { name: '☢️ NUCLEAR CHAOS', fn: Injects.nuclearChaos, color: '#ff0000' },
            { name: 'Chaos Mode', fn: Injects.chaos, color: '#ff5722' },
            { name: 'Pure Chaos', fn: Injects.pureChaos, color: '#d32f2f' },
            { name: 'damn is 😂🎉', fn: Injects.damnIs, color: '#ffeb3b' },
            { name: 'CSS Meltdown', fn: Injects.cssMeltdown, color: '#ff1493' },
            { name: 'Rickroll', fn: Injects.rickroll, color: '#e91e63' },
            { name: 'Retro Mode', fn: Injects.retroMode, color: '#ff6f00' },
            { name: 'Party Mode', fn: Injects.partyMode, color: '#e91e63' },
            { name: 'Alien Invasion', fn: Injects.alienInvasion, color: '#4caf50' },
            { name: 'Time Warp', fn: Injects.timeWarp, color: '#9c27b0' },
            { name: 'Dimension Shift', fn: Injects.dimensionShift, color: '#3f51b5' }
          ]
        },
        {
          name: 'Destructive Injects',
          actions: [
            { name: 'Nuke Page', fn: Injects.nuke, color: '#dc3545' },
            { name: 'Hijack Links', fn: Injects.hijackLinks, color: '#6f42c1' },
            { name: 'Delete Everything', fn: Injects.deleteEverything, color: '#721c24' },
            { name: 'Element Vanish', fn: Injects.elementVanish, color: '#8e24aa' },
            { name: 'Slow Delete', fn: Injects.slowDelete, color: '#d84315' }
          ]
        },
        {
          name: 'Utility',
          actions: [
            { name: 'Reset All', fn: Injects.reset, color: '#28a745' },
            { name: 'Screenshot Mode', fn: Injects.screenshotMode, color: '#17a2b8' },
            { name: 'Performance Test', fn: Injects.performanceTest, color: '#6c757d' },
            { name: 'Element Counter', fn: Injects.elementCounter, color: '#fd7e14' },
            { name: 'Color Picker', fn: Injects.colorPicker, color: '#20c997' },
            { name: 'Reload Page', fn: () => location.reload(), color: '#007bff' }
          ]
        }
      ];

      categories.forEach(category => {
        const categoryEl = Utils.createElement('div', {
          style: { marginBottom: '24px' }
        });

        const categoryTitle = Utils.createElement('h3', {
          textContent: category.name,
          style: {
            color: '#007bff',
            fontSize: '16px',
            fontWeight: '600',
            marginBottom: '12px',
            paddingBottom: '6px',
            borderBottom: '1px solid #333'
          }
        });
        categoryEl.appendChild(categoryTitle);

        const actionsGrid = Utils.createElement('div', {
          style: {
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
                                                gap: '8px'
          }
        });

        category.actions.forEach(action => {
          const btn = Utils.createElement('button', {
            textContent: action.name,
            style: {
              padding: '10px 12px',
              border: `1px solid ${action.color}`,
              borderRadius: '6px',
              backgroundColor: 'transparent',
              color: action.color,
              cursor: 'pointer',
              fontSize: '13px',
              fontWeight: '500',
              transition: 'all 0.2s ease'
            },
            events: {
              click: action.fn,
              mouseenter: function() {
                this.style.backgroundColor = action.color;
                this.style.color = '#fff';
              },
              mouseleave: function() {
                this.style.backgroundColor = 'transparent';
                this.style.color = action.color;
              }
            }
          });
          actionsGrid.appendChild(btn);
        });

        categoryEl.appendChild(actionsGrid);
        container.appendChild(categoryEl);
      });

      return container;
    }

    createTweakerTab() {
      Logger.debug('TAB_RENDER', 'Creating Tweaker tab content');
      const container = Utils.createElement('div');

      const header = Utils.createElement('div', {
        style: {
          marginBottom: '16px',
          display: 'flex',
          gap: '8px',
          alignItems: 'center'
        }
      });

      const title = Utils.createElement('h3', {
        textContent: 'Value Tweaker',
        style: {
          color: '#007bff',
          flex: '1'
        }
      });

      const captureBtn = Utils.createElement('button', {
        textContent: '📸 Capture Snapshot',
        style: {
          padding: '10px 20px',
          background: '#28a745',
          color: 'white',
          border: 'none',
          borderRadius: '6px',
          cursor: 'pointer',
          fontWeight: '600'
        },
        events: {
          click: async () => {
            const label = prompt('Enter a label for this snapshot:', `Snapshot ${SnapshotManager.snapshots.length + 1}`);
            if (label) {
              SnapshotManager.capture(label);
              this.refreshSnapshotsList(snapshotsList);
            }
          }
        }
      });

      const clearBtn = Utils.createElement('button', {
        textContent: '🗑️ Clear All',
        style: {
          padding: '10px 20px',
          background: '#dc3545',
          color: 'white',
          border: 'none',
          borderRadius: '6px',
          cursor: 'pointer',
          fontWeight: '600'
        },
        events: {
          click: async () => {
            const confirmed = await Modal.confirm('Delete all snapshots?');
            if (confirmed) {
              SnapshotManager.clear();
              this.refreshSnapshotsList(snapshotsList);
            }
          }
        }
      });

      header.appendChild(title);
      header.appendChild(captureBtn);
      header.appendChild(clearBtn);

      const info = Utils.createElement('div', {
        innerHTML: `
        <p style="color: #999; font-size: 13px; margin-bottom: 16px; padding: 12px; background: #252525; border-radius: 6px;">
        💡 <strong>Tip:</strong> A snapshot is automatically captured when you open the menu.
        You can create additional snapshots manually and restore them if you mess up the page.
        Snapshots are temporary and will be cleared on page reload.
        </p>
        `
      });

      const snapshotsList = Utils.createElement('div', {
        attributes: { id: 'snapshotsList' },
        style: {
          display: 'flex',
          flexDirection: 'column',
          gap: '8px'
        }
      });

      container.appendChild(header);
      container.appendChild(info);
      container.appendChild(snapshotsList);

      // Setup event listeners for auto-refresh
      EventBus.on('snapshot:created', () => this.refreshSnapshotsList(snapshotsList));
      EventBus.on('snapshot:deleted', () => this.refreshSnapshotsList(snapshotsList));
      EventBus.on('snapshot:cleared', () => this.refreshSnapshotsList(snapshotsList));

      this.refreshSnapshotsList(snapshotsList);
      return container;
    }

    createInjectsTab() {
      Logger.debug('TAB_RENDER', 'Creating Injects tab content');
      const container = Utils.createElement('div');

      const header = Utils.createElement('h3', {
        textContent: 'Running Injects',
        style: {
          color: '#007bff',
          marginBottom: '16px'
        }
      });

      const injectsList = Utils.createElement('div', {
        attributes: { id: 'injectsList' }
      });

      container.appendChild(header);
      container.appendChild(injectsList);

      this.refreshInjectsList(injectsList);
      return container;
    }

    createSnapshotsTab() {
      Logger.debug('TAB_RENDER', 'Creating Snapshots tab content');
      const container = Utils.createElement('div');

      const header = Utils.createElement('div', {
        style: {
          marginBottom: '16px',
          display: 'flex',
          gap: '8px',
          alignItems: 'center'
        }
      });

      const title = Utils.createElement('h3', {
        textContent: 'Page Snapshots',
        style: {
          color: '#007bff',
          flex: '1'
        }
      });

      const captureBtn = Utils.createElement('button', {
        textContent: '📸 Capture Snapshot',
        style: {
          padding: '10px 20px',
          background: '#28a745',
          color: 'white',
          border: 'none',
          borderRadius: '6px',
          cursor: 'pointer',
          fontWeight: '600'
        },
        events: {
          click: async () => {
            const label = prompt('Enter a label for this snapshot:', `Snapshot ${SnapshotManager.snapshots.length + 1}`);
            if (label) {
              SnapshotManager.capture(label);
              this.refreshSnapshotsList(snapshotsList);
            }
          }
        }
      });

      const clearBtn = Utils.createElement('button', {
        textContent: '🗑️ Clear All',
        style: {
          padding: '10px 20px',
          background: '#dc3545',
          color: 'white',
          border: 'none',
          borderRadius: '6px',
          cursor: 'pointer',
          fontWeight: '600'
        },
        events: {
          click: async () => {
            const confirmed = await Modal.confirm('Delete all snapshots?');
            if (confirmed) {
              SnapshotManager.clear();
              this.refreshSnapshotsList(snapshotsList);
            }
          }
        }
      });

      header.appendChild(title);
      header.appendChild(captureBtn);
      header.appendChild(clearBtn);

      const info = Utils.createElement('div', {
        innerHTML: `
        <p style="color: #999; font-size: 13px; margin-bottom: 16px; padding: 12px; background: #252525; border-radius: 6px;">
        💡 <strong>Tip:</strong> A snapshot is automatically captured when you open the menu.
        You can create additional snapshots manually and restore them if you mess up the page.
        Snapshots are temporary and will be cleared on page reload.
        </p>
        `
      });

      const snapshotsList = Utils.createElement('div', {
        attributes: { id: 'snapshotsList' },
        style: {
          display: 'flex',
          flexDirection: 'column',
          gap: '8px'
        }
      });

      container.appendChild(header);
      container.appendChild(info);
      container.appendChild(snapshotsList);

      // Setup event listeners for auto-refresh
      EventBus.on('snapshot:created', () => this.refreshSnapshotsList(snapshotsList));
      EventBus.on('snapshot:deleted', () => this.refreshSnapshotsList(snapshotsList));
      EventBus.on('snapshot:cleared', () => this.refreshSnapshotsList(snapshotsList));

      this.refreshSnapshotsList(snapshotsList);
      return container;
    }

    createCustomTab() {
      Logger.debug('TAB_RENDER', 'Creating Custom tab content');
      const container = Utils.createElement('div');

      container.innerHTML = `
      <h3 style="color: #007bff; margin-bottom: 16px;">Custom Actions</h3>
      <div style="background: #252525; padding: 16px; border-radius: 8px; margin-bottom: 16px;">
      <input type="text" id="actionName" placeholder="Action Name" style="width: 100%; padding: 8px; background: #1a1a1a; border: 1px solid #444; border-radius: 4px; color: white; margin-bottom: 8px;">
      <textarea id="actionCode" placeholder="JavaScript Code" style="width: 100%; height: 100px; padding: 8px; background: #1a1a1a; border: 1px solid #444; border-radius: 4px; color: white; font-family: monospace; margin-bottom: 8px; resize: vertical;"></textarea>
      <button id="addAction" style="padding: 8px 16px; background: #007bff; color: white; border: none; border-radius: 4px; cursor: pointer;">Add Action</button>
      </div>
      <div id="customActionsList"></div>
      `;

      // Add functionality
      setTimeout(() => {
        const addBtn = container.querySelector('#addAction');
        const nameInput = container.querySelector('#actionName');
        const codeInput = container.querySelector('#actionCode');
        const listEl = container.querySelector('#customActionsList');

        addBtn?.addEventListener('click', () => {
          const name = nameInput.value.trim();
          const code = codeInput.value.trim();
          if (name && code) {
            this.addCustomAction(name, code);
            nameInput.value = '';
            codeInput.value = '';
            this.refreshCustomActionsList(listEl);
          }
        });

        this.refreshCustomActionsList(listEl);
      }, 100);

      return container;
    }

    createUtilsTab() {
      Logger.debug('TAB_RENDER', 'Creating Utils tab content');
      const container = Utils.createElement('div');

      // PanelCracker section
      const panelCrackerSection = Utils.createElement('div', {
        style: { marginBottom: '32px' }
      });

      const header = Utils.createElement('h3', {
        textContent: 'PanelCracker',
        style: {
          color: '#007bff',
          marginBottom: '16px'
        }
      });

      const info = Utils.createElement('div', {
        style: {
          color: '#999',
          fontSize: '13px',
          marginBottom: '16px',
          padding: '12px',
          background: '#252525',
          borderRadius: '6px'
        }
      });

      const tipEmoji = document.createTextNode('🔍 ');
      const tipStrong = Utils.createElement('strong', {
        textContent: 'PanelCracker'
      });
      const tipText = document.createTextNode(' finds hidden divs on the page (display: none, visibility: hidden, etc.) and lets you show/hide them.');

      const tipPara = Utils.createElement('p', {
        style: { margin: '0' }
      });
      tipPara.appendChild(tipEmoji);
      tipPara.appendChild(tipStrong);
      tipPara.appendChild(tipText);
      info.appendChild(tipPara);

      const scanBtn = Utils.createElement('button', {
        textContent: '🔍 Scan for Hidden Divs',
        style: {
          padding: '10px 20px',
          background: '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '6px',
          cursor: 'pointer',
          fontWeight: '600',
          marginBottom: '16px'
        },
        events: {
          click: () => {
            Logger.info('UTILS', 'Scanning for hidden divs');
            this.scanHiddenDivs(hiddenDivsList);
          }
        }
      });

      const hiddenDivsList = Utils.createElement('div', {
        attributes: { id: 'hiddenDivsList' },
        style: {
          display: 'flex',
          flexDirection: 'column',
          gap: '8px'
        }
      });

      panelCrackerSection.appendChild(header);
      panelCrackerSection.appendChild(info);
      panelCrackerSection.appendChild(scanBtn);
      panelCrackerSection.appendChild(hiddenDivsList);

      // FunctionFinder section
      const functionFinderSection = Utils.createElement('div', {
        style: { marginBottom: '32px' }
      });

      const ffHeader = Utils.createElement('h3', {
        textContent: 'FunctionFinder',
        style: {
          color: '#007bff',
          marginBottom: '16px'
        }
      });

      const ffInfo = Utils.createElement('div', {
        style: {
          color: '#999',
          fontSize: '13px',
          marginBottom: '16px',
          padding: '12px',
          background: '#252525',
          borderRadius: '6px'
        }
      });

      const ffTipEmoji = document.createTextNode('⚡ ');
      const ffTipStrong = Utils.createElement('strong', {
        textContent: 'FunctionFinder'
      });
      const ffTipText = document.createTextNode(' discovers all accessible functions in the global scope and loaded scripts, allowing you to execute them directly.');

      const ffTipPara = Utils.createElement('p', {
        style: { margin: '0' }
      });
      ffTipPara.appendChild(ffTipEmoji);
      ffTipPara.appendChild(ffTipStrong);
      ffTipPara.appendChild(ffTipText);
      ffInfo.appendChild(ffTipPara);

      const ffScanBtn = Utils.createElement('button', {
        textContent: '⚡ Scan for Functions',
        style: {
          padding: '10px 20px',
          background: '#28a745',
          color: 'white',
          border: 'none',
          borderRadius: '6px',
          cursor: 'pointer',
          fontWeight: '600',
          marginBottom: '16px'
        },
        events: {
          click: () => {
            Logger.info('UTILS', 'Scanning for functions');
            this.scanFunctions(functionsList);
          }
        }
      });

      const functionsList = Utils.createElement('div', {
        attributes: { id: 'functionsList' },
        style: {
          display: 'flex',
          flexDirection: 'column',
          gap: '8px'
        }
      });

      functionFinderSection.appendChild(ffHeader);
      functionFinderSection.appendChild(ffInfo);
      functionFinderSection.appendChild(ffScanBtn);
      functionFinderSection.appendChild(functionsList);

      // CodeTweaker section
      const codeTweakerSection = Utils.createElement('div', { style: { marginBottom: '32px' } });
      const ctHeader = Utils.createElement('h3', { textContent: 'CodeTweaker', style: { color: '#007bff', marginBottom: '16px' } });
      const ctInfo = Utils.createElement('div', { style: { color: '#999', fontSize: '13px', marginBottom: '12px', padding: '12px', background: '#252525', borderRadius: '6px' }, innerHTML: '<p style="margin:0;">Edit loaded JavaScript for this session. Saving will replace the original script with your modified version until the page reloads.</p>' });
      const ctScanBtn = Utils.createElement('button', { textContent: '📝 Scan Scripts', style: { padding: '10px 20px', background: '#28a745', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '600', marginBottom: '12px' }, events: { click: () => { Logger.info('CODETWEAKER','Scanning scripts'); this.scanScripts(scriptsList); } } });
      const scriptsList = Utils.createElement('div', { attributes: { id: 'scriptsList' }, style: { display: 'flex', flexDirection: 'column', gap: '8px' } });
      codeTweakerSection.appendChild(ctHeader);
      codeTweakerSection.appendChild(ctInfo);
      codeTweakerSection.appendChild(ctScanBtn);
      codeTweakerSection.appendChild(scriptsList);

      // NEW: StateForcer section
      const stateForcerSection = Utils.createElement('div', { style: { marginBottom: '32px' } });
      stateForcerSection.appendChild(this.createStateForcer());

      // NEW: UCon section
      const uconSection = Utils.createElement('div', { style: { marginBottom: '32px' } });
      uconSection.appendChild(this.createUCon());

      container.appendChild(panelCrackerSection);
      container.appendChild(functionFinderSection);
      container.appendChild(codeTweakerSection);
      container.appendChild(stateForcerSection);
      container.appendChild(uconSection);

      return container;
    }

    scanHiddenDivs(container) {
      container.innerHTML = '<div style="color: #999; text-align: center; padding: 10px;">Scanning...</div>';

      setTimeout(() => {
        const hiddenDivs = [];
        // Scan ALL elements including divs and iframes
        const allElements = document.querySelectorAll('div, iframe');

        allElements.forEach((el, index) => {
          if (Utils.isFuckeryElement(el)) return;

          const computedStyle = window.getComputedStyle(el);
          const isHidden =
          computedStyle.display === 'none' ||
          computedStyle.visibility === 'hidden' ||
          computedStyle.opacity === '0' ||
          el.hidden === true;

          if (isHidden) {
            const tagName = el.tagName.toLowerCase();
            hiddenDivs.push({
              element: el,
              id: el.id || `${tagName}-${index}`,
              className: el.className || 'no-class',
              tagName: tagName,
              reason: computedStyle.display === 'none' ? 'display: none' :
              computedStyle.visibility === 'hidden' ? 'visibility: hidden' :
              computedStyle.opacity === '0' ? 'opacity: 0' :
              'hidden attribute'
            });
          }
        });

        Logger.info('UTILS', `Found ${hiddenDivs.length} hidden elements (divs and iframes)`);
        this.displayHiddenDivs(hiddenDivs, container);
      }, 100);
    }

    displayHiddenDivs(hiddenDivs, container) {
      container.innerHTML = '';

      if (hiddenDivs.length === 0) {
        container.innerHTML = '<div style="text-align: center; color: #666; padding: 20px;">No hidden elements found</div>';
        return;
      }

      const summary = Utils.createElement('div', {
        textContent: `Found ${hiddenDivs.length} hidden element(s)`,
                                          style: {
                                            color: '#28a745',
                                            fontWeight: '600',
                                            marginBottom: '12px',
                                            padding: '8px',
                                            background: '#252525',
                                            borderRadius: '4px',
                                            textAlign: 'center'
                                          }
      });
      container.appendChild(summary);

      hiddenDivs.forEach((item, index) => {
        const row = Utils.createElement('div', {
          style: {
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '12px',
            background: '#1a1a1a',
            borderRadius: '6px',
            border: '1px solid #333',
            marginBottom: '8px'
          }
        });

        const info = Utils.createElement('div', {
          style: { flex: '1' }
        });

        const tagEl = Utils.createElement('div', {
          textContent: `<${item.tagName}>`,
          style: {
            color: item.tagName === 'iframe' ? '#FF9800' : '#4CAF50',
            fontWeight: '600',
            fontSize: '12px',
            marginBottom: '4px'
          }
        });

        const idEl = Utils.createElement('div', {
          textContent: item.id,
          style: {
            color: '#4CAF50',
            fontWeight: '600',
            fontSize: '13px',
            marginBottom: '4px'
          }
        });

        const classEl = Utils.createElement('div', {
          textContent: `Class: ${item.className}`,
          style: {
            color: '#999',
            fontSize: '11px',
            marginBottom: '2px'
          }
        });

        const reasonEl = Utils.createElement('div', {
          textContent: `Hidden by: ${item.reason}`,
          style: {
            color: '#666',
            fontSize: '11px'
          }
        });

        info.appendChild(tagEl);
        info.appendChild(idEl);
        info.appendChild(classEl);
        info.appendChild(reasonEl);

        const buttonGroup = Utils.createElement('div', {
          style: {
            display: 'flex',
            gap: '6px'
          }
        });

        const showBtn = Utils.createElement('button', {
          textContent: 'Show',
          style: {
            padding: '6px 12px',
            background: '#28a745',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '12px',
            fontWeight: '600'
          },
          events: {
            click: () => {
              item.element.style.display = item.tagName === 'iframe' ? 'block' : 'block';
              item.element.style.visibility = 'visible';
              item.element.style.opacity = '1';
              item.element.hidden = false;
              Logger.info('UTILS', `Showed hidden element: ${item.id} (${item.tagName})`);
              Modal.alert(`Element "${item.id}" (${item.tagName}) is now visible`);
            }
          }
        });

        const hideBtn = Utils.createElement('button', {
          textContent: 'Hide',
          style: {
            padding: '6px 12px',
            background: '#dc3545',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '12px'
          },
          events: {
            click: () => {
              item.element.style.display = 'none';
              Logger.info('UTILS', `Hid element: ${item.id} (${item.tagName})`);
              Modal.alert(`Element "${item.id}" (${item.tagName}) is now hidden`);
            }
          }
        });

        buttonGroup.appendChild(showBtn);
        buttonGroup.appendChild(hideBtn);

        row.appendChild(info);
        row.appendChild(buttonGroup);
        container.appendChild(row);
      });
    }

    createStateForcer() {
      const sectionRoot = Utils.createElement('div');
      const header = Utils.createElement('h3', { textContent: 'StateForcer', style: { color: '#007bff', marginBottom: '16px' } });
      const info = Utils.createElement('div', {
        style: { color: '#999', fontSize: '13px', marginBottom: '12px', padding: '12px', background: '#252525', borderRadius: '6px' },
        innerHTML: '<p style="margin:0;">🎯 <strong>StateForcer</strong> scans script source code for variables (const, let, var) that look like game states and lets you modify them. This is experimental and may break the page.</p>'
      });
      const scanBtn = Utils.createElement('button', {
        textContent: '🎯 Scan Scripts for States',
        style: {
          padding: '10px 20px',
          background: '#fd7e14',
          color: 'white',
          border: 'none',
          borderRadius: '6px',
          cursor: 'pointer',
          fontWeight: '600',
          marginBottom: '12px'
        },
        events: {
          click: () => {
            Logger.info('STATEFORCER', 'Scanning scripts for states');
            this.scanForStates(statesList);
          }
        }
      });
      const statesList = Utils.createElement('div', {
        attributes: { id: 'statesList' },
        style: { display: 'flex', flexDirection: 'column', gap: '8px' }
      });

      sectionRoot.appendChild(header);
      sectionRoot.appendChild(info);
      sectionRoot.appendChild(scanBtn);
      sectionRoot.appendChild(statesList);

      return sectionRoot;
    }

    async scanForStates(container) {
      container.innerHTML = '<div style="color: #999; text-align:center;padding:10px;">Scanning scripts for potential states...</div>';

      const scripts = Array.from(document.querySelectorAll('script'));
      const states = [];
      const keywords = [
        'level', 'score', 'health', 'hp', 'mana', 'mp', 'xp', 'exp', 'gold', 'money', 'cash', 'credits', 'points',
        'is', 'has', 'can', 'show', 'hide', 'active', 'enabled', 'disabled', 'visible', 'hidden', 'loading',
        'ready', 'complete', 'error', 'success', 'warning', 'status', 'state', 'mode', 'current', 'selected',
        'page', 'step', 'index', 'count', 'amount', 'value', 'progress', 'auth', 'user', 'session', 'token', 'admin'
      ];

      const isStateKeyword = (key) => {
        if (!key || typeof key !== 'string') return false;
        const lowerKey = key.toLowerCase();
        return keywords.some(keyword => lowerKey.includes(keyword));
      };

      const processScript = (scriptElement, scriptContent, scriptIndex) => {
        // Regex to find variable declarations with simple literal values
        const regex = /(?:const|let|var)\s+([a-zA-Z0-9_]+)\s*=\s*(true|false|"[^"]*"|'[^']*'|`[^`]*`|-?[0-9.]+)/g;
        let match;
        while ((match = regex.exec(scriptContent)) !== null) {
          const varName = match[1];
          if (isStateKeyword(varName)) {
            states.push({
              name: varName,
              originalValue: match[2],
              scriptElement: scriptElement,
              scriptIndex: scriptIndex,
              declaration: match[0]
            });
          }
        }
      };

      for (let i = 0; i < scripts.length; i++) {
        const script = scripts[i];
        if (Utils.isFuckeryElement(script)) continue;

        if (script.src) {
          try {
            const response = await fetch(script.src, { cache: 'no-store' });
            if (response.ok) {
              const text = await response.text();
              processScript(script, text, i);
            }
          } catch (e) {
            Logger.warn('STATEFORCER', `Could not fetch external script: ${script.src}`, e);
          }
        } else {
          processScript(script, script.textContent, i);
        }
      }

      Logger.info('STATEFORCER', `Script scan complete. Found ${states.length} potential states.`);
      this.displayStates(states, container);
    }

    displayStates(states, container) {
      container.innerHTML = '';
      if (states.length === 0) {
        container.innerHTML = '<div style="text-align: center; color: #666; padding: 20px;">No potential states found in scripts.</div>';
        return;
      }

      const summary = Utils.createElement('div', {
        textContent: `Found ${states.length} potential state variable(s). Modifying these will re-run the script.`,
                                          style: {
                                            color: '#fd7e14',
                                            fontWeight: '600',
                                            marginBottom: '12px',
                                            padding: '8px',
                                            background: '#252525',
                                            borderRadius: '4px',
                                            textAlign: 'center',
                                            fontSize: '12px'
                                          }
      });
      container.appendChild(summary);

      const listContainer = Utils.createElement('div', {
        style: {
          maxHeight: '400px',
          overflowY: 'auto'
        }
      });
      container.appendChild(listContainer);

      states.forEach(state => {
        const row = Utils.createElement('div', {
          style: {
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px',
            background: '#1a1a1a',
            borderRadius: '4px',
            marginBottom: '6px'
          }
        });

        const infoEl = Utils.createElement('div', {
          style: { flex: '1', display: 'flex', flexDirection: 'column', minWidth: 0 }
        });

        const pathEl = Utils.createElement('span', {
          textContent: state.name,
          style: {
            fontWeight: '600',
            color: '#4CAF50',
            fontSize: '13px',
          }
        });
        const scriptInfoEl = Utils.createElement('span', {
          textContent: state.scriptElement.src ? new URL(state.scriptElement.src).pathname.split('/').pop() : `inline script #${state.scriptIndex}`,
                                                 style: {
                                                   fontSize: '10px',
                                                   color: '#888',
                                                   whiteSpace: 'nowrap',
                                                   overflow: 'hidden',
                                                   textOverflow: 'ellipsis'
                                                 }
        });
        infoEl.appendChild(pathEl);
        infoEl.appendChild(scriptInfoEl);

        const valueInput = Utils.createElement('input', {
          attributes: {
            value: state.originalValue.replace(/^["']|["']$/g, ''), // Strip quotes for editing
          },
          style: {
            width: '150px',
            padding: '4px 8px',
            background: '#2d2d2d',
            border: '1px solid #444',
            borderRadius: '4px',
            color: '#fff',
            fontSize: '12px'
          }
        });

        const updateBtn = Utils.createElement('button', {
          textContent: 'Set',
          style: {
            padding: '4px 12px',
            background: '#007bff',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '12px'
          },
          events: {
            click: () => {
              this.updateStateValue(state, valueInput.value);
            }
          }
        });

        row.appendChild(infoEl);
        row.appendChild(valueInput);
        row.appendChild(updateBtn);
        listContainer.appendChild(row);
      });
    }

    async updateStateValue(state, newValueStr) {
      Logger.debug('STATEFORCER', `Attempting to update state in script`, { name: state.name, newValue: newValueStr });

      try {
        let scriptContent;
        if (state.scriptElement.src) {
          const response = await fetch(state.scriptElement.src, { cache: 'no-store' });
          if (!response.ok) throw new Error('Failed to fetch script source');
          scriptContent = await response.text();
        } else {
          scriptContent = state.scriptElement.textContent;
        }

        // Determine if the new value should be a string
        let newValueForScript;
        const originalValue = state.originalValue;
        if (originalValue.startsWith('"') || originalValue.startsWith("'") || originalValue.startsWith("`")) {
          newValueForScript = `"${newValueStr.replace(/"/g, '\\"')}"`; // Quote the new value
        } else if (originalValue === 'true' || originalValue === 'false') {
          newValueForScript = String(newValueStr).toLowerCase() === 'true' || newValueStr === '1';
        } else {
          newValueForScript = parseFloat(newValueStr);
          if (isNaN(newValueForScript)) {
            // It was likely a variable or something else, but we'll try to set it as a string
            newValueForScript = `"${newValueStr.replace(/"/g, '\\"')}"`;
          }
        }

        const newDeclaration = state.declaration.replace(state.originalValue, newValueForScript);
        const newScriptContent = scriptContent.replace(state.declaration, newDeclaration);

        // Use CodeTweaker's logic to apply the new script
        this.applyScriptEdit(state.scriptElement, newScriptContent);

        Logger.info('STATEFORCER', `Applied modified script to update state`, { name: state.name, newValue: newValueForScript });
        Modal.alert(`Applied change to '${state.name}'. The page may need a moment to update.`);

      } catch (e) {
        Logger.error('STATEFORCER', `Failed to update state via script modification`, { name: state.name, error: e.message });
        Modal.alert('Error updating value: ' + e.message);
      }
    }

    createUCon() {
      const uconRoot = Utils.createElement('div');
      const uconHeader = Utils.createElement('h3', { textContent: 'UCon - Universal Console', style: { color: '#007bff', marginBottom: '16px' } });
      const uconInfo = Utils.createElement('div', {
        style: { color: '#999', fontSize: '13px', marginBottom: '12px', padding: '12px', background: '#252525', borderRadius: '6px' },
        innerHTML: '<p style="margin:0;">Execute JavaScript in different contexts (main window or iframes). Features command history and basic autocompletion. Browser security rules apply.</p>'
      });
      uconRoot.appendChild(uconHeader);
      uconRoot.appendChild(uconInfo);

      const container = Utils.createElement('div', {
        style: {
          border: '1px solid #333',
          borderRadius: '8px',
          overflow: 'hidden',
          height: '400px',
          display: 'flex',
          flexDirection: 'column'
        }
      });

      // Header with context selector
      const header = Utils.createElement('div', {
        style: { padding: '8px', background: '#252525', borderBottom: '1px solid #333', display: 'flex', alignItems: 'center', gap: '8px' }
      });
      const contextLabel = Utils.createElement('label', { textContent: 'Context:', style: { color: '#ccc', fontSize: '12px' } });
      const contextSelector = Utils.createElement('select', {
        attributes: { id: 'uconContextSelector' },
        style: {
          flex: '1',
          padding: '4px',
          background: '#1a1a1a',
          color: 'white',
          border: '1px solid #444'
        }
      });
      header.appendChild(contextLabel);
      header.appendChild(contextSelector);
      container.appendChild(header);

      // Console Output
      const output = Utils.createElement('div', {
        className: 'ucon-output',
        style: {
          flex: '1',
          background: '#0d0d0d',
          color: '#e0e0e0',
          padding: '8px',
          fontFamily: 'monospace',
          fontSize: '12px',
          overflowY: 'auto',
          whiteSpace: 'pre-wrap',
          wordBreak: 'break-word'
        }
      });
      container.appendChild(output);

      // Autocomplete container
      const suggestions = Utils.createElement('div', {
        className: 'ucon-suggestions',
        style: {
          background: '#252525',
          borderTop: '1px solid #333',
          maxHeight: '120px',
          overflowY: 'auto',
          display: 'none' // Initially hidden
        }
      });
      container.appendChild(suggestions);

      // Console Input
      const input = Utils.createElement('textarea', {
        attributes: { placeholder: 'Enter JS code. Shift+Enter for new line. Enter to execute.', rows: '3' },
        style: {
          width: '100%',
          padding: '8px',
          background: '#1e1e1e',
          border: 'none',
          borderTop: '1px solid #333',
          color: '#fff',
          fontFamily: 'monospace',
          resize: 'none'
        }
      });
      container.appendChild(input);

      // --- Logic ---
      let contexts = [];
      const commandHistory = [];
      let historyIndex = -1;
      let activeSuggestions = [];
      let suggestionIndex = -1;

      const logToConsole = (message, type = 'log', rawHTML = false) => {
        const entry = Utils.createElement('div');
        const colors = { log: '#e0e0e0', error: '#ff8a80', success: '#80d8ff', info: '#82b1ff', command: '#00bcd4' };
        entry.style.color = colors[type] || '#e0e0e0';
        entry.style.borderBottom = '1px solid #222';
        entry.style.padding = '4px 0';
        if (rawHTML) {
          entry.innerHTML = message;
        } else {
          entry.textContent = message;
        }
        output.appendChild(entry);
        output.scrollTop = output.scrollHeight;
      };

      const getSelectedContext = () => {
        const selectedIndex = contextSelector.selectedIndex;
        return contexts[selectedIndex]?.context;
      };

      const execute = () => {
        const code = input.value.trim();
        if (!code) return;

        logToConsole(`> ${code}`, 'command');
        commandHistory.unshift(code);
        historyIndex = -1;
        input.value = '';
        suggestions.style.display = 'none';

        const context = getSelectedContext();
        if (!context) {
          logToConsole('Error: No context selected.', 'error');
          return;
        }

        try {
          const result = context.eval(code);

          let resultStr;
          if (result === undefined) {
            resultStr = '<span style="color: #666;">undefined</span>';
          } else {
            try {
              resultStr = JSON.stringify(result, null, 2);
              resultStr = resultStr.replace(/</g, "&lt;").replace(/>/g, "&gt;");
            } catch (e) {
              resultStr = String(result).replace(/</g, "&lt;").replace(/>/g, "&gt;");
            }
          }
          logToConsole(`&lt; ${resultStr}`, 'success', true);
        } catch (e) {
          logToConsole(`❌ ${e.name}: ${e.message}`, 'error');
        }
      };

      const updateAutocomplete = () => {
        const text = input.value;
        const cursorPos = input.selectionStart;
        const textBeforeCursor = text.slice(0, cursorPos);
        const match = textBeforeCursor.match(/([a-zA-Z0-9_$.]+)\.([a-zA-Z0-9_]*)$/);

        if (!match) {
          suggestions.style.display = 'none';
          return;
        }

        const [, objExpr, propPrefix] = match;
        const context = getSelectedContext();

        try {
          const obj = context.eval(objExpr);
          if (obj === null || obj === undefined) {
            suggestions.style.display = 'none';
            return;
          }

          let props = [];
          for (const prop in obj) {
            if (prop.startsWith(propPrefix)) {
              props.push(prop);
            }
          }
          props.sort();

          if (props.length > 0) {
            activeSuggestions = props;
            suggestionIndex = -1;
            suggestions.innerHTML = '';
            props.forEach((prop, i) => {
              const item = Utils.createElement('div', { textContent: prop, style: { padding: '4px 8px', cursor: 'pointer' } });
              item.addEventListener('click', () => {
                applySuggestion(i);
              });
              suggestions.appendChild(item);
            });
            suggestions.style.display = 'block';
          } else {
            suggestions.style.display = 'none';
          }
        } catch (e) {
          suggestions.style.display = 'none';
        }
      };

      const applySuggestion = (index) => {
        const text = input.value;
        const cursorPos = input.selectionStart;
        const textBeforeCursor = text.slice(0, cursorPos);
        const match = textBeforeCursor.match(/([a-zA-Z0-9_$.]+)\.([a-zA-Z0-9_]*)$/);
        const suggestion = activeSuggestions[index];
        const newText = textBeforeCursor.replace(/([a-zA-Z0-9_]*)$/, suggestion) + text.slice(cursorPos);
        input.value = newText;
        input.focus();
        suggestions.style.display = 'none';
      };

      input.addEventListener('keydown', e => {
        if (suggestions.style.display === 'block') {
          if (e.key === 'ArrowDown') {
            e.preventDefault();
            suggestionIndex = (suggestionIndex + 1) % activeSuggestions.length;
            // highlight suggestion
          } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            suggestionIndex = (suggestionIndex - 1 + activeSuggestions.length) % activeSuggestions.length;
            // highlight suggestion
          } else if (e.key === 'Enter' || e.key === 'Tab') {
            if (suggestionIndex !== -1) {
              e.preventDefault();
              applySuggestion(suggestionIndex);
            }
          } else if (e.key === 'Escape') {
            suggestions.style.display = 'none';
          }
          return; // Prevent other handlers
        }

        if (e.key === 'Enter' && !e.shiftKey) {
          e.preventDefault();
          execute();
        } else if (e.key === 'ArrowUp') {
          if (input.selectionStart === 0) { // Only trigger if at start of input
            if (historyIndex < commandHistory.length - 1) {
              historyIndex++;
              input.value = commandHistory[historyIndex];
              e.preventDefault();
            }
          }
        } else if (e.key === 'ArrowDown') {
          if (input.selectionStart === input.value.length) { // Only trigger if at end of input
            if (historyIndex > 0) {
              historyIndex--;
              input.value = commandHistory[historyIndex];
              e.preventDefault();
            } else {
              historyIndex = -1;
              input.value = '';
            }
          }
        }
      });

      input.addEventListener('input', updateAutocomplete);

      const scanAndPopulateContexts = () => {
        contextSelector.innerHTML = '';
        contexts = [];

        contexts.push({ name: 'Main Window (top)', context: window });

        document.querySelectorAll('iframe').forEach((iframe, index) => {
          if (Utils.isFuckeryElement(iframe)) return;
          let name;
          try {
            name = iframe.id ? `#${iframe.id}` : iframe.src ? new URL(iframe.src).pathname : `(inline)-${index}`;
          } catch {
            name = iframe.src || `(opaque)-${index}`;
          }
          contexts.push({ name, context: iframe.contentWindow });
        });

        contexts.forEach((ctx, i) => {
          const option = Utils.createElement('option', { textContent: `${i}: ${ctx.name}` });
          contextSelector.appendChild(option);
        });
      };
      scanAndPopulateContexts();

      logToConsole('UCon Initialized. Select a context and start typing.', 'info');

      uconRoot.appendChild(container);
      return uconRoot;
    }

    scanFunctions(container) {
      container.innerHTML = '<div style="color:#999; text-align:center;padding:10px;">Scanning for functions...</div>';

      setTimeout(() => {
        const functions = [];
        const seenFunctions = new Set();

        // Scan window/global scope
        try {
          const scanObject = (obj, path = 'window', depth = 0, maxDepth = 2) => {
            if (depth > maxDepth) return;

            try {
              const keys = Object.getOwnPropertyNames(obj);

              keys.forEach(key => {
                try {
                  const value = obj[key];
                  const fullPath = path === 'window' ? key : `${path}.${key}`;

                  // Skip fuckery elements and known problematic objects
                  if (key.toLowerCase().includes('fuckery') ||
                    key === '__FuckeryMenu' ||
                    key === 'fcom') {
                    return;
                    }

                    if (typeof value === 'function') {
                      const funcString = value.toString();
                      const funcSignature = funcString.substring(0, Math.min(funcString.indexOf('{'), 100));

                      if (!seenFunctions.has(fullPath)) {
                        seenFunctions.add(fullPath);
                        functions.push({
                          name: key,
                          path: fullPath,
                          signature: funcSignature || 'function()',
                                       source: path.split('.')[0],
                                       isNative: funcString.includes('[native code]')
                        });
                      }
                    } else if (value && typeof value === 'object' && depth < maxDepth) {
                      // Recursively scan objects, but limit depth
                      try {
                        scanObject(value, fullPath, depth + 1, maxDepth);
                      } catch (e) {
                        // Skip objects that can't be scanned
                      }
                    }
                } catch (e) {
                  // Skip inaccessible properties
                }
              });
            } catch (e) {
              Logger.warn('UTILS', 'Error scanning object', { path, error: e.message });
            }
          };

          // Scan global window object
          scanObject(window, 'window', 0, 2);

          // Scan all loaded script tags for global function declarations
          document.querySelectorAll('script').forEach((script, index) => {
            if (script.textContent) {
              try {
                // Look for function declarations in script text
                const functionMatches = script.textContent.matchAll(/function\s+(\w+)\s*\(/g);
                for (const match of functionMatches) {
                  const funcName = match[1];
                  if (window[funcName] && typeof window[funcName] === 'function') {
                    const fullPath = funcName;
                    if (!seenFunctions.has(fullPath)) {
                      seenFunctions.add(fullPath);
                      functions.push({
                        name: funcName,
                        path: fullPath,
                        signature: `function ${funcName}()`,
                                     source: `script-${index}`,
                                     isNative: false
                      });
                    }
                  }
                }
              } catch (e) {
                // Skip if script parsing fails
              }
            }
          });

        } catch (e) {
          Logger.error('UTILS', 'Error during function scan', { error: e.message });
        }

        Logger.info('UTILS', `Function scan complete`, {
          totalFound: functions.length
        });

        this.displayFunctions(functions, container);
      }, 100);
    }

    displayFunctions(functions, container) {
      container.innerHTML = '';

      if (functions.length === 0) {
        container.innerHTML = '<div style="text-align: center; color: #666; padding: 20px;">No functions found</div>';
        return;
      }

      // Add search/filter
      const searchContainer = Utils.createElement('div', {
        style: {
          marginBottom: '12px',
          padding: '8px',
          background: '#1a1a1a',
          borderRadius: '6px',
          display: 'flex',
          gap: '8px',
          alignItems: 'center'
        }
      });

      const searchInput = Utils.createElement('input', {
        attributes: {
          type: 'text',
          placeholder: 'Filter functions...'
        },
        style: {
          flex: '1',
          padding: '8px',
          background: '#2d2d2d',
          border: '1px solid #444',
          borderRadius: '4px',
          color: '#fff',
          fontSize: '13px'
        }
      });

      const nativeToggle = Utils.createElement('label', {
        style: {
          color: '#999',
          fontSize: '13px',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          cursor: 'pointer'
        }
      });

      const nativeCheckbox = Utils.createElement('input', {
        attributes: { type: 'checkbox' }
      });

      const nativeText = document.createTextNode('Hide Native');
      nativeToggle.appendChild(nativeCheckbox);
      nativeToggle.appendChild(nativeText);

      searchContainer.appendChild(searchInput);
      searchContainer.appendChild(nativeToggle);
      container.appendChild(searchContainer);

      const summary = Utils.createElement('div', {
        textContent: `Found ${functions.length} function(s)`,
                                          style: {
                                            color: '#28a745',
                                            fontWeight: '600',
                                            marginBottom: '12px',
                                            padding: '8px',
                                            background: '#252525',
                                            borderRadius: '4px',
                                            textAlign: 'center'
                                          }
      });
      container.appendChild(summary);

      const listContainer = Utils.createElement('div', {
        attributes: { id: 'functionsListContainer' },
        style: {
          maxHeight: '400px',
          overflowY: 'auto'
        }
      });
      container.appendChild(listContainer);

      const renderFunctions = () => {
        const searchTerm = searchInput.value.toLowerCase();
        const hideNative = nativeCheckbox.checked;

        const filteredFunctions = functions.filter(func => {
          const matchesSearch = func.name.toLowerCase().includes(searchTerm) ||
          func.path.toLowerCase().includes(searchTerm);
          const matchesNative = !hideNative || !func.isNative;
          return matchesSearch && matchesNative;
        });

        listContainer.innerHTML = '';

        if (filteredFunctions.length === 0) {
          listContainer.innerHTML = '<div style="text-align: center; color: #666; padding: 20px;">No functions match filter</div>';
          return;
        }

        filteredFunctions.forEach((func, index) => {
          const row = Utils.createElement('div', {
            style: {
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '10px',
              background: '#1a1a1a',
              borderRadius: '6px',
              border: '1px solid #333',
              marginBottom: '6px'
            }
          });

          const info = Utils.createElement('div', {
            style: { flex: '1' }
          });

          const nameEl = Utils.createElement('div', {
            textContent: func.path,
            style: {
              color: func.isNative ? '#FF9800' : '#4CAF50',
              fontWeight: '600',
              fontSize: '13px',
              marginBottom: '4px',
              fontFamily: 'monospace'
            }
          });

          const signatureEl = Utils.createElement('div', {
            textContent: func.signature,
            style: {
              color: '#999',
              fontSize: '11px',
              fontFamily: 'monospace',
              marginBottom: '2px',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              maxWidth: '400px'
            }
          });

          const sourceEl = Utils.createElement('div', {
            textContent: `Source: ${func.source}${func.isNative ? ' (native)' : ''}`,
                                               style: {
                                                 color: '#666',
                                                 fontSize: '10px'
                                               }
          });

          info.appendChild(nameEl);
          info.appendChild(signatureEl);
          info.appendChild(sourceEl);

          const buttonGroup = Utils.createElement('div', {
            style: {
              display: 'flex',
              gap: '6px'
            }
          });

          const executeBtn = Utils.createElement('button', {
            textContent: 'Execute',
            style: {
              padding: '6px 12px',
              background: '#007bff',
              color: '#fff',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '12px',
              fontWeight: '600'
            },
            events: {
              click: async () => {
                try {
                  // Get the actual function reference
                  const funcRef = func.path.split('.').reduce((obj, key) => obj[key], window);

                  if (typeof funcRef !== 'function') {
                    Modal.alert('Function is no longer available');
                    return;
                  }

                  // Prompt for arguments
                  const argsInput = prompt('Enter arguments (comma-separated, or leave empty for no args):\n\nExamples:\n- "Hello", 123\n- \n- 42, true', '');

                  if (argsInput === null) return; // User cancelled

                  let args = [];
                  if (argsInput.trim()) {
                    try {
                      // Parse arguments safely
                      args = JSON.parse(`[${argsInput}]`);
                    } catch (e) {
                      // If JSON parse fails, try eval in a safer way
                      try {
                        args = eval(`[${argsInput}]`);
                      } catch (e2) {
                        Modal.alert('Invalid arguments format');
                        return;
                      }
                    }
                  }

                  Logger.info('FUNCTION_FINDER', `Executing: ${func.path}`, { args });
                  const result = funcRef(...args);

                  // Show result
                  const resultStr = result === undefined ? 'undefined' :
                  result === null ? 'null' :
                  typeof result === 'object' ? JSON.stringify(result, null, 2) :
                  String(result);

                  Modal.alert(`Function executed successfully!\n\nResult:\n${resultStr.substring(0, 500)}${resultStr.length > 500 ? '...' : ''}`);
                  Logger.info('FUNCTION_FINDER', `Execution result: ${func.path}`, { result });

                } catch (e) {
                  Logger.error('FUNCTION_FINDER', `Error executing ${func.path}`, { error: e.message });
                  Modal.alert(`Error executing function:\n${e.message}`);
                }
              }
            }
          });

          const copyBtn = Utils.createElement('button', {
            textContent: 'Copy',
            style: {
              padding: '6px 12px',
              background: '#6c757d',
              color: '#fff',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '12px'
            },
            events: {
              click: () => {
                try {
                  navigator.clipboard.writeText(func.path);
                  Modal.alert(`Copied to clipboard:\n${func.path}`);
                } catch (e) {
                  prompt('Copy this function path:', func.path);
                }
              }
            }
          });

          buttonGroup.appendChild(executeBtn);
          buttonGroup.appendChild(copyBtn);

          row.appendChild(info);
          row.appendChild(buttonGroup);
          listContainer.appendChild(row);
        });

        summary.textContent = `Showing ${filteredFunctions.length} of ${functions.length} function(s)`;
      };

      searchInput.addEventListener('input', renderFunctions);
      nativeCheckbox.addEventListener('change', renderFunctions);

      renderFunctions();
    }

    createSettingsTab() {
      Logger.debug('TAB_RENDER', 'Creating Settings tab content');
      const container = Utils.createElement('div');

      const settings = Settings.getAll();

      container.innerHTML = `
      <h3 style="color: #007bff; margin-bottom: 16px;">Settings</h3>
      <div style="display: flex; flex-direction: column; gap: 16px;">
      <label style="display: flex; align-items: center; gap: 8px;">
      <input type="checkbox" id="autoOpen" ${settings.autoOpen ? 'checked' : ''}>
      <span style="color: #ccc;">Auto-open on load</span>
      </label>
      <label style="display: flex; align-items: center; gap: 8px;">
      <input type="checkbox" id="enableAnimations" ${settings.enableAnimations ? 'checked' : ''}>
      <span style="color: #ccc;">Enable animations</span>
      </label>
      <label style="display: flex; align-items: center; gap: 8px;">
      <input type="checkbox" id="debugMode" ${settings.debugMode ? 'checked' : ''}>
      <span style="color: #ccc;">Debug mode</span>
      </label>
      <div style="margin-top: 16px;">
      <button id="clearData" style="padding: 10px 20px; background: #dc3545; color: white; border: none; border-radius: 6px; cursor: pointer;">
      Clear All Data
      </button>
      </div>
      <div style="margin-top: 24px; padding-top: 24px; border-top: 1px solid #333;">
      <h4 style="color: #999; font-size: 12px; margin-bottom: 8px;">License Information</h4>
      <div style="font-size: 10px; color: #666; line-height: 1.4; max-height: 300px; overflow-y: auto; padding: 12px; background: #0d0d0d; border-radius: 4px; border: 1px solid #222;">
      <p style="margin-bottom: 8px;"><strong>FuckeryMenu v${this.version}</strong></p>
      <p style="margin-bottom: 8px;">Copyright (C) ${CONFIG.COPYRIGHT_YEAR} 1st</p>
      <p style="margin-bottom: 12px;">This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.</p>
      <p style="margin-bottom: 12px;">This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.</p>
      <p style="margin-bottom: 12px; font-weight: bold;">NO WARRANTY</p>
      <p style="margin-bottom: 12px;">THERE IS NO WARRANTY FOR THE PROGRAM, TO THE EXTENT PERMITTED BY APPLICABLE LAW. EXCEPT WHEN OTHERWISE STATED IN WRITING THE COPYRIGHT HOLDERS AND/OR OTHER PARTIES PROVIDE THE PROGRAM "AS IS" WITHOUT WARRANTY OF ANY KIND, EITHER EXPRESSED OR IMPLIED, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE. THE ENTIRE RISK AS TO THE QUALITY AND PERFORMANCE OF THE PROGRAM IS WITH YOU. SHOULD THE PROGRAM PROVE DEFECTIVE, YOU ASSUME THE COST OF ALL NECESSARY SERVICING, REPAIR OR CORRECTION.</p>
      <p style="margin-bottom: 12px; font-weight: bold;">GNU GENERAL PUBLIC LICENSE - VERSION 3</p>
      <p style="margin-bottom: 8px;">The GNU General Public License is a free, copyleft license for software and other kinds of works.</p>
      <p style="margin-bottom: 8px;">The licenses for most software and other practical works are designed to take away your freedom to share and change the works. By contrast, the GNU General Public License is intended to guarantee your freedom to share and change all versions of a program--to make sure it remains free software for all its users. We, the Free Software Foundation, use the GNU General Public License for most of our software; it applies also to any other work released this way by its authors. You can apply it to your programs, too.</p>
      <p style="margin-bottom: 8px;">When we speak of free software, we are referring to freedom, not price. Our General Public Licenses are designed to make sure that you have the freedom to distribute copies of free software (and charge for them if you wish), that you receive source code or can get it if you want it, that you can change the software or use pieces of it in new free programs, and that you know you can do these things.</p>
      <p style="margin-bottom: 8px;">To protect your rights, we need to prevent others from denying you these rights or asking you to surrender the rights. Therefore, you have certain responsibilities if you distribute copies of the software, or if you modify it: responsibilities to respect the freedom of others.</p>
      <p style="margin-bottom: 8px;">For example, if you distribute copies of such a program, whether gratis or for a fee, you must pass on to the recipients the same freedoms that you received. You must make sure that they, too, receive or can get the source code. And you must show them these terms so they know their rights.</p>
      <p style="margin-bottom: 8px;">Developers that use the GNU GPL protect your rights with two steps: (1) assert copyright on the software, and (2) offer you this License giving you legal permission to copy, distribute and/or modify it.</p>
      <p style="margin-bottom: 8px;">For the developers' and authors' protection, the GPL clearly explains that there is no warranty for this free software. For both users' and authors' sake, the GPL requires that modified versions be marked as changed, so that their problems will not be attributed erroneously to authors of previous versions.</p>
      <p style="margin-bottom: 8px;">Some devices are designed to deny users access to install or run modified versions of the software inside them, although the manufacturer can do so. This is fundamentally incompatible with the aim of protecting users' freedom to change the software. The systematic pattern of such abuse occurs in the area of products for individuals to use, which is precisely where it is most unacceptable. Therefore, we have designed this version of the GPL to prohibit the practice for those products. If such problems arise substantially in other domains, we stand ready to extend this provision to those domains in future versions of the GPL, as needed to protect the freedom of users.</p>
      <p style="margin-bottom: 8px;">Finally, every program is threatened constantly by software patents. States should not allow patents to restrict development and use of software on general-purpose computers, but in those that do, we wish to avoid the special danger that patents applied to a free program could make it effectively proprietary. To prevent this, the GPL assures that patents cannot be used to render the program non-free.</p>
      <p style="margin-top: 12px; font-style: italic;">You should have received a copy of the GNU General Public License along with this program. If not, see &lt;https://www.gnu.org/licenses/&gt;.</p>
      </div>
      </div>
      </div>
      `;

      // Add event listeners
      setTimeout(() => {
        container.querySelector('#autoOpen')?.addEventListener('change', (e) => {
          Settings.set('autoOpen', e.target.checked);
        });

        container.querySelector('#enableAnimations')?.addEventListener('change', (e) => {
          Settings.set('enableAnimations', e.target.checked);
        });

        container.querySelector('#debugMode')?.addEventListener('change', (e) => {
          Settings.set('debugMode', e.target.checked);
        });

        container.querySelector('#clearData')?.addEventListener('click', async () => {
          const confirmed = await Modal.confirm('Clear all FuckeryMenu data?');
          if (confirmed) {
            Settings.clear();
            Modal.alert('All data cleared!');
          }
        });
      }, 100);

      return container;
    }

    setupDragging() {
      Logger.debug('UI', 'Setting up dragging for menu header');
      let isDragging = false;
      let startX, startY, startLeft, startTop;

      this.header.addEventListener('mousedown', (e) => {
        e.stopPropagation();
        isDragging = true;
        startX = e.clientX;
        startY = e.clientY;
        const rect = this.container.getBoundingClientRect();
        startLeft = rect.left;
        startTop = rect.top;
        this.container.style.position = 'fixed';
        this.container.style.left = startLeft + 'px';
        this.container.style.top = startTop + 'px';
        this.container.style.margin = '0';
      });

      document.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        e.preventDefault();

        const deltaX = e.clientX - startX;
        const deltaY = e.clientY - startY;
        const newLeft = startLeft + deltaX;
        const newTop = startTop + deltaY;

        // Clamp to screen bounds
        const maxLeft = window.innerWidth - this.container.offsetWidth;
        const maxTop = window.innerHeight - this.container.offsetHeight;

        this.container.style.left = Utils.clamp(newLeft, 0, maxLeft) + 'px';
        this.container.style.top = Utils.clamp(newTop, 0, maxTop) + 'px';
      });

      document.addEventListener('mouseup', (e) => {
        if (isDragging) {
          e.stopPropagation();
          isDragging = false;
          document.body.style.userSelect = '';
        }
      });
    }

    setupKeyboardShortcuts() {
      const handleKeyDown = (e) => {
        if (e.key === Settings.get('hotkey') || e.code === 'F8') {
          e.preventDefault();
          e.stopPropagation();
          Logger.ui('HOTKEY', `F8 pressed, toggling menu (currently ${this.isVisible ? 'visible' : 'hidden'})`);
          this.toggle();
        }
      };

      // Use document instead of window and don't capture
      document.addEventListener('keydown', handleKeyDown, false);

      Logger.debug('UI', 'Keyboard shortcuts initialized');
    }

    show() {
      Logger.ui('UI', 'Showing FuckeryMenu');
      this.container.style.display = 'flex';
      this.isVisible = true;

      // Capture auto-snapshot on first open if no snapshots exist
      if (SnapshotManager.snapshots.length === 0) {
        SnapshotManager.capture('Auto Snapshot (Menu Opened)');
      }

      // Update the integrated log display
      this.updateIntegratedLogs();

      Logger.info('UI', 'FuckeryMenu displayed');
    }

    hide() {
      Logger.ui('UI', 'Hiding FuckeryMenu');
      this.container.style.display = 'none';
      this.isVisible = false;
      Logger.info('UI', 'FuckeryMenu hidden');
    }

    toggle() {
      Logger.ui('UI', `Toggling FuckeryMenu (currently ${this.isVisible ? 'visible' : 'hidden'})`);
      if (this.isVisible) {
        this.hide();
      } else {
        this.show();
      }
    }

    destroy() {
      Logger.ui('UI', 'Destroying FuckeryMenu');
      if (this.fuckeryRoot?.parentNode) {
        this.fuckeryRoot.remove();
      }
      this.isVisible = false;
    }

    // Helper methods
    scanForValues(container) {
      Logger.debug('TWEAKER', 'Starting value scan');
      const values = [];
      const isWebsim = window.location.hostname.includes('websim.com');

      Logger.info('TWEAKER', `Scanning for values on ${isWebsim ? 'Websim' : 'external'} site`);

      // Expanded list of metadata properties to exclude
      const metadataKeywords = [
        'webkit', 'chrome', 'moz', 'fuckery', 'on', 'meta', 'Meta', 'analytics', 'gtag',
        'google', 'fb', 'twitter', 'tracking', 'pixel', 'scroll', 'Screen', 'inner',
        'outer', 'client', 'offset', 'page', 'frame', 'history', 'location', 'navigator',
        'document', 'window', 'parent', 'top', 'self', 'frames', 'length', 'closed',
        'opener', 'status', 'toolbar', 'menubar', 'scrollbar', 'resizable', 'fullscreen',
        'outerHeight', 'outerWidth', 'screenX', 'screenY', 'screenLeft', 'screenTop',
        'scrollX', 'scrollY', 'pageXOffset', 'pageYOffset', 'devicePixelRatio',
        'performance', 'crypto', 'indexedDB', 'sessionStorage', 'localStorage',
        'speechSynthesis', 'webkitNotifications', 'external', 'sidebar', 'opera'
      ];

      const isMetadataKey = (key) => {
        return metadataKeywords.some(keyword =>
        key.toLowerCase().includes(keyword.toLowerCase())
        );
      };

      if (isWebsim) {
        // Only scan project-specific values on websim
        Logger.debug('TWEAKER', 'Scanning window properties (Websim mode)');
        Object.keys(window).forEach(key => {
          const value = window[key];
          if ((typeof value === 'number' || typeof value === 'string' || typeof value === 'boolean') &&
            !isMetadataKey(key)) {
            values.push({ key, value, type: typeof value, source: 'window' });
            }
        });

        // Scan localStorage for project data only
        try {
          Logger.debug('TWEAKER', 'Scanning localStorage (Websim mode)');
          Object.keys(localStorage).forEach(key => {
            if (!isMetadataKey(key)) {
              values.push({ key, value: localStorage.getItem(key), type: 'localStorage', source: 'localStorage' });
            }
          });
        } catch (e) {
          Logger.error('TWEAKER', 'Failed to scan localStorage', { error: e.message });
        }
      } else {
        // Scan window properties on non-websim sites
        Logger.debug('TWEAKER', 'Scanning window properties (External site mode)');
        Object.keys(window).forEach(key => {
          const value = window[key];
          if ((typeof value === 'number' || typeof value === 'string' || typeof value === 'boolean') &&
            !isMetadataKey(key)) {
            values.push({ key, value, type: typeof value, source: 'window' });
            }
        });

        // Scan localStorage
        try {
          Logger.debug('TWEAKER', 'Scanning localStorage (External site mode)');
          Object.keys(localStorage).forEach(key => {
            if (!isMetadataKey(key)) {
              values.push({ key, value: localStorage.getItem(key), type: 'localStorage', source: 'localStorage' });
            }
          });
        } catch (e) {
          Logger.error('TWEAKER', 'Failed to scan localStorage', { error: e.message });
        }
      }

      Logger.info('TWEAKER', `Value scan complete`, {
        totalFound: values.length,
        windowValues: values.filter(v => v.source === 'window').length,
                  localStorageValues: values.filter(v => v.source === 'localStorage').length
      });

      this.displayValues(values, container);
    }

    displayValues(values, container) {
      container.innerHTML = '';

      if (values.length === 0) {
        container.innerHTML = '<div style="text-align: center; color: #666; padding: 20px;">No values found</div>';
        return;
      }

      values.forEach(item => {
        const row = Utils.createElement('div', {
          style: {
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px',
            background: '#1a1a1a',
            borderRadius: '4px',
            marginBottom: '6px'
          }
        });

        const keySpan = Utils.createElement('span', {
          textContent: item.key,
          style: {
            fontWeight: '600',
            color: '#4CAF50',
            minWidth: '120px',
            fontSize: '12px'
          }
        });

        const valueInput = Utils.createElement('input', {
          attributes: { value: String(item.value) },
                                               style: {
                                                 flex: '1',
                                                 padding: '4px 8px',
                                                 background: '#2d2d2d',
                                                 border: '1px solid #444',
                                                 borderRadius: '4px',
                                                 color: '#fff',
                                                 fontSize: '12px'
                                               }
        });

        const updateBtn = Utils.createElement('button', {
          textContent: 'Update',
          style: {
            padding: '4px 12px',
            background: '#007bff',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '12px'
          },
          events: {
            click: () => {
              try {
                const newValue = valueInput.value;
                if (item.source === 'window') {
                  if (item.type === 'number') {
                    window[item.key] = parseFloat(newValue) || 0;
                  } else if (item.type === 'boolean') {
                    window[item.key] = newValue.toLowerCase() === 'true';
                  } else {
                    window[item.key] = newValue;
                  }
                } else if (item.source === 'localStorage') {
                  localStorage.setItem(item.key, newValue);
                }
                Modal.alert('Value updated successfully!');
              } catch (e) {
                Modal.alert('Error updating value: ' + e.message);
              }
            }
          }
        });

        row.appendChild(keySpan);
        row.appendChild(valueInput);
        row.appendChild(updateBtn);
        container.appendChild(row);
      });
    }

    refreshInjectsList(container) {
      container.innerHTML = '';

      if (InjectManager.running.size === 0) {
        container.innerHTML = '<div style="text-align: center; color: #666; padding: 20px;">No injects running</div>';
        return;
      }

      InjectManager.running.forEach((inject, name) => {
        const row = Utils.createElement('div', {
          style: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '12px',
            background: '#252525',
            borderRadius: '6px',
            marginBottom: '8px'
          }
        });

        const info = Utils.createElement('div');
        const nameEl = Utils.createElement('div', {
          textContent: name,
          style: { color: '#4CAF50', fontWeight: '600' }
        });
        const timeEl = Utils.createElement('div', {
          textContent: `Running for ${Math.floor((Date.now() - inject.startTime) / 1000)}s`,
                                           style: { color: '#999', fontSize: '12px', marginTop: '2px' }
        });

        info.appendChild(nameEl);
        info.appendChild(timeEl);

        const stopBtn = Utils.createElement('button', {
          textContent: 'Stop',
          style: {
            padding: '6px 12px',
            background: '#dc3545',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '12px'
          },
          events: {
            click: () => {
              InjectManager.remove(name);
              this.refreshInjectsList(container);
            }
          }
        });

        row.appendChild(info);
        row.appendChild(stopBtn);
        container.appendChild(row);
      });
    }

    refreshRunningInjectsTab() {
      if (this.activeTab === 'injects') {
        const container = this.content.querySelector('#injectsList');
        if (container) {
          this.refreshInjectsList(container);
        }
      }
    }

    addCustomAction(name, code) {
      Logger.debug('CUSTOM', `Adding custom action: ${name}`);
      try {
        const customActions = JSON.parse(localStorage.getItem('fuckeryCustomActions') || '{}');
        customActions[name] = code;
        localStorage.setItem('fuckeryCustomActions', JSON.stringify(customActions));
        Logger.info('CUSTOM', `Custom action saved: ${name}`, { codeLength: code.length });
      } catch (e) {
        Logger.error('CUSTOM', `Failed to save custom action: ${name}`, { error: e.message });
        Modal.alert('Error saving custom action: ' + e.message);
      }
    }

    refreshCustomActionsList(container) {
      container.innerHTML = '';

      try {
        const customActions = JSON.parse(localStorage.getItem('fuckeryCustomActions') || '{}');

        if (Object.keys(customActions).length === 0) {
          container.innerHTML = '<div style="text-align: center; color: #666; padding: 20px;">No custom actions created</div>';
          return;
        }

        Object.entries(customActions).forEach(([name, code]) => {
          const row = Utils.createElement('div', {
            style: {
              display: 'flex',
              gap: '8px',
              alignItems: 'center',
              padding: '12px',
              background: '#252525',
              borderRadius: '6px',
              marginBottom: '8px'
            }
          });

          const nameEl = Utils.createElement('span', {
            textContent: name,
            style: {
              color: '#4CAF50',
              fontWeight: '600',
              flex: '1'
            }
          });

          const runBtn = Utils.createElement('button', {
            textContent: 'Run',
            style: {
              padding: '6px 12px',
              background: '#28a745',
              color: '#fff',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '12px'
            },
            events: {
              click: () => {
                try {
                  (new Function(code))();
                } catch (e) {
                  Modal.alert('Error running custom action: ' + e.message);
                }
              }
            }
          });

          const deleteBtn = Utils.createElement('button', {
            textContent: 'Delete',
            style: {
              padding: '6px 12px',
              background: '#dc3545',
              color: '#fff',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '12px'
            },
            events: {
              click: async () => {
                const confirmed = await Modal.confirm(`Delete "${name}"?`);
                if (confirmed) {
                  const customActions = JSON.parse(localStorage.getItem('fuckeryCustomActions') || '{}');
                  delete customActions[name];
                  localStorage.setItem('fuckeryCustomActions', JSON.stringify(customActions));
                  this.refreshCustomActionsList(container);
                }
              }
            }
          });

          row.appendChild(nameEl);
          row.appendChild(runBtn);
          row.appendChild(deleteBtn);
          container.appendChild(row);
        });
      } catch (e) {
        container.innerHTML = '<div style="color: #dc3545;">Error loading custom actions</div>';
      }
    }

    analyzeWebsimProject() {
      return {
        domain: window.location.hostname,
        isWebsim: window.location.hostname.includes('websim.com'),
                 hasWebsimAPI: !!window.websim,
                 elementCount: document.querySelectorAll('*').length,
                 scriptCount: document.querySelectorAll('script').length,
                 windowVars: Object.keys(window).length,
                 localStorageSize: Object.keys(localStorage).length
      };
    }

    exportProjectData() {
      try {
        const data = {
          url: window.location.href,
          title: document.title,
          html: document.documentElement.outerHTML,
          timestamp: new Date().toISOString()
        };

        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = Utils.createElement('a', {
          attributes: {
            href: url,
            download: `fuckery-export-${Date.now()}.json`
          }
        });
        a.click();
        URL.revokeObjectURL(url);
        Modal.alert('Project data exported!');
      } catch (e) {
        Modal.alert('Error exporting data: ' + e.message);
      }
    }

    updateIntegratedLogs() {
      if (!this.logContainer) return;

      // Keep only last 50 logs for performance
      const recentLogs = Logger.logs.slice(-50);

      this.logContainer.innerHTML = '';
      recentLogs.forEach(log => {
        const logEl = Utils.createElement('div', {
          className: `log-entry log-${log.level.toLowerCase()}`,
                                          style: {
                                            padding: '4px 8px',
                                            marginBottom: '2px',
                                            borderRadius: '3px',
                                            fontSize: '11px',
                                            fontFamily: 'monospace',
                                            backgroundColor: Logger.getLogColor(log.level),
                                          color: '#fff',
                                          borderLeft: `3px solid ${Logger.getLogBorderColor(log.level)}`,
                                          wordBreak: 'break-word'
                                          }
        });

        const timeEl = Utils.createElement('span', {
          textContent: log.timestamp,
          style: {
            color: '#ccc',
            marginRight: '6px',
            fontSize: '10px'
          }
        });

        const categoryEl = Utils.createElement('span', {
          textContent: `[${log.category}]`,
          style: {
            color: '#fff',
            fontWeight: 'bold',
            marginRight: '6px'
          }
        });

        const messageEl = Utils.createElement('span', {
          textContent: log.message,
          style: {
            color: '#fff'
          }
        });

        logEl.appendChild(timeEl);
        logEl.appendChild(categoryEl);
        logEl.appendChild(messageEl);

        if (log.data) {
          const dataEl = Utils.createElement('div', {
            textContent: `📊 ${JSON.stringify(log.data)}`,
                                             style: {
                                               marginTop: '2px',
                                               paddingLeft: '10px',
                                               fontSize: '10px',
                                               color: '#ddd',
                                               fontStyle: 'italic'
                                             }
          });
          logEl.appendChild(dataEl);
        }

        this.logContainer.appendChild(logEl);
      });

      // Auto-scroll to bottom
      this.logContainer.scrollTop = this.logContainer.scrollHeight;
    }

    refreshSnapshotsList(container) {
      if (!container) return;

      container.innerHTML = '';

      const snapshots = SnapshotManager.list();

      if (snapshots.length === 0) {
        container.innerHTML = '<div style="text-align: center; color: #666; padding: 20px;">No snapshots captured yet</div>';
        return;
      }

      snapshots.forEach((snapshot, index) => {
        const row = Utils.createElement('div', {
          style: {
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '12px',
            background: '#252525',
            borderRadius: '6px',
            border: '1px solid #333'
          }
        });

        const info = Utils.createElement('div', {
          style: { flex: '1' }
        });

        const labelEl = Utils.createElement('div', {
          textContent: snapshot.label,
          style: {
            color: '#4CAF50',
            fontWeight: '600',
            fontSize: '14px',
            marginBottom: '4px'
          }
        });

        const timeEl = Utils.createElement('div', {
          textContent: new Date(snapshot.timestamp).toLocaleString(),
                                           style: {
                                             color: '#999',
                                             fontSize: '12px'
                                           }
        });

        const injectsEl = Utils.createElement('div', {
          textContent: snapshot.runningInjects.length > 0
          ? `${snapshot.runningInjects.length} inject(s) running`
          : 'No injects running',
          style: {
            color: '#666',
            fontSize: '11px',
            marginTop: '2px'
          }
        });

        info.appendChild(labelEl);
        info.appendChild(timeEl);
        info.appendChild(injectsEl);

        const buttonGroup = Utils.createElement('div', {
          style: {
            display: 'flex',
            gap: '6px'
          }
        });

        const restoreBtn = Utils.createElement('button', {
          textContent: '↻ Restore',
          style: {
            padding: '8px 16px',
            background: '#007bff',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '12px',
            fontWeight: '600'
          },
          events: {
            click: () => {
              SnapshotManager.restore(snapshot.id);
            }
          }
        });

        const deleteBtn = Utils.createElement('button', {
          textContent: '✕',
          style: {
            padding: '8px 12px',
            background: '#dc3545',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '12px'
          },
          events: {
            click: async () => {
              const confirmed = await Modal.confirm(`Delete snapshot "${snapshot.label}"?`);
              if (confirmed) {
                SnapshotManager.delete(snapshot.id);
              }
            }
          }
        });

        buttonGroup.appendChild(restoreBtn);
        buttonGroup.appendChild(deleteBtn);

        row.appendChild(info);
        row.appendChild(buttonGroup);
        container.appendChild(row);
      });
    }

    // NEW: CodeTweaker methods
    scanScripts(container) {
      container.innerHTML = '<div style="color:#999; text-align:center;padding:10px;">Scanning scripts...</div>';
      setTimeout(async () => {
        const scripts = [];
        document.querySelectorAll('script').forEach((s, idx) => {
          try {
            scripts.push({
              el: s,
              index: idx,
              src: s.src || null,
              inline: s.src ? null : s.textContent,
              type: s.type || 'text/javascript'
            });
          } catch (e) { /* skip */ }
        });

        // Detect import maps in the page: explicit <script type="importmap"> tags
        document.querySelectorAll('script[type="importmap"]').forEach((im, idx) => {
          try {
            const jsonText = im.textContent || '{}';
            const parsed = JSON.parse(jsonText);
            scripts.push({
              el: im,
              index: `importmap-${idx}`,
              src: null,
              inline: jsonText,
              type: 'importmap',
              importMap: parsed.imports || parsed
            });
          } catch (e) {
            // If parse fails, still include raw content for inspection
            scripts.push({
              el: im,
              index: `importmap-${idx}`,
              src: null,
              inline: im.textContent || '',
              type: 'importmap',
              importMap: null
            });
          }
        });

        // Also try to find import-map-like JSON blocks inside other inline scripts (fallback)
        document.querySelectorAll('script:not([src])').forEach((s, idx) => {
          try {
            const txt = s.textContent || '';
            if (txt.includes('"imports"') || txt.includes("'imports'")) {
              const match = txt.match(/\{[\s\S]*?"imports"\s*:\s*\{[\s\S]*?\}\s*\}/);
              if (match) {
                try {
                  const parsed = JSON.parse(match[0]);
                  scripts.push({
                    el: s,
                    index: `inline-importmap-${idx}`,
                    src: null,
                    inline: match[0],
                    type: 'importmap-inline',
                    importMap: parsed.imports || parsed
                  });
                } catch (e) {
                  // push raw if JSON.parse failed
                  scripts.push({
                    el: s,
                    index: `inline-importmap-${idx}`,
                    src: null,
                    inline: match[0],
                    type: 'importmap-inline',
                    importMap: null
                  });
                }
              }
            }
          } catch (e) { /* ignore */ }
        });

        // Expand importMap entries into concrete script/module references (resolve relative paths)
        try {
          const seenUrls = new Set(scripts.filter(s=>s.src).map(s=>s.src));
          const importMaps = scripts.filter(s=>s.importMap && typeof s.importMap === 'object');
          importMaps.forEach((im, imIdx) => {
            Object.entries(im.importMap).forEach(([specifier, ref]) => {
              try {
                const resolved = (typeof ref === 'string') ? (new URL(ref, document.baseURI).href) : null;
                if (resolved && !seenUrls.has(resolved)) {
                  seenUrls.add(resolved);
                  scripts.push({
                    el: null,
                    index: `importmap-ref-${imIdx}-${specifier}`,
                    src: resolved,
                    inline: null,
                    type: 'module (importmap ref)',
                               importSpecifier: specifier,
                               fromImportMap: true
                  });
                }
              } catch(e){ /* ignore resolution errors */ }
            });
          });
        } catch(e) { /* ignore importMap expansion errors */ }

        this.displayScripts(scripts, container);
      }, 100);
    }

    async displayScripts(scripts, container) {
      container.innerHTML = '';
      if (!scripts.length) {
        container.innerHTML = '<div style="text-align:center;color:#666;padding:12px;">No scripts found</div>';
        return;
      }

      scripts.forEach((script, i) => {
        const row = Utils.createElement('div', { style: { background:'#1a1a1a', padding:'8px', borderRadius:'6px', border:'1px solid #333', marginBottom:'8px' } });
        const title = Utils.createElement('div', { textContent: script.src ? `External: ${script.src}` : `Inline script #${script.index}`, style: { fontWeight:'600', fontSize:'13px', marginBottom:'6px', wordBreak: 'break-all' } });
        const editBtn = Utils.createElement('button', { textContent:'Edit', style: { padding:'6px 12px', background:'#007bff', color:'#fff', border:'none', borderRadius:'4px', cursor:'pointer', marginRight:'8px' } });
        const fetchBtn = Utils.createElement('button', { textContent:'Load Source', style: { padding:'6px 12px', background:'#6c757d', color:'#fff', border:'none', borderRadius:'4px', cursor:'pointer' } });
        row.appendChild(title);
        row.appendChild(editBtn);
        row.appendChild(fetchBtn);
        container.appendChild(row);

        const openEditor = async (sourceCode) => {
          const textarea = Utils.createElement('textarea', { style: { width:'100%', height:'300px', background:'#0d0d0d', color:'#fff', padding:'8px', border:'1px solid #444', borderRadius:'4px', fontFamily:'monospace' } });
          textarea.value = sourceCode || '';
          const saveBtn = Utils.createElement('button', { textContent:'Save & Apply', style: { padding:'8px 14px', background:'#28a745', color:'#fff', border:'none', borderRadius:'6px', cursor:'pointer', marginRight:'8px' } });
          const cancelBtn = Utils.createElement('button', { textContent:'Cancel', style: { padding:'8px 14px', background:'#dc3545', color:'#fff', border:'none', borderRadius:'6px', cursor:'pointer' } });
          const editorWrap = Utils.createElement('div', { style: { marginTop:'8px', display:'flex', flexDirection:'column', gap:'8px' } });
          editorWrap.appendChild(textarea);
          const btnRow = Utils.createElement('div', { style: { display:'flex', gap:'8px' } });
          btnRow.appendChild(saveBtn);
          btnRow.appendChild(cancelBtn);
          editorWrap.appendChild(btnRow);
          row.appendChild(editorWrap);
          saveBtn.addEventListener('click', async () => {
            try {
              this.applyScriptEdit(script, textarea.value);
              Modal.alert('Script applied for this session. Reload page to restore original.');
            } catch (e) {
              Modal.alert('Error applying script: ' + e.message);
            }
          });
          cancelBtn.addEventListener('click', () => editorWrap.remove());
        };

        fetchBtn.addEventListener('click', async () => {
          if (script.src) {
            try {
              const res = await fetch(script.src, { cache: 'no-store', credentials: 'omit' });
              const text = await res.text();
              openEditor(text);
            } catch (e) {
              Modal.alert('Failed to fetch script source. It might be blocked by the browser.');
            }
          } else {
            openEditor(script.inline || '');
          }
        });

        editBtn.addEventListener('click', () => {
          if (script.inline) {
            openEditor(script.inline);
          } else {
            fetchBtn.click();
          }
        });
      });
    }

    applyScriptEdit(originalScript, newCode) {
      // Mark original disabled for session and inject new script
      try {
        const marker = originalScript && originalScript.el ? originalScript.el : null;

        // Create injected script node (preserve module type if possible)
        const injected = document.createElement('script');
        injected.className = 'fuckery-element';
        if (originalScript && originalScript.type === 'module') injected.type = 'module';
        injected.textContent = newCode;
        injected.setAttribute('data-fuckery-modified', '1');

        if (marker) {
          // Attempt graceful teardown: try to disable/stop if possible, then remove
          try { marker.setAttribute('data-fuckery-original-disabled', '1'); } catch(e) {}
          try { marker.type = 'javascript/disabled'; } catch(e) {}
          try { marker.remove(); } catch(e) { try { marker.style.display = 'none'; } catch(_){} }
          // Insert modified script next so it runs in roughly same context
          try { marker.parentNode ? marker.parentNode.insertBefore(injected, marker.nextSibling) : document.head.appendChild(injected); } catch(e) { document.head.appendChild(injected); }
        } else {
          // No marker (resolved importmap entry): inject into head as module/classic matching original hint
          document.head.appendChild(injected);
        }

        Logger.info('CODETWEAKER', `Applied modified script (${originalScript && (originalScript.src || 'inline#' + originalScript.index) || 'unknown'}) and started it in-session`);
      } catch (e) {
        Logger.error('CODETWEAKER', 'Failed to apply script edit', { error: e.message });
        throw e;
      }
    }
  };

  // Initialize everything
  Logger.info('INIT', `Starting FuckeryMenu v${CONFIG.VER} initialization`);
  const ui = new FuckeryMenuUI();

  // Global API
  window.__FuckeryMenu = ui;

  // Add fcom global object for programmatic control
  window.fcom = {
    open: () => {
      Logger.ui('FCOM', 'Menu toggled via fcom.open()');
      ui.toggle();
    }
  };

  // Auto-open if enabled
  if (Settings.get('autoOpen')) {
    Logger.info('INIT', 'Auto-opening FuckeryMenu (setting enabled)');
    ui.show();
  }

  // Add global styles
  Styles.addGlobal('main', `
  .fuckery-element * {
    box-sizing: border-box;
  }

  .fuckery-element button:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  }

  .fuckery-element input:focus,
  .fuckery-element textarea:focus {
    outline: 2px solid #007bff;
    outline-offset: -2px;
  }

  .fuckery-element::-webkit-scrollbar {
    width: 8px;
  }

  .fuckery-element::-webkit-scrollbar-track {
    background: #1a1a1a;
  }

  .fuckery-element::-webkit-scrollbar-thumb {
    background: #444;
    border-radius: 4px;
  }

  .fuckery-element::-webkit-scrollbar-thumb:hover {
    background: #555;
  }
  `);

  Logger.info('INIT', `FuckeryMenu v${ui.version} initialization complete`);
  Logger.info('HELP', 'Press F8 to open/close the menu');

  console.log(`🔥 FuckeryMenu v${ui.version} loaded! Press F8 to open the menu`);
})();


// ==UserScript==
// @name         FuckeryMenu
// @namespace    http://tampermonkey.net/
// @version      9.0.0-bugfix2
// @description  Injector modmenu
// @author       1st
// @match        *://*/*
// @grant        none
// @require      https://cdn.jsdelivr.net/npm/pako@2.1.0/dist/pako.min.js
// @downloadURL  3j53dm6mz8p0w3ixr_2h.c.websim.com/FuckeryMenu.user.js
// @updateURL    3j53dm6mz8p0w3ixr_2h.c.websim.com/FuckeryMenu.user.js
// ==/UserScript==

// FuckeryMenu - A chaotic web injector for creative website modification
// Copyright (C) 2025
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
// GNU General Public License for more details.
//
// ============================================================
// NO WARRANTY
// ============================================================
//
// THERE IS NO WARRANTY FOR THE PROGRAM, TO THE EXTENT PERMITTED BY
// APPLICABLE LAW. EXCEPT WHEN OTHERWISE STATED IN WRITING THE COPYRIGHT
// HOLDERS AND/OR OTHER PARTIES PROVIDE THE PROGRAM "AS IS" WITHOUT WARRANTY
// OF ANY KIND, EITHER EXPRESSED OR IMPLIED, INCLUDING, BUT NOT LIMITED TO,
// THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR
// PURPOSE. THE ENTIRE RISK AS TO THE QUALITY AND PERFORMANCE OF THE PROGRAM
// IS WITH YOU. SHOULD THE PROGRAM PROVE DEFECTIVE, YOU ASSUME THE COST OF
// ALL NECESSARY SERVICING, REPAIR OR CORRECTION.
//
// ============================================================
// GNU GENERAL PUBLIC LICENSE - VERSION 3
// ============================================================
//
// The GNU General Public License is a free, copyleft license for software
// and other kinds of works.
//
// The licenses for most software and other practical works are designed to
// take away your freedom to share and change the works. By contrast, the
// GNU General Public License is intended to guarantee your freedom to share
// and change all versions of a program--to make sure it remains free
// software for all its users. We, the Free Software Foundation, use the
// GNU General Public License for most of our software; it applies also to
// any other work released this way by its authors. You can apply it to
// your programs, too.
//
// When we speak of free software, we are referring to freedom, not price.
// Our General Public Licenses are designed to make sure that you have the
// freedom to distribute copies of free software (and charge for them if
// you wish), that you receive source code or can get it if you want it,
// that you can change the software or use pieces of it in new free programs,
// and that you know you can do these things.
//
// To protect your rights, we need to prevent others from denying you these
// rights or asking you to surrender the rights. Therefore, you have certain
// responsibilities if you distribute copies of the software, or if you
// modify it: responsibilities to respect the freedom of others.
//
// For example, if you distribute copies of such a program, whether gratis
// or for a fee, you must pass on to the recipients the same freedoms that
// you received. You must make sure that they, too, receive or can get the
// source code. And you must show them these terms so they know their rights.
//
// Developers that use the GNU GPL protect your rights with two steps:
// (1) assert copyright on the software, and (2) offer you this License
// giving you legal permission to copy, distribute and/or modify it.
//
// For the developers' and authors' protection, the GPL clearly explains
// that there is no warranty for this free software. For both users' and
// authors' sake, the GPL requires that modified versions be marked as
// changed, so that their problems will not be attributed erroneously to
// authors of previous versions.
//
// Some devices are designed to deny users access to install or run modified
// versions of the software inside them, although the manufacturer can do so.
// This is fundamentally incompatible with the aim of protecting users'
// freedom to change the software. The systematic pattern of such abuse
// occurs in the area of products for individuals to use, which is precisely
// where it is most unacceptable. Therefore, we have designed this version
// of the GPL to prohibit the practice for those products. If such problems
// arise substantially in other domains, we stand ready to extend this
// provision to those domains in future versions of the GPL, as needed to
// protect the freedom of users.
//
// Finally, every program is threatened constantly by software patents.
// States should not allow patents to restrict development and use of
// software on general-purpose computers, but in those that do, we wish to
// avoid the special danger that patents applied to a free program could
// make it effectively proprietary. To prevent this, the GPL assures that
// patents cannot be used to render the program non-free.
//
// (GNU Public License 3.0 shenanegains)
//
// You should have received a copy of the GNU General Public License
// along with this program. If not, see <https://www.gnu.org/licenses/>.
