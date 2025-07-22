import { MathUtils, Vector3 } from "three";
import { calculateAngles, positions, boxPositions } from "../utils/utils";
import { createBox } from "../models/create";

class AnimateHand {
  constructor(robot, scene) {
    this.J1 = robot.J1;
    this.J3 = robot.J3;
    this.J2 = robot.J2;
    this.J4 = robot.J4;
    this.J5 = robot.J5;
    this.J6 = robot.J6;

    this.robot = robot;
    this.scene = scene;

    this.box = null;

    this.animPoints = [];
    this.currentAnimIndex = 0;

    this.positions = Object.values(positions).map((pos) => ({
      x: pos.x,
      y: pos.y,
      z: pos.z,
    }));
    this.boxIndex = 0;

    this.boxModel = createBox(1, 1, 2, new Vector3(0, 0, 0));
  }

  start(startPoint, box) {
    this.boxIndex = 0;
    this.box = null;
    this.box = box;
    this.startPoint = startPoint;
    this.iteratePositions();
  }

  iteratePositions() {
    if (this.boxIndex < this.positions.length) {
      const pos = this.positions[this.boxIndex];
      const endPoint = new Vector3(pos.x, pos.y, pos.z);
      this.mainStart(this.startPoint, endPoint);
      this.boxIndex++;
    }
  }

  mainStart(startPoint, endPoint) {
    const midPoint1 = new Vector3(startPoint.x, 5, startPoint.z);
    const midPoint2 = new Vector3(endPoint.x, 5, endPoint.z);

    this.animPoints = [];
    this.currentAnimIndex = 0;

    this.animPoints.push(midPoint1);
    this.animPoints.push(startPoint);
    this.animPoints.push(midPoint1);
    this.animPoints.push(midPoint2);
    this.animPoints.push(endPoint);
    this.animPoints.push(midPoint2);

    this.startAnimation();
  }

  startAnimation() {
    const { baseAngle, shoulderAngle, elbowAngle } = calculateAngles(
      this.robot,
      this.animPoints[this.currentAnimIndex]
    );

    if (this.currentAnimIndex == 2) {
      this.robot.endPointer.add(this.boxModel);
      this.boxModel.rotation.set(Math.PI / 2, Math.PI / 2, 0);
      this.box.visible = false;
    } else if (this.currentAnimIndex == 5) {
      this.scene.add(createBox(1, 1, 2, boxPositions[this.boxIndex - 1]));
      this.robot.endPointer.remove(this.boxModel);
      this.box.visible = true;
    }
    this.animate(
      baseAngle + MathUtils.degToRad(3),
      shoulderAngle - MathUtils.degToRad(5),
      elbowAngle - Math.PI + MathUtils.degToRad(6)
    );
    // this.animate(baseAngle, shoulderAngle, elbowAngle - Math.PI);
  }

  animate(baseAngle, shoulderAngle, elbowAngle) {
    const duration = 1;
    const startTime = performance.now();
    const J4Angle = -(shoulderAngle + elbowAngle) + Math.PI / 2;
    const J5Angle = Math.PI;
    const J6Angle = -baseAngle + Math.PI / 2;
    const initialAngles = [
      this.J1.rotation.y,
      this.J2.rotation.x,
      this.J3.rotation.x,
      this.J4.rotation.x,
      this.J5.rotation.y,
      this.J6.rotation.z,
    ];
    const deltaAngles = [
      baseAngle - initialAngles[0],
      shoulderAngle - initialAngles[1],
      elbowAngle - initialAngles[2],
      J4Angle - initialAngles[3],
      J5Angle - initialAngles[4],
      J6Angle - initialAngles[5],
    ];
    const animate = (time) => {
      const elapsed = time - startTime;
      const t = Math.min(elapsed / (duration * 1000), 1);

      this.J1.rotation.y = initialAngles[0] + deltaAngles[0] * t;
      this.J2.rotation.x = initialAngles[1] + deltaAngles[1] * t;
      this.J3.rotation.x = initialAngles[2] + deltaAngles[2] * t;
      this.J4.rotation.x = initialAngles[3] + deltaAngles[3] * t;
      this.J5.rotation.y = initialAngles[4] + deltaAngles[4] * t;
      this.J6.rotation.z = initialAngles[5] + deltaAngles[5] * t;

      if (t < 1) {
        requestAnimationFrame(animate);
      } else {
        this.J1.rotation.y = baseAngle;
        this.J2.rotation.x = shoulderAngle;
        this.J3.rotation.x = elbowAngle;
        this.J4.rotation.x = J4Angle;
        this.J5.rotation.y = J5Angle;

        if (this.currentAnimIndex < 5) {
          this.currentAnimIndex++;
          this.startAnimation();
        } else {
          this.currentAnimIndex = 0;
          this.iteratePositions();
        }
      }
    };
    requestAnimationFrame(animate);
  }
}

export { AnimateHand };
