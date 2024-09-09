var TileType;
(function (TileType) {
    TileType[TileType["Air"] = 0] = "Air";
    TileType[TileType["Solid"] = 1] = "Solid";
    TileType[TileType["Exit"] = 2] = "Exit";
    TileType[TileType["Start"] = 3] = "Start";
    TileType[TileType["FakeExit"] = 4] = "FakeExit";
})(TileType || (TileType = {}));
export default TileType;
