import { Vector3 } from "three";

function calculateDistance(robot, ball) {
  // const basePos = robot.base.getWorldPosition(new Vector3());
  const ballPos = ball.getWorldPosition(new Vector3());
  const uArmPos = robot.J3.getWorldPosition(new Vector3());
  const lArmPos = robot.J2.getWorldPosition(new Vector3());
  const handPos = robot.J6.getWorldPosition(new Vector3());

  const uArmToHand = handPos.distanceTo(uArmPos);
  const lArmToBall = ballPos.distanceTo(lArmPos);
  const lArmToUArm = uArmPos.distanceTo(lArmPos);

  // const baseToLArm = lArmPos.distanceTo(basePos);

  const targetHeight = ballPos.y - lArmPos.y;

  const horizontalDist = Math.sqrt(
    Math.pow(lArmToBall, 2) - Math.pow(targetHeight, 2)
  );

  return {
    uArmToHand,
    lArmToBall,
    lArmToUArm,
    targetHeight,
    horizontalDist,
  };
}

function calculateAngles(robot, ball) {
  const { uArmToHand, lArmToBall, lArmToUArm, targetHeight, horizontalDist } =
    calculateDistance(robot, ball);

  const maxReach = uArmToHand + lArmToUArm;

  const baseAngle = Math.atan2(ball.position.x, ball.position.z);

  if (lArmToBall > maxReach) {
    console.warn("Target is too far to reach!");
    return {
      baseAngle: baseAngle,
      shoulderAngle: 0,
      elbowAngle: Math.PI,
    };
  }

  const shoulderAngle1 = Math.atan2(targetHeight, horizontalDist);
  const shoulderAngle2 = Math.acos(
    (lArmToBall ** 2 + lArmToUArm ** 2 - uArmToHand ** 2) /
      (2 * lArmToBall * lArmToUArm)
  );

  let elbowAngle = Math.acos(
    (lArmToUArm ** 2 + uArmToHand ** 2 - lArmToBall ** 2) /
      (2 * lArmToUArm * uArmToHand)
  );

  let shoulderAngle = shoulderAngle1 + shoulderAngle2;
  // elbowAngle = elbowAngle + Math.PI / 4;
  // elbowAngle = elbowAngle - Math.PI / 4;

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

export {
  calculateDistance,
  calculateAngles,
  // calculateBoxplacement,
  // calculateJointAngles,
  updateRobotJoints,
};
