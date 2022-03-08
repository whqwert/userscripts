// ==UserScript==
// @name         Old Reddit Broken Link Fixer
// @namespace    https://github.com/whqwert/userscripts
// @version      1.2.4
// @description  Fixes incorrect backslash placement in links on Old Reddit
// @author       whqwert
// @match        https://*.reddit.com/*/*/comments/*
// @icon         https://www.reddit.com/favicon.ico
// @supportURL   https://github.com/whqwert/userscripts/issues
// @license      MIT
// @run-at       document-start
// ==/UserScript==

(function () {
	'use strict';

	// Function that actually removes the backslashes from links
	function removeBackslashes(a) {
		a.href = a.href.replace(/%5C([\-_"])/g, '$1');
		a.innerText = a.innerText.replace(/\\([\-_"])/g, '$1');
	}

	// For link in comments and post, remove backslashes in link
	function fixAllLinks() {
		document
			.querySelectorAll(
				`#siteTable > .thing > .entry > .expando > form > .usertext-body > .md a[href*="%5C"],
				.commentarea > .sitetable > .thing a[href*="%5C"]`
			)
			.forEach(a => {
				removeBackslashes(a);
			});
	}

	// When the 'load more comments' button is pressed, it waits for new comments to load and then runs the link fixer
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
		new MutationObserver(function () {
			const more = document.querySelector('a[id^="more_"]'); // 'load more comments' button
			if (more) {
				more.addEventListener('click', function () {
					observeNewComments();
				});
				this.disconnect();
			}
		}).observe(document.querySelector('.commentarea'), {
			subtree: true,
			childList: true
		});
	}

	function runLinkFixer(observer) {
		observer.disconnect();
		fixAllLinks();
		addMoreButtonListener();
	}

	// Fix links on load
	new MutationObserver(function () {
		if (document.getElementsByClassName('commentarea').length) {
			runLinkFixer(this);
		}
	}).observe(document, {
		subtree: true,
		childList: true
	});
})();
