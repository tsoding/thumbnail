function getElementByIdOrDie(elementId: string): HTMLElement {
    const element = document.getElementById(elementId);
    if (element === null) {
        throw new Error(`Could not find element with id '${elementId}'`);
    }
    return element;
}

function renderThumbnail(ctx: CanvasRenderingContext2D, ytThumb: HTMLImageElement, ytTitle: HTMLInputElement, width: number, fontSize: number, pad: number): void {
    const aspect = ytThumb.height / ytThumb.width;
    const height = aspect * width;

    ctx.canvas.width  = width;
    ctx.canvas.height = height;

    ctx.drawImage(ytThumb, 0, 0, width, height);
    let gradient = ctx.createLinearGradient(
        width * 0.5, height,
        width * 0.5, 0);
    gradient.addColorStop(0.0, 'black');
    gradient.addColorStop(1.0, '#00000000');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);
    ctx.font = `${fontSize}px serif`;
    ctx.fillStyle = 'white';
    ctx.fillText(ytTitle.value, pad, height - pad);
}

window.onload = () => {
    const ytLink = getElementByIdOrDie("yt-link") as HTMLInputElement;
    const ytError = getElementByIdOrDie("yt-error") as HTMLElement;
    const ytThumb = getElementByIdOrDie("yt-thumb") as HTMLImageElement;
    const ytCanvas = getElementByIdOrDie("yt-canvas") as HTMLCanvasElement;
    const ytTitle = getElementByIdOrDie("yt-title") as HTMLInputElement;
    const ytWidth = getElementByIdOrDie("yt-width") as HTMLInputElement;
    const ytWidthDisplay = getElementByIdOrDie("yt-width-display") as HTMLOutputElement;
    const ytFont = getElementByIdOrDie("yt-font") as HTMLInputElement;
    const ytFontDisplay = getElementByIdOrDie("yt-font-display") as HTMLOutputElement;
    const ytPad = getElementByIdOrDie("yt-pad") as HTMLInputElement;
    const ytPadDisplay = getElementByIdOrDie("yt-pad-display") as HTMLOutputElement;
    const ctx = ytCanvas.getContext('2d');
    if (ctx === null) {
        throw new Error(`Could not initialize 2d context`);
    }

    ytWidthDisplay.value = ytWidth.value;
    ytFontDisplay.value = `${ytFont.value}px`;
    ytPadDisplay.value = ytPad.value;
    ytWidth.oninput = () => {
        ytWidthDisplay.value = ytWidth.value;
        renderThumbnail(ctx, ytThumb, ytTitle, Number(ytWidth.value), Number(ytFont.value), Number(ytPad.value));
    }
    ytFont.oninput = () => {
        ytFontDisplay.value = `${ytFont.value}px`;
        renderThumbnail(ctx, ytThumb, ytTitle, Number(ytWidth.value), Number(ytFont.value), Number(ytPad.value));
    }
    ytPad.oninput = () => {
        ytPadDisplay.value = ytPad.value;
        renderThumbnail(ctx, ytThumb, ytTitle, Number(ytWidth.value), Number(ytFont.value), Number(ytPad.value));
    }
    ytTitle.onchange = () => renderThumbnail(ctx, ytThumb, ytTitle, Number(ytWidth.value), Number(ytFont.value), Number(ytPad.value));
    ytThumb.onload = () => renderThumbnail(ctx, ytThumb, ytTitle, Number(ytWidth.value), Number(ytFont.value), Number(ytPad.value));
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

// TODO: a reasonable presentable CSS style
// TODO: long range sliders (for finer control of the parameters)
// TODO: store the parameters in the URL
// TODO: save/download the thumbnail button
