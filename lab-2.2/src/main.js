import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';


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

//floor (plane)
const n = new THREE.Vector3(0, 1, 0); //normal vector of the plane
const p0 = new THREE.Vector3(0, 0, 0); //point on the plane, random point
const d = n.dot(p0); //distance from the origin to the plane

//for creating 3d objects, we need to create a geometry and a material, then we can create a mesh with the geometry and material, and finally we can add the mesh to the scene
// the mesh mixes the geometry and the material together, so we can see the object in the scene
//and lest we add the object to the scene

const geometry = new THREE.PlaneGeometry(12, 12); //width, height
const material = new THREE.MeshBasicMaterial({ color: 0x2a3140 });

//create floor
const floor = new THREE.Mesh(geometry, material);
floor.rotation.x = -Math.PI / 2; //rotate the floor to be horizontal

floor.updateMatrixWorld(true);
const grid = new THREE.GridHelper(12, 12); //size, divisions, color1, color2
//we make the grid 12,12 becase we want it to be the same size as the floor, so it will be easier to see the floor and the grid together

scene.add(floor, grid);


//implement the ray
//we have to find the origin and the direction of the ray, so we can create a raycaster
const o = new THREE.Vector3(2,5,1); //origin of the ray
const dir = new THREE.Vector3(0.3, -1, 0.1).normalize(); //direction of the ray
//whenever i write .normalize(), it finds the unit vector, only one piece of the vector, so it will be easier to work with, because we can use it to create the raycaste
//find the unit vector of the direction, so we can use it to create the raycaster

//formala
const t = (d - n.dot(o)) / n.dot(dir); //t is the distance from the origin to the intersection point, we can find it by using the formula of the plane and the ray
const hit = o.clone().addScaledVector(dir, t); //hit is the intersection point, we can find it by using the formula of the ray and the distance t
//we clone the o becase we want the original vector, and not the o that we change
//we use scaled vector because we know t is a number, but the others are vectors, so when we calculare numbers with vectors, 
// we need to use scaled vector, so we can multiply the vector by the number t


//ray
//we do part of the ray, so we can see it in the scene, we can use the line geometry to create a line from the origin to the intersection point
scene.add(new THREE.Line(
  new THREE.BufferGeometry().setFromPoints([o, hit]), //we pass the oriigin and the hit
  new THREE.MeshBasicMaterial({color: 0xff4422 })
))
//the dot will be used to visualize better where the ray hits the
const dot = new THREE.Mesh(
  new THREE.SphereGeometry(0.18), //radius, width segments, height segments
  new THREE.MeshBasicMaterial({color: 0xffd700})
)
dot.position.copy(hit) //we copy the position of the hit to the dot, so we can see where the ray hits the plane
scene.add(dot)


//compare the results with the THREE.Raycaster, 
//the raycaster is a class that allows us to create a ray and check for intersections with objects in the scene
const rayCaster = new THREE.Raycaster(o, dir).intersectObject(floor); //we pass the origin and the direction of the ray, and the object we want to check for intersections
//becase the floor intersects with the ray

console.log('Our formula:', hit.toArray().map(x => x.toFixed(3)))
console.log('Raycaster:', rayCaster[0].point.toArray().map(x => x.toFixed(3))) //we focus only on the point


function animate(){
  requestAnimationFrame(animate);
  control.update();  //when i call this function animate, the camera will be updated with the mouse movement
  //so it seams like the object is moving, but in reality the camera is moving around the object
  renderer.render(scene, camera); //in order to see the scene, we need to render it with the camera
}
animate();
