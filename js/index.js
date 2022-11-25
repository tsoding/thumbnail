"use strict";
function getElementByIdOrDie(elementId) {
    var element = document.getElementById(elementId);
    if (element === null) {
        throw new Error("Could not find element with id '" + elementId + "'");
    }
    return element;
}
function renderThumbnail(ctx, ytThumb, ytTitle, width, fontSize, pad) {
    var aspect = ytThumb.height / ytThumb.width;
    var height = aspect * width;
    ctx.canvas.width = width;
    ctx.canvas.height = height;
    ctx.drawImage(ytThumb, 0, 0, width, height);
    var gradient = ctx.createLinearGradient(width * 0.5, height, width * 0.5, 0);
    gradient.addColorStop(0.0, 'black');
    gradient.addColorStop(1.0, '#00000000');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);
    ctx.font = fontSize + "px serif";
    ctx.fillStyle = 'white';
    ctx.fillText(ytTitle.value, pad, height - pad);
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
    if (ctx === null) {
        throw new Error("Could not initialize 2d context");
    }
    ytWidthDisplay.value = ytWidth.value;
    ytFontDisplay.value = ytFont.value + "px";
    ytPadDisplay.value = ytPad.value;
    ytWidth.oninput = function () {
        ytWidthDisplay.value = ytWidth.value;
        renderThumbnail(ctx, ytThumb, ytTitle, Number(ytWidth.value), Number(ytFont.value), Number(ytPad.value));
    };
    ytFont.oninput = function () {
        ytFontDisplay.value = ytFont.value + "px";
        renderThumbnail(ctx, ytThumb, ytTitle, Number(ytWidth.value), Number(ytFont.value), Number(ytPad.value));
    };
    ytPad.oninput = function () {
        ytPadDisplay.value = ytPad.value;
        renderThumbnail(ctx, ytThumb, ytTitle, Number(ytWidth.value), Number(ytFont.value), Number(ytPad.value));
    };
    ytTitle.onchange = function () { return renderThumbnail(ctx, ytThumb, ytTitle, Number(ytWidth.value), Number(ytFont.value), Number(ytPad.value)); };
    ytThumb.onload = function () { return renderThumbnail(ctx, ytThumb, ytTitle, Number(ytWidth.value), Number(ytFont.value), Number(ytPad.value)); };
    ytLink.onchange = function () {
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
};
