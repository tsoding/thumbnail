"use strict";
function getElementByIdOrDie(elementId) {
    var element = document.getElementById(elementId);
    if (element === null) {
        throw new Error("Could not find element with id '" + elementId + "'");
    }
    return element;
}
function renderThumbnail(ctx, ytThumb, ytTitle) {
    var w = 800.0;
    var r = ytThumb.height / ytThumb.width;
    var h = r * w;
    var pad = 50;
    ctx.canvas.width = w;
    ctx.canvas.height = h;
    ctx.drawImage(ytThumb, 0, 0, w, h);
    var gradient = ctx.createLinearGradient(w * 0.5, h, w * 0.5, 0);
    gradient.addColorStop(0.0, 'black');
    gradient.addColorStop(1.0, '#00000000');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, w, h);
    ctx.font = '44px serif';
    ctx.fillStyle = 'white';
    ctx.fillText(ytTitle.value, pad, h - pad);
}
window.onload = function () {
    var ytLink = getElementByIdOrDie("yt-link");
    var ytError = getElementByIdOrDie("yt-error");
    var ytThumb = getElementByIdOrDie("yt-thumb");
    var ytCanvas = getElementByIdOrDie("yt-canvas");
    var ytTitle = getElementByIdOrDie("yt-title");
    var ctx = ytCanvas.getContext('2d');
    if (ctx === null) {
        throw new Error("Could not initialize 2d context");
    }
    ytTitle.onchange = function () { return renderThumbnail(ctx, ytThumb, ytTitle); };
    ytThumb.onload = function () { return renderThumbnail(ctx, ytThumb, ytTitle); };
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
