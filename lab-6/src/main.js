import * as THREE from 'three';
import { PLYLoader } from 'three/examples/jsm/Addons.js';


const scene = new THREE.Scene();
scene.background = new THREE.Color(0xFFFFFF);

const perspective = new THREE.PerspectiveCamera(
  75, //agol, obicno se postavuva od 75 do 90 stepeni
  window.innerWidth / window.innerHeight,   //aspect ratio, delot kade se crta, ne mora da e na window, tuku
  0.1,  //ako e 0 moze da se pojavuva i gubi objektot, samo da ne e 0, neshhto pogolemo od 0
  100   //od kade do kade moze da gleda kamerata, i ako koci moze da e do ova zohto se trudi da gledamo mnogu daleku, i sistemot se maci
);
perspective.position.set(0,2,15)
perspective.lookAt (0,0,0)
scene.add (perspective)

//otfographic camera
const aspect = window.innerWidth / window.innerHeight
const size = 16
const ortographic = new THREE.OrthographicCamera (
  size * aspect, //right
  -size * aspect,  //left
  size,
  -size, 
  0.1, 
  100
)
ortographic.position.set(0,2,15)
ortographic.lookAt (0,0,0)

const renderer = new THREE.WebGLRenderer({antialias: true});  //antialias: true to make the edges of the objects smoother
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);  

const ambientLight = new THREE.AmbientLight(0xffffff, 0.35);
const directionalLight = new THREE.DirectionalLight (0xffffff, 2.5)
scene.add (ambientLight, directionalLight)

//here add an array of depths
const depths = [0, -2, -4];

//here add an array of colors
const colors = [0xff0000, 0x00ff00, 0x0000ff];

const positions = [-10, 0, 10];
new PLYLoader().load('/models/Fused.ply', (geo) => {
  //todo: add 2 more models with different colors and depths and show all 3 objects different cameras
  geo.center()
  //for each loops, and on the color part you will go and get colors from the colors array,
 colors.forEach((color, index) => {
    const mesh = new THREE.Mesh(
      geo,
      new THREE.MeshStandardMaterial({
        color: color,
        roughness: 0.5
      })
    );

    mesh.scale.setScalar(0.02);
    mesh.rotation.x = Math.PI;

    mesh.position.x = positions[index];
    mesh.position.z = depths[index];

    scene.add(mesh);
  })
})

const cameras = [perspective, ortographic]
let current = 0
console.log ('Active: Perspective')

addEventListener ('keydown', (e) => 
{
  if(e.code == 'Space')
  {
    e.preventDefault()
    current = current+1
    
    if (current >= cameras.length)
    {
      current=0
    }

    console.log ('Active: ', current == 0 ? ' PerspectiveCamera' : 'OrthographicCamera' )
  }

})

function animate()
{
  requestAnimationFrame(animate)
  renderer.render (scene, cameras[current])
}
animate()


