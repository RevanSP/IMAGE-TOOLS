document.addEventListener("DOMContentLoaded", () => {
    const fileInputs = document.getElementById('fileInputs');
    const formatSelect = document.getElementById('formatSelect');
    const convertButton = document.getElementById('convertButton');
    const saveButton = document.getElementById('saveButton');
    const canvasElement = document.getElementById('canvas');
    const ctx = canvasElement.getContext('2d');

    let uploadedImage = null;

    fileInputs.addEventListener('change', (event) => {
        const file = event.target.files[0];
        if (file && file.type.startsWith('image')) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const img = new Image();
                img.onload = () => {
                    uploadedImage = img;
                    canvasElement.width = img.width;
                    canvasElement.height = img.height;
                    ctx.drawImage(img, 0, 0);
                };
                img.src = e.target.result;
            };
            reader.readAsDataURL(file);
        }
    });

    convertButton.addEventListener('click', () => {
        if (uploadedImage) {
            const selectedFormat = formatSelect.value;

            let imageDataURL = '';

            switch (selectedFormat) {
                case 'image/jpeg':
                    imageDataURL = canvasElement.toDataURL('image/jpeg');
                    break;
                case 'image/png':
                    imageDataURL = canvasElement.toDataURL('image/png');
                    break;
                case 'image/webp':
                    imageDataURL = canvasElement.toDataURL('image/webp');
                    break;
                default:
                    return;
            }

            saveButton.disabled = false;

            saveButton.onclick = () => {
                const a = document.createElement('a');
                a.href = imageDataURL;
                a.download = `converted-image.${selectedFormat.split('/')[1]}`;
                a.click();
            };
        } else {
            alert('Please upload an image first.');
        }
    });
});
