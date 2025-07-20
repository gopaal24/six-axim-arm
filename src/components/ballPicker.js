import { Raycaster } from "three";

class BallPicker {
  constructor() {
    this.raycaster = new Raycaster();
    this.selectedBall = null;
  }

  pick(pointer, balls, camera) {
    this.selectedBall = null;

    this.raycaster.setFromCamera(pointer, camera);

    const intersection = this.raycaster.intersectObjects(balls);
    if (intersection.length > 0) {
      this.selectedBall = intersection[0].object;
    }
  }
}

export default BallPicker;
