(() => {
    const state = {
        nodes: new Map(), activeNodeId: null, nextId: 0, loading: false,
        finalized: false, finalSnapshot: null,
        verification: null, verificationLoading: false, verificationFailed: false,
    };
    const isStaticDemo = document.body.dataset.staticDemo === 'true';
    const input = document.getElementById('path-prompt-input');
    const startButton = document.getElementById('path-start-btn');
    const finishButton = document.getElementById('finish-path-btn');
    const verifyButton = document.getElementById('verify-hallucination-btn');
    const candidatesElement = document.getElementById('path-candidates');
    const treeElement = document.getElementById('path-tree');
    const activePremiseLabelElement = document.getElementById('active-premise-label');
    const activePremiseElement = document.getElementById('active-premise-text');
    const activeResponseLabelElement = document.getElementById('active-response-label');
    const activeResponseElement = document.getElementById('active-response-text');
    const statusElement = document.getElementById('path-status');
    const verificationElement = document.getElementById('verification-result');
    const verificationTitleElement = document.getElementById('verification-title');
    const verificationReasonElement = document.getElementById('verification-reason');
    const verificationSourcesElement = document.getElementById('verification-sources');

    const staticInitialSegment = [
        { selected_token: ' it', selected_prob: 0.72, top_logprobs: [{ token: ' it', probability: 0.72 }, { token: ' Sydney', probability: 0.15 }, { token: ' the', probability: 0.08 }] },
        { selected_token: ' was', selected_prob: 0.68, top_logprobs: [{ token: ' was', probability: 0.68 }, { token: ' became', probability: 0.18 }, { token: ' is', probability: 0.09 }] },
        { selected_token: ' once', selected_prob: 0.61, top_logprobs: [{ token: ' once', probability: 0.61 }, { token: ' originally', probability: 0.21 }, { token: ' historically', probability: 0.12 }] },
    ];
    const staticBranchSegment = [
        { selected_token: ' became', selected_prob: 0.66, top_logprobs: [{ token: ' became', probability: 0.66 }, { token: ' grew', probability: 0.19 }, { token: ' remained', probability: 0.1 }] },
        { selected_token: ' a', selected_prob: 0.75, top_logprobs: [{ token: ' a', probability: 0.75 }, { token: ' the', probability: 0.18 }, { token: ' an', probability: 0.04 }] },
        { selected_token: ' major', selected_prob: 0.7, top_logprobs: [{ token: ' major', probability: 0.7 }, { token: ' prominent', probability: 0.17 }, { token: ' well-known', probability: 0.08 }] },
    ];

    const t = (key) => window.i18n.t(key);
    const formatToken = (token) => token.replace(/ /g, '␠').replace(/\n/g, '↵').replace(/\t/g, '⇥');

    function createNode({ parentId = null, token = '', probability = null, context, responsePrefix = '', segment = [], nextIndex = 0 }) {
        const id = `path-node-${state.nextId++}`;
        const node = { id, parentId, token, probability, context, responsePrefix, segment, nextIndex, children: [] };
        state.nodes.set(id, node);
        if (parentId) state.nodes.get(parentId).children.push(id);
        return node;
    }

    const activeNode = () => state.nodes.get(state.activeNodeId);
    const rootNode = () => [...state.nodes.values()].find((node) => node.parentId === null);
    const currentTokenData = (node) => node?.segment[node.nextIndex] || null;

    function candidateChoices(tokenData) {
        const candidates = [...(tokenData.top_logprobs || [])];
        if (!candidates.some((candidate) => candidate.token === tokenData.selected_token)) {
            candidates.unshift({ token: tokenData.selected_token, probability: tokenData.selected_prob });
        }
        return candidates.filter((candidate, index, all) => all.findIndex((other) => other.token === candidate.token) === index);
    }

    function renderActivePath() {
        const node = activeNode();
        const root = rootNode();
        activePremiseLabelElement.textContent = t('pathPremise');
        activeResponseLabelElement.textContent = t('assistantResponse');
        activePremiseElement.textContent = root ? root.context : t('pathEmpty');
        activeResponseElement.textContent = node?.responsePrefix || t('pathResponseEmpty');
        finishButton.disabled = !node?.responsePrefix || state.loading || state.finalized;
    }

    function renderVerification() {
        verificationSourcesElement.innerHTML = '';
        verifyButton.disabled = !state.finalSnapshot || state.verificationLoading;
        if (state.verificationLoading) {
            verificationElement.hidden = false;
            verificationTitleElement.textContent = t('verificationLoading');
            verificationReasonElement.textContent = '';
            return;
        }
        if (state.verificationFailed) {
            verificationElement.hidden = false;
            verificationTitleElement.textContent = t('verificationFailed');
            verificationReasonElement.textContent = '';
            return;
        }
        if (!state.verification) {
            verificationElement.hidden = true;
            return;
        }
        verificationElement.hidden = false;
        verificationTitleElement.textContent = t('verificationResult');
        verificationReasonElement.textContent = state.verification.message;
        (state.verification.sources || []).forEach((source) => {
            const item = document.createElement('li');
            const link = document.createElement('a');
            link.href = source.url;
            link.target = '_blank';
            link.rel = 'noopener noreferrer';
            link.textContent = `${source.relation}: ${source.title}${source.retrieved_at ? ` (${source.retrieved_at})` : ''}`;
            item.appendChild(link);
            verificationSourcesElement.appendChild(item);
        });
    }

    function renderCandidates() {
        candidatesElement.innerHTML = '';
        if (state.finalized) {
            candidatesElement.textContent = t('pathFinished');
            return;
        }
        const tokenData = currentTokenData(activeNode());
        if (!tokenData) {
            if (activeNode() && !state.loading) candidatesElement.textContent = t('pathComplete');
            return;
        }
        candidateChoices(tokenData).forEach((candidate) => {
            const button = document.createElement('button');
            button.type = 'button';
            button.className = 'path-candidate';
            const token = document.createElement('span');
            token.className = 'path-candidate-token';
            token.textContent = formatToken(candidate.token);
            const probability = document.createElement('span');
            probability.className = 'path-candidate-probability';
            probability.textContent = `${(candidate.probability * 100).toFixed(1)}%`;
            button.append(token, probability);
            button.addEventListener('click', () => chooseCandidate(candidate));
            candidatesElement.appendChild(button);
        });
    }

    function renderTreeNode(node, parent) {
        const item = document.createElement('li');
        item.className = 'path-tree-item';
        item.setAttribute('role', 'treeitem');
        item.setAttribute('aria-selected', String(node.id === state.activeNodeId));
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'path-tree-node';
        if (node.id === state.activeNodeId) button.classList.add('path-tree-node-active');
        const token = document.createElement('span');
        token.textContent = node.parentId ? formatToken(node.token) : node.context;
        button.appendChild(token);
        if (node.probability !== null) {
            const probability = document.createElement('small');
            probability.textContent = ` ${(node.probability * 100).toFixed(1)}%`;
            button.appendChild(probability);
        }
        button.disabled = state.finalized;
        button.addEventListener('click', () => selectNode(node.id));
        item.appendChild(button);
        if (node.children.length) {
            const children = document.createElement('ul');
            children.setAttribute('role', 'group');
            node.children.forEach((childId) => renderTreeNode(state.nodes.get(childId), children));
            item.appendChild(children);
        }
        parent.appendChild(item);
    }

    function renderTree() {
        treeElement.innerHTML = '';
        const root = [...state.nodes.values()].find((node) => node.parentId === null);
        if (!root) return;
        const list = document.createElement('ul');
        list.className = 'path-tree-list';
        renderTreeNode(root, list);
        treeElement.appendChild(list);
    }

    function render() {
        renderActivePath();
        renderCandidates();
        renderTree();
        renderVerification();
    }

    function setLoading(isLoading) {
        state.loading = isLoading;
        startButton.disabled = isLoading;
        candidatesElement.classList.toggle('path-candidates-loading', isLoading);
        if (isLoading) candidatesElement.textContent = t('loadingChoices');
    }

    async function requestSegment(premise, responsePrefix) {
        if (isStaticDemo) return responsePrefix ? staticBranchSegment : staticInitialSegment;
        const response = await fetch('/api/generate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ prompt: premise, response_prefix: responsePrefix, top_k: 5, temperature: 0.0, mode: 'path', locale: window.i18n.getLocale() }),
        });
        if (!response.ok) throw new Error('Could not generate path candidates.');
        const data = await response.json();
        if (!Array.isArray(data.tokenProbs) || !data.tokenProbs.length) throw new Error('The path response was invalid.');
        return data.tokenProbs;
    }

    async function loadSegment(node) {
        setLoading(true);
        statusElement.textContent = '';
        try {
            const root = rootNode();
            node.segment = await requestSegment(root.context, node.responsePrefix);
            node.nextIndex = 0;
            if (state.activeNodeId === node.id) render();
        } catch (error) {
            node.segment = [];
            if (state.activeNodeId === node.id) {
                candidatesElement.textContent = t('noCandidates');
                statusElement.textContent = t('generationError');
            }
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    async function startPath() {
        const premise = input.value;
        if (!premise.trim()) {
            statusElement.textContent = t('enterFalsePremise');
            input.focus();
            return;
        }
        state.nodes.clear();
        state.nextId = 0;
        state.finalized = false;
        state.finalSnapshot = null;
        state.verification = null;
        state.verificationLoading = false;
        state.verificationFailed = false;
        const root = createNode({ context: premise });
        state.activeNodeId = root.id;
        input.disabled = true;
        render();
        await loadSegment(root);
    }

    async function chooseCandidate(candidate) {
        const parent = activeNode();
        const tokenData = currentTokenData(parent);
        if (!parent || !tokenData || state.loading || state.finalized) return;
        const isOriginalChoice = candidate.token === tokenData.selected_token;
        const child = createNode({
            parentId: parent.id,
            token: candidate.token,
            probability: candidate.probability,
            context: parent.context + candidate.token,
            responsePrefix: parent.responsePrefix + candidate.token,
            segment: isOriginalChoice ? parent.segment : [],
            nextIndex: isOriginalChoice ? parent.nextIndex + 1 : 0,
        });
        state.activeNodeId = child.id;
        render();
        if (!isOriginalChoice) await loadSegment(child);
    }

    function selectNode(nodeId) {
        if (state.finalized) return;
        state.activeNodeId = nodeId;
        statusElement.textContent = '';
        render();
    }

    function finishPath() {
        const node = activeNode();
        const root = rootNode();
        if (state.finalized || !node?.responsePrefix || !root) return;
        state.finalized = true;
        state.finalSnapshot = Object.freeze({ prompt: root.context, response: node.responsePrefix });
        statusElement.textContent = t('pathFinished');
        render();
    }

    async function verifyPath() {
        if (!state.finalSnapshot || state.verificationLoading) return;
        state.verificationLoading = true;
        state.verificationFailed = false;
        render();
        try {
            if (isStaticDemo) {
                state.verification = {
                    message: 'A continuação apresenta uma explicação factual que precisa de verificação por fontes externas.',
                    sources: [{ title: 'NASA: The Moon Illusion', url: 'https://science.nasa.gov/solar-system/moon/the-moon-illusion-why-does-the-moon-look-so-big-sometimes/', relation: 'contradicts', retrieved_at: '2026-10-02' }],
                };
            } else {
                const response = await fetch('/api/verify-hallucination', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ ...state.finalSnapshot, locale: window.i18n.getLocale() }),
                });
                if (!response.ok) throw new Error('Could not verify the path response.');
                state.verification = await response.json();
                if (typeof state.verification.message !== 'string' || !state.verification.message.trim()) {
                    throw new Error('The verification response was invalid.');
                }
            }
        } catch (error) {
            state.verification = null;
            state.verificationFailed = true;
            console.error(error);
        } finally {
            state.verificationLoading = false;
            render();
        }
    }

    startButton.addEventListener('click', startPath);
    input.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            startPath();
        }
    });
    finishButton.addEventListener('click', finishPath);
    verifyButton.addEventListener('click', verifyPath);
    document.addEventListener('localechange', render);
})();
