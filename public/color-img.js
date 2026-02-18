const fileInput = document.getElementById("fileInput");
const canvas = document.getElementById("imageCanvas");
const hexInput = document.getElementById("hexInput");
const rgbInput = document.getElementById("rgbInput");
const hslInput = document.getElementById("hslInput");
const colorPaletteInput = document.querySelector(
  'input[placeholder="COLOR PALETTE OUTPUT"]',
);
const copyButtons = [
  document.getElementById("copyHex"),
  document.getElementById("copyRgb"),
  document.getElementById("copyHsl"),
];

let imageUrl = null;

fileInput.addEventListener("change", (event) => {
  const file = event.target.files[0];
  if (file) {
    imageUrl = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      const ctx = canvas.getContext("2d");
      const dpr = window.devicePixelRatio || 1;
      const fixedWidth = 320,
        fixedHeight = (fixedWidth * 9) / 16;
      const aspectRatio = img.naturalWidth / img.naturalHeight;
      const [drawWidth, drawHeight] =
        aspectRatio > 1
          ? [fixedWidth, fixedWidth / aspectRatio]
          : [fixedHeight * aspectRatio, fixedHeight];

      canvas.width = fixedWidth * dpr;
      canvas.height = fixedHeight * dpr;
      ctx.scale(dpr, dpr);
      const offsetX = (fixedWidth - drawWidth) / 2,
        offsetY = (fixedHeight - drawHeight) / 2;
      ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
    };
    img.src = imageUrl;
  }
});

canvas.addEventListener("click", (event) => {
  const { left, top, width, height } = canvas.getBoundingClientRect();
  const [x, y] = [
    (event.clientX - left) * (canvas.width / width),
    (event.clientY - top) * (canvas.height / height),
  ];
  const {
    data: [r, g, b],
  } = canvas.getContext("2d").getImageData(x, y, 1, 1);

  const hexColor = rgbToHex(r, g, b),
    rgbColor = `rgb(${r}, ${g}, ${b})`,
    hslColor = rgbToHsl(r, g, b);
  hexInput.value = hexColor;
  rgbInput.value = rgbColor;
  hslInput.value = hslColor;
  colorPaletteInput.style.backgroundColor = hexColor;
  enableCopyButtons();
});

copyButtons.forEach((button) =>
  button.addEventListener("click", () => {
    navigator.clipboard.writeText(button.previousElementSibling.value);
    showCopied(button);
  }),
);

function rgbToHex(r, g, b) {
  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase()}`;
}

function rgbToHsl(r, g, b) {
  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b),
    min = Math.min(r, g, b);
  const l = (max + min) / 2,
    delta = max - min;
  let h = 0,
    s =
      max !== min
        ? l > 0.5
          ? delta / (2 - max - min)
          : delta / (max + min)
        : 0;

  if (max !== min) {
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
    }
    h /= 6;
  }
  return `hsl(${Math.round(h * 360)}, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%)`;
}

function enableCopyButtons() {
  [hexInput, rgbInput, hslInput].forEach((input, i) => {
    copyButtons[i].disabled = !input.value;
  });
}

function showCopied(button) {
  const originalText = button.innerText;
  button.innerText = "COPIED";
  setTimeout(() => (button.innerText = originalText), 3000);
}

copyButtons.forEach((button) => (button.disabled = true));