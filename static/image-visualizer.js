(() => {
    let finalImageUrl = null;
    let imageMimeType = 'image/png';
    let capturedFrames = [];
    const promptInput = document.getElementById('image-prompt-input');
    const captureStepsInput = document.getElementById('capture-steps-input');
    const captureSettings = document.getElementById('capture-settings');
    const captureEveryInput = document.getElementById('capture-every-input');
    const generateButton = document.getElementById('generate-image-btn');
    const status = document.getElementById('image-status');
    const resultSection = document.getElementById('image-result-section');
    const previewLabel = document.getElementById('image-preview-label');
    const image = document.getElementById('generated-image');
    const downloadButton = document.getElementById('download-image-btn');
    const capturedFramesSection = document.getElementById('captured-frames-section');
    const capturedFramesContainer = document.getElementById('captured-frames');
    const t = (key) => window.i18n.t(key);
    const interpolate = (key, values) => Object.entries(values).reduce(
        (text, [name, value]) => text.replace(`{${name}}`, value), t(key),
    );

    window.imageDenoisingCapture = {
        get frames() { return capturedFrames; },
    };

    function captureEnabled() {
        return captureStepsInput.getAttribute('aria-pressed') === 'true';
    }

    function syncCaptureControls() {
        const enabled = captureEnabled();
        captureSettings.hidden = !enabled;
        captureEveryInput.disabled = !enabled;
    }

    function clearResult() {
        if (finalImageUrl) URL.revokeObjectURL(finalImageUrl);
        capturedFrames.forEach((frame) => URL.revokeObjectURL(frame.url));
        finalImageUrl = null;
        capturedFrames = [];
        image.removeAttribute('src');
        capturedFramesContainer.replaceChildren();
        capturedFramesSection.hidden = true;
        resultSection.hidden = true;
    }

    function showError(key) {
        status.textContent = t(key);
        status.className = 'image-status image-status-error';
    }

    function showPreview(url, label) {
        image.src = url;
        image.alt = label;
        previewLabel.textContent = label;
    }

    function selectFrame(frame) {
        showPreview(frame.url, interpolate('selectedDenoisingStep', frame));
        capturedFrames.forEach((item) => {
            item.button.setAttribute('aria-pressed', String(item === frame));
        });
    }

    function appendFrame(frame) {
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'captured-frame';
        button.setAttribute('role', 'listitem');
        button.setAttribute('aria-pressed', 'false');
        button.setAttribute('aria-label', interpolate('selectedDenoisingStep', frame));

        const thumbnail = document.createElement('img');
        thumbnail.src = frame.url;
        thumbnail.alt = '';
        const metadata = document.createElement('span');
        metadata.className = 'captured-frame-metadata';
        metadata.textContent = `${interpolate('denoisingStepLabel', frame)} · ${interpolate('timestepLabel', frame)}`;
        button.appendChild(thumbnail);
        button.appendChild(metadata);
        button.addEventListener('click', () => selectFrame(frame));
        frame.button = button;
        capturedFramesContainer.appendChild(button);
    }

    function showFinalImage(blob) {
        if (!blob.type.startsWith('image/')) throw new Error('invalid_image');
        clearResult();
        imageMimeType = blob.type;
        finalImageUrl = URL.createObjectURL(blob);
        showPreview(finalImageUrl, t('finalImageLabel'));
        resultSection.hidden = false;
    }

    function pngBase64ToBlob(pngBase64) {
        if (typeof pngBase64 !== 'string' || !pngBase64) throw new Error('invalid_capture');
        const binary = atob(pngBase64);
        const bytes = new Uint8Array(binary.length);
        for (let index = 0; index < binary.length; index += 1) bytes[index] = binary.charCodeAt(index);
        return new Blob([bytes], { type: 'image/png' });
    }

    function showCapture(capture) {
        if (!Array.isArray(capture.captured_steps)) throw new Error('invalid_capture');
        const finalBlob = pngBase64ToBlob(capture.final_image_png_base64);
        const frames = capture.captured_steps.map((frame) => ({
            step: frame.step,
            timestep: frame.timestep,
            blob: pngBase64ToBlob(frame.png_base64),
        }));
        showFinalImage(finalBlob);
        capturedFrames = frames.map((frame) => ({ ...frame, url: URL.createObjectURL(frame.blob) }));
        capturedFrames.forEach(appendFrame);
        capturedFramesSection.hidden = capturedFrames.length === 0;
    }

    async function generateImage() {
        const prompt = promptInput.value.trim();
        if (!prompt) return showError('imagePromptRequired');
        const captureSteps = captureEnabled();
        const captureEvery = Number(captureEveryInput.value);
        if (captureSteps && (!Number.isInteger(captureEvery) || captureEvery <= 0)) {
            return showError('captureEveryInvalid');
        }
        generateButton.disabled = true;
        status.textContent = t('imageGenerating');
        status.className = 'image-status';
        try {
            const body = captureSteps
                ? { prompt, capture_steps: true, capture_every: captureEvery }
                : { prompt };
            const response = await fetch('/api/generate-image', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
            });
            if (!response.ok) throw new Error('image_generation_failed');
            if (captureSteps) showCapture(await response.json());
            else showFinalImage(await response.blob());
            status.textContent = '';
        } catch (_error) {
            showError('imageGenerationError');
        } finally {
            generateButton.disabled = false;
        }
    }

    function downloadImage() {
        if (!finalImageUrl) return;
        const extension = imageMimeType === 'image/jpeg' ? 'jpg' : 'png';
        const link = document.createElement('a');
        link.href = finalImageUrl;
        link.download = `generated-image.${extension}`;
        document.body.appendChild(link);
        link.click();
        link.remove();
    }

    syncCaptureControls();
    captureStepsInput.addEventListener('click', () => {
        captureStepsInput.setAttribute('aria-pressed', String(!captureEnabled()));
        syncCaptureControls();
    });
    generateButton.addEventListener('click', generateImage);
    downloadButton.addEventListener('click', downloadImage);
    window.addEventListener('beforeunload', clearResult);
})();
