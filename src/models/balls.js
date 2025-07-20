import {
  IcosahedronGeometry,
  MeshStandardMaterial,
  Mesh,
  Vector3,
} from "three";

function generateBalls() {
  const balls = [];

  for (var i = 0; i < 15; i++) {
    const x = 0.8 + Math.random() * 8;
    const y = 0.25 + Math.random() * 3;
    const z = 0.8 + Math.random() * 8;
    const rndPos = new Vector3(
      Math.random() > 0.5 ? x : -x,
      y,
      Math.random() > 0.5 ? z : -z
    );
    const ball = new Mesh(
      new IcosahedronGeometry(0.5),
      new MeshStandardMaterial({
        color: "orange",
        metalness: 1,
        roughness: 0.4,
      })
    );
    ball.position.copy(rndPos);
    balls.push(ball);
  }
  return balls;
}

export { generateBalls };
