const fileInput = document.getElementById("fileInput");
const canvas = document.getElementById("imageCanvas");
const hexInput = document.getElementById("hexInput");
const rgbInput = document.getElementById("rgbInput");
const hslInput = document.getElementById("hslInput");
const colorPaletteInput = document.querySelector('input[placeholder="COLOR PALETTE OUTPUT"]');
const copyHexButton = document.getElementById("copyHex");
const copyRgbButton = document.getElementById("copyRgb");
const copyHslButton = document.getElementById("copyHsl");

let imageUrl = null;

fileInput.addEventListener("change", (event) => {
  const file = event.target.files[0];
  if (file) {
    imageUrl = URL.createObjectURL(file);
    const img = new Image();
    img.onload = function () {
      const ctx = canvas.getContext("2d");

      const fixedWidth = 320;
      const fixedHeight = fixedWidth * (9 / 16);

      canvas.width = fixedWidth;
      canvas.height = fixedHeight;

      const aspectRatio = img.naturalWidth / img.naturalHeight;
      let drawWidth = fixedWidth;
      let drawHeight = fixedHeight;

      if (aspectRatio > 1) {
        drawHeight = fixedWidth / aspectRatio;
      } else {
        drawWidth = fixedHeight * aspectRatio;
      }

      const offsetX = (fixedWidth - drawWidth) / 2;
      const offsetY = (fixedHeight - drawHeight) / 2;

      ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
    };
    img.src = imageUrl;
  }
});

canvas.addEventListener("click", (event) => {
  const rect = canvas.getBoundingClientRect();
  const x = Math.floor((event.clientX - rect.left) * (canvas.width / rect.width));
  const y = Math.floor((event.clientY - rect.top) * (canvas.height / rect.height));
  const ctx = canvas.getContext("2d");
  const imageData = ctx.getImageData(x, y, 1, 1).data;
  const r = imageData[0];
  const g = imageData[1];
  const b = imageData[2];

  const rgbColor = `rgb(${r}, ${g}, ${b})`;
  const hexColor = rgbToHex(r, g, b);
  const hslColor = rgbToHsl(r, g, b);

  hexInput.value = hexColor;
  rgbInput.value = rgbColor;
  hslInput.value = hslColor;

  // Set the background color of the color palette input field
  colorPaletteInput.style.backgroundColor = hexColor;

  enableCopyButtons();
});

copyHexButton.addEventListener("click", () => {
  navigator.clipboard.writeText(hexInput.value);
  showCopied(copyHexButton);
});

copyRgbButton.addEventListener("click", () => {
  navigator.clipboard.writeText(rgbInput.value);
  showCopied(copyRgbButton);
});

copyHslButton.addEventListener("click", () => {
  navigator.clipboard.writeText(hslInput.value);
  showCopied(copyHslButton);
});

function rgbToHex(r, g, b) {
  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase()}`;
}

function rgbToHsl(r, g, b) {
  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  let l = (max + min) / 2;

  if (max !== min) {
    const delta = max - min;
    s = l > 0.5 ? delta / (2 - max - min) : delta / (max + min);

    switch (max) {
      case r:
        h = (g - b) / delta + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / delta + 2;
        break;
      case b:
        h = (r - g) / delta + 4;
        break;
      default:
        break;
    }
    h /= 6;
  }

  return `hsl(${Math.round(h * 360)}, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%)`;
}

function enableCopyButtons() {
  if (hexInput.value) {
    copyHexButton.disabled = false;
  }
  if (rgbInput.value) {
    copyRgbButton.disabled = false;
  }
  if (hslInput.value) {
    copyHslButton.disabled = false;
  }
}

function showCopied(button) {
  const originalText = button.innerText;
  button.innerText = "COPIED";
  setTimeout(() => {
    button.innerText = originalText;
  }, 3000);
}

copyHexButton.disabled = true;
copyRgbButton.disabled = true;
copyHslButton.disabled = true;