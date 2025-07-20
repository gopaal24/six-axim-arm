import { GLTFLoader } from "three/examples/jsm/Addons.js";
import { Group, AxesHelper, MeshStandardMaterial, DoubleSide } from "three";

export default class Robot {
  // constructor() {
  //   this.loadModel();
  // }

  loadModel() {
    const greyMaterial = new MeshStandardMaterial({
      color: "grey",
      metalness: 0.4,
      roughness: 0.6,
      side: DoubleSide,
    });
    const loader = new GLTFLoader();
    const robot = new Group();
    loader.load("./roboticArm.glb", (gltf) => {
      const model = gltf.scene;
      model.traverse((obj) => {
        if (obj.isMesh) {
          const name = obj.name;
          this[name] = obj;
          obj.rotation.order = "XYZ";
          obj.material = greyMaterial;
          obj.material.needsUpdate;
          // obj.add(new AxesHelper(200));
        }
      });
      robot.rotation.y = Math.PI;
      robot.add(model);
      console.log(robot);
    });
    return robot;
  }
}
