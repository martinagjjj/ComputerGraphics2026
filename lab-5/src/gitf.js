import *  as THREE from 'three'

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';


//na kolokvium da se napisha osnovnite rabote
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xcccccc);

const camera = new THREE.PerspectiveCamera(
  55, 
  window.innerWidth / window.innerHeight, 
  0.1, 
  100
);
camera.position.set(3,2,5)

const renderer = new THREE.WebGLRenderer({antialias: true});  //antialias: true to make the edges of the objects smoother
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Ambient light - illuminates the entire scene
const ambientLight = new THREE.AmbientLight(0xffffff, 1.5);
scene.add(ambientLight);

// Directional light - simulates sunlight
const directionalLight = new THREE.DirectionalLight(0xffffff, 3);
directionalLight.position.set(5, 8, 4);
scene.add(directionalLight);

const loader = new GLTFLoader();


loader.load('/model.glb', (gltf) => {
    gltf.scene.rotation.y = Math.PI 
    scene.add(gltf.scene);

    let meshCount = 0;
    let totalVertices =0;
    let totalFaces = 0;

    gltf.scene.traverse((child) => {
        if(child.isMesh)
        {
            meshCount++

            const geometry = child.geometry
            const position = geometry.getAttribute('position')
            const index = geometry.index

            const vertices = position.count
            const faces = index.count /3

            totalVertices += vertices
            totalFaces += faces

            console.log ('Mesh', child.name)
            console.log ('Vertices', vertices)
            console.log ('Faces', faces)

        }
    })
    console.log('Total Mesh', meshCount)
    console.log('Total Vertices', totalVertices)
    console.log('Total Faces', totalFaces)
})

const control = new OrbitControls(camera, renderer.domElement)
function animate()
{
    requestAnimationFrame(animate)
    control.update()
    renderer.render(scene, camera)
}
animate()