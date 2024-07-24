import * as THREE from "three";
// Initialize Three.js
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Load the GLTF model
const loader = new THREE.GLTFLoader();
let model = null;
loader.load('/static/models/model.glb', function (gltf) {
    model = gltf.scene;
    scene.add(model);
    model.visible = false;  // Hide the model initially
}, undefined, function (error) {
    console.error(error);
});

// Function to update model position
function updateModelPosition(earCoordinates) {
    if (model) {
        // Convert screen coordinates to world coordinates
        // This is a simplified example and might need adjustment
        const scale = 0.01;  // Adjust this based on model size
        model.position.set(earCoordinates.x * scale - window.innerWidth / 2, -earCoordinates.y * scale + window.innerHeight / 2, 0);
        model.visible = true;
    }
}

// Animation loop
camera.position.z = 5;
function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}
animate();

// Fetch ear coordinates from Flask
async function fetchEarCoordinates() {
    const response = await fetch('/ear_coordinates');
    const data = await response.json();
    if (data.left_ear) {
        updateModelPosition(data.left_ear);
    }
    if (data.right_ear) {
        updateModelPosition(data.right_ear);
    }
}

// Poll for ear coordinates
setInterval(fetchEarCoordinates, 1000);  // Adjust the interval as needed
