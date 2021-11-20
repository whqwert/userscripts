// ==UserScript==
// @name         Bandcamp Downloader
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Adds a download link to songs on Bandcamp
// @author       whqwert
// @match        https://*.bandcamp.com/*
// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAMAAABEpIrGAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAAzFBMVEUAAAAdoMMeoMMeocQeoMQdn8Ibn8Ieo8UfocQcn8IcoMIeosQdocMeocUcoMMfosUgo8QeosUeocMdoMMdoMMdoMMdoMMdoMMdoMMdoMMdoMMdoMMdoMMdoMMdoMMfosUdoMMdoMMdoMMdoMMdoMMdoMMdoMMdoMMdoMMdoMMdoMMdoMMeocQdoMMdoMMdoMMdoMMdoMMdoMMdn8IdoMMdoMMdoMMdoMMdoMMdoMMdoMMdoMMdoMMcoMMdoMMdoMMdoMMdoMMdoMP///8al1lIAAAAQnRSTlMAAAAAAAAAAAAAAAAAAAAAAAAAAwQBVWRgYWNbTP2SAcn5+/raD1/8ZwrY0QZzVhbm/sABh0MCI/KumzKaARVy0sgKk2+GAAAAAWJLR0RDZ9ANYgAAAAd0SU1FB+MEEQ8KGdT5UsEAAAEXSURBVDjLzVLZUgIxENw2iuCtyQICCxJuRGSRU1R0/v+jnCXLy2ZqHy37IVWp6fSkZzoI/g8AaCNAp/UTIGROnoAy5Ur1MYta3dVPzzQaFFEWETWPAoXWE7VtBh3q9lz9XKNPA09gQEP3LYRqNPY7RPQ8KboGBi9kBYEpEptFdvg6o9ivz0tvSQtcGCwEgZiW0Ey4xArrjSSw5QoToDTeBQtkd0xQgeJz5+vziw9olQhcrbD1BWLarPnpNRM0lsKQLS1gbg4ePgtzSWD2xe4VEzSmwg8t7Xl6hznfTr6lIY9HKkz3MBS31Ie+c4RelzrZNbfpp1U65qspWIipweZSQr3m5axaKZv7/IAmCX5Ib3LYcxP+5/gFzD1sP8rfy6wAAAAldEVYdGRhdGU6Y3JlYXRlADIwMTktMDQtMTdUMTU6MTA6MjUrMDI6MDC8n04vAAAAJXRFWHRkYXRlOm1vZGlmeQAyMDE5LTA0LTE3VDE1OjEwOjI1KzAyOjAwzcL2kwAAAFd6VFh0UmF3IHByb2ZpbGUgdHlwZSBpcHRjAAB4nOPyDAhxVigoyk/LzEnlUgADIwsuYwsTIxNLkxQDEyBEgDTDZAMjs1Qgy9jUyMTMxBzEB8uASKBKLgDqFxF08kI1lQAAAABJRU5ErkJggg==
// @grant        GM_download
// @grant        GM_xmlhttpRequest
// @connect      t4.bcbits.com
// @run-at       document-end
// ==/UserScript==

(function () {
    'use strict';
    const table = document.querySelectorAll('#track_table > tbody > tr');
    const adata = unsafeWindow.TralbumData || false;

    if (adata) {
        const albutton = document.querySelector('.share-collect-controls > ul');
        const downloadButtonHTML =
            `<li id="download-button">
                  <span class="bc-ui2" style="height: 12px; width: 15px; display: inline-block; background-image: url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0ODcuMTU2IiBoZWlnaHQ9IjQ4Ny4xNTYiIHN0eWxlPSJlbmFibGUtYmFja2dyb3VuZDpuZXcgMCAwIDQ4Ny4xNTYgNDg3LjE1NiIgZmlsbD0iIzY2NiIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSI+PHBhdGggZD0iTTIuMTY2IDM3NC41OTZ2MTEyLjU2SDQ4NC45OVYzNzEuNjM1aC00NC40MzF2NzEuMDlINDYuNTk4di02OC4xMjl6Ii8+PHBhdGggZD0ibTI1OS45MjQgMzk3Ljk0MSAxMTQuNjE1LTE3My43OTItMzkuNzg0LjAzQzMzNC42MDQgMjQuNjg0IDE0MC4yODMgMCAxNDAuMjgzIDBzNDQuNDIgNjIuMjA4IDQ0LjU0NCAyMjQuMjkybC0zOS43ODQuMDI5IDExNC44ODEgMTczLjYyeiIvPjwvc3ZnPg==); background-size: contain">
                  </span>
                  <span class="share-embed-label">
                        <button type="button">
                              Download
                        </button>
                  </span>
            </li>`
        function downloadSong(file, title) {
            GM_download({
                url: file,
                name: adata.artist + ' - ' + title + '.mp3',
                saveAs: true
            });
        }
        if (table.length) { // isAlbum
            const dlinks = document.getElementsByClassName('dl_link');
            adata.trackinfo.forEach((track, i) => {
                let link = dlinks[i]
                let file = track.file['mp3-128']
                let title = track.title

                link.innerHTML =
                    `<a
                    href="${file}"
                    title="${adata.artist + ' - ' + title}">
                    download
                </a>`
                link.firstChild.onclick = () => {
                    downloadSong(file, title);
                    return false;
                }
            })
        } else { // isSong
            const file = unsafeWindow.TralbumData.trackinfo[0].file['mp3-128']
            albutton.insertAdjacentHTML('beforeend', downloadButtonHTML);
            document.getElementById('download-button').onclick = () => {
                downloadSong(file, adata.current.title);
            }
        }
    }
})();