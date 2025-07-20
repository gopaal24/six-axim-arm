import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/Addons.js";

import Robot from "./models/loadModel";
import { calculateAngles } from "./utils/utils";
import { AnimateHand } from "./components/animate";

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x333333);
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  100
);
camera.position.set(0, 5, 15);

window.scene = scene;

const grid = new THREE.GridHelper(40, 40);
scene.add(grid);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio || 1);
document.body.appendChild(renderer.domElement);

new OrbitControls(camera, renderer.domElement);

// Light
{
  const color = 0xffffff;
  const intensity = 6;
  const light = new THREE.DirectionalLight(color, intensity);
  light.position.set(-1, 2, 4);
  scene.add(light);
}
{
  const color = 0xffffff;
  const intensity = 6;
  const light = new THREE.DirectionalLight(color, intensity);
  light.position.set(1, -2, -4);
  scene.add(light);
}

{
  const color = 0xffffff;
  const intensity = 3;
  const light = new THREE.PointLight(color, intensity);
  light.position.set(0, 10, 0);
  light.castShadow = true; // set light to cast shadow
  scene.add(light);
}

const robot = new Robot();
scene.add(robot.loadModel());
let modelLoaded = false;

function createBallAtPosition(x, y, z) {
  const geometry = new THREE.SphereGeometry(0.5, 32, 32);
  const material = new THREE.MeshStandardMaterial({ color: 0xff0000 });
  const ball = new THREE.Mesh(geometry, material);
  ball.position.set(x, y, z);
  ball.castShadow = true;
  ball.receiveShadow = true;
  scene.add(ball);
  return ball;
}

const ball = createBallAtPosition(-3, 8, -6);
function updateRobot() {
  const { baseAngle, shoulderAngle, elbowAngle } = calculateAngles(robot, ball);

  const animateHand = new AnimateHand(robot);
  animateHand.start(
    baseAngle + THREE.MathUtils.degToRad(6),
    shoulderAngle + THREE.MathUtils.degToRad(3),
    elbowAngle - Math.PI + THREE.MathUtils.degToRad(5)
  );
}

function animate() {
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
  if (robot.J6 && !modelLoaded) {
    modelLoaded = true;
    updateRobot();
  }
  // if (robot.J5) {
  //   // Rotate J5 for demonstration purposes
  //   robot.J5.rotation.y += 0.01;
  // }
}
animate();
