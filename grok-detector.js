// ==UserScript==
// @name         Grok Imagine Link Detector
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Detect and capture links while scrolling on Grok Imagine
// @author       Antigravity
// @match        https://grok.com/imagine*
// @grant        GM_setClipboard
// ==/UserScript==

(function () {
    'use strict';

    console.log("Grok Imagine Link Detector Active!");

    const capturedLinks = new Set();

    // UI for feedback
    const ui = document.createElement('div');
    ui.style.position = 'fixed';
    ui.style.bottom = '20px';
    ui.style.right = '20px';
    ui.style.zIndex = '9999';
    ui.style.background = '#0f172a';
    ui.style.color = 'white';
    ui.style.padding = '12px';
    ui.style.borderRadius = '8px';
    ui.style.border = '1px solid #334155';
    ui.style.boxShadow = '0 4px 6px -1px rgb(0 0 0 / 0.1)';
    ui.innerHTML = `
        <div style="font-weight: bold; margin-bottom: 8px;">Grok Vault Helper</div>
        <div id="capture-count">Captured: 0</div>
        <button id="copy-all" style="margin-top: 8px; background: #3b82f6; border: none; color: white; padding: 4px 8px; border-radius: 4px; cursor: pointer;">Copy for Vault</button>
    `;
    document.body.appendChild(ui);

    const updateCount = () => {
        document.getElementById('capture-count').innerText = `Captured: ${capturedLinks.size}`;
    };

    document.getElementById('copy-all').onclick = () => {
        const data = Array.from(capturedLinks).map(link => ({
            url: link,
            title: "Captured from Grok",
            tags: ["Captured"]
        }));
        GM_setClipboard(JSON.stringify(data));
        alert("Copied " + capturedLinks.size + " links to clipboard for AI Vault!");
    };

    const detector = () => {
        // Detect Grok post links (pattern: /imagine/post/...)
        const links = document.querySelectorAll('a[href*="/imagine/post/"]');
        links.forEach(l => {
            const href = l.href;
            if (!capturedLinks.has(href)) {
                capturedLinks.add(href);
                console.log("Detected new link:", href);
                updateCount();
            }
        });
    };

    // Run on scroll
    window.addEventListener('scroll', detector);
    // Also run on interval for dynamic loading
    setInterval(detector, 2000);

})();
