import {
  BoxGeometry,
  CylinderGeometry,
  IcosahedronGeometry,
  Mesh,
  MeshStandardMaterial,
  Group,
} from "three";

class Robot {
  create() {
    const greyMaterial = new MeshStandardMaterial({
      color: "grey",
      metalness: 1,
      roughness: 0.6,
    });
    const orangeMaterial = new MeshStandardMaterial({
      color: "orange",
      metalness: 1,
      roughness: 0.6,
    });

    const robot = new Group();

    const j1Group = new Group();

    const grey_base_geo = new CylinderGeometry(2.5, 2.5, 0.8, 32);
    const grey_base = new Mesh(grey_base_geo, greyMaterial);
    grey_base.position.set(0, 0.4, 0);
    grey_base.castShadow = true;
    grey_base.receiveShadow = true;
    j1Group.add(grey_base);

    const oragneg_base_geo = new CylinderGeometry(2, 2, 0.4, 32);
    const orange_base = new Mesh(oragneg_base_geo, orangeMaterial);
    orange_base.position.set(0, 0.8, 0);
    orange_base.castShadow = true;
    orange_base.receiveShadow = true;
    j1Group.add(orange_base);

    const base_arm_geo = new BoxGeometry(0.2, 1.2, 0.6);
    const base_arm = new Mesh(base_arm_geo, orangeMaterial);
    base_arm.position.set(0, 1.6, 0);
    j1Group.add(base_arm);

    const j2Group = new Group();
    j2Group.position.set(0, 2.4, 0);

    const j2Geo = new CylinderGeometry(0.4, 0.4, 1, 32);
    const j2 = new Mesh(j2Geo, greyMaterial);
    j2.rotation.z = Math.PI / 2;
    j2.position.set(-0.3, 0, 0);
    j2Group.add(j2);

    const j2HandGeo = new BoxGeometry(0.2, 3, 0.6);
    const j2Hand = new Mesh(j2HandGeo, orangeMaterial);
    j2Hand.position.set(-0.6, 1.5, 0);
    j2Group.add(j2Hand);

    const j3Group = new Group();
    j3Group.position.set(0, 3, 0);

    const j3Geo = new CylinderGeometry(0.4, 0.4, 1, 32);
    const j3 = new Mesh(j3Geo, greyMaterial);
    j3.rotation.z = Math.PI / 2;
    j3.position.set(-0.3, 0, 0);
    j3Group.add(j3);

    const j3HandGeo = new BoxGeometry(0.2, 3, 0.6);
    const j3Hand = new Mesh(j3HandGeo, orangeMaterial);
    j3Hand.position.set(0, 1.5, 0);
    j3Group.add(j3Hand);

    const j4Group = new Group();
    j4Group.position.set(0, 3, 0);

    const j4Geo = new CylinderGeometry(0.4, 0.4, 1, 32);
    const j4 = new Mesh(j4Geo, greyMaterial);
    j4.rotation.z = Math.PI / 2;
    j4.position.set(-0.3, 0, 0);
    j4Group.add(j4);

    const j4HandGeo = new BoxGeometry(0.2, 1.4, 0.6);
    const j4Hand = new Mesh(j4HandGeo, orangeMaterial);
    j4Hand.position.set(-0.6, 0.7, 0);
    j4Group.add(j4Hand);

    robot.add(j1Group);
    j1Group.add(j2Group);
    j2Group.add(j3Group);
    j3Group.add(j4Group);

    return robot;
  }
}

export default Robot;
