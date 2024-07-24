import * as THREE from './three.module.min.js'; // Ensure this file is in /static/js/
import { GLTFLoader } from './GLTFLoader.js';    // Ensure this file is in /static/js/

// Initialize scene, camera, and renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Add a simple light
const light = new THREE.AmbientLight(0xffffff);
scene.add(light);

// Load the GLTF model
const loader = new GLTFLoader();
loader.load('/static/models/model.gltf', function (gltf) {
    scene.add(gltf.scene);
    gltf.scene.position.set(0, 0, -5); // Adjust as needed
}, undefined, function (error) {
    console.error('Error loading GLTF model:', error);
});

// Animation loop
function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}
animate();

// Update model position based on ear coordinates
function updateModelPosition(x, y) {
    const xPos = (x / window.innerWidth) * 2 - 1; // Normalize to -1 to 1
    const yPos = - (y / window.innerHeight) * 2 + 1; // Normalize to -1 to 1
    if (scene.children.length > 0) {
        scene.children[0].position.set(xPos, yPos, -5); // Adjust Z position as needed
    }
}
// Get the video element
const video = document.getElementById('video');

// Access the webcam
navigator.mediaDevices.getUserMedia({ video: true })
    .then(stream => {
        video.srcObject = stream;
        video.play();
    })
    .catch(error => {
        console.error('Error accessing webcam:', error);
    });

// Fetch ear coordinates from Flask
function fetchEarCoordinates() {
    fetch('/ear_coordinates')
        .then(response => response.json())
        .then(data => {
            if (data && data.left_ear) {
                updateModelPosition(data.left_ear[0], data.left_ear[1]); // Example for left ear
                // Handle right ear if needed
            } else {
                console.error('No ear coordinates data received');
            }
        })
        .catch(error => console.error('Error fetching ear coordinates:', error));
}

// Periodically fetch coordinates
setInterval(fetchEarCoordinates, 100); // Fetch every 100ms
