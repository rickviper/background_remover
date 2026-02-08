const uploadBox = document.getElementById("uploadBox");
const fileInput = document.getElementById("fileInput");
const uploadSection = document.getElementById("uploadSection");
const previewSection = document.getElementById("previewSection");
const loadingSection = document.getElementById("loadingSection");
const resultSection = document.getElementById("resultSection");
const previewImage = document.getElementById("previewImage");
const resultImage = document.getElementById("resultImage");
const fileDetails = document.getElementById("fileDetails");
const resultInfo = document.getElementById("resultInfo");
const changeImageBtn = document.getElementById("changeImageBtn");
const removeBgBtn = document.getElementById("removeBgBtn");
const resetBtn = document.getElementById("resetBtn");
const downloadBtn = document.getElementById("downloadBtn");
const errorMessage = document.getElementById("errorMessage");
const errorText = document.getElementById("errorText");
const closeErrorBtn = document.getElementById("closeErrorBtn");

let currentFilename = null;
let currentOutputFilename = null;

const ALLOWED_TYPES = ["image/png", "image/jpeg", "image/jpg", "image/webp"];
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

document.addEventListener("DOMContentLoaded", () => {
  setupDragAndDrop();
  setupEventListeners();
});

function setupDragAndDrop() {
  // Prevent default drag behaviors
  ["dragenter", "dragover", "dragleave", "drop"].forEach((eventName) => {
    uploadBox.addEventListener(eventName, preventDefaults, false);
    document.body.addEventListener(eventName, preventDefaults, false);
  });
  ["dragenter", "dragover"].forEach((eventName) => {
    uploadBox.addEventListener(
      eventName,
      () => {
        uploadBox.classList.add("dragover");
      },
      false,
    );
  });
  ["dragleave", "drop"].forEach((eventName) => {
    uploadBox.addEventListener(
      eventName,
      () => {
        uploadBox.classList.remove("dragover");
      },
      false,
    );
  });
  uploadBox.addEventListener("drop", handleDrop, false);
}

function preventDefaults(e) {
  e.preventDefault();
  e.stopPropagation();
}

function handleDrop(e) {
  const dt = e.dataTransfer;
  const files = dt.files;

  if (files.length > 0) {
    handleFile(files[0]);
  }
}

function setupEventListeners() {
  fileInput.addEventListener("change", (e) => {
    if (e.target.files.length > 0) {
      handleFile(e.target.files[0]);
    }
  });
  changeImageBtn.addEventListener("click", () => {
    resetToUpload();
  });
  removeBgBtn.addEventListener("click", () => {
    removeBackground();
  });
  resetBtn.addEventListener("click", () => {
    resetToUpload();
  });
  closeErrorBtn.addEventListener("click", () => {
    hideError();
  });
}

function handleFile(file) {
  if (!ALLOWED_TYPES.includes(file.type)) {
    showError("Invalid file type. Please upload PNG, JPG, JPEG, or WEBP.");
    return;
  }
  if (file.size > MAX_FILE_SIZE) {
    showError("File too large. Maximum size is 10MB.");
    return;
  }
  uploadFile(file);
}

async function uploadFile(file) {
  const formData = new FormData();
  formData.append("file", file);

  try {
    const response = await fetch("/upload", {
      method: "POST",
      body: formData,
    });

    const data = await response.json();

    if (data.success) {
      currentFilename = data.filename;
      showPreview(file, data);
    } else {
      showError(data.error || "Failed to upload file.");
    }
  } catch (error) {
    showError("Network error. Please try again.");
    console.error("Upload error:", error);
  }
}

function showPreview(file, data) {
  const objectUrl = URL.createObjectURL(file);
  previewImage.src = objectUrl;
  const sizeInMB = (data.size / (1024 * 1024)).toFixed(2);
  fileDetails.innerHTML = `
        <strong>File:</strong> ${file.name}<br>
        <strong>Size:</strong> ${sizeInMB} MB<br>
        <strong>Type:</strong> ${file.type}
    `;
  uploadSection.classList.add("hidden");
  previewSection.classList.remove("hidden");
}

async function removeBackground() {
  if (!currentFilename) {
    showError("No file selected. Please upload an image first.");
    return;
  }
  previewSection.classList.add("hidden");
  loadingSection.classList.remove("hidden");

  try {
    const response = await fetch("/remove-bg", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        filename: currentFilename,
      }),
    });
    const data = await response.json();
    if (data.success) {
      currentOutputFilename = data.output_filename;
      showResult(data);
    } else {
      showError(data.error || "Failed to process image.");
      loadingSection.classList.add("hidden");
      previewSection.classList.remove("hidden");
    }
  } catch (error) {
    showError("Network error. Please try again.");
    console.error("Processing error:", error);
    loadingSection.classList.add("hidden");
    previewSection.classList.remove("hidden");
  }
}

function showResult(data) {
  resultImage.src = `/preview/${data.output_filename}`;
  const sizeInMB = (data.size / (1024 * 1024)).toFixed(2);
  resultInfo.innerHTML = `
        <strong>Resolution:</strong> ${data.width} x ${data.height}px<br>
        <strong>Size:</strong> ${sizeInMB} MB<br>
        <strong>Format:</strong> PNG (Transparent)
    `;
  downloadBtn.href = `/download/${data.output_filename}`;
  loadingSection.classList.add("hidden");
  resultSection.classList.remove("hidden");
}

function resetToUpload() {
  currentFilename = null;
  currentOutputFilename = null;
  fileInput.value = "";
  previewImage.src = "";
  resultImage.src = "";
  downloadBtn.href = "#";
  uploadSection.classList.remove("hidden");
  previewSection.classList.add("hidden");
  loadingSection.classList.add("hidden");
  resultSection.classList.add("hidden");
  hideError();
}

function showError(message) {
  errorText.textContent = message;
  errorMessage.classList.remove("hidden");
  setTimeout(() => {
    hideError();
  }, 5000);
}

function hideError() {
  errorMessage.classList.add("hidden");
}

function formatFileSize(bytes) {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
}

function getFileExtension(filename) {
  return filename.slice(((filename.lastIndexOf(".") - 1) >>> 0) + 2);
}

function isValidImageFile(file) {
  return ALLOWED_TYPES.includes(file.type);
}

function isValidFileSize(file) {
  return file.size <= MAX_FILE_SIZE;
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    formatFileSize,
    getFileExtension,
    isValidImageFile,
    isValidFileSize,
  };
}
