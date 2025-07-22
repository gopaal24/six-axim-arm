import { GLTFLoader } from "three/examples/jsm/Addons.js";
import { Group, MeshPhysicalMaterial } from "three";

export default class Robot {
  // constructor() {
  //   this.loadModel();
  // }

  loadModel() {
    const greyMaterial = new MeshPhysicalMaterial({
      color: "grey", // Red plastic
      roughness: 0.4, // Adjust for desired shininess
      transmission: 0.5, // Make it slightly transparent
      opacity: 1, // Important when using transmission
      ior: 1.6, // Index of refraction, affects how light bends
      thickness: 0.5, // Thickness of the plastic, affects transparency
      specularIntensity: 0.4, // Adjust specular highlights
      specularColor: 0xffffff, // Color of specular highlights
    });
    const loader = new GLTFLoader();
    const robot = new Group();
    loader.load("./endpointerArm.glb", (gltf) => {
      const model = gltf.scene;
      model.traverse((obj) => {
        if (obj.isMesh) {
          const name = obj.name;
          this[name] = obj;
          obj.rotation.order = "XYZ";
          obj.material = greyMaterial;
          obj.material.needsUpdate;
          obj.castShadow = true;
          obj.receiveShadow = true;
          // obj.add(new AxesHelper(200));
        }
      });
      robot.rotation.y = Math.PI;
      robot.add(model);
      robot.traverse((child) => {
        if (child.isMesh) {
          child.castShadow = true;
          child.receiveShadow = true;
        }
      });
      console.log(robot);
    });
    // robot.position.y += Math.random() * 8;
    return robot;
  }
}
