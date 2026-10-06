import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { roughness } from 'three/tsl';


const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
  75, 
  window.innerWidth / window.innerHeight, 
  0.1, 
  1000
);
camera.position.set(6,5,8)

const renderer = new THREE.WebGLRenderer();
renderer.setSize(innerWidth, innerHeight);
document.body.appendChild(renderer.domElement);

const control = new OrbitControls(camera, renderer.domElement); //to be able to move the camera with the mouse

const pointLight = new THREE.PointLight(0xffffff, 400, 0, 1.6);
const ambientLight = new THREE.AmbientLight(0xffffff, 0.15);
scene.add(pointLight, ambientLight);

//create sum, where we will use spher geometry to create a sphere, and then we will use a material to give it color and texture
const geometry = new THREE.SphereGeometry(2, 32, 24);
const material = new THREE.MeshStandardMaterial({ color: 0xFF0000 });
const sun = new THREE.Mesh(geometry, material);
scene.add(sun);

//add lorbit and add it as the child of the sun
//new THREE.Object3D()
const earthOrbit = new THREE.Object3D();
sun.add(earthOrbit); //add it as a child of the sun, so when the sun moves, the earth will move with it

//place the earth smaller, as child of eartOrbit
const earth = new THREE.Mesh(
  new THREE.SphereGeometry(0.8, 32, 24),
  new THREE.MeshStandardMaterial({ color: 0x1E40FF, roughness: 0.9 })
);
earth.position.x = 6
earthOrbit.add(earth);  


function animate(){
  requestAnimationFrame(animate);
  control.update();  //when i call this function animate, the camera will be updated with the mouse movement
  //so it seams like the object is moving, but in reality the camera is moving around the object
  earthOrbit.rotation.y += 0.01; //rotate the earth around the sun
  renderer.render(scene, camera); //in order to see the scene, we need to render it with the camera
}
animate();