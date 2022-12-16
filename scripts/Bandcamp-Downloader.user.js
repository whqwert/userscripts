// ==UserScript==
// @name         Bandcamp Downloader
// @namespace    https://github.com/whqwert/userscripts
// @version      1.1.0
// @description  Adds a download link to songs on Bandcamp
// @author       whqwert
// @match        https://*.bandcamp.com/*
// @icon         https://s4.bcbits.com/img/favicon/favicon-32x32.png
// @supportURL   https://github.com/whqwert/userscripts/issues
// @license      MIT
// @grant        GM_download
// ==/UserScript==

(function () {
	'use strict';
	const isMobile = document.getElementsByClassName('webkit').length;

	const table = document.querySelectorAll('#track_table > tbody > tr');
	const adata = unsafeWindow.TralbumData;

	if (!adata) return;

	const albutton = document.querySelector(
		isMobile ? '.main-button' : '.share-collect-controls > ul'
	);

	const downloadButtonHTML = isMobile
		? `<h4 class="ft compound-button" id="download-button">
			<button type="button" class="download-link buy-link">
				Download Track
			</button>
			&nbsp;
		</h4>`
		: `<li id="download-button">
			<span class="bc-ui2 share-embed-icon" style="
				clip-path: polygon(65% 0%, 15% 50%, 15% 85%, 65% 80%, 100% 37%);
				transform: rotate(90deg) scale(1.06);
			"></span>
			<span class="share-embed-label">
				<button type="button">
					Download
				</button>
			</span>
		</li>`;

	function downloadSong(file, title) {
		GM_download({
			url: file,
			name: adata.artist + ' - ' + title + '.mp3',
			saveAs: true
		});
	}

	if (table.length) {
		// isAlbum
		const dlinks = document.getElementsByClassName('dl_link');
		for (const [i, track] of adata.trackinfo.entries()) {
			const link = dlinks[i];
			const file = track.file['mp3-128'];
			const title = track.title;

			link.innerHTML = `<a
				href="${file}"
				title="${adata.artist} - ${title}">
				download
			</a>`;
			link.firstChild.onclick = () => {
				downloadSong(file, title);
				return false;
			};
		}
	} else {
		// isSong
		const file = unsafeWindow.TralbumData.trackinfo[0].file['mp3-128'];
		albutton.insertAdjacentHTML(
			isMobile ? 'afterend' : 'beforeend',
			downloadButtonHTML
		);
		document.getElementById('download-button').onclick = () => {
			downloadSong(file, adata.current.title);
		};
	}
})();
