import { MathUtils } from "three";

class AnimateHand {
  constructor(robot) {
    this.J1 = robot.J1;
    this.J3 = robot.J3;
    this.J2 = robot.J2;
    this.J4 = robot.J4;
    this.J5 = robot.J5;
    this.J6 = robot.J6;
  }

  start(baseAngle, lowerArmAngle, upperArmAngle) {
    const duration = 1;
    const startTime = performance.now();
    const J4Angle = -(lowerArmAngle + upperArmAngle) + Math.PI / 2;
    const J5Angle = Math.PI;
    const initialAngles = [
      this.J1.rotation.y,
      this.J2.rotation.x,
      this.J3.rotation.x,
      this.J4.rotation.x,
      this.J5.rotation.z,
      this.J6.rotation.z,
    ];
    const deltaAngles = [
      baseAngle - initialAngles[0],
      lowerArmAngle - initialAngles[1],
      upperArmAngle - initialAngles[2],
      J4Angle - initialAngles[3],
      J5Angle - initialAngles[4],
    ];
    const animate = (time) => {
      const elapsed = time - startTime;
      const t = Math.min(elapsed / (duration * 1000), 1);

      this.J1.rotation.y = initialAngles[0] + deltaAngles[0] * t;
      this.J2.rotation.x = initialAngles[1] + deltaAngles[1] * t;
      this.J3.rotation.x = initialAngles[2] + deltaAngles[2] * t;
      this.J4.rotation.x = initialAngles[3] + deltaAngles[3] * t;
      this.J5.rotation.y = initialAngles[4] + deltaAngles[4] * t;

      if (t < 1) {
        requestAnimationFrame(animate);
      } else {
        this.J1.rotation.y = baseAngle;
        this.J2.rotation.x = lowerArmAngle;
        this.J3.rotation.x = upperArmAngle;
        this.J4.rotation.x = J4Angle;
        this.J5.rotation.y = J5Angle;
      }
    };
    requestAnimationFrame(animate);
  }
}

export { AnimateHand };
