import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/Addons.js";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader";
import { GroundedSkybox } from "three/examples/jsm/objects/GroundedSkybox";

import Robot from "./models/loadModel";
import { AnimateHand } from "./components/animate";
import { positions } from "./utils/utils";

import { createBox, createPallete, createConveyer } from "./models/create";

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
  const intensity = 6;
  const light = new THREE.DirectionalLight(color, intensity);
  light.position.set(1, 2, 4);
  light.castShadow = true;
  light.shadow.mapSize.width = 4086; // Increase shadow quality
  light.shadow.mapSize.height = 4086;
  light.shadow.camera.near = 0.5;
  light.shadow.camera.far = 50;
  light.shadow.camera.left = -50;
  light.shadow.camera.right = 50;
  light.shadow.camera.top = 50;
  light.shadow.camera.bottom = -50;
  scene.add(light);
}

{
  const color = 0xffffff;
  const intensity = 3;
  const light = new THREE.PointLight(color, intensity);
  light.position.set(0, 10, 0);
  // light.castShadow = true;
  scene.add(light);
}

const robot = new Robot();
scene.add(robot.loadModel());
let modelLoaded = false;

const box = createBox(1, 1, 2, new THREE.Vector3(-6, 2.5, 0));
scene.add(box);

const pallet = createPallete(5, 0.5, 5, new THREE.Vector3(4, 0.25, 4));
scene.add(pallet);

const conveyer = createConveyer(2, 6, 2, new THREE.Vector2(-6, -1));
scene.add(conveyer);

function animateRobot() {
  const startPoint = new THREE.Vector3(-5.55, 2.9, 0.5);

  const animateHand = new AnimateHand(robot, scene);
  animateHand.start(startPoint, box);
}

// function updateRobot() {
//   const { baseAngle, shoulderAngle, elbowAngle } = calculateAngles(
//     robot,
//     box.position.clone()
//   );

//   const animateHand = new AnimateHand(robot);
//   animateHand.start(
//     baseAngle + THREE.MathUtils.degToRad(3),
//     shoulderAngle - THREE.MathUtils.degToRad(5),
//     elbowAngle - Math.PI + THREE.MathUtils.degToRad(6)
//   );
//   setTimeout(() => {
//     robot.endPointer.add(box);
//     box.position.set(0, 0, 0);
//     box.rotation.x = Math.PI / 2;
//     box.rotation.y = Math.PI / 2;

//     const { baseAngle, shoulderAngle, elbowAngle } = calculateAngles(
//       robot,
//       pallet.position
//         .clone()
//         .add(new THREE.Vector3(-4 + 1.5, 0.25 + 0.5, -4 + 6))
//     );

//     animateHand.start(
//       baseAngle + THREE.MathUtils.degToRad(8),
//       shoulderAngle - THREE.MathUtils.degToRad(0),
//       elbowAngle - Math.PI - THREE.MathUtils.degToRad(12)
//     );

//     setTimeout(() => {
//       robot.endPointer.remove(box);
//       box.position.set(0, 0, 0);
//       box.position.copy(
//         pallet.position
//           .clone()
//           .add(new THREE.Vector3(-4 + 1.5, 0.25 + 0.5, -4 + 6))
//       );
//       box.rotation.set(0, 0, 0);
//       scene.add(box);

//       const { baseAngle, shoulderAngle, elbowAngle } = calculateAngles(
//         robot,
//         pallet.position.clone().add(new THREE.Vector3(-4 + 1.5, 5, -4 + 6))
//       );

//       animateHand.start(
//         baseAngle + THREE.MathUtils.degToRad(8),
//         shoulderAngle - THREE.MathUtils.degToRad(0),
//         elbowAngle - Math.PI - THREE.MathUtils.degToRad(12)
//       );
//     }, 1000);

//     console.log(box);
//   }, 1000);
// }

const params = {
  height: 15,
  radius: 50,
};

const hdrLoader = new RGBELoader();
hdrLoader.load("/industry.hdr", (texture) => {
  texture.mapping = THREE.EquirectangularReflectionMapping;

  const skybox = new GroundedSkybox(texture, params.height, params.radius);
  skybox.position.y = params.height - 0.01;
  scene.add(skybox);

  scene.environment = texture;
});

renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

// Add a shadow mesh to the scene
const shadowMesh = new THREE.Mesh(
  new THREE.PlaneGeometry(100, 100),
  new THREE.ShadowMaterial({ opacity: 0.5 })
);
shadowMesh.rotation.x = -Math.PI / 2;
shadowMesh.position.y = -0.01; // Adjusted to align with the ground level
shadowMesh.receiveShadow = true;
scene.add(shadowMesh);

function animate() {
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
  if (robot.J6 && !modelLoaded) {
    modelLoaded = true;
    // updateRobot();
    animateRobot();
  }

  // if (robot.J5) {
  //   // Rotate J5 for demonstration purposes
  //   robot.J5.rotation.y += 0.01;
  // }
}
animate();
