"use strict";
function WireSelector(comps, callback) {
    comps.thumb.onload = function (e) {
        callback();
    };
    comps.link.onchange = function (e) {
        try {
            comps.error.innerText = '';
            comps.thumb.src = '';
            var url = new URL(this.value);
            var ytHostRegexp = new RegExp('^(.+\.)?youtube\.com$');
            if (ytHostRegexp.test(url.hostname)) {
                var ytVideoId = url.searchParams.getAll('v').join('');
                comps.thumb.src = "http://i3.ytimg.com/vi/" + ytVideoId + "/maxresdefault.jpg";
                fetch("https://www.youtube.com/watch?v=" + ytVideoId, { mode: 'no-cors' }).then(function (res) {
                    return res.text();
                }).then(function (html) {
                    console.log(html);
                    var parser = new DOMParser();
                    var doc = parser.parseFromString(html, 'text/html');
                });
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
window.onload = function () {
    var ytLink = document.getElementById("yt-link");
    var ytError = document.getElementById("yt-error");
    var ytThumb = document.getElementById("yt-thumb");
    var ytCanvas = document.getElementById("yt-canvas");
    var ctx = ytCanvas.getContext('2d');
    WireSelector({
        "link": ytLink,
        "thumb": ytThumb,
        "error": ytError,
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
