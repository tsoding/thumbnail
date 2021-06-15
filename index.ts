// https://www.youtube.com/watch?v=erxN99OQkbY

function WireSelector(comps, callback) {
    comps.thumb.onload = function(e) {
        callback();
    };

    comps.link.onchange = function(e) {
        try {
            comps.error.innerText = '';
            comps.thumb.src = '';
            const url = new URL(this.value);
            const ytHostRegexp = new RegExp('^(.+\.)?youtube\.com$');
            if (ytHostRegexp.test(url.hostname)) {
                const ytVideoId = url.searchParams.getAll('v').join('')
                comps.thumb.src = `http://i3.ytimg.com/vi/${ytVideoId}/maxresdefault.jpg`;
                fetch(`https://www.youtube.com/watch?v=${ytVideoId}`, { mode: 'no-cors'}).then((res) => {
                    return res.text();
                }).then((html) => {
                    console.log(html);
                    let parser = new DOMParser();
                    let doc = parser.parseFromString(html, 'text/html');
                });
            } else {
                throw new Error('Only YouTube Links are supported');
            }
        } catch(e) {
            comps.error.innerText = e.message;
        }
    };
}

window.onload = () => {
    const ytLink = document.getElementById("yt-link");
    const ytError = document.getElementById("yt-error");
    const ytThumb = document.getElementById("yt-thumb");
    const ytCanvas = document.getElementById("yt-canvas");
    const ctx = ytCanvas.getContext('2d');

    WireSelector({
        "link": ytLink,
        "thumb": ytThumb,
        "error": ytError,
    }, () => {
        const w = 800.0;
        const r = ytThumb.height / ytThumb.width;
        const h = r * w;
        const pad = 50;

        ytCanvas.width  = w;
        ytCanvas.height = h;

        ctx.drawImage(ytThumb, 0, 0, w, h);
        let gradient = ctx.createLinearGradient(
            w * 0.5, h,
            w * 0.5, 0);
        gradient.addColorStop(0.0, 'black');
        gradient.addColorStop(1.0, '#00000000');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, w, h);
        ctx.font = '48px serif';
        ctx.fillStyle = 'white';
        ctx.fillText('Hello, World', pad, h - pad);
    });
};
