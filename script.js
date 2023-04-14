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

async function setupIrisTracking() {
  const iris = new Iris({ locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/iris/${file}` });
  iris.setOptions({ maxNumIrisLandmarks: 1 });
  iris.onResults(onResults);

  const camera = await setupCamera();
  camera.width = videoElement.videoWidth;
  camera.height = videoElement.videoHeight;
  canvasElement.width = videoElement.videoWidth;
  canvasElement.height = videoElement.videoHeight;

  function renderFrame() {
    canvasCtx.drawImage(videoElement, 0, 0, videoElement.videoWidth, videoElement.videoHeight);
    iris.send({ image: videoElement });
    requestAnimationFrame(renderFrame);
  }
  renderFrame();
}

function onResults(results) {
  canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
  canvasCtx.drawImage(results.segmentationMask, 0, 0, canvasElement.width, canvasElement.height);
  drawLandmarks(canvasCtx, results.multiIrisLandmarks, { lineWidth: 1, color: 'blue' });
  // Use the pupil position as a pointer
}

setupIrisTracking();
