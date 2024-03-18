// ==UserScript==
// @name         eBay Sponsored Listings Hider
// @namespace    https://github.com/whqwert/userscripts
// @version      3.0.0
// @description  Hides sponsored listings on eBay
// @author       whqwert
// @match        https://www.ebay.*/sch/*
// @icon         https://pages.ebay.com/favicon.ico
// @supportURL   https://github.com/whqwert/userscripts/issues
// @license      MIT
// @grant        none
// @run-at       document-start
// ==/UserScript==

new MutationObserver((_, obs) => {
	// wait for search results
	if (!document.getElementById('mainContent')) return;
	obs.disconnect();

	for (const label of document.querySelectorAll('[data-w] > div')) {
		const style = window.getComputedStyle(label);

		// position offsets
		const o1 = parseInt(style['padding-top']);
		const o2 = new DOMMatrixReadOnly(style.transform).f;
		const o3 = parseInt(style['margin-top']);

		// is visible (not moved)
		const sponsored = o1 + o2 + o3 === 0;

		if (sponsored) {
			// hide listing
			label.closest('.s-item').style.display = 'none';
		}
	}
}).observe(document.documentElement, { childList: true, subtree: true });
