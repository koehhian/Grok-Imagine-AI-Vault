(function () {
    'use strict';

    console.log("🚀 [Grok Vault Helper] Extension Loading...");

    // Cross-browser API shim
    const api = typeof chrome !== 'undefined' ? chrome : browser;

    let isLassoDragging = false;
    let startX, startY;
    let lassoBox = null;
    let selectedLinks = new Set();
    let capturedLinks = [];
    let isAutoEnabled = true;
    let currentLang = 'en';

    const TRANSLATIONS = {
        en: {
            title: "VAULT HELPER",
            secAuto: "Automatic",
            labelAuto: "Auto-Detect",
            labelCap: "Captured:",
            btnCopyAll: "COPY ALL CAPTURED",
            secRange: "Range Export",
            btnCopyRange: "COPY RANGE",
            secManual: "Manual Selection",
            labelSel: "Selected:",
            btnCopySel: "COPY SELECTED",
            hint: "💡 Shift + Drag to Lasso",
            copied: "COPIED! ✅",
            noRange: "⚠️ No links found in this range.",
            btnLike: "❤️ LIKE BATCH",
            btnClear: "CLEAR",
            rangePre: "No. ",
            rangePost: ""
        },
        'zh-TW': {
            title: "Vault 助手",
            secAuto: "自動偵測",
            labelAuto: "自動擷取",
            labelCap: "已偵測:",
            btnCopyAll: "複製全部擷取",
            secRange: "範圍導出",
            btnCopyRange: "複製範圍",
            secManual: "手動選取",
            labelSel: "已選取:",
            btnCopySel: "複製已選項目",
            hint: "💡 Shift + 拖弋 以套索選取",
            copied: "已複製! ✅",
            noRange: "⚠️ 此範圍內沒有連結。",
            btnLike: "❤️ 批次按愛心",
            btnClear: "清除",
            rangePre: "第 ",
            rangePost: " 張"
        },
        'zh-CN': {
            title: "Vault 助手",
            secAuto: "自动侦测",
            labelAuto: "自动抓取",
            labelCap: "已抓取:",
            btnCopyAll: "复制全部抓取",
            secRange: "范围导出",
            btnCopyRange: "复制范围",
            secManual: "手动选取",
            labelSel: "已选取:",
            btnCopySel: "复制已选项目",
            hint: "💡 Shift + 拖拽 以套索选取",
            copied: "已复制! ✅",
            noRange: "⚠️ 此范围内没有链接。",
            btnLike: "❤️ 批量按爱心",
            btnClear: "清除",
            rangePre: "第 ",
            rangePost: " 张"
        },
        ja: {
            title: "保管助手",
            secAuto: "自動検出",
            labelAuto: "自動キャプチャ",
            labelCap: "検出数:",
            btnCopyAll: "すべてコピー",
            secRange: "範囲エクスポート",
            btnCopyRange: "範囲コピー",
            secManual: "手動選択",
            labelSel: "選択数:",
            btnCopySel: "選択項目をコピー",
            hint: "💡 Shift + ドラッグで投げ縄選択",
            copied: "コピー完了! ✅",
            noRange: "⚠️ この範囲にはリンクがありません。",
            btnLike: "❤️ 一括いいね",
            btnClear: "クリア",
            rangePre: "第 ",
            rangePost: " 枚"
        }
    };

    const LANG_CYCLE = ['en', 'zh-TW', 'zh-CN', 'ja'];

    const init = () => {
        if (!document.body) {
            setTimeout(init, 100);
            return;
        }

        api.storage.local.get(['panelPos', 'autoEnabled', 'lang'], (result) => {
            isAutoEnabled = result.autoEnabled !== false;
            currentLang = result.lang || 'en';
            injectPanel(result.panelPos);
            setupGlobalListeners();
            startLoops();
            console.log("✅ [Grok Vault Helper] Extension Initialized.");
        });
    };

    const injectPanel = (savedPos) => {
        if (document.getElementById('grok-vault-panel')) return;

        const panel = document.createElement('div');
        panel.id = 'grok-vault-panel';

        const pos = savedPos || { bottom: '24px', right: '24px' };
        Object.assign(panel.style, pos);
        if (pos.top || pos.left) {
            panel.style.bottom = 'auto';
            panel.style.right = 'auto';
        }

        updatePanelContent(panel);
        document.body.appendChild(panel);
        setupPanelLogic(panel);
    };

    const updatePanelContent = (panel) => {
        const t = TRANSLATIONS[currentLang];
        panel.innerHTML = `
            <div class="grok-drag-handle">
                <div class="grok-header-left" id="grok-header-left">
                    <button id="grok-lang-btn" class="grok-lang-btn" title="Switch Language">🌐</button>
                    <div class="grok-lang-item" data-lang="en">EN</div>
                    <div class="grok-lang-item" data-lang="zh-TW">繁</div>
                    <div class="grok-lang-item" data-lang="zh-CN">简</div>
                    <div class="grok-lang-item" data-lang="ja">日</div>
                    <span id="grok-title-text">${t.title}</span>
                </div>
                <span>⠿</span>
            </div>

            <div class="grok-section-title" id="sec-auto">== ${t.secAuto} ==</div>
            <div class="grok-toggle-row">
                <span id="label-auto">${t.labelAuto}</span>
                <label class="grok-toggle-switch">
                    <input type="checkbox" id="grok-auto-toggle" ${isAutoEnabled ? 'checked' : ''}>
                    <span class="grok-toggle-slider"></span>
                </label>
            </div>
            <div class="grok-stat-row">
                <span id="label-cap">${t.labelCap}</span>
                <span id="grok-count-captured" class="grok-stat-val">0</span>
            </div>
            <button id="grok-copy-all" class="grok-btn btn-secondary">${t.btnCopyAll}</button>

            <div class="grok-section-title" id="sec-range">== ${t.secRange} ==</div>
            <div class="grok-range-group">
                <span>${t.rangePre}</span>
                <input type="number" id="grok-range-start" class="grok-range-input" value="1" min="1">
                <span>${t.rangePost}</span>
                <span class="grok-range-sep">~</span>
                <span>${t.rangePre}</span>
                <input type="number" id="grok-range-end" class="grok-range-input" value="1" min="1">
                <span>${t.rangePost}</span>
            </div>
            <button id="grok-copy-range" class="grok-btn btn-range">${t.btnCopyRange}</button>

            <div class="grok-section-title" id="sec-manual">== ${t.secManual} ==</div>
            <div class="grok-stat-row">
                <span id="label-sel">${t.labelSel}</span>
                <div class="grok-sel-val-group">
                    <span id="grok-count-selected" class="grok-stat-val" style="color: #00f2ff;">0</span>
                    <button id="grok-clear-selected" class="grok-btn-clear" title="${t.btnClear}">${t.btnClear}</button>
                </div>
            </div>
            <div class="grok-manual-btns">
                <button id="grok-copy-selected" class="grok-btn btn-primary" style="display:none;">${t.btnCopySel}</button>
                <button id="grok-like-selected" class="grok-btn btn-like" style="display:none;">${t.btnLike}</button>
            </div>

            <div class="grok-helper-hint" id="hint-text">${t.hint}</div>
        `;
    };

    const setupPanelLogic = (panel) => {
        let isPanelMoving = false;
        let ox, oy;
        const dragHandle = panel.querySelector('.grok-drag-handle');

        dragHandle.onmousedown = (e) => {
            if (e.target.id === 'grok-lang-btn' || e.target.closest('.grok-lang-item')) return;
            isPanelMoving = true;
            const rect = panel.getBoundingClientRect();
            ox = e.clientX - rect.left;
            oy = e.clientY - rect.top;
            e.preventDefault();
        };

        window.addEventListener('mousemove', (e) => {
            if (!isPanelMoving) return;
            const x = e.clientX - ox;
            const y = e.clientY - oy;
            panel.style.left = x + 'px';
            panel.style.top = y + 'px';
            panel.style.bottom = 'auto';
            panel.style.right = 'auto';
        });

        window.addEventListener('mouseup', () => {
            if (!isPanelMoving) return;
            isPanelMoving = false;
            api.storage.local.set({
                panelPos: { top: panel.style.top, left: panel.style.left }
            });
        });

        // Event Listeners
        const addListeners = (p) => {
            const langBtn = p.querySelector('#grok-lang-btn');
            const headerLeft = p.querySelector('#grok-header-left');

            langBtn.onclick = (e) => {
                e.stopPropagation();
                const isOpen = headerLeft.classList.toggle('grok-lang-menu-open');
                langBtn.classList.toggle('active', isOpen);
            };

            // Language Items click
            p.querySelectorAll('.grok-lang-item').forEach(item => {
                item.onclick = (e) => {
                    e.stopPropagation();
                    const newLang = item.getAttribute('data-lang');
                    setLanguage(newLang);
                };
            });

            p.querySelector('#grok-auto-toggle').onchange = (e) => {
                isAutoEnabled = e.target.checked;
                api.storage.local.set({ autoEnabled: isAutoEnabled });
                if (isAutoEnabled) scan();
            };
            p.querySelector('#grok-copy-selected').onclick = () => copyLinks(Array.from(selectedLinks), 'grok-copy-selected');
            p.querySelector('#grok-clear-selected').onclick = () => { selectedLinks.clear(); updateUI(); };
            p.querySelector('#grok-like-selected').onclick = handleBatchLike;
            p.querySelector('#grok-copy-all').onclick = () => copyLinks(capturedLinks, 'grok-copy-all');
            p.querySelector('#grok-copy-range').onclick = handleCopyRange;

            // Close menu when clicking elsewhere in panel
            p.onclick = () => {
                headerLeft.classList.remove('grok-lang-menu-open');
                langBtn.classList.remove('active');
            };
        };

        addListeners(panel);
        updateUI();
    };

    const setLanguage = (lang) => {
        currentLang = lang;
        api.storage.local.set({ lang: currentLang });

        const panel = document.getElementById('grok-vault-panel');
        if (panel) {
            // Explicitly close menu before re-rendering
            const headerLeft = panel.querySelector('#grok-header-left');
            const langBtn = panel.querySelector('#grok-lang-btn');
            if (headerLeft) headerLeft.classList.remove('grok-lang-menu-open');
            if (langBtn) langBtn.classList.remove('active');

            updatePanelContent(panel);
            setupPanelLogic(panel);
        }
    };

    const cycleLanguage = () => { // Kept for reference but not used in new fan-out UI
        const idx = LANG_CYCLE.indexOf(currentLang);
        currentLang = LANG_CYCLE[(idx + 1) % LANG_CYCLE.length];
        setLanguage(currentLang);
    };

    const handleCopyRange = () => {
        const start = parseInt(document.getElementById('grok-range-start').value) - 1;
        const end = parseInt(document.getElementById('grok-range-end').value);
        if (isNaN(start) || isNaN(end) || start < 0) return;

        const rangeLinks = capturedLinks.slice(start, end);
        if (rangeLinks.length === 0) {
            alert(TRANSLATIONS[currentLang].noRange);
            return;
        }
        copyLinks(rangeLinks, 'grok-copy-range');
    };

    const handleBatchLike = () => {
        const urlsToLike = selectedLinks.size > 0 ? Array.from(selectedLinks) : capturedLinks;
        if (urlsToLike.length === 0) return;

        const CARD_SELECTOR = '[role="listitem"]';
        let foundCount = 0;

        document.querySelectorAll(CARD_SELECTOR).forEach(card => {
            const url = extractPostUrl(card);
            if (urlsToLike.includes(url)) {
                const likeBtn = card.querySelector('button[aria-label="Like"], button[aria-label="Liked"]');
                if (likeBtn && likeBtn.getAttribute('aria-label') === 'Like') {
                    likeBtn.click();
                    foundCount++;
                }
            }
        });

        const btn = document.getElementById('grok-like-selected');
        const oldText = btn.innerText;
        if (foundCount > 0) {
            btn.innerText = `❤️ ${foundCount} DONE!`;
            btn.style.background = "#ef4444";
        } else {
            btn.innerText = "✨ ALL LIKED";
        }
        setTimeout(() => {
            btn.innerText = oldText;
            btn.style.background = "";
        }, 2000);
    };

    const copyLinks = (links, btnId) => {
        if (links.length === 0) return;
        const plainText = links.join('\n');

        navigator.clipboard.writeText(plainText).then(() => {
            const btn = document.getElementById(btnId);
            const oldText = btn.innerText;
            btn.innerText = TRANSLATIONS[currentLang].copied;
            btn.style.background = "#10b981";
            setTimeout(() => {
                btn.innerText = oldText;
                btn.style.background = "";
                if (btnId === 'grok-copy-selected') {
                    selectedLinks.clear();
                    updateUI();
                }
            }, 1500);
        });
    };

    const extractPostUrl = (card) => {
        const a = card.querySelector('a[href*="/imagine/post/"]');
        if (a) return a.href;
        const m = card.querySelector('img, video');
        const s = m?.src || m?.getAttribute('poster') || "";
        const id = s.match(/([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})/i);
        return id ? `https://grok.com/imagine/post/${id[1]}` : null;
    };

    const updateUI = () => {
        const cap = document.getElementById('grok-count-captured');
        const sel = document.getElementById('grok-count-selected');
        const bSel = document.getElementById('grok-copy-selected');
        const bLike = document.getElementById('grok-like-selected');
        const bAll = document.getElementById('grok-copy-all');

        if (cap) cap.innerText = capturedLinks.length;
        if (sel) sel.innerText = selectedLinks.size;

        if (bSel) bSel.style.display = selectedLinks.size > 0 ? 'block' : 'none';
        if (bLike) bLike.style.display = (selectedLinks.size > 0 || capturedLinks.length > 0) ? 'block' : 'none';

        if (bAll) bAll.innerText = `${TRANSLATIONS[currentLang].btnCopyAll} (${capturedLinks.length})`;

        const CARD_SELECTOR = '[role="listitem"]';
        document.querySelectorAll(CARD_SELECTOR).forEach(el => {
            const url = extractPostUrl(el);
            if (url && selectedLinks.has(url)) el.classList.add('grok-selected-card');
            else el.classList.remove('grok-selected-card');
        });
    };

    const scan = () => {
        if (!isAutoEnabled) return;
        const currentLinks = new Set(capturedLinks);
        const CARD_SELECTOR = '[role="listitem"]';
        document.querySelectorAll(CARD_SELECTOR).forEach(c => {
            const u = extractPostUrl(c);
            if (u && !currentLinks.has(u)) {
                capturedLinks.push(u);
            }
        });
        updateUI();
    };

    const setupGlobalListeners = () => {
        window.addEventListener('mousedown', (e) => {
            if (!e.shiftKey || e.button !== 0) return;
            isLassoDragging = true;
            startX = e.clientX + window.scrollX;
            startY = e.clientY + window.scrollY;
            lassoBox = document.createElement('div');
            lassoBox.className = 'grok-lasso-selection';
            document.body.appendChild(lassoBox);
            e.preventDefault();
        });

        window.addEventListener('mousemove', (e) => {
            if (!isLassoDragging) return;
            const cx = e.clientX + window.scrollX;
            const cy = e.clientY + window.scrollY;
            const l = Math.min(startX, cx);
            const t = Math.min(startY, cy);
            const w = Math.abs(startX - cx);
            const h = Math.abs(startY - cy);
            lassoBox.style.left = l + 'px';
            lassoBox.style.top = t + 'px';
            lassoBox.style.width = w + 'px';
            lassoBox.style.height = h + 'px';

            const box = { l, t, r: l + w, b: t + h };
            const CARD_SELECTOR = '[role="listitem"]';
            document.querySelectorAll(CARD_SELECTOR).forEach(el => {
                const r = el.getBoundingClientRect();
                const ar = {
                    l: r.left + window.scrollX,
                    t: r.top + window.scrollY,
                    r: r.right + window.scrollX,
                    b: r.bottom + window.scrollY
                };
                if (!(box.r < ar.l || box.l > ar.r || box.b < ar.t || box.t > ar.b)) {
                    const u = extractPostUrl(el);
                    if (u) selectedLinks.add(u);
                }
            });
            updateUI();
        });

        window.addEventListener('mouseup', () => {
            if (isLassoDragging) {
                isLassoDragging = false;
                lassoBox?.remove();
                lassoBox = null;
            }
        });

        window.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                selectedLinks.clear();
                updateUI();
            }
        });
    };

    const startLoops = () => {
        setInterval(scan, 2000);
        window.addEventListener('scroll', scan);
        scan();
    };

    init();
})();
