(() => {
    let imageUrl = null;
    let imageMimeType = 'image/png';
    const promptInput = document.getElementById('image-prompt-input');
    const generateButton = document.getElementById('generate-image-btn');
    const status = document.getElementById('image-status');
    const resultSection = document.getElementById('image-result-section');
    const image = document.getElementById('generated-image');
    const downloadButton = document.getElementById('download-image-btn');
    const t = (key) => window.i18n.t(key);

    function clearImage() {
        if (imageUrl) URL.revokeObjectURL(imageUrl);
        imageUrl = null;
        image.removeAttribute('src');
        resultSection.hidden = true;
    }

    function showError(key) {
        status.textContent = t(key);
        status.className = 'image-status image-status-error';
    }

    async function generateImage() {
        const prompt = promptInput.value.trim();
        if (!prompt) return showError('imagePromptRequired');
        generateButton.disabled = true;
        status.textContent = t('imageGenerating');
        status.className = 'image-status';
        try {
            const response = await fetch('/api/generate-image', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ prompt }),
            });
            if (!response.ok) throw new Error('image_generation_failed');
            const blob = await response.blob();
            if (!blob.type.startsWith('image/')) throw new Error('invalid_image');
            clearImage();
            imageMimeType = blob.type;
            imageUrl = URL.createObjectURL(blob);
            image.src = imageUrl;
            image.alt = t('generatedImageAlt');
            resultSection.hidden = false;
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

    generateButton.addEventListener('click', generateImage);
    downloadButton.addEventListener('click', downloadImage);
    window.addEventListener('beforeunload', clearImage);
})();
