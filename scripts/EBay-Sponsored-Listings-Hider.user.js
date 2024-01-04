// ==UserScript==
// @name         eBay Sponsored Listings Hider
// @namespace    https://github.com/whqwert/userscripts
// @version      1.0.0
// @description  Hides sponsored listings on eBay
// @author       whqwert
// @match        https://www.ebay.com/sch/i.html
// @icon         https://pages.ebay.com/favicon.ico
// @supportURL   https://github.com/whqwert/userscripts/issues
// @license      MIT
// @grant        none
// @run-at       document-start
// ==/UserScript==

// hijack attachShadow to make shadow DOMs always be open
Element.prototype._attachShadow = Element.prototype.attachShadow;
Element.prototype.attachShadow = function () {
	return this._attachShadow({ mode: 'open' });
};

window.addEventListener('load', () => {
	const sponsoredLabels = [...document.getElementsByClassName('s-item__sep')]
		// find 'Sponsored' label
		.map((sep) => sep.firstElementChild.shadowRoot.lastElementChild)
		// only hide if 'Sponsored' label is visible
		.filter((label) => window.getComputedStyle(label).display !== 'none');

	for (const label of sponsoredLabels) {
		let listing = label.getRootNode().host.parentElement;
		while (listing.classList[0] !== 's-item') {
			listing = listing.parentElement;
		}
		listing.style.display = 'none';
	}
});
