const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');

class Element {
    constructor() {
        this.children = [];
        this.events = {};
        this.classList = { add() {}, toggle() {} };
        this.disabled = false;
        this.textContent = '';
        this.value = '';
    }

    set innerHTML(value) {
        this.children = [];
        this._innerHTML = value;
    }

    get innerHTML() { return this._innerHTML; }
    append(...children) { this.children.push(...children); }
    appendChild(child) { this.children.push(child); }
    addEventListener(name, handler) { this.events[name] = handler; }
    setAttribute() {}
}

const elements = new Map([
    ['path-prompt-input', new Element()],
    ['path-start-btn', new Element()],
    ['finish-path-btn', new Element()],
    ['verify-hallucination-btn', new Element()],
    ['path-candidates', new Element()],
    ['path-tree', new Element()],
    ['active-premise-label', new Element()],
    ['active-premise-text', new Element()],
    ['active-response-label', new Element()],
    ['active-response-text', new Element()],
    ['path-status', new Element()],
    ['verification-result', new Element()],
    ['verification-title', new Element()],
    ['verification-reason', new Element()],
    ['verification-sources', new Element()],
]);
global.document = {
    body: { dataset: { staticDemo: 'false' } },
    getElementById(id) { return elements.get(id); },
    createElement() { return new Element(); },
    addEventListener() {},
};
global.window = { i18n: { t: (key) => key, getLocale: () => 'en' } };

const initialSegment = [
    { selected_token: ' A', selected_prob: 0.8, top_logprobs: [{ token: ' A', probability: 0.8 }, { token: ' alt', probability: 0.1 }] },
    { selected_token: ' B', selected_prob: 0.7, top_logprobs: [{ token: ' B', probability: 0.7 }] },
];
const branchSegment = [
    { selected_token: ' branch', selected_prob: 0.75, top_logprobs: [{ token: ' branch', probability: 0.75 }] },
];
const calls = [];
global.fetch = async (_url, options) => {
    const payload = JSON.parse(options.body);
    calls.push(payload);
    if (_url === '/api/verify-hallucination') {
        return { ok: true, json: async () => ({ message: 'The factual claim is not supported by the available sources.', sources: [] }) };
    }
    return {
        ok: true,
        json: async () => ({ tokenProbs: payload.response_prefix ? branchSegment : initialSegment }),
    };
};

vm.runInThisContext(fs.readFileSync('static/hallucination-path.js', 'utf8'));

async function clickCandidate(index) {
    await elements.get('path-candidates').children[index].events.click();
}

(async () => {
    const input = elements.get('path-prompt-input');
    input.value = 'False premise';
    await elements.get('path-start-btn').events.click();
    assert.equal(calls.length, 1);
    assert.equal(calls[0].response_prefix, '');
    assert.equal(elements.get('active-premise-text').textContent, 'False premise');
    assert.equal(elements.get('active-response-text').textContent, 'pathResponseEmpty');

    await clickCandidate(0);
    assert.equal(calls.length, 1, 'following the selected token must not fetch');
    assert.equal(elements.get('active-premise-text').textContent, 'False premise');
    assert.equal(elements.get('active-response-text').textContent, ' A');
    await clickCandidate(0);
    assert.equal(calls.length, 1, 'revealing the final selected token must not fetch');
    assert.equal(elements.get('path-candidates').textContent, 'pathComplete');
    await elements.get('finish-path-btn').events.click();
    assert.equal(calls.length, 1, 'finishing must not verify the path');
    assert.equal(elements.get('verify-hallucination-btn').disabled, false);
    const frozenResponse = elements.get('active-response-text').textContent;
    const rootTreeItem = elements.get('path-tree').children[0].children[0];
    const firstTokenTreeItem = rootTreeItem.children[1].children[0];
    await firstTokenTreeItem.children[0].events.click();
    assert.equal(elements.get('active-response-text').textContent, frozenResponse, 'finalizing must prevent changing the active branch');
    await elements.get('verify-hallucination-btn').events.click();
    assert.equal(calls.at(-1).prompt, 'False premise');
    assert.equal(calls.at(-1).response, ' A B');
    assert.equal(elements.get('verification-title').textContent, 'verificationResult');
    assert.equal(elements.get('verification-reason').textContent, 'The factual claim is not supported by the available sources.');
})().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
