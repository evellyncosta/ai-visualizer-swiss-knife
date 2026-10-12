(() => {
    let imageUrl = null;
    let imageMimeType = 'image/png';
    let capturedFrames = [];
    const promptInput = document.getElementById('image-prompt-input');
    const captureStepsInput = document.getElementById('capture-steps-input');
    const captureSettings = document.getElementById('capture-settings');
    const captureEveryInput = document.getElementById('capture-every-input');
    const generateButton = document.getElementById('generate-image-btn');
    const status = document.getElementById('image-status');
    const resultSection = document.getElementById('image-result-section');
    const image = document.getElementById('generated-image');
    const downloadButton = document.getElementById('download-image-btn');
    const t = (key) => window.i18n.t(key);

    window.imageDenoisingCapture = {
        get frames() { return capturedFrames; },
    };

    function syncCaptureControls() {
        const enabled = captureStepsInput.checked;
        captureSettings.hidden = !enabled;
        captureEveryInput.disabled = !enabled;
    }

    function clearImage() {
        if (imageUrl) URL.revokeObjectURL(imageUrl);
        imageUrl = null;
        capturedFrames = [];
        image.removeAttribute('src');
        resultSection.hidden = true;
    }

    function showError(key) {
        status.textContent = t(key);
        status.className = 'image-status image-status-error';
    }

    function showImage(blob) {
        if (!blob.type.startsWith('image/')) throw new Error('invalid_image');
        clearImage();
        imageMimeType = blob.type;
        imageUrl = URL.createObjectURL(blob);
        image.src = imageUrl;
        image.alt = t('generatedImageAlt');
        resultSection.hidden = false;
    }

    function pngBase64ToBlob(pngBase64) {
        if (typeof pngBase64 !== 'string' || !pngBase64) throw new Error('invalid_capture');
        const binary = atob(pngBase64);
        const bytes = new Uint8Array(binary.length);
        for (let index = 0; index < binary.length; index += 1) bytes[index] = binary.charCodeAt(index);
        return new Blob([bytes], { type: 'image/png' });
    }

    async function generateImage() {
        const prompt = promptInput.value.trim();
        if (!prompt) return showError('imagePromptRequired');
        const captureSteps = captureStepsInput.checked;
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
            if (captureSteps) {
                const capture = await response.json();
                if (!Array.isArray(capture.captured_steps)) throw new Error('invalid_capture');
                showImage(pngBase64ToBlob(capture.final_image_png_base64));
                capturedFrames = capture.captured_steps;
            } else {
                showImage(await response.blob());
            }
            status.textContent = '';
        } catch (_error) {
            showError('imageGenerationError');
        } finally {
            generateButton.disabled = false;
        }
    }

    function downloadImage() {
        if (!imageUrl) return;
        const extension = imageMimeType === 'image/jpeg' ? 'jpg' : 'png';
        const link = document.createElement('a');
        link.href = imageUrl;
        link.download = `generated-image.${extension}`;
        document.body.appendChild(link);
        link.click();
        link.remove();
    }

    syncCaptureControls();
    captureStepsInput.addEventListener('change', syncCaptureControls);
    generateButton.addEventListener('click', generateImage);
    downloadButton.addEventListener('click', downloadImage);
    window.addEventListener('beforeunload', clearImage);
})();
