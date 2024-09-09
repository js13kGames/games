/**
 * Return a MazeCell representing a cell in a maze. A maze cell has a north wall,
 * an east wall, and region used for maze generation.
 * 
 */
function MazeCell() {
    // first half of outer wall, clockwise
    this.outer0 = true;
    // second half, clockwise
    this.outer1 = true;
    // clockwise wall
    this.clockwise = true;
    this.root = this;
    this.findBaseRoot = function () {
        let curr = this.root;
        while (curr !== curr.root) {
            curr = curr.root;
        }
        return curr;
    }
    this.updateRoot = function () {
        this.root = this.findBaseRoot();
    }
    this.copyRoot = function (other) {
        this.root.root = other.root;
    }
    this.updateRootsAndMatch = function (other) {
        this.updateRoot();
        other.updateRoot();
        return this.root === other.root;
    }
    this.knockOuterWall = function () { this.outer0 = false; this.outer1 = false; }
    this.knockOuter0Wall = function () { this.outer0 = false; }
    this.knockOuter1Wall = function () { this.outer1 = false; }
    this.knockClockwiseWall = function () { this.clockwise = false }
}