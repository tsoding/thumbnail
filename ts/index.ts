function getElementByIdOrDie(elementId: string): HTMLElement {
    const element = document.getElementById(elementId);
    if (element === null) {
        throw new Error(`Could not find element with id '${elementId}'`);
    }
    return element;
}

function renderThumbnail(ctx: CanvasRenderingContext2D, ytThumb: HTMLImageElement, ytTitle: HTMLInputElement): void {
    const w = 800.0;
    const r = ytThumb.height / ytThumb.width;
    const h = r * w;
    const pad = 50;

    ctx.canvas.width  = w;
    ctx.canvas.height = h;

    ctx.drawImage(ytThumb, 0, 0, w, h);
    let gradient = ctx.createLinearGradient(
        w * 0.5, h,
        w * 0.5, 0);
    gradient.addColorStop(0.0, 'black');
    gradient.addColorStop(1.0, '#00000000');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, w, h);
    // TODO: let the user control the font size
    ctx.font = '44px serif';
    ctx.fillStyle = 'white';
    ctx.fillText(ytTitle.value, pad, h - pad);
}

window.onload = () => {
    const ytLink = getElementByIdOrDie("yt-link") as HTMLInputElement;
    const ytError = getElementByIdOrDie("yt-error") as HTMLElement;
    const ytThumb = getElementByIdOrDie("yt-thumb") as HTMLImageElement;
    const ytCanvas = getElementByIdOrDie("yt-canvas") as HTMLCanvasElement;
    const ytTitle = getElementByIdOrDie("yt-title") as HTMLInputElement;
    const ctx = ytCanvas.getContext('2d');
    if (ctx === null) {
        throw new Error(`Could not initialize 2d context`);
    }

    ytTitle.onchange = () => renderThumbnail(ctx, ytThumb, ytTitle);
    ytThumb.onload = () => renderThumbnail(ctx, ytThumb, ytTitle);
    ytLink.onchange = () => {
        try {
            ytError.innerText = '';
            ytThumb.src = '';
            const url = new URL(ytLink.value);
            const ytHostRegexp = new RegExp('^(.+\.)?youtube\.com$');
            if (ytHostRegexp.test(url.hostname)) {
                const ytVideoId = url.searchParams.getAll('v').join('')
                ytThumb.src = `http://i3.ytimg.com/vi/${ytVideoId}/maxresdefault.jpg`;
            } else {
                throw new Error('Only YouTube Links are supported');
            }
        } catch(e) {
            ytError.innerText = e.message;
        }
    };
};
