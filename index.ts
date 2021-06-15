interface WireSelectorComps {
    thumb: HTMLImageElement,
    link: HTMLInputElement,
    error: HTMLElement,
}

function WireSelector(comps: WireSelectorComps, callback: () => void) {
    comps.thumb.onload = function() {
        callback();
    };

    comps.link.onchange = function() {
        try {
            comps.error.innerText = '';
            comps.thumb.src = '';
            const url = new URL(comps.link.value);
            const ytHostRegexp = new RegExp('^(.+\.)?youtube\.com$');
            if (ytHostRegexp.test(url.hostname)) {
                const ytVideoId = url.searchParams.getAll('v').join('')
                comps.thumb.src = `http://i3.ytimg.com/vi/${ytVideoId}/maxresdefault.jpg`;
            } else {
                throw new Error('Only YouTube Links are supported');
            }
        } catch(e) {
            comps.error.innerText = e.message;
        }
    };
}

function getElementByIdOrDie(elementId: string): HTMLElement {
    const element = document.getElementById(elementId);
    if (element === null) {
        throw new Error(`Could not find element with id '${elementId}'`);
    }
    return element;
}

window.onload = () => {
    const ytLink = getElementByIdOrDie("yt-link") as HTMLInputElement;
    const ytError = getElementByIdOrDie("yt-error") as HTMLElement;
    const ytThumb = getElementByIdOrDie("yt-thumb") as HTMLImageElement;
    const ytCanvas = getElementByIdOrDie("yt-canvas") as HTMLCanvasElement;
    const ctx = ytCanvas.getContext('2d');
    if (ctx === null) {
        throw new Error(`Could not initialize 2d context`);
    }

    WireSelector({
        link: ytLink,
        thumb: ytThumb,
        error: ytError,
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
