const CameraCaptureModule = (function () {
  // Private variables and functions
  let videoContainer,
    video,
    captureBtn,
    capturedImageContainer,
    capturedImage,
    confirmBtn,
    retakeBtn, 
    permissionDeniedContainer,
    stream;

    const overlayHTML = '<div id="video-box"></div>';

    let showOverlay = true;

  function getElements() {
    videoContainer = document.getElementById("camera-container");
    video = document.getElementById("video");
    captureBtn = document.getElementById("capture-btn");
    capturedImageContainer = document.getElementById(
      "captured-image-container"
    );
    capturedImage = document.getElementById("captured-image");
    confirmBtn = document.getElementById("confirm-btn");
    retakeBtn = document.getElementById("retake-btn");
    permissionDeniedContainer = document.getElementById(
      "permission-denied-container"
    );
    overlayColorPicker = document.getElementById("overlay-color");

  }

  async function startCamera() {
    try {
      stream = await navigator.mediaDevices.getUserMedia({ video: true });
      video.srcObject = stream;
    } catch (error) {
      console.error("Error accessing camera:", error);
      permissionDeniedContainer.style.display = "block";
    }
  }

  function captureImage(event) {  
    event.preventDefault();
    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext("2d").drawImage(video, 0, 0);
    const imageData = canvas.toDataURL("image/png");
    capturedImage.src = imageData;
    videoContainer.style.display = "none";
    capturedImageContainer.style.display = "block";
    stopCamera();
  }

  function retakePicture(event) {
    event.preventDefault();
    startCamera();
    videoContainer.style.display = "block";
    capturedImageContainer.style.display = "none";
  }

  function stopCamera() {
    if (stream) {
      const tracks = stream.getTracks();
      tracks.forEach((track) => track.stop());
    }
  }

  function updateOverlay() {
    if (showOverlay) {
      videoContainer.insertAdjacentHTML("afterbegin", overlayHTML);
    } else {
      const overlay = document.getElementById("video-box");
      if (overlay) {
        overlay.remove();
      }
    }
  }

  function updateOverlayColor() {
    const selectedColor = overlayColorPicker.value;
    const overlay = document.getElementById("video-box");
    if (overlay) {
      overlay.style.boxShadow = `0 0 0 1000px rgba(${parseInt(
        selectedColor.slice(1, 3),
        16
      )}, ${parseInt(selectedColor.slice(3, 5), 16)}, ${parseInt(
        selectedColor.slice(5, 7),
        16
      )}, 0.5)`;
    }
  }


  function handleConfirm() {
    alert("success");
  }

  // Public functions and properties
  return {
    init: function () {
      getElements();
      captureBtn.addEventListener("click", captureImage);
      confirmBtn.addEventListener("click", handleConfirm);
      retakeBtn.addEventListener("click", retakePicture);
      startCamera();
      window.addEventListener("beforeunload", stopCamera);
        // Call the updateOverlay function initially
        updateOverlay();
      window.addEventListener("load", updateOverlayColor);
      overlayColorPicker.addEventListener("input", updateOverlayColor);
    },
  };
})();

// Usage
CameraCaptureModule.init();
