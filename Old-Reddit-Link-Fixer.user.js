// ==UserScript==
// @name         Old Reddit Broken Link Fixer
// @namespace    https://github.com/whqwert/userscripts
// @version      1.2.5
// @description  Fixes escaped characters in links on Old Reddit
// @author       whqwert
// @match        https://*.reddit.com/*/*/comments/*
// @icon         https://www.reddit.com/favicon.ico
// @supportURL   https://github.com/whqwert/userscripts/issues
// @license      MIT
// @run-at       document-start
// ==/UserScript==

(function () {
	'use strict';

	/*
	Function that removes the backslashes from links

	Not sure if quotes or dashes are incorrectly escaped anymore,
	but I've seen a few old posts/comments where they are.
	*/
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
		// 'load more comments' button
		const more = document.querySelector('a[id^="more_"]');
		if (more) {
			more.addEventListener('click', function () {
				observeNewComments();
			});
		}
	}

	function runLinkFixer(observer) {
		observer.disconnect();
		fixAllLinks();
		addMoreButtonListener();
	}

	/*
	Fix links on load

	Used with '@run-at document-start' to fix links as fast as possible
	*/
	new MutationObserver(function () {
		if (document.getElementsByClassName('commentarea').length) {
			runLinkFixer(this);
		}
	}).observe(document, {
		subtree: true,
		childList: true
	});
})();
