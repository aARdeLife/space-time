const videoElement = document.getElementById('video');
const canvasElement = document.getElementById('canvas');
const canvasCtx = canvasElement.getContext('2d');

async function setupCamera() {
  const stream = await navigator.mediaDevices.getUserMedia({
    audio: false,
    video: { facingMode: 'user' },
  });

  videoElement.srcObject = stream;
  return new Promise((resolve) => {
    videoElement.onloadedmetadata = () => {
      resolve(videoElement);
    };
  });
}

async function setupFaceApi() {
  await faceapi.nets.tinyFaceDetector.loadFromUri('https://cdn.jsdelivr.net/npm/face-api.js/models');
  await faceapi.nets.faceLandmark68TinyNet.loadFromUri('https://cdn.jsdelivr.net/npm/face-api.js/models');
  const camera = await setupCamera();
  camera.width = videoElement.videoWidth;
  camera.height = videoElement.videoHeight;
  canvasElement.width = videoElement.videoWidth;
  canvasElement.height = videoElement.videoHeight;

  function renderFrame() {
    canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
    detectEyeLandmarks();
    requestAnimationFrame(renderFrame);
  }
  renderFrame();
}

async function detectEyeLandmarks() {
  const options = new faceapi.TinyFaceDetectorOptions({ inputSize: 224 });
  const result = await faceapi.detectSingleFace(videoElement, options).withFaceLandmarks(true, options);

  if (result) {
    const resizedResults = faceapi.resizeResults(result, { width: videoElement.videoWidth, height: videoElement.videoHeight });
    faceapi.draw.drawFaceLandmarks(canvasElement, resizedResults, { lineWidth: 1, color: 'blue' });

    // Use the pupil position as a pointer
  }
}

setupFaceApi();


function onResults(results) {
  if (results.multiIrisLandmarks) {
    drawLandmarks(canvasCtx, results.multiIrisLandmarks, { lineWidth: 1, color: 'blue' });
    // Use the pupil position as a pointer
  }
}

setupIrisTracking();
