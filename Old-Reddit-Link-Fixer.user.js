// ==UserScript==
// @name         Old Reddit Broken Link Fixer
// @namespace    https://github.com/qwhert/userscripts
// @version      0.1
// @description  Fixes incorrect URL backslash placement in comments
// @author       whqwert
// @match        https://*.reddit.com/*/*/comments/*
// @icon         https://www.reddit.com/favicon.ico
// @updateURL    https://github.com/qwhert/userscripts/raw/main/Old-Reddit-Link-Fixer.user.js
// @supportURL   https://github.com/qwhert/userscripts/issues
// @license      MIT
// @run-at       document-end
// ==/UserScript==
(function () {
    'use strict';
    document.querySelectorAll('.commentarea > .sitetable > .thing a[href*="%5C"]') // searches for urls in comments with backslashes
        .forEach(a => {
            // removes backslashes that are before underscores or quotes
            a.href = a.href.replace(/%5C(_|")/g, "$1");
            a.innerText = a.innerText.replace(/\\(_|")/g, "$1");
        })
})();
