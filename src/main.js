//point -- location in space
//vector -- direction, movement

//length is the square root of the sum of the squares of the components
//this is equal to a.length() = sqrt(a.x^2 + a.y^2 + a.z^2)

//normalization is the process of making a vector have a length of 1, we do this by dividing each component by the length of the vector
// this is equal to a.normalize() = a / a.length()


//the dot product of two vectors is a scalar value that represents the cosine of the angle between them, multiplied by the lengths of the vectors
//this is equal to a.dot(b) = a.x * b.x + a.y * b.y + a.z * b.z
//or cos(theta) = a.dot(b) / (a.length() * b.length())
//so it takes two vectors and returns a number that represents how much they are pointing in the same direction


//projection is the process of finding the component of one vector in the direction of another vector
//how far does vector a extend along vector b? we can find this by taking the dot product of a and b, and dividing by the length of b
//this is equal to a.project(b) = (a.dot(b) / b.length()) * b.normalize()


//parametric form
//this is a way of representing a line in space using a point and a direction vector
//the line can be represented as p(t) = p0 + t * d, where p0 is a point on the line, d is the direction vector, and t is a scalar parameter that varies along the line

//Task 1
//add scene, camera, and renderer to the code
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/Addons.js';
import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min.js';

//Add a scene
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x000000); //set the background color of the scene to black

//Add a camera
const camera = new THREE.PerspectiveCamera(
  75, 
  window.innerWidth / window.innerHeight, 
  0.1, 
  1000);

camera.position.set(4, 4, 6);
camera.lookAt(0, 0, 0);


//Add a renderer
const renderer = new THREE.WebGLRenderer({antialias: true}); //antialias makes the edges of objects look smoother, the edge of the object is not jagged, but smooth
renderer.setSize(innerWidth,innerHeight); //difference between innerWidth and window.innerWidth is that innerWidth is the width of the window excluding the scrollbar, while window.innerWidth is the width of the window including the scrollbar
document.body.appendChild(renderer.domElement);


//orbit controls
const controls = new OrbitControls(camera, renderer.domElement); //allows the user to control the camera with the mouse, and to zoom in and out with the mouse wheel
  //add axes helper for visual representation of the coordinate system
scene.add(new THREE.AxesHelper(4)); //adds a visual representation of the coordinate system to the scene, the axes are colored red, green, and blue for the x, y, and z axes respectively


//create a vector at the origin, and two other vectors
const origin = new THREE.Vector3(0, 0, 0); //create a vector at the origin
const a = new THREE.Vector3(2, 1, 0); //create a vector at (2, 1, 0)
const b = new THREE.Vector3(0, 2, 0); //create a vector at (0, 2, 0)

//create an arrow helper for each vector, the arrow helper is a visual representation of the vector, it is an arrow that points in the direction of the vector, and its length is equal to the length of the vector
// arrow helper takes 5 parameters: the direction of the arrow, the origin of the arrow, the length of the arrow, the color of the arrow, the length of the head of the arrow, and the width of the head of the arrow
const arrA = new THREE.ArrowHelper(a.clone().normalize(), origin, a.length(), 0xE00000, 0.35, 0.2); //create an arrow helper for vector a, the arrow is colored red
const arrB = new THREE.ArrowHelper(b.clone().normalize(), origin, b.length(), 0x00E000, 0.35, 0.2); //create an arrow helper for vector b, the arrow is colored green
//0.35 is the length of the head of the arrow (strelkiceto), 0.2 is the width of the head of the arrow

//to show the vectors in the scene, we need to add them to the scene
scene.add(arrA);
scene.add(arrB);

//compare a + b and display on screen at least the sum as the third arrow 
const sum = new THREE.Vector3().addVectors(a, b); //create a new vector that is the sum of a and b
const dot = a.dot(b); //calculate the dot product of a and b
const arrSum = new THREE.ArrowHelper(sum.clone().normalize(), origin, sum.length(), 0x3ecf8e, 0.35, 0.2); //create an arrow helper for the sum of a and b, the arrow is colored blue
scene.add(arrSum); //add the arrow helper for the sum of a and b to the scene


// console.log("Vector a: ", a);
// console.log("Vector b: ", b);
// console.log("Sum of a and b: ", sum);
// console.log("Dot product of a and b: ", dot);


const gui = new GUI();
const params = {
  aX: a.x, aY: a.y, aZ: a.z,
  bX: b.x, bY: b.y, bZ: b.z,
  sum: '',
  dot: '',
  cross: '',
  crossLength: '',
  angle: ''
}

//the three box geometry is a folder, so for cube we need 3 folders, one for each vector, and we need to add the x, y, and z components of each vector to the corresponding folder
const aFolder = gui.addFolder('Vector A');
aFolder.add(params, 'aX', -5, 5, 0.1).name('X').onChange(value => {a.x = value; updateVectors()});
aFolder.add(params, 'aY', -5, 5, 0.1).name('Y').onChange(value => {a.y = value; updateVectors()});
aFolder.add(params, 'aZ', -5, 5, 0.1).name('Z').onChange(value => {a.z = value; updateVectors()});

//the second folder is for vector b, and we need to add the x, y, and z components of vector b to the corresponding folder
const bFolder = gui.addFolder('Vector B');
bFolder.add(params, 'bX', -5, 5, 0.1).name('X').onChange(value => {b.x = value; updateVectors()});
bFolder.add(params, 'bY', -5, 5, 0.1).name('Y').onChange(value => {b.y = value; updateVectors()});
bFolder.add(params, 'bZ', -5, 5, 0.1).name('Z').onChange(value => {b.z = value; updateVectors()});


const resultFolder = gui.addFolder('Results');
resultFolder.add(params, 'sum').name('a+b').disable(); //whenever we change the values of a or b, we need to update the sum, dot, cross, and angle values, so we need to add a function that updates these values
resultFolder.add(params, 'dot').name('a(dot)b').disable();
resultFolder.add(params, 'cross').name('axb').disable();
resultFolder.add(params, 'crossLength').name('||axb||').disable();
resultFolder.add(params, 'angle').name('degrees').disable();
resultFolder.open(); //open the results folder by default, so that we can see the results without having to click on the folder

function updateVectors() {
  requestAnimationFrame(updateVectors); //this is a loop that calls the update function every frame, and it is called before the next repaint, so it is called at the same rate as the screen refresh rate, which is usually 60 times per second
  controls.update(); //this is necessary for the orbit controls to work, it updates the camera position and orientation based on the user input
  //this is always at the bottom if we dont have a function, but if we have a function, we can put it in the function
  renderer.render(scene, camera); //renders the scene from the perspective of the camera, and displays it on the screen, draws the scene to the screen

  arrA.setDirection(a.clone().normalize()); //update the direction of the arrow helper for vector a, we need to clone the vector because the normalize function modifies the original vector
  arrA.setLength(a.length(), 0.35, 0.2); //update the length of the arrow helper for vector a

  arrB.setDirection(b.clone().normalize()); //update the direction of the arrow helper for vector b
  arrB.setLength(b.length(), 0.35, 0.2); //update the length of the arrow helper for vector b

  sum.addVectors(a, b); //update the sum of a and b
  arrSum.setDirection(sum.clone().normalize());
  arrSum.setLength(sum.length(), 0.35, 0.2); //update the length of the arrow helper for the sum of a and b

  const dot = a.dot(b); //update the dot product of a and b
  const cross = new THREE.Vector3().crossVectors(a, b); //update the cross product of a and b
  const crossLength = cross.length(); //update the length of the cross product of a and b
  const cos = THREE.MathUtils.clamp(dot / (a.length() * b.length()), -1, 1); //update the cosine of the angle between a and b, we need to clamp the value between -1 and 1 because the acos function only accepts values between -1 and 1
  const angle = THREE.MathUtils.radToDeg(Math.acos(cos));


  //update the values of the parameters in the GUI
  params.sum = `(${sum.x}, ${sum.y}, ${sum.z})`; //update the sum of a and b in the GUI
  params.dot = dot; //update the dot product of a and b in the GUI
  params.cross = `(${cross.x}, ${cross.y}, ${cross.z})`;
  params.crossLength = crossLength;
  params.angle = angle;

//update the display of the parameters in the GUI
  resultFolder.controllersRecursive().forEach(controller => controller.updateDisplay()); //update the display of the controllers in the results folder, so that we can see the updated values without having to click on the folder

  renderer.render(scene, camera); //renders the scene from the perspective of the camera, and displays it on the screen, draws the scene to the screen
}

updateVectors(); //this is the function that starts the loop, it is called once to start the loop, and then it calls itself every frame
