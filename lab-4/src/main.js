import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';


//lab robotic arm

const scene = new THREE.Scene();
scene.background = new THREE.Color(0xFFFFFF);

const camera = new THREE.PerspectiveCamera(
  75, //agol, obicno se postavuva od 75 do 90 stepeni
  window.innerWidth / window.innerHeight,   //aspect ratio, delot kade se crta, ne mora da e na window, tuku
  0.1,  //ako e 0 moze da se pojavuva i gubi objektot, samo da ne e 0, neshhto pogolemo od 0
  1000   //od kade do kade moze da gleda kamerata, i ako koci moze da e do ova zohto se trudi da gledamo mnogu daleku, i sistemot se maci
);
camera.position.set(8,6,12)

const renderer = new THREE.WebGLRenderer({antialias: true});  //antialias: true to make the edges of the objects smoother
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);


const ground = new THREE.Mesh(
  new THREE.PlaneGeometry(20, 20),
  new THREE.MeshStandardMaterial({ color: 0xcccccc , side: THREE.DoubleSide }) //side: THREE.DoubleSide to make the ground visible from both sides
);
const grid = new THREE.GridHelper(20, 20);
ground.rotation.x = -Math.PI / 2;
scene.add(ground, grid);

const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
const directionalLight = new THREE.DirectionalLight(0xffffff, 2);
scene.add(ambientLight, directionalLight);

const baseGeometry = new THREE.CylinderGeometry(1.2, 1.2, 0.5, 32);
const baseMaterial = new THREE.MeshStandardMaterial({ color: 0x555555 });
const base = new THREE.Mesh(baseGeometry, baseMaterial);
scene.add(base);

const shoulder = new THREE.Group();
shoulder.position.y = 0.5;
base.add(shoulder);

const shoulderJoint = new THREE.Mesh( 
  new THREE.SphereGeometry(0.5, 32, 32),
  baseMaterial
);
shoulder.add(shoulderJoint);


const armMaterial = new THREE.MeshStandardMaterial({ color: 0x3399ff });
const upperArm = new THREE.Mesh(
  new THREE.BoxGeometry(0.7, 3, 0.7),
  armMaterial
);
upperArm.position.y = 1.2; //position the upper arm above the shoulder joint
shoulder.add(upperArm);

//elbow group
const elbow = new THREE.Group();
elbow.position.y = 2.6;
shoulder.add(elbow);

const elbowJoint = new THREE.Mesh(
  new THREE.SphereGeometry(0.45, 32, 32),
  baseMaterial
);
elbow.add(elbowJoint);

const forearm = new THREE.Mesh(
  new THREE.BoxGeometry(0.6, 3, 0.6),
  armMaterial
);
forearm.position.y = 1.25; //position the forearm above the elbow joint
elbow.add(forearm);


const wrist = new THREE.Group();
wrist.position.y = 2.8;
elbow.add(wrist);

const wristJoint = new THREE.Mesh(
  new THREE.SphereGeometry(0.3, 32, 32),
  baseMaterial
);
wrist.add(wristJoint);

const palm = new THREE.Mesh(
  new THREE.BoxGeometry(1.8, 1.5, 1.5),
  new THREE.MeshStandardMaterial({ color: 0xffaa55 })
);
palm.position.y = 1; //position the palm above the wrist joint
wrist.add(palm);


shoulder.rotation.z= THREE.MathUtils.degToRad (-20)
elbow.rotation.z= THREE.MathUtils.degToRad (40)
wrist.rotation.z= THREE.MathUtils.degToRad (-20)




const fingers = []
const fingerGeo = new THREE.BoxGeometry(0.2, 1, 0.2)
const fingerMaterial = new THREE.MeshStandardMaterial({ color: 0xffcc88 })

for (let i = 0; i < 5; i++) {
  const finger = new THREE.Mesh(fingerGeo, fingerMaterial)

  finger.position.x = (i - 2) * 0.35
  finger.position.y = 2.25
  finger.position.z = 0

  wrist.add(finger)
  fingers.push(finger)
}


const rotationSteps = THREE.MathUtils.degToRad(5)
window.addEventListener ('keydown', function(event){
  const key = event.key.toLowerCase()
  if (key == 'q')
      shoulder.rotation.z += rotationSteps

  if (key == 'a')
    shoulder.rotation.z -= rotationSteps

  if (key == 'w')
      elbow.rotation.z += rotationSteps

  if (key == 's')
      elbow.rotation.z -= rotationSteps

  if (key == 'e')
      wrist.rotation.z += rotationSteps

  if (key == 'd')
      wrist.rotation.z -= rotationSteps
})




const orbitControl = new OrbitControls(camera, renderer.domElement); //to be able to move the camera with the mouse
orbitControl.enableDamping = true; //to make the camera movement smoother
function animate () {
  requestAnimationFrame(animate);
  orbitControl.update();
  renderer.render(scene, camera);
}
animate();


