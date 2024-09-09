class MazeRotationLayer {
    constructor(origin, cellCount, scene, offset) {
        this.origin = origin;
        this.wallMeshes = [];
        this.wallMaterial = new BABYLON.StandardMaterial("wall mat", scene);
        this.offset = offset;
        this.cellCount = cellCount;
        this.snapAngles = [];
        this.currentAngle = 0;
        let angleIncr = 2 * Math.PI / cellCount;
        for (let angle = 0, i = 0; i < cellCount; i++, angle += angleIncr) {
            this.snapAngles.push(angle);
        }
        this.currentAngle = 2 * Math.PI - this.snapAngles[this.offset];
        // this.origin.rotation.z = this.currentAngle;
    }
    update(deltaTime) {
        const snapAngleDiff = Math.abs(this.origin.rotation.z - this.currentAngle);
        if (snapAngleDiff > ANGLE_EQUALITY_THRESHOLD) {
            if (snapAngleDiff > Math.PI) {
                if (this.origin.rotation.z > this.currentAngle) {
                    this.origin.rotation.z += deltaTime * ANGULAR_SPEED;
                } else {
                    this.origin.rotation.z += 2 * Math.PI - deltaTime * ANGULAR_SPEED;
                }
                this.origin.rotation.z %= 2 * Math.PI;
            } else {
                if (this.origin.rotation.z > this.currentAngle) {
                    this.origin.rotation.z -= deltaTime * ANGULAR_SPEED;
                } else {
                    this.origin.rotation.z += deltaTime * ANGULAR_SPEED
                }
            }
        } else {
            this.origin.rotation.z = this.currentAngle;
        }
    }
    addWallMesh(mesh) {
        this.wallMeshes.push(mesh);
        mesh.material = this.wallMaterial;
    }
    setWallColor(color) {
        this.wallMaterial.diffuseColor = color;
    }
    rotate(angle) {
        angle %= 2 * Math.PI;
        if (angle < 0) {
            angle += 2 * Math.PI;
        }
        this.origin.rotation.z = (this.currentAngle + angle) % (2 * Math.PI);
    }
    endRotate() {
        // find nearest snap
        this.offset = this.binarySearch(2 * Math.PI - this.origin.rotation.z);
        let snapAngle = this.snapAngles[this.offset];
        // this.origin.rotation.z = -snapAngle;
        this.currentAngle = 2 * Math.PI - snapAngle;
    }
    binarySearch(angle) {
        let start = 0;
        let end = this.snapAngles.length - 1;
        let curr = Math.floor((start + end) / 2);
        while (start < end) {
            if (this.snapAngles[curr] === angle) {
                return curr;
            } else if (angle < this.snapAngles[curr]) {
                end = curr - 1;
            } else if (angle > this.snapAngles[curr]) {
                start = curr + 1;
            }
            curr = Math.floor((start + end) / 2);
        }
        if (this.snapAngles[curr] === angle) {
            return curr;
        } else if (angle < this.snapAngles[curr]) {
            if (curr === 0) {
                return curr;
            } else {
                return Math.abs(angle - this.snapAngles[curr]) < Math.abs(angle - this.snapAngles[curr - 1])
                    ? curr
                    : curr - 1;
            }
        } else if (angle > this.snapAngles[curr]) {
            if (curr === this.snapAngles.length - 1) {
                return Math.abs(angle - this.snapAngles[curr]) < Math.abs(angle - 2 * Math.PI)
                    ? curr
                    : 0;
            } else {
                return Math.abs(angle - this.snapAngles[curr]) < Math.abs(angle - this.snapAngles[curr + 1])
                    ? curr
                    : curr + 1;
            }
        }
    }
}