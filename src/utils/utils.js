import { Vector3 } from "three";

function calculateDistance(robot, targetPos) {
  // const basePos = robot.base.getWorldPosition(new Vector3());
  const uArmPos = robot.J3.getWorldPosition(new Vector3());
  const lArmPos = robot.J2.getWorldPosition(new Vector3());
  const handPos = robot.endPointer.getWorldPosition(new Vector3());

  const uArmToHand = handPos.distanceTo(uArmPos);
  const lArmTotarget = targetPos.distanceTo(lArmPos);
  const lArmToUArm = uArmPos.distanceTo(lArmPos);

  // const baseToLArm = lArmPos.distanceTo(basePos);

  const targetHeight = targetPos.y - lArmPos.y;

  const horizontalDist = Math.sqrt(
    Math.pow(lArmTotarget, 2) - Math.pow(targetHeight, 2)
  );

  return {
    uArmToHand,
    lArmTotarget,
    lArmToUArm,
    targetHeight,
    horizontalDist,
  };
}

function calculateAngles(robot, targetPos) {
  const { uArmToHand, lArmTotarget, lArmToUArm, targetHeight, horizontalDist } =
    calculateDistance(robot, targetPos);

  const maxReach = uArmToHand + lArmToUArm;

  const baseAngle = Math.atan2(targetPos.x, targetPos.z);

  if (lArmTotarget > maxReach) {
    console.warn("Target is too far to reach!");
    return {
      baseAngle: baseAngle,
      shoulderAngle: 0,
      elbowAngle: Math.PI,
    };
  }

  const shoulderAngle1 = Math.atan2(targetHeight, horizontalDist);
  const shoulderAngle2 = Math.acos(
    (lArmTotarget ** 2 + lArmToUArm ** 2 - uArmToHand ** 2) /
      (2 * lArmTotarget * lArmToUArm)
  );

  let elbowAngle = Math.acos(
    (lArmToUArm ** 2 + uArmToHand ** 2 - lArmTotarget ** 2) /
      (2 * lArmToUArm * uArmToHand)
  );

  let shoulderAngle = shoulderAngle1 + shoulderAngle2;

  return {
    baseAngle,
    shoulderAngle,
    elbowAngle,
  };
}

const api = "/api/RobotData";

function updateRobotJoints(robot) {
  fetch(api)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      if (robot.J6) {
        robot.J1.rotation.y = MathUtils.degToRad(data.j1_CurrentPosition);
        robot.J2.rotation.x = MathUtils.degToRad(data.j2_CurrentPosition - 180);
        robot.J3.rotation.x = MathUtils.degToRad(data.j3_CurrentPosition);
        robot.J4.rotation.x = MathUtils.degToRad(data.j4_CurrentPosition - 180);
        robot.J5.rotation.z = MathUtils.degToRad(data.j5_CurrentPosition + 90);
        robot.J6.rotation.z = MathUtils.degToRad(data.j6_CurrentPosition - 13);
      }
      console.log(data);
    });
}

const positions = {
  1: {
    x: 1.4,
    y: 1.2,
    z: 1.2,
  },
  2: {
    x: 2.6,
    y: 1.1,
    z: 1.6,
  },
  3: {
    x: 3.95,
    y: 1.1,
    z: 1.8,
  },
  4: {
    x: 5.3,
    y: 1.2,
    z: 2.1,
  },
  5: {
    x: 2.2,
    y: 1.2,
    z: 4.2,
  },
  6: {
    x: 3.3,
    y: 1.2,
    z: 4.3,
  },
  7: {
    x: 4.45,
    y: 1.35,
    z: 4.45,
  },
  8: {
    x: 5.75,
    y: 1.45,
    z: 4.6,
  },
};

const boxPositions = [];
for (let j = 0; j < 2; j++) {
  for (let i = 0; i < 4; i++) {
    boxPositions.push(
      new Vector3(
        4 - 2.5 + i + 0.5 + i * 0.25 + 0.15,
        0.25 + 0.25 + 0.5,
        4 - 2.5 + 1 + 2 * j + j * 0.5 + 0.25
      )
    );
  }
}
export { calculateAngles, positions, boxPositions };
