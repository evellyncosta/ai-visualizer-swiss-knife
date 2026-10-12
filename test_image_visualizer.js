const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');

class Element {
    constructor() { this.events = {}; this.value = ''; this.textContent = ''; this.className = ''; this.hidden = true; this.children = []; this.checked = false; this.disabled = false; }
    addEventListener(name, handler) { this.events[name] = handler; }
    removeAttribute(name) { delete this[name]; }
    appendChild(child) { this.children.push(child); }
    remove() { this.removed = true; }
    click() { this.clicked = true; }
}

const elements = new Map([
    ['image-prompt-input', new Element()], ['generate-image-btn', new Element()],
    ['image-status', new Element()], ['image-result-section', new Element()],
    ['generated-image', new Element()], ['download-image-btn', new Element()],
    ['capture-steps-input', new Element()], ['capture-settings', new Element()],
    ['capture-every-input', new Element()],
]);
elements.get('capture-every-input').value = '10';
let downloadLink;
global.document = {
    getElementById(id) { return elements.get(id); },
    createElement() { downloadLink = new Element(); return downloadLink; },
    body: { appendChild() {} },
};
const createdUrls = [];
const revokedUrls = [];
global.URL.createObjectURL = (blob) => { createdUrls.push(blob); return `blob:${createdUrls.length}`; };
global.URL.revokeObjectURL = (url) => revokedUrls.push(url);
global.window = { i18n: { t: (key) => key }, addEventListener() {} };
const requests = [];
let failNextRequest = false;
let pendingResolve;
let captureResponse = false;
global.fetch = async (_url, options) => {
    requests.push({ _url, options });
    if (failNextRequest) {
        failNextRequest = false;
        return { ok: false };
    }
    if (pendingResolve === null) {
        return new Promise((resolve) => { pendingResolve = resolve; });
    }
    if (captureResponse) {
        captureResponse = false;
        return {
            ok: true,
            json: async () => ({
                prompt: 'A fox',
                num_inference_steps: 50,
                captured_steps: [{ step: 0, timestep: 999, png_base64: 'cG5n' }],
                final_image_png_base64: 'cG5n',
            }),
        };
    }
    return { ok: true, blob: async () => new Blob(['png'], { type: 'image/png' }) };
};

vm.runInThisContext(fs.readFileSync('static/image-visualizer.js', 'utf8'));

(async () => {
    elements.get('image-prompt-input').value = 'A fox';
    await elements.get('generate-image-btn').events.click();
    assert.equal(requests[0]._url, '/api/generate-image');
    assert.deepEqual(JSON.parse(requests[0].options.body), { prompt: 'A fox' });
    assert.equal(elements.get('generated-image').src, 'blob:1');
    assert.equal(elements.get('image-result-section').hidden, false);
    assert.equal(elements.get('capture-settings').hidden, true);
    assert.equal(elements.get('capture-every-input').disabled, true);
    elements.get('capture-steps-input').checked = true;
    elements.get('capture-steps-input').events.change();
    assert.equal(elements.get('capture-settings').hidden, false);
    assert.equal(elements.get('capture-every-input').disabled, false);
    captureResponse = true;
    await elements.get('generate-image-btn').events.click();
    assert.deepEqual(JSON.parse(requests[1].options.body), {
        prompt: 'A fox', capture_steps: true, capture_every: 10,
    });
    assert.equal(elements.get('generated-image').src, 'blob:2');
    assert.deepEqual(window.imageDenoisingCapture.frames, [
        { step: 0, timestep: 999, png_base64: 'cG5n' },
    ]);
    elements.get('capture-steps-input').checked = false;
    elements.get('capture-steps-input').events.change();
    await elements.get('generate-image-btn').events.click();
    assert.deepEqual(revokedUrls, ['blob:1', 'blob:2']);
    assert.deepEqual(window.imageDenoisingCapture.frames, []);
    elements.get('download-image-btn').events.click();
    assert.equal(downloadLink.href, 'blob:3');
    assert.equal(downloadLink.download, 'generated-image.png');
    assert.equal(downloadLink.clicked, true);
    failNextRequest = true;
    await elements.get('generate-image-btn').events.click();
    assert.equal(elements.get('image-status').textContent, 'imageGenerationError');
    pendingResolve = null;
    const pendingGeneration = elements.get('generate-image-btn').events.click();
    assert.equal(elements.get('image-status').textContent, 'imageGenerating');
    pendingResolve({ ok: true, blob: async () => new Blob(['png'], { type: 'image/png' }) });
    await pendingGeneration;
})().catch((error) => { console.error(error); process.exitCode = 1; });
