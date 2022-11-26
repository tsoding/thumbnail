function getElementByIdOrDie(elementId: string): HTMLElement {
    const element = document.getElementById(elementId);
    if (element === null) {
        throw new Error(`Could not find element with id '${elementId}'`);
    }
    return element;
}

interface Config {
    title: string;
    width: number;
    fontSize: number;
    pad: number;
}

function renderThumbnail(ctx: CanvasRenderingContext2D, ytThumb: HTMLImageElement, config: Config): void {
    const aspect = ytThumb.height / ytThumb.width;
    const height = aspect * config.width;

    ctx.canvas.width  = config.width;
    ctx.canvas.height = height;

    ctx.drawImage(ytThumb, 0, 0, config.width, height);
    let gradient = ctx.createLinearGradient(
        config.width * 0.5, height,
        config.width * 0.5, 0);
    gradient.addColorStop(0.0, 'black');
    gradient.addColorStop(1.0, '#00000000');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, config.width, height);
    ctx.font = `${config.fontSize}px LibreBaskerville`;
    ctx.fillStyle = 'white';
    ctx.fillText(config.title, config.pad, height - config.pad);
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

    const config = {
        title: ytTitle.value,
        width: Number(ytWidth.value),
        fontSize: Number(ytFont.value),
        pad: Number(ytPad.value),
    };

    ytWidth.oninput = () => {
        ytWidthDisplay.value = ytWidth.value;
        config.width = Number(ytWidth.value);
        renderThumbnail(ctx, ytThumb, config);
    }
    ytFont.oninput = () => {
        ytFontDisplay.value = `${ytFont.value}px`;
        config.fontSize = Number(ytFont.value);
        renderThumbnail(ctx, ytThumb, config);
    }
    ytPad.oninput = () => {
        ytPadDisplay.value = ytPad.value;
        config.pad = Number(ytPad.value);
        renderThumbnail(ctx, ytThumb, config);
    }
    ytTitle.oninput = () => {
        config.title = ytTitle.value;
        renderThumbnail(ctx, ytThumb, config);
    }
    ytThumb.onload = () => renderThumbnail(ctx, ytThumb, config);
    ytLink.oninput = () => {
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

    ytLink.dispatchEvent(new Event("input"));
};

// TODO: save/download the thumbnail button
// TODO: remember last used parameters in the local storage
// TODO: button to reset to default paremeters
// TODO: set the parameters in the URL
//   If some of the parameters are not set, get them from the remembered parameters from storage.
//   If some parameters are not from storage, get the default ones.
