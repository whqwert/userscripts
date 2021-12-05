// ==UserScript==
// @name         Old Reddit Broken Link Fixer
// @namespace    https://github.com/qwhert/userscripts
// @version      1.2.2
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
		a.href = a.href.replace(/%5C([\-_"])/g, '$1');
		a.innerText = a.innerText.replace(/\\([\-_"])/g, '$1');
	}

	function fixLinks() {
		// Posts
		document
			.querySelectorAll(
				'#siteTable > .thing > .entry > .expando > form > .usertext-body > .md a[href*="%5C"]'
			)
			.forEach(a => {
				removeBackslashes(a);
			});
		// Comments
		document
			.querySelectorAll(
				'.commentarea > .sitetable > .thing a[href*="%5C"]'
			)
			.forEach(a => {
				removeBackslashes(a);
			});
	}

	function observeNewComments() {
		const wait = document.querySelector('.commentarea > .sitetable');
		if (wait) {
			new MutationObserver(function () {
				runLinkFixer(this);
			}).observe(wait, {
				childList: true
			});
		}
	}

	function addMoreButtonListener() {
		const more = document.querySelector('a[id^="more"]');
		if (more) {
			more.addEventListener('click', function () {
				observeNewComments();
			});
		}
	}

	function runLinkFixer(obs) {
		obs.disconnect();
		fixLinks();
		addMoreButtonListener();
	}

	new MutationObserver(function () {
		if (document.getElementsByClassName('commentarea').length) {
			runLinkFixer(this);
		}
	}).observe(document, {
		subtree: true,
		childList: true
	});
})();
