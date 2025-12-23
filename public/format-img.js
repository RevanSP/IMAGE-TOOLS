document.addEventListener("DOMContentLoaded", () => {
  const fileInput = document.getElementById("fileInputs");
  const formatSelect = document.getElementById("formatSelect");
  const convertButton = document.getElementById("convertButton");
  const saveButton = document.getElementById("saveButton");
  const canvas = document.getElementById("canvas");
  const ctx = canvas.getContext("2d");

  let originalImage, convertedDataUrl, convertedFormat, convertedFilename;

  convertButton.disabled = true;
  saveButton.disabled = true;

  const loadImage = (file, callback) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => callback(img);
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  };

  const updateConvertButtonState = () => {
    const fileSelected = fileInput.files.length > 0;
    const validFormat = formatSelect.value && formatSelect.value !== "FORMAT";
    convertButton.disabled = !(fileSelected && validFormat);
  };

  fileInput.addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (!file) {
      convertButton.disabled = true;
      saveButton.disabled = true;
      return;
    }

    loadImage(file, (img) => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);
    });

    saveButton.disabled = true;
    convertedDataUrl = null;

    updateConvertButtonState();
  });

  formatSelect.addEventListener("change", () => {
    updateConvertButtonState();
  });

  convertButton.addEventListener("click", async () => {
    if (
      !fileInput.files.length ||
      !formatSelect.value ||
      formatSelect.value === "FORMAT"
    ) {
      alert("Please select an image and format");
      return;
    }

    const formData = new FormData();
    formData.append("image", fileInput.files[0]);

    try {
      canvas.style.opacity = 0.5;
      convertButton.disabled = true;
      convertButton.textContent = "CONVERTING...";

      const response = await fetch(`/convert?format=${formatSelect.value}`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error(await response.text());

      const data = await response.json();

      convertedDataUrl = data.dataUrl;
      convertedFormat = formatSelect.value;
      convertedFilename = data.convertedName;

      const img = new Image();
      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);
        saveButton.disabled = false;
      };
      img.src = convertedDataUrl;
    } catch (error) {
      alert("Error: " + error.message);
      console.error("Conversion error:", error);
    } finally {
      canvas.style.opacity = 1;
      convertButton.disabled = false;
      convertButton.textContent = "CONVERT";
      updateConvertButtonState();
    }
  });

  saveButton.addEventListener("click", () => {
    if (!convertedDataUrl)
      return alert("No converted image available to download");

    const link = document.createElement("a");
    link.href = convertedDataUrl;
    link.download = convertedFilename || `converted.${convertedFormat}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  });

  saveButton.addEventListener("contextmenu", (e) => {
    e.preventDefault();
    if (
      !saveButton.disabled &&
      confirm(
        "Use alternative download method?\n(Recommended for larger files)"
      )
    ) {
      const form = document.createElement("form");
      form.method = "POST";
      form.action = `/convert-download?format=${convertedFormat}`;
      form.target = "_blank";

      const clonedInput = fileInput.cloneNode(true);
      form.appendChild(clonedInput);

      document.body.appendChild(form);
      form.submit();
      document.body.removeChild(form);
    }
  });
});