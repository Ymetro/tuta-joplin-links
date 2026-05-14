// ==UserScript==
// @name         Joplin x-callback-url Button for Tuta
// @namespace    https://github.com/Ymetro
// @version      3.3.1
// @description  Floating overlay buttons for Joplin links in Tuta – positioned right of link text
// @author       Ymetro
// @match        https://app.tuta.com/*
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    const JOPLIN_PREFIX = 'joplin://';
    const OVERLAY_ID = 'joplin-overlay-root';
    let isRendering = false;
    let scanTimer = null;

    // ─── Inject CSS once ─────────────────────────────────────────────────
    function injectCSS() {
        if (document.getElementById('joplin-cb-css')) return;
        const style = document.createElement('style');
        style.id = 'joplin-cb-css';
        style.textContent = `
            .joplin-float-btn {
                position: fixed;
                z-index: 999999;
                padding: 2px 10px;
                font-size: 12px;
                cursor: pointer;
                background: #2196F3;
                color: white;
                border: none;
                border-radius: 4px;
                line-height: 1.6;
                box-shadow: 0 2px 6px rgba(0,0,0,0.3);
                pointer-events: auto;
                white-space: nowrap;
            }
            .joplin-float-btn:hover {
                background: #1976D2;
            }
        `;
        document.head.appendChild(style);
    }

    // ─── Anchor launcher ─────────────────────────────────────────────────
    // Creates a temporary anchor element to trigger the joplin:// protocol
    function launchJoplin(url) {
        const a = document.createElement('a');
        a.href = url;
        a.target = '_blank';
        a.rel = 'noopener noreferrer';
        a.style.display = 'none';
        document.body.appendChild(a);
        a.click();
        setTimeout(() => document.body.removeChild(a), 500);
    }

    // ─── Overlay container ───────────────────────────────────────────────
    // Returns (or creates) a fixed, zero-size overlay div to hold all buttons
    function getOverlay() {
        let overlay = document.getElementById(OVERLAY_ID);
        if (!overlay) {
            overlay = document.createElement('div');
            overlay.id = OVERLAY_ID;
            overlay.style.cssText = 'position:fixed;top:0;left:0;width:0;height:0;overflow:visible;z-index:999998;pointer-events:none;';
            document.body.appendChild(overlay);
        }
        return overlay;
    }

    // ─── Remove all floating buttons ─────────────────────────────────────
    function clearButtons() {
        const overlay = document.getElementById(OVERLAY_ID);
        if (overlay) overlay.innerHTML = '';
    }

    // ─── Create a floating button to the right of the text node ──────────
    // Positions the button using getBoundingClientRect() of the text node
    function makeFloatingButton(textNode, url) {
        try {
            if (!textNode.isConnected) return;

            const range = document.createRange();
            range.selectNode(textNode);
            const rect = range.getBoundingClientRect();
            if (!rect || rect.width === 0 || rect.height === 0) return;

            const btn = document.createElement('button');
            btn.className = 'joplin-float-btn';
            btn.textContent = '📓 Open in Joplin';
            btn.title = url;

            // Vertically center the button relative to the text node
            const btnHeight = 24;
            btn.style.top = Math.round(rect.top + (rect.height - btnHeight) / 2) + 'px';
            btn.style.left = (rect.right + 8) + 'px';

            btn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                launchJoplin(url);
            });

            getOverlay().appendChild(btn);
        } catch (err) {
            // Node already removed from DOM — silently ignore
        }
    }

    // ─── Scan the page for Joplin text nodes ─────────────────────────────
    // Uses a TreeWalker to find all visible text nodes starting with joplin://
    function scanAndRender() {
        isRendering = true;

        clearButtons();

        const walker = document.createTreeWalker(
            document.body,
            NodeFilter.SHOW_TEXT,
            {
                acceptNode(node) {
                    // Skip nodes inside our own overlay to prevent infinite loops
                    if (node.parentElement?.closest('#' + OVERLAY_ID)) {
                        return NodeFilter.FILTER_REJECT;
                    }
                    const val = node.nodeValue?.trim();
                    return (val && val.startsWith(JOPLIN_PREFIX))
                        ? NodeFilter.FILTER_ACCEPT
                        : NodeFilter.FILTER_REJECT;
                }
            }
        );

        const found = [];
        let node;
        while ((node = walker.nextNode())) found.push(node);
        found.forEach(n => makeFloatingButton(n, n.nodeValue.trim()));

        isRendering = false;
    }

    // ─── Reposition buttons on window resize ─────────────────────────────
    window.addEventListener('resize', () => scanAndRender());

    // ─── MutationObserver ────────────────────────────────────────────────
    // Watches for DOM changes in Tuta's SPA and re-scans when relevant
    const observer = new MutationObserver((mutations) => {
        if (isRendering) return; // Ignore mutations caused by our own rendering

        const relevant = mutations.some(mut =>
            !mut.target?.closest?.('#' + OVERLAY_ID)
        );
        if (!relevant) return;

        // Debounce: wait 300ms after last mutation before re-scanning
        clearTimeout(scanTimer);
        scanTimer = setTimeout(scanAndRender, 300);
    });

    observer.observe(document.body, {
        childList: true,
        subtree:   true,
    });

    // ─── Initialise ───────────────────────────────────────────────────────
    injectCSS();
    scanAndRender();

})();
