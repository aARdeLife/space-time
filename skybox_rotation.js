
document.addEventListener('DOMContentLoaded', () => {
    const skybox = document.getElementById('earth-skybox');
    skybox.setAttribute('src', 'path/to/your/earth_texture.jpg');
    skybox.setAttribute('rotation', '0 180 0');
});

const rotationSpeed = 360 / (24 * 60 * 60); // Degrees per second

function updateRotation() {
    const skybox = document.getElementById('earth-skybox');
    const currentRotation = skybox.getAttribute('rotation').split(' ')[1]; // Get the Y rotation
    const newRotation = (parseFloat(currentRotation) + rotationSpeed * (1/60)) % 360; // Add the rotation speed and make sure it's within 360 degrees
    skybox.setAttribute('rotation', `0 ${newRotation} 0`);
    requestAnimationFrame(updateRotation);
}

updateRotation();
