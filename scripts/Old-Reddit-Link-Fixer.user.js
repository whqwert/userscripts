// ==UserScript==
// @name         Old Reddit Broken Link Fixer
// @namespace    https://github.com/whqwert/userscripts
// @version      1.2.7
// @description  Fixes incorrectly escaped characters in links on Old Reddit
// @author       whqwert
// @match        https://*.reddit.com/*/*/comments/*
// @icon         https://www.reddit.com/favicon.ico
// @supportURL   https://github.com/whqwert/userscripts/issues
// @license      MIT
// @grant        none
// @run-at       document-start
// ==/UserScript==

(function () {
	'use strict';

	// Not sure if quotes or dashes are incorrectly escaped anymore,
	// but I've seen a few old posts/comments where they are.
	function removeBackslashes(a) {
		a.href = a.href.replace(/%5C([-_"])/g, '$1');
		a.innerText = a.innerText.replace(/\\([-_"])/g, '$1');
	}

	// For link in comments and post, remove backslashes in link
	function fixAllLinks() {
		for (const link of document.querySelectorAll(
			`#siteTable > .thing > .entry > .expando > form > .usertext-body > .md a[href*="%5C"],
			.commentarea > .sitetable > .thing a[href*="%5C"]`
		)) {
			removeBackslashes(link);
		}
	}

	// When the 'load more comments' button is pressed,
	// it waits for new comments to load and then runs the link fixer
	function observeNewComments() {
		new MutationObserver((_, observer) => {
			runLinkFixer(observer);
		}).observe(document.querySelector('.commentarea > .sitetable'), {
			childList: true
		});
	}

	function addMoreButtonListener() {
		document
			.querySelector('a[id^="more_"]') // 'load more comments' button
			?.addEventListener('click', observeNewComments());
	}

	function runLinkFixer(observer) {
		observer.disconnect();
		fixAllLinks();
		addMoreButtonListener();
	}

	// Fix links on load
	new MutationObserver((_, observer) => {
		// Do nothing if there are no comments
		if (!document.getElementsByClassName('commentarea').length) return;
		runLinkFixer(observer);
	}).observe(document, {
		subtree: true,
		childList: true
	});
})();
