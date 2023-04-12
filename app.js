const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const context = canvas.getContext('2d');

async function setupCamera() {
    const constraints = {
        video: {
            facingMode: { ideal: "environment" },
            width: { ideal: 640 },
            height: { ideal: 480 }
        }
    };

    try {
        video.srcObject = await navigator.mediaDevices.getUserMedia(constraints);
        return new Promise(resolve => video.onloadedmetadata = resolve);
    } catch (error) {
        console.error("Error accessing camera:", error);
    }
}

async function detectObjects(model) {
    const predictions = await model.detect(video);
    drawBoundingBoxes(predictions);
    requestAnimationFrame(() => detectObjects(model));
}

async function main() {
    await setupCamera();
    video.play();
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const model = await tfModels.cocoSsd.load();
    detectObjects(model);
}

main();
