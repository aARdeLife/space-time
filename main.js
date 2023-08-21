
document.addEventListener('DOMContentLoaded', () => {
    const skybox = document.getElementById('earth-skybox');
    skybox.setAttribute('src', 'Earth4096.jpg');
    skybox.setAttribute('rotation', '0 180 0');
});

const rotationSpeed = 360 / (24 * 60 * 60); // Degrees per second

function updateRotation() {
    const skybox = document.getElementById('earth-skybox');
    const currentRotation = skybox.object3D.rotation; // Get the rotation object
    const yRotation = THREE.Math.radToDeg(currentRotation.y); // Convert to degrees
    const newRotation = (yRotation + rotationSpeed * (1/60)) % 360;
    skybox.setAttribute('rotation', `0 ${newRotation} 0`);
    requestAnimationFrame(updateRotation);
}

updateRotation();
