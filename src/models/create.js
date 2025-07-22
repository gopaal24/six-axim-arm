import { BoxGeometry, MeshStandardMaterial, Mesh, Group } from "three";

function createBox(l, b, h, pos) {
  const geo = new BoxGeometry(l, b, h);
  const material = new MeshStandardMaterial({ color: 0x4c4525 });
  const box = new Mesh(geo, material);
  box.position.set(pos.x, pos.y, pos.z);
  box.castShadow = true;
  box.receiveShadow = true;

  return box;
}

function createPallete(l, b, h, pos) {
  const geo = new BoxGeometry(l, b, h);
  const material = new MeshStandardMaterial({
    color: 0x8b4513,
    metalness: 0.8,
    roughness: 0.5,
  });
  const pallete = new Mesh(geo, material);
  pallete.position.set(pos.x, pos.y, pos.z);

  pallete.castShadow = true;
  pallete.receiveShadow = true;

  return pallete;
}

function createConveyer(l, b, h, pos) {
  const conveyer = new Group();

  const geo = new BoxGeometry(l, 0.25, b);
  const material = new MeshStandardMaterial({ color: 0x808080 });
  const base = new Mesh(geo, material);

  base.castShadow = true;
  base.receiveShadow = true;
  conveyer.add(base);

  const legMaterial = new MeshStandardMaterial({ color: 0x000000 });
  const legGeo = new BoxGeometry(0.15, h, 0.15);

  for (let i = 0; i < 4; i++) {
    const leg = new Mesh(legGeo, legMaterial);
    leg.position.set(
      (i % 2 === 0 ? -1 : 1) * (l / 2 - 0.2),
      -h / 2,
      (i < 2 ? -1 : 1) * (b / 2 - 0.2)
    );
    leg.castShadow = true;
    leg.receiveShadow = true;
    conveyer.add(leg);
  }

  conveyer.position.set(pos.x, h, pos.y);

  return conveyer;
}

export { createBox, createPallete, createConveyer };
