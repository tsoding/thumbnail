function getElementByIdOrDie(elementId: string): HTMLElement {
    const element = document.getElementById(elementId);
    if (element === null) {
        throw new Error(`Could not find element with id '${elementId}'`);
    }
    return element;
}

interface State {
    title: string;
    width: number;
    fontSize: number;
    pad: number;
    link: string;
    [index: string]: number | string;
}

function renderThumbnail(ctx: CanvasRenderingContext2D, ytThumb: HTMLImageElement, state: State): void {
    const aspect = ytThumb.height / ytThumb.width;
    const height = aspect * state.width;

    ctx.canvas.width  = state.width;
    ctx.canvas.height = height;

    ctx.drawImage(ytThumb, 0, 0, state.width, height);
    let gradient = ctx.createLinearGradient(
        state.width * 0.5, height,
        state.width * 0.5, 0);
    gradient.addColorStop(0.0, 'black');
    gradient.addColorStop(1.0, '#00000000');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, state.width, height);
    ctx.font = `${state.fontSize}px LibreBaskerville`;
    ctx.fillStyle = 'white';
    ctx.fillText(state.title, state.pad, height - state.pad);
}

function updateUrl(state: State, defaultState: State) {
    let diff: Record<string, string> = {};
    let key: string;
    for (key in state) {
        if (defaultState[key] !== state[key]) {
            diff[key] = state[key].toString();
        }
    }
    window.history.replaceState(null, "", "/?"+new URLSearchParams(diff).toString())
}

window.onload = () => {
    const ytLink         = getElementByIdOrDie("yt-link")          as HTMLInputElement;
    const ytError        = getElementByIdOrDie("yt-error")         as HTMLElement;
    const ytThumb        = getElementByIdOrDie("yt-thumb")         as HTMLImageElement;
    const ytCanvas       = getElementByIdOrDie("yt-canvas")        as HTMLCanvasElement;
    const ytTitle        = getElementByIdOrDie("yt-title")         as HTMLInputElement;
    const ytWidth        = getElementByIdOrDie("yt-width")         as HTMLInputElement;
    const ytWidthDisplay = getElementByIdOrDie("yt-width-display") as HTMLOutputElement;
    const ytFont         = getElementByIdOrDie("yt-font")          as HTMLInputElement;
    const ytFontDisplay  = getElementByIdOrDie("yt-font-display")  as HTMLOutputElement;
    const ytPad          = getElementByIdOrDie("yt-pad")           as HTMLInputElement;
    const ytPadDisplay   = getElementByIdOrDie("yt-pad-display")   as HTMLOutputElement;

    const ctx = ytCanvas.getContext('2d');
    if (ctx === null) throw new Error(`Could not initialize 2d context`);

    const defaultState = {
        title: ytTitle.value,
        width: Number(ytWidth.value),
        fontSize: Number(ytFont.value),
        pad: Number(ytPad.value),
        link: ytLink.value,
    };

    const params = new URLSearchParams(window.location.search);
    const title    = params.get("title");    if (title)    ytTitle.value = title;
    const width    = params.get("width");    if (width)    ytWidth.value = width;
    const fontSize = params.get("fontSize"); if (fontSize) ytFont.value  = fontSize;
    const pad      = params.get("pad");      if (pad)      ytPad.value   = pad;
    const link     = params.get("link");     if (link)     ytLink.value  = link;

    ytWidthDisplay.value = ytWidth.value;
    ytFontDisplay.value  = `${ytFont.value}px`;
    ytPadDisplay.value   = ytPad.value;

    const state = {
        title: ytTitle.value,
        width: Number(ytWidth.value),
        fontSize: Number(ytFont.value),
        pad: Number(ytPad.value),
        link: ytLink.value,
    };

    const json = JSON.stringify(state);
    console.log(json)
    console.log(btoa(json));

    ytWidth.onchange = () => updateUrl(state, defaultState);
    ytWidth.oninput = () => {
        ytWidthDisplay.value = ytWidth.value;
        state.width = Number(ytWidth.value);
        renderThumbnail(ctx, ytThumb, state);
    }
    ytFont.onchange = () => updateUrl(state, defaultState);
    ytFont.oninput = () => {
        ytFontDisplay.value = `${ytFont.value}px`;
        state.fontSize = Number(ytFont.value);
        renderThumbnail(ctx, ytThumb, state);
    }
    ytPad.onchange = () => updateUrl(state, defaultState);
    ytPad.oninput = () => {
        ytPadDisplay.value = ytPad.value;
        state.pad = Number(ytPad.value);
        renderThumbnail(ctx, ytThumb, state);
    }
    ytTitle.onchange = () => updateUrl(state, defaultState);
    ytTitle.oninput = () => {
        state.title = ytTitle.value;
        renderThumbnail(ctx, ytThumb, state);
    }
    ytThumb.onload = () => renderThumbnail(ctx, ytThumb, state);
    ytLink.onchange = () => updateUrl(state, defaultState);
    ytLink.oninput = () => {
        state.link = ytLink.value;
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
            ytError.innerText = (e as Error).message;
        }
    };

    ytLink.dispatchEvent(new Event("input"));
};

// TODO: save/download the thumbnail button
// TODO: remember last used parameters in the local storage
//   If some of the parameters are not set in the URL, get them from the storage.
//   If some parameters are not in the storage, get the default ones.
// TODO: button to reset to default paremeters
