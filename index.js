"use strict";
function WireSelector(comps, callback) {
    comps.thumb.onload = function () {
        callback();
    };
    comps.link.onchange = function () {
        try {
            comps.error.innerText = '';
            comps.thumb.src = '';
            var url = new URL(comps.link.value);
            var ytHostRegexp = new RegExp('^(.+\.)?youtube\.com$');
            if (ytHostRegexp.test(url.hostname)) {
                var ytVideoId = url.searchParams.getAll('v').join('');
                comps.thumb.src = "http://i3.ytimg.com/vi/" + ytVideoId + "/maxresdefault.jpg";
            }
            else {
                throw new Error('Only YouTube Links are supported');
            }
        }
        catch (e) {
            comps.error.innerText = e.message;
        }
    };
}
function getElementByIdOrDie(elementId) {
    var element = document.getElementById(elementId);
    if (element === null) {
        throw new Error("Could not find element with id '" + elementId + "'");
    }
    return element;
}
window.onload = function () {
    var ytLink = getElementByIdOrDie("yt-link");
    var ytError = getElementByIdOrDie("yt-error");
    var ytThumb = getElementByIdOrDie("yt-thumb");
    var ytCanvas = getElementByIdOrDie("yt-canvas");
    var ctx = ytCanvas.getContext('2d');
    if (ctx === null) {
        throw new Error("Could not initialize 2d context");
    }
    WireSelector({
        link: ytLink,
        thumb: ytThumb,
        error: ytError,
    }, function () {
        var w = 800.0;
        var r = ytThumb.height / ytThumb.width;
        var h = r * w;
        var pad = 50;
        ytCanvas.width = w;
        ytCanvas.height = h;
        ctx.drawImage(ytThumb, 0, 0, w, h);
        var gradient = ctx.createLinearGradient(w * 0.5, h, w * 0.5, 0);
        gradient.addColorStop(0.0, 'black');
        gradient.addColorStop(1.0, '#00000000');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, w, h);
        ctx.font = '48px serif';
        ctx.fillStyle = 'white';
        ctx.fillText('Hello, World', pad, h - pad);
    });
};
