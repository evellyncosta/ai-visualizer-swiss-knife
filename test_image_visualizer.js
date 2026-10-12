const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');

class Element {
    constructor() {
        this.events = {}; this.value = ''; this.textContent = ''; this.className = '';
        this.hidden = true; this.children = []; this.disabled = false; this.attributes = {};
    }
    addEventListener(name, handler) { this.events[name] = handler; }
    setAttribute(name, value) { this.attributes[name] = String(value); }
    getAttribute(name) { return this.attributes[name] ?? null; }
    removeAttribute(name) { delete this[name]; delete this.attributes[name]; }
    appendChild(child) { this.children.push(child); }
    replaceChildren() { this.children = []; }
    remove() { this.removed = true; }
    click() { this.clicked = true; if (this.events.click) this.events.click(); }
}

const elements = new Map([
    ['image-prompt-input', new Element()], ['generate-image-btn', new Element()],
    ['image-status', new Element()], ['image-result-section', new Element()],
    ['image-preview-label', new Element()], ['generated-image', new Element()],
    ['download-image-btn', new Element()], ['capture-steps-input', new Element()],
    ['capture-settings', new Element()], ['capture-every-input', new Element()],
    ['captured-frames-section', new Element()], ['captured-frames', new Element()],
]);
elements.get('capture-every-input').value = '10';
elements.get('capture-steps-input').setAttribute('aria-pressed', 'false');
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
const translations = {
    finalImageLabel: 'Final image',
    selectedDenoisingStep: 'Denoising step {step} (timestep {timestep})',
    denoisingStepLabel: 'Step {step}',
    timestepLabel: 'Timestep {timestep}',
};
const windowEvents = {};
global.window = {
    i18n: { t: (key) => translations[key] || key },
    addEventListener(name, handler) { windowEvents[name] = handler; },
};
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
    if (pendingResolve === null) return new Promise((resolve) => { pendingResolve = resolve; });
    if (captureResponse) {
        captureResponse = false;
        return {
            ok: true,
            json: async () => ({
                prompt: 'A fox',
                num_inference_steps: 50,
                captured_steps: [
                    { step: 0, timestep: 999, png_base64: 'cG5n' },
                    { step: 10, timestep: 799, png_base64: 'cG5n' },
                ],
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

    elements.get('capture-steps-input').events.click();
    assert.equal(elements.get('capture-steps-input').getAttribute('aria-pressed'), 'true');
    assert.equal(elements.get('capture-settings').hidden, false);
    assert.equal(elements.get('capture-every-input').disabled, false);
    captureResponse = true;
    await elements.get('generate-image-btn').events.click();
    assert.deepEqual(JSON.parse(requests[1].options.body), {
        prompt: 'A fox', capture_steps: true, capture_every: 10,
    });
    assert.equal(elements.get('generated-image').src, 'blob:2');
    assert.equal(elements.get('captured-frames-section').hidden, false);
    assert.equal(elements.get('captured-frames').children.length, 2);
    assert.deepEqual(window.imageDenoisingCapture.frames.map(({ step, timestep }) => ({ step, timestep })), [
        { step: 0, timestep: 999 }, { step: 10, timestep: 799 },
    ]);

    elements.get('captured-frames').children[1].events.click();
    assert.equal(elements.get('generated-image').src, 'blob:4');
    assert.equal(elements.get('image-preview-label').textContent, 'Denoising step 10 (timestep 799)');
    assert.equal(elements.get('captured-frames').children[1].getAttribute('aria-pressed'), 'true');
    elements.get('download-image-btn').events.click();
    assert.equal(downloadLink.href, 'blob:2');
    assert.equal(downloadLink.download, 'generated-image.png');

    elements.get('capture-steps-input').events.click();
    await elements.get('generate-image-btn').events.click();
    assert.deepEqual(revokedUrls, ['blob:1', 'blob:2', 'blob:3', 'blob:4']);
    assert.deepEqual(window.imageDenoisingCapture.frames, []);
    assert.equal(elements.get('captured-frames').children.length, 0);

    failNextRequest = true;
    await elements.get('generate-image-btn').events.click();
    assert.equal(elements.get('image-status').textContent, 'imageGenerationError');
    pendingResolve = null;
    const pendingGeneration = elements.get('generate-image-btn').events.click();
    assert.equal(elements.get('image-status').textContent, 'imageGenerating');
    pendingResolve({ ok: true, blob: async () => new Blob(['png'], { type: 'image/png' }) });
    await pendingGeneration;
    windowEvents.beforeunload();
    assert.deepEqual(revokedUrls, ['blob:1', 'blob:2', 'blob:3', 'blob:4', 'blob:5', 'blob:6']);
})().catch((error) => { console.error(error); process.exitCode = 1; });
