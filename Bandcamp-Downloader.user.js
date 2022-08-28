// ==UserScript==
// @name         Bandcamp Downloader
// @namespace    https://github.com/whqwert/userscripts
// @version      1.0.4
// @description  Adds a download link to songs on Bandcamp
// @author       whqwert
// @match        https://*.bandcamp.com/*
// @icon         https://s4.bcbits.com/img/favicon/favicon-32x32.png
// @supportURL   https://github.com/whqwert/userscripts/issues
// @license      MIT
// @grant        GM_download
// @run-at       document-end
// ==/UserScript==

(function () {
	'use strict';
	const table = document.querySelectorAll('#track_table > tbody > tr');
	const adata = unsafeWindow.TralbumData || false;

	if (adata) {
		const albutton = document.querySelector('.share-collect-controls > ul');
		const downloadButtonHTML = `<li id="download-button">
            <span class="bc-ui2 share-embed-icon" style="
				clip-path: polygon(65% 0%, 15% 50%, 15% 85%, 65% 80%, 100% 37%);
				transform: rotate(90deg) scale(1.07);
			"/>
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
			adata.trackinfo.forEach((track, i) => {
				const link = dlinks[i];
				const file = track.file['mp3-128'];
				const title = track.title;

				link.innerHTML = `<a
                    href="${file}"
                    title="${adata.artist + ' - ' + title}">
                    download
                </a>`;
				link.firstChild.onclick = () => {
					downloadSong(file, title);
					return false;
				};
			});
		} else {
			// isSong
			const file = unsafeWindow.TralbumData.trackinfo[0].file['mp3-128'];
			albutton.insertAdjacentHTML('beforeend', downloadButtonHTML);
			document.getElementById('download-button').onclick = () => {
				downloadSong(file, adata.current.title);
			};
		}
	}
})();
