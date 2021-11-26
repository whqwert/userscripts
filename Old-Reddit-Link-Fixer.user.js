// ==UserScript==
// @name         Old Reddit Broken Link Fixer
// @namespace    https://github.com/qwhert/userscripts
// @version      1.0.0
// @description  Fixes incorrect backslash placement in links on Old Reddit
// @author       whqwert
// @match        https://*.reddit.com/*/*/comments/*
// @icon         https://www.reddit.com/favicon.ico
// @supportURL   https://github.com/qwhert/userscripts/issues
// @license      MIT
// @run-at       document-start
// ==/UserScript==

(function () {
    'use strict';

    function removeBackslashes(a) {
        a.href = a.href.replace(/%5C(_|")/g, "$1");
        a.innerText = a.innerText.replace(/\\(_|")/g, "$1");
    }

    function fixLinks() {
        // Posts
        document.querySelectorAll('#siteTable > .thing > .entry > .expando > form > .usertext-body > .md a[href*="%5C"]')
            .forEach(a => {
                removeBackslashes(a);
            })
        // Comments
        document.querySelectorAll('.commentarea > .sitetable > .thing a[href*="%5C"]')
            .forEach(a => {
                removeBackslashes(a);
            })
    }

    new MutationObserver((ms, me) => {
        if (document.getElementsByClassName('commentarea').length) {
            me.disconnect();
            fixLinks();
            return;
        }
    }).observe(document, {
        subtree: true,
        childList: true
    });
})();
