const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');

class Element {
    constructor() { this.events = {}; this.value = ''; this.textContent = ''; this.className = ''; this.hidden = true; this.children = []; }
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
]);
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
global.fetch = async (_url, options) => {
    requests.push({ _url, options });
    if (failNextRequest) {
        failNextRequest = false;
        return { ok: false };
    }
    if (pendingResolve === null) {
        return new Promise((resolve) => { pendingResolve = resolve; });
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
    await elements.get('generate-image-btn').events.click();
    assert.deepEqual(revokedUrls, ['blob:1']);
    elements.get('download-image-btn').events.click();
    assert.equal(downloadLink.href, 'blob:2');
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
