"use strict";
function getElementByIdOrDie(elementId) {
    var element = document.getElementById(elementId);
    if (element === null) {
        throw new Error("Could not find element with id '" + elementId + "'");
    }
    return element;
}
function renderThumbnail(ctx, ytThumb, state) {
    var aspect = ytThumb.height / ytThumb.width;
    var height = aspect * state.width;
    ctx.canvas.width = state.width;
    ctx.canvas.height = height;
    ctx.drawImage(ytThumb, 0, 0, state.width, height);
    var gradient = ctx.createLinearGradient(state.width * 0.5, height, state.width * 0.5, 0);
    gradient.addColorStop(0.0, 'black');
    gradient.addColorStop(1.0, '#00000000');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, state.width, height);
    ctx.font = state.fontSize + "px LibreBaskerville";
    ctx.fillStyle = 'white';
    ctx.fillText(state.title, state.pad, height - state.pad);
}
function updateUrl(state) {
    window.history.replaceState(null, "", "/?" + new URLSearchParams(state).toString());
}
window.onload = function () {
    var ytLink = getElementByIdOrDie("yt-link");
    var ytError = getElementByIdOrDie("yt-error");
    var ytThumb = getElementByIdOrDie("yt-thumb");
    var ytCanvas = getElementByIdOrDie("yt-canvas");
    var ytTitle = getElementByIdOrDie("yt-title");
    var ytWidth = getElementByIdOrDie("yt-width");
    var ytWidthDisplay = getElementByIdOrDie("yt-width-display");
    var ytFont = getElementByIdOrDie("yt-font");
    var ytFontDisplay = getElementByIdOrDie("yt-font-display");
    var ytPad = getElementByIdOrDie("yt-pad");
    var ytPadDisplay = getElementByIdOrDie("yt-pad-display");
    var ctx = ytCanvas.getContext('2d');
    if (ctx === null)
        throw new Error("Could not initialize 2d context");
    var params = new URLSearchParams(window.location.search);
    var title = params.get("title");
    if (title)
        ytTitle.value = title;
    var width = params.get("width");
    if (width)
        ytWidth.value = width;
    var fontSize = params.get("fontSize");
    if (fontSize)
        ytFont.value = fontSize;
    var pad = params.get("pad");
    if (pad)
        ytPad.value = pad;
    var link = params.get("link");
    if (link)
        ytLink.value = link;
    ytWidthDisplay.value = ytWidth.value;
    ytFontDisplay.value = ytFont.value + "px";
    ytPadDisplay.value = ytPad.value;
    var state = {
        title: ytTitle.value,
        width: Number(ytWidth.value),
        fontSize: Number(ytFont.value),
        pad: Number(ytPad.value),
        link: ytLink.value,
    };
    var json = JSON.stringify(state);
    console.log(json);
    console.log(btoa(json));
    ytWidth.onchange = function () { return updateUrl(state); };
    ytWidth.oninput = function () {
        ytWidthDisplay.value = ytWidth.value;
        state.width = Number(ytWidth.value);
        renderThumbnail(ctx, ytThumb, state);
    };
    ytFont.onchange = function () { return updateUrl(state); };
    ytFont.oninput = function () {
        ytFontDisplay.value = ytFont.value + "px";
        state.fontSize = Number(ytFont.value);
        renderThumbnail(ctx, ytThumb, state);
    };
    ytPad.onchange = function () { return updateUrl(state); };
    ytPad.oninput = function () {
        ytPadDisplay.value = ytPad.value;
        state.pad = Number(ytPad.value);
        renderThumbnail(ctx, ytThumb, state);
    };
    ytTitle.onchange = function () { return updateUrl(state); };
    ytTitle.oninput = function () {
        state.title = ytTitle.value;
        renderThumbnail(ctx, ytThumb, state);
    };
    ytThumb.onload = function () { return renderThumbnail(ctx, ytThumb, state); };
    ytLink.onchange = function () { return updateUrl(state); };
    ytLink.oninput = function () {
        state.link = ytLink.value;
        try {
            ytError.innerText = '';
            ytThumb.src = '';
            var url = new URL(ytLink.value);
            var ytHostRegexp = new RegExp('^(.+\.)?youtube\.com$');
            if (ytHostRegexp.test(url.hostname)) {
                var ytVideoId = url.searchParams.getAll('v').join('');
                ytThumb.src = "http://i3.ytimg.com/vi/" + ytVideoId + "/maxresdefault.jpg";
            }
            else {
                throw new Error('Only YouTube Links are supported');
            }
        }
        catch (e) {
            ytError.innerText = e.message;
        }
    };
    ytLink.dispatchEvent(new Event("input"));
};
