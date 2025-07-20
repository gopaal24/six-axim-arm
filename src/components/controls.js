import GUI from "three/examples/jsm/libs/lil-gui.module.min.js";

export function setupControls(robot) {
  const gui = new GUI();

  const params = {
    baseY: 0,
    upperArmX: 0,
    lowerArmY: 0,
  };

  // Base rotation around Y-axis
  gui.add(params, "baseY", -Math.PI, Math.PI).onChange((value) => {
    if (robot.base) robot.base.rotation.y = value;
  });

  // Upper arm rotation around X-axis
  gui.add(params, "upperArmX", -Math.PI, Math.PI).onChange((value) => {
    if (robot.upper_arm) robot.upper_arm.rotation.x = value;
  });

  // Lower arm rotation around Y-axis
  gui.add(params, "lowerArmY", -Math.PI, Math.PI).onChange((value) => {
    if (robot.lower_arm) robot.lower_arm.rotation.x = value;
  });
}
