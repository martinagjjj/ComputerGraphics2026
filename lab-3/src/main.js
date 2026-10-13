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

//point light vs ambient light
//point light is a light that comes from a specific point in space, and it has a direction, so it will cast shadows and create highlights on the objects in the scene
//ambient light is a light that comes from all directions, and it will illuminate the objects in the scene evenly, without creating shadows or highlights
const pointLight = new THREE.PointLight(0xffffff, 400, 0, 1.6);
const ambientLight = new THREE.AmbientLight(0xffffff, 0.15);
scene.add(pointLight, ambientLight);

//create sum, where we will use spher geometry to create a sphere, and then we will use a material to give it color and texture
const geometry = new THREE.SphereGeometry(2, 32, 24);
const material = new THREE.MeshStandardMaterial({ color: 0x75c518, emissive: 0xE8531c, emissiveIntensity: 6 });
const sun = new THREE.Mesh(geometry, material);
scene.add(sun);

//add lorbit and add it as the child of the sun
//new THREE.Object3D()
const earthOrbit = new THREE.Object3D();
sun.add(earthOrbit); //add it as a child of the sun, so when the sun moves, the earth will move with it
// earthOrbit.add ( new THREE.AxesHelper(5) ); //add axes helper to the earthOrbit, so we can see the rotation of the earth around the sun
//the eart position is on axis x, so it will be on the right side of the sun, and it will rotate around the sun

//place the earth smaller, as child of eartOrbit
const earth = new THREE.Mesh(
  new THREE.SphereGeometry(0.8, 32, 24),
  new THREE.MeshStandardMaterial({ color: 0x1E40FF, roughness: 0.9 })
);
earth.position.x = 6
earthOrbit.add(earth);  

// earth.add ( new THREE.AxesHelper(5) );

const moonOrbit = new THREE.Object3D();
earth.add(moonOrbit); //add it as a child of the earth, so when the earth moves, the moon will move with it
// moonOrbit.add ( new THREE.AxesHelper(5) ); //add axes helper to the moonOrbit, so we can see the rotation of the moon around the earth

const moon = new THREE.Mesh(
  new THREE.SphereGeometry(0.25, 32, 24),
  new THREE.MeshStandardMaterial({ color: 0x888888, roughness: 0.9 })
);
moon.position.x = 1.8
moonOrbit.add(moon);


//TODO: add a second planet and its own moon
// ex. Mars and Fobos
const marsOrbit = new THREE.Object3D();
sun.add(marsOrbit);

const mars = new THREE.Mesh(
  new THREE.SphereGeometry(0.5, 32, 24),
  new THREE.MeshStandardMaterial({ color: 0xFF4500, roughness: 0.9 })
);
mars.position.x = 10
marsOrbit.add(mars);

const phobosOrbit = new THREE.Object3D();
mars.add(phobosOrbit);

const phobos = new THREE.Mesh(
  new THREE.SphereGeometry(0.15, 32, 24),
  new THREE.MeshStandardMaterial({ color: 0x888888, roughness: 0.9 })
);
phobos.position.x = 1.2
phobosOrbit.add(phobos);

//add stars to the scene, so we can see the stars in the background
const starGeometry = new THREE.BufferGeometry();
const starMaterial = new THREE.PointsMaterial({ color: 0xffffff });
const starVertices = [];
for (let i = 0; i < 10000; i++) {
  const x = (Math.random() - 0.5) * 2000;
  const y = (Math.random() - 0.5) * 2000;
  const z = (Math.random() - 0.5) * 2000;
  starVertices.push(x, y, z);
}
starGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starVertices, 3));
const stars = new THREE.Points(starGeometry, starMaterial);
scene.add(stars);



function animate(){
  requestAnimationFrame(animate);
  control.update();  //when i call this function animate, the camera will be updated with the mouse movement
  //so it seams like the object is moving, but in reality the camera is moving around the object
  earthOrbit.rotation.y += 0.01; //rotate the earth around the sun
  
  moonOrbit.rotation.y += 0.04; //rotate the moon around the earth
  earth.rotation.y += 0.05; //rotate the earth around its own axis
  sun.rotation.y += 0.003; //rotate the sun around its own axis

  marsOrbit.rotation.y += 0.008; //rotate the mars around the sun
  mars.rotation.y += 0.05; //rotate the mars around its own axis
  phobosOrbit.rotation.y += 0.05; //rotate the phobos around the mars
  phobos.rotation.y += 0.05; //rotate the phobos around its own axis

  renderer.render(scene, camera); //in order to see the scene, we need to render it with the camera
}
animate();

//resize
addEventListener('resize', () => {
  camera.aspect = innerWidth / innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(innerWidth, innerHeight);
});