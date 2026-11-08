
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

// Scene
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x000000);

// TODO 1 - Camera
const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);
camera.position.set(0, 1, 5);

// TODO 2 - Renderer
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// TODO 3 - Cube
const cubeGeometry = new THREE.BoxGeometry(1.5, 1.5, 1.5);
const cubeMaterial = new THREE.MeshStandardMaterial({
    color: 0xE8431C
});

const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
cube.position.set(-1.5, 0, 0);
scene.add(cube);

// Additional Object - Pink Wireframe Sphere
const sphereGeometry = new THREE.SphereGeometry(1, 30, 30);
const sphereMaterial = new THREE.MeshBasicMaterial({
    color: 0xFF69B4,
    wireframe: true
});

const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
sphere.position.set(1.5, 0, 0);
scene.add(sphere);

// TODO 4 - Lights
const ambientLight = new THREE.AmbientLight(0xffffff, 1);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 2);
directionalLight.position.set(5, 5, 5);
scene.add(directionalLight);

// TODO 6 - OrbitControls
const control = new OrbitControls(camera, renderer.domElement);

// Timer
const timer = new THREE.Timer();

// TODO 5 - Animation Loop
function animate() {
    requestAnimationFrame(animate);

    timer.update();
    const dt = timer.getDelta();

    // Rotate cube
    cube.rotation.x += dt * 0.5;
    cube.rotation.y += dt * 0.5;

    // Rotate sphere
    sphere.rotation.x += dt * 0.5;
    sphere.rotation.y += dt * 0.5;

    control.update();
    renderer.render(scene, camera);
}

animate();

// Window Resize
window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});
