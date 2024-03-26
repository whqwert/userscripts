// ==UserScript==
// @name         eBay Sponsored Listings Hider
// @namespace    https://github.com/whqwert/userscripts
// @version      4.0.0
// @description  Hides sponsored listings on eBay
// @author       whqwert
// @match        https://www.ebay.*/sch/*
// @icon         https://pages.ebay.com/favicon.ico
// @supportURL   https://github.com/whqwert/userscripts/issues
// @license      MIT
// @grant        none
// ==/UserScript==

window.addEventListener('load', () => {
	// find sponsored label id
	const clipped = [...document.getElementsByClassName('clipped')[0].parentElement.querySelectorAll('[id]')];
	const sponsored = clipped[clipped.length - 1].id;

	for (const sep of document.getElementsByClassName('s-item__sep')) {
		// is sponsored?
		if (sep.firstElementChild.getAttribute('aria-labelledby') === sponsored) {
			// hide listing
			sep.closest('.s-item').style.display = 'none';
		}
	}
});
