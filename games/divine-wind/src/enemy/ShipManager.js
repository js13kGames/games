class ShipManager {
    constructor(scene, shipCount, waveWidth) {
        this.ships = [];
        this.waveWidth = waveWidth;
        for (let i = 0; i < shipCount; i++) {
            this.ships.push(new MongolShip(scene, BABYLON.Vector3.Down(), i === 0));
        }
    }
    startWave(levelTime, shipSpeed, shipCount = this.ships.length) {
        let minDistance = levelTime * shipSpeed;
        for (let i = 0; i < shipCount && i < this.ships.length; i++) {
            this.ships[i].setPosition(
                i === 0 ? 0 : this.waveWidth * Math.random() - this.waveWidth / 2,
                0,
                minDistance + (i === 0 ? 0 : this.waveWidth * Math.random())
            )
            this.ships[i].resetTraveling();
        }
    }
    blowWaveAway() {
        for (let ship of this.ships) {
            if (ship.traveling) {
                ship.blowAway();
            }
        }
    }
}