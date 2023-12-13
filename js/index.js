"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var _a;
function getElementByIdOrDie(elementId) {
    var element = document.getElementById(elementId);
    if (element === null) {
        throw new Error("Could not find element with id '".concat(elementId, "'"));
    }
    return element;
}
var PARAMETERS = "parameters";
var data = { title: "", link: "", width: 0, fontSize: 0, pad: 0 };
if (localStorage.getItem(PARAMETERS) != null) {
    data = JSON.parse((_a = localStorage.getItem(PARAMETERS)) !== null && _a !== void 0 ? _a : "");
}
function renderThumbnail(ctx, ytThumb, config) {
    var aspect = ytThumb.height / ytThumb.width;
    var height = aspect * config.width;
    ctx.canvas.width = config.width;
    ctx.canvas.height = height;
    ctx.drawImage(ytThumb, 0, 0, config.width, height);
    var gradient = ctx.createLinearGradient(config.width * 0.5, height, config.width * 0.5, 0);
    gradient.addColorStop(0.0, "black");
    gradient.addColorStop(1.0, "#00000000");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, config.width, height);
    ctx.font = "".concat(config.fontSize, "px LibreBaskerville");
    ctx.fillStyle = "white";
    ctx.fillText(config.title, config.pad, height - config.pad);
}
window.onload = function () {
    var ytLink = getElementByIdOrDie("yt-link");
    updateInputValue(ytLink, "link");
    var ytError = getElementByIdOrDie("yt-error");
    var ytThumb = getElementByIdOrDie("yt-thumb");
    var ytCanvas = getElementByIdOrDie("yt-canvas");
    var ytTitle = getElementByIdOrDie("yt-title");
    updateInputValue(ytTitle, "title");
    var ytWidth = getElementByIdOrDie("yt-width");
    updateInputValue(ytWidth, "width");
    var ytWidthDisplay = getElementByIdOrDie("yt-width-display");
    var ytFont = getElementByIdOrDie("yt-font");
    updateInputValue(ytFont, "fontSize");
    var ytFontDisplay = getElementByIdOrDie("yt-font-display");
    var ytPad = getElementByIdOrDie("yt-pad");
    updateInputValue(ytPad, "pad");
    var ytPadDisplay = getElementByIdOrDie("yt-pad-display");
    var ctx = ytCanvas.getContext("2d");
    if (ctx === null) {
        throw new Error("Could not initialize 2d context");
    }
    ytWidthDisplay.value = ytWidth.value;
    ytFontDisplay.value = "".concat(ytFont.value, "px");
    ytPadDisplay.value = ytPad.value;
    var config = {
        title: ytTitle.value,
        width: Number(ytWidth.value),
        fontSize: Number(ytFont.value),
        pad: Number(ytPad.value),
    };
    ytWidth.oninput = function () {
        ytWidthDisplay.value = ytWidth.value;
        config.width = Number(ytWidth.value);
        updateLocalStorage("width", config.width);
        renderThumbnail(ctx, ytThumb, config);
    };
    ytFont.oninput = function () {
        ytFontDisplay.value = "".concat(ytFont.value, "px");
        config.fontSize = Number(ytFont.value);
        updateLocalStorage("fontSize", config.fontSize);
        renderThumbnail(ctx, ytThumb, config);
    };
    ytPad.oninput = function () {
        ytPadDisplay.value = ytPad.value;
        config.pad = Number(ytPad.value);
        updateLocalStorage("pad", config.pad);
        renderThumbnail(ctx, ytThumb, config);
    };
    ytTitle.oninput = function () {
        config.title = ytTitle.value;
        updateLocalStorage("title", config.title);
        renderThumbnail(ctx, ytThumb, config);
    };
    ytThumb.onload = function () { return renderThumbnail(ctx, ytThumb, config); };
    ytLink.oninput = function () {
        try {
            updateLocalStorage("link", ytLink.value);
            ytError.innerText = "";
            ytThumb.src = "";
            var url = new URL(ytLink.value);
            var ytHostRegexp = new RegExp("^(.+.)?youtube.com$");
            if (ytHostRegexp.test(url.hostname)) {
                var ytVideoId = url.searchParams.getAll("v").join("");
                ytThumb.src = "http://i3.ytimg.com/vi/".concat(ytVideoId, "/maxresdefault.jpg");
            }
            else {
                throw new Error("Only YouTube Links are supported");
            }
        }
        catch (e) {
            ytError.innerText = e.message;
        }
    };
    ytLink.dispatchEvent(new Event("input"));
};
var updateLocalStorage = function (key, value) {
    var _a;
    data = __assign(__assign({}, data), (_a = {}, _a[key] = value, _a));
    localStorage.setItem(PARAMETERS, JSON.stringify(data));
};
var updateInputValue = function (input, keyInStorage) {
    var _a;
    var value = (_a = data[keyInStorage]) !== null && _a !== void 0 ? _a : "";
    if (input.type == "range") {
        var isInputValueSet = input.value !== String((+input.min + +input.max) / 2);
        if (!isInputValueSet && value != "") {
            input.value = value.toString();
        }
    }
    if (input.value === "" && value !== null && value !== undefined) {
        input.value = data[keyInStorage].toString();
    }
};
