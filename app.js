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

function drawBoundingBoxes(predictions) {
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    predictions.forEach(prediction => {
        const [x, y, width, height] = prediction.bbox;

        context.strokeStyle = 'red';
        context.lineWidth = 3;
        context.strokeRect(x, y, width, height);

        context.font = '18px Arial';
        context.fillStyle = 'red';
        context.fillText(prediction.class, x, y - 5);
    });
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
