import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import GUI from 'lil-gui';

// Scene
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xcccccc);

// Camera
const camera = new THREE.PerspectiveCamera(
  55,
  window.innerWidth / window.innerHeight,
  0.1,
  100
);
camera.position.set(3, 2, 5);

// Renderer
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// OrbitControls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

// Floor grid
const grid = new THREE.GridHelper(10, 10);
scene.add(grid);

// Lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 2);
scene.add(ambientLight);

// Pickable objects
const pickables = [];
const geometry = new THREE.BoxGeometry(1, 1, 1);

function createCube(color, x) {
  const material = new THREE.MeshStandardMaterial({ color });
  const cube = new THREE.Mesh(geometry, material);

  cube.position.set(x, 0.5, 0);
  scene.add(cube);
  pickables.push(cube);

  return cube;
}

createCube(0xff0000, -2);
createCube(0x00ff00, 0);
createCube(0x0000ff, 2);

// Save original positions
const originalPositions = pickables.map(
  cube => cube.position.clone()
);

// Pointer coordinates (NDC)
const pointer = new THREE.Vector2();

function updatePointer(event) {
  const rect = renderer.domElement.getBoundingClientRect();

  pointer.x =
    ((event.clientX - rect.left) / rect.width) * 2 - 1;

  pointer.y =
    -((event.clientY - rect.top) / rect.height) * 2 + 1;

  return pointer;
}

// Raycaster
const raycaster = new THREE.Raycaster();

// Dragging plane
const dragPlane = new THREE.Plane(
  new THREE.Vector3(0, 1, 0),
  0
);

const intersection = new THREE.Vector3();
const dragOffset = new THREE.Vector3();

let selected = null;
let hovered = null;
let isDragging = false;

// GUI settings
const settings = {
  hoverHighlight: true,

  resetPositions: () => {
    stopDragging();

    pickables.forEach((cube, index) => {
      cube.position.copy(originalPositions[index]);
    });

    selected = null;
    hovered = null;
    updateHighlights();
  }
};

// GUI panel
const gui = new GUI();
gui.add(settings, 'hoverHighlight')
  .name('Hover Highlight')
  .onChange(updateHighlights);

gui.add(settings, 'resetPositions')
  .name('Reset Positions');

// Update object highlights
function updateHighlights() {
  pickables.forEach(cube => {
    if (cube === selected) {
      cube.material.emissive.set(0xffff00);
    } else if (
      cube === hovered &&
      settings.hoverHighlight &&
      !isDragging
    ) {
      cube.material.emissive.set(0x444444);
    } else {
      cube.material.emissive.set(0x000000);
    }
  });
}

// Pointer down - select and start dragging
renderer.domElement.addEventListener('pointerdown', (event) => {
  if (event.button !== 0) return;

  updatePointer(event);
  raycaster.setFromCamera(pointer, camera);

  const intersects = raycaster.intersectObjects(pickables);

  if (intersects.length > 0) {
    selected = intersects[0].object;
    hovered = selected;

    console.log('Clicked:', selected);

    // Calculate drag offset
    if (raycaster.ray.intersectPlane(dragPlane, intersection)) {
      dragOffset.set(
        selected.position.x - intersection.x,
        0,
        selected.position.z - intersection.z
      );

      isDragging = true;
      controls.enabled = false;

      renderer.domElement.setPointerCapture(event.pointerId);
    }
  } else {
    selected = null;
    hovered = null;
  }

  updateHighlights();
});

// Pointer move - drag or hover
renderer.domElement.addEventListener('pointermove', (event) => {
  updatePointer(event);
  raycaster.setFromCamera(pointer, camera);

  // Dragging
  if (isDragging && selected) {
    if (raycaster.ray.intersectPlane(dragPlane, intersection)) {
      selected.position.x = intersection.x + dragOffset.x;
      selected.position.z = intersection.z + dragOffset.z;
    }
    return;
  }

  // Hover detection
  const intersects = raycaster.intersectObjects(pickables);

  hovered = intersects.length > 0
    ? intersects[0].object
    : null;

  updateHighlights();
});

// Stop dragging
function stopDragging() {
  isDragging = false;
  controls.enabled = true;
  updateHighlights();
}

window.addEventListener('pointerup', stopDragging);
renderer.domElement.addEventListener('pointercancel', stopDragging);

// Remove hover when leaving canvas
renderer.domElement.addEventListener('pointerleave', () => {
  if (!isDragging) {
    hovered = null;
    updateHighlights();
  }
});

// Window resizing
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);
});

// Animation loop
function animate() {
  requestAnimationFrame(animate);

  controls.update();
  renderer.render(scene, camera);
}

animate();
