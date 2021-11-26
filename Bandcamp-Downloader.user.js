// ==UserScript==
// @name         Bandcamp Downloader
// @namespace    https://github.com/qwhert/userscripts
// @version      1.0.3
// @description  Adds a download link to songs on Bandcamp
// @author       whqwert
// @match        https://*.bandcamp.com/*
// @icon         https://s4.bcbits.com/img/favicon/favicon-32x32.png
// @supportURL   https://github.com/qwhert/userscripts/issues
// @license      MIT
// @grant        GM_download
// @connect      t4.bcbits.com
// @run-at       document-end
// ==/UserScript==

(function () {
	'use strict';
	const table = document.querySelectorAll('#track_table > tbody > tr');
	const adata = unsafeWindow.TralbumData || false;

	if (adata) {
		const albutton = document.querySelector('.share-collect-controls > ul');
		const downloadButtonHTML = `<li id="download-button">
            <span class="bc-ui2" style="height: 12px; width: 15px; display: inline-block; background-image: url(
                    data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0ODcuMTU2IiBoZWlnaHQ9IjQ4Ny4xNTYiIHN0eWxlPSJlbmFibGUtYmFja2dyb3VuZDpuZXcgMCAwIDQ4Ny4xNTYgNDg3LjE1NiIgZmlsbD0iIzY2NiIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSI+PHBhdGggZD0iTTIuMTY2IDM3NC41OTZ2MTEyLjU2SDQ4NC45OVYzNzEuNjM1aC00NC40MzF2NzEuMDlINDYuNTk4di02OC4xMjl6Ii8+PHBhdGggZD0ibTI1OS45MjQgMzk3Ljk0MSAxMTQuNjE1LTE3My43OTItMzkuNzg0LjAzQzMzNC42MDQgMjQuNjg0IDE0MC4yODMgMCAxNDAuMjgzIDBzNDQuNDIgNjIuMjA4IDQ0LjU0NCAyMjQuMjkybC0zOS43ODQuMDI5IDExNC44ODEgMTczLjYyeiIvPjwvc3ZnPg==
                ); background-size: contain">
            </span>
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
