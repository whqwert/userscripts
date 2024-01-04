// ==UserScript==
// @name         eBay Sponsored Listings Hider
// @namespace    https://github.com/whqwert/userscripts
// @version      2.0.0
// @description  Hides sponsored listings on eBay
// @author       whqwert
// @match        https://www.ebay.com/sch/i.html
// @icon         https://pages.ebay.com/favicon.ico
// @supportURL   https://github.com/whqwert/userscripts/issues
// @license      MIT
// @grant        none
// @run-at       document-start
// ==/UserScript==

// block templates from being turned into shadow roots
Element.prototype.attachShadow = () => {};

new MutationObserver((_, obs) => {
	// wait for search results to exist
	if (!document.getElementById('mainContent')) return;
	obs.disconnect();

	for (const template of document.querySelectorAll('template[shadowrootmode]')) {
		// extract wrapper div from template so getComputedStyle can be used
		const wrapper = template.parentElement;
		template.outerHTML = template.innerHTML;

		const [style, span] = wrapper.children;

		// is sponsored?
		if (window.getComputedStyle(span).display !== 'none') {
			// find full listing element
			let listing = wrapper.parentElement;
			while (listing.classList[0] !== 's-item') {
				listing = listing.parentElement;
			}

			// hide sponsored listing
			listing.style.display = 'none';
		}

		// disable span style to stop page from breaking
		style.disabled = true;
		span.style.display = 'none';
	}
}).observe(document.documentElement, { childList: true, subtree: true });
