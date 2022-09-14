/*jslint plusplus: true, eqeq: true, es5: true, regexp: true, bitwise: true  */
/*globals Game, console */

/**
 * Solid generation code and adapters
 * 
 * My special thanks goes to Viktor Kovacs http://kovacsv.hu 
 * for platonic/archimedean solid generation and projection code!
 */
(function(window){
    
'use strict';


Game.pushVertex = function(vertexMap, x, y, z) {    
    var key = Object.keys(vertexMap).length;
    //var key = 1000000*x + 1000*y + z;  
    vertexMap[key] = {x: x, y: y, z: z, px: null, py: null, active: 0, neighbours: {}, polygons: []};       
};

Game.pushPolygon = function(polygonArr, polygon) {
    polygonArr.push(polygon);  
};

Game.generateTruncatedIcosahedron = function () {

    var vArr = {};
    var pArr = [];
    
    var scaleFact = 0.4;

    var a = 0.0;
    var b = 1.0 * scaleFact;
    var c = 2.0 * scaleFact;
    var d = scaleFact * (1.0 + Math.sqrt (5.0)) / 2.0;
    var e = 3.0 * d;
    var f = 1.0 * scaleFact + 2.0 * d;
    var g = 2.0 * scaleFact + d;
    var h = 2.0 * d;

    Game.pushVertex (vArr, +a, +b, +e);
    Game.pushVertex (vArr, +a, +b, -e);
    Game.pushVertex (vArr, +a, -b, +e);
    Game.pushVertex (vArr, +a, -b, -e);

    Game.pushVertex (vArr, +b, +e, +a);
    Game.pushVertex (vArr, +b, -e, +a);
    Game.pushVertex (vArr, -b, +e, +a);
    Game.pushVertex (vArr, -b, -e, +a);

    Game.pushVertex (vArr, +e, +a, +b);
    Game.pushVertex (vArr, -e, +a, +b);
    Game.pushVertex (vArr, +e, +a, -b);
    Game.pushVertex (vArr, -e, +a, -b);

    Game.pushVertex (vArr, +c, +f, +d);
    Game.pushVertex (vArr, +c, +f, -d);
    Game.pushVertex (vArr, +c, -f, +d);
    Game.pushVertex (vArr, -c, +f, +d);
    Game.pushVertex (vArr, +c, -f, -d);
    Game.pushVertex (vArr, -c, +f, -d);
    Game.pushVertex (vArr, -c, -f, +d);
    Game.pushVertex (vArr, -c, -f, -d);

    Game.pushVertex (vArr, +f, +d, +c);
    Game.pushVertex (vArr, +f, -d, +c);
    Game.pushVertex (vArr, -f, +d, +c);
    Game.pushVertex (vArr, +f, +d, -c);
    Game.pushVertex (vArr, -f, -d, +c);
    Game.pushVertex (vArr, +f, -d, -c);
    Game.pushVertex (vArr, -f, +d, -c);
    Game.pushVertex (vArr, -f, -d, -c);

    Game.pushVertex (vArr, +d, +c, +f);
    Game.pushVertex (vArr, -d, +c, +f);
    Game.pushVertex (vArr, +d, +c, -f);
    Game.pushVertex (vArr, +d, -c, +f);
    Game.pushVertex (vArr, -d, +c, -f);
    Game.pushVertex (vArr, -d, -c, +f);
    Game.pushVertex (vArr, +d, -c, -f);
    Game.pushVertex (vArr, -d, -c, -f);

    Game.pushVertex (vArr, +b, +g, +h);
    Game.pushVertex (vArr, +b, +g, -h);
    Game.pushVertex (vArr, +b, -g, +h);
    Game.pushVertex (vArr, -b, +g, +h);
    Game.pushVertex (vArr, +b, -g, -h);
    Game.pushVertex (vArr, -b, +g, -h);
    Game.pushVertex (vArr, -b, -g, +h);
    Game.pushVertex (vArr, -b, -g, -h);

    Game.pushVertex (vArr, +g, +h, +b);
    Game.pushVertex (vArr, +g, -h, +b);
    Game.pushVertex (vArr, -g, +h, +b);
    Game.pushVertex (vArr, +g, +h, -b);
    Game.pushVertex (vArr, -g, -h, +b);
    Game.pushVertex (vArr, +g, -h, -b);
    Game.pushVertex (vArr, -g, +h, -b);
    Game.pushVertex (vArr, -g, -h, -b);

    Game.pushVertex (vArr, +h, +b, +g);
    Game.pushVertex (vArr, -h, +b, +g);
    Game.pushVertex (vArr, +h, +b, -g);
    Game.pushVertex (vArr, +h, -b, +g);
    Game.pushVertex (vArr, -h, +b, -g);
    Game.pushVertex (vArr, -h, -b, +g);
    Game.pushVertex (vArr, +h, -b, -g);
    Game.pushVertex (vArr, -h, -b, -g);

    Game.pushPolygon(pArr, [0, 28, 36, 39, 29]);
    Game.pushPolygon(pArr, [1, 32, 41, 37, 30]);
    Game.pushPolygon(pArr, [2, 33, 42, 38, 31]);
    Game.pushPolygon(pArr, [3, 34, 40, 43, 35]);
    Game.pushPolygon(pArr, [4, 12, 44, 47, 13]);
    Game.pushPolygon(pArr, [5, 16, 49, 45, 14]);
    Game.pushPolygon(pArr, [6, 17, 50, 46, 15]);
    Game.pushPolygon(pArr, [7, 18, 48, 51, 19]);
    Game.pushPolygon(pArr, [8, 20, 52, 55, 21]);
    Game.pushPolygon(pArr, [9, 24, 57, 53, 22]);
    Game.pushPolygon(pArr, [10, 25, 58, 54, 23]);
    Game.pushPolygon(pArr, [11, 26, 56, 59, 27]);

    Game.pushPolygon(pArr, [0, 2, 31, 55, 52, 28]);
    Game.pushPolygon(pArr, [0, 29, 53, 57, 33, 2]);
    Game.pushPolygon(pArr, [1, 3, 35, 59, 56, 32]);
    Game.pushPolygon(pArr, [1, 30, 54, 58, 34, 3]);
    Game.pushPolygon(pArr, [4, 6, 15, 39, 36, 12]);
    Game.pushPolygon(pArr, [4, 13, 37, 41, 17, 6]);
    Game.pushPolygon(pArr, [5, 7, 19, 43, 40, 16]);
    Game.pushPolygon(pArr, [5, 14, 38, 42, 18, 7]);
    Game.pushPolygon(pArr, [8, 10, 23, 47, 44, 20]);
    Game.pushPolygon(pArr, [8, 21, 45, 49, 25, 10]);
    Game.pushPolygon(pArr, [9, 11, 27, 51, 48, 24]);
    Game.pushPolygon(pArr, [9, 22, 46, 50, 26, 11]);
    Game.pushPolygon(pArr, [12, 36, 28, 52, 20, 44]);
    Game.pushPolygon(pArr, [13, 47, 23, 54, 30, 37]);
    Game.pushPolygon(pArr, [14, 45, 21, 55, 31, 38]);
    Game.pushPolygon(pArr, [15, 46, 22, 53, 29, 39]);
    Game.pushPolygon(pArr, [16, 40, 34, 58, 25, 49]);
    Game.pushPolygon(pArr, [17, 41, 32, 56, 26, 50]);
    Game.pushPolygon(pArr, [18, 42, 33, 57, 24, 48]);
    Game.pushPolygon(pArr, [19, 51, 27, 59, 35, 43]);

    return {vertices: vArr, polygons: pArr};
};

Game.generateTruncatedOctahedron = function () {
    var vArr = {}, pArr = [],
        scaleFact = 0.85,
        a = 1.0 * scaleFact,
        b = 0.0,
        c = 2.0 * scaleFact;

    Game.pushVertex(vArr, +b, +a, +c);
    Game.pushVertex(vArr, +b, +a, -c);
    Game.pushVertex(vArr, +b, -a, +c);
    Game.pushVertex(vArr, +b, -a, -c);

    Game.pushVertex(vArr, +b, +c, +a);
    Game.pushVertex(vArr, +b, -c, +a);
    Game.pushVertex(vArr, +b, +c, -a);
    Game.pushVertex(vArr, +b, -c, -a);

    Game.pushVertex(vArr, +a, +b, +c);
    Game.pushVertex(vArr, +a, +b, -c);
    Game.pushVertex(vArr, -a, +b, +c);
    Game.pushVertex(vArr, -a, +b, -c);

    Game.pushVertex(vArr, +a, +c, +b);
    Game.pushVertex(vArr, +a, -c, +b);
    Game.pushVertex(vArr, -a, +c, +b);
    Game.pushVertex(vArr, -a, -c, +b);

    Game.pushVertex(vArr, +c, +b, +a);
    Game.pushVertex(vArr, -c, +b, +a);
    Game.pushVertex(vArr, +c, +b, -a);
    Game.pushVertex(vArr, -c, +b, -a);

    Game.pushVertex(vArr, +c, +a, +b);
    Game.pushVertex(vArr, -c, +a, +b);
    Game.pushVertex(vArr, +c, -a, +b);
    Game.pushVertex(vArr, -c, -a, +b);

    Game.pushPolygon(pArr, [0, 10, 2, 8]);
    Game.pushPolygon(pArr, [1, 9, 3, 11]);
    Game.pushPolygon(pArr, [4, 12, 6, 14]);
    Game.pushPolygon(pArr, [5, 15, 7, 13]);
    Game.pushPolygon(pArr, [16, 22, 18, 20]);
    Game.pushPolygon(pArr, [17, 21, 19, 23]);

    Game.pushPolygon(pArr, [0, 4, 14, 21, 17, 10]);
    Game.pushPolygon(pArr, [0, 8, 16, 20, 12, 4]);
    Game.pushPolygon(pArr, [1, 6, 12, 20, 18, 9]);
    Game.pushPolygon(pArr, [1, 11, 19, 21, 14, 6]);
    Game.pushPolygon(pArr, [2, 5, 13, 22, 16, 8]);
    Game.pushPolygon(pArr, [2, 10, 17, 23, 15, 5]);
    Game.pushPolygon(pArr, [3, 7, 15, 23, 19, 11]);
    Game.pushPolygon(pArr, [3, 9, 18, 22, 13, 7]);

    return {vertices: vArr, polygons: pArr};
};

Game.generateSnubCube = function () {
    var vArr = {}, pArr = [],
        scaleFact = 0.9,
        a = 1.0 * scaleFact,
        b = (1.0 / 3.0) * scaleFact * (Math.pow (17 + 3.0 * Math.sqrt (33.0), 1.0 / 3.0) - Math.pow (-17 + 3.0 * Math.sqrt (33.0), 1.0 / 3.0)*scaleFact - 1.0*scaleFact),
        c = 1.0 * scaleFact / b;

    Game.pushVertex(vArr,+a, +b, -c);
    Game.pushVertex(vArr,+a, -b, +c);
    Game.pushVertex(vArr,-a, +b, +c);
    Game.pushVertex(vArr,-a, -b, -c);

    Game.pushVertex(vArr,+b, -c, +a);
    Game.pushVertex(vArr,-b, +c, +a);
    Game.pushVertex(vArr,+b, +c, -a);
    Game.pushVertex(vArr,-b, -c, -a);

    Game.pushVertex(vArr,-c, +a, +b);
    Game.pushVertex(vArr,+c, +a, -b);
    Game.pushVertex(vArr,+c, -a, +b);
    Game.pushVertex(vArr,-c, -a, -b);

    Game.pushVertex(vArr,+a, +c, +b);
    Game.pushVertex(vArr,+a, -c, -b);
    Game.pushVertex(vArr,-a, +c, -b);
    Game.pushVertex(vArr,-a, -c, +b);

    Game.pushVertex(vArr,+b, +a, +c);
    Game.pushVertex(vArr,-b, +a, -c);
    Game.pushVertex(vArr,-b, -a, +c);
    Game.pushVertex(vArr,+b, -a, -c);

    Game.pushVertex(vArr,+c, +b, +a);
    Game.pushVertex(vArr,-c, -b, +a);
    Game.pushVertex(vArr,+c, -b, -a);
    Game.pushVertex(vArr,-c, +b, -a);

    Game.pushPolygon(pArr,[0, 6, 9]);
    Game.pushPolygon(pArr,[0, 9, 22]);
    Game.pushPolygon(pArr,[0, 17, 6]);
    Game.pushPolygon(pArr,[0, 22, 19]);
    Game.pushPolygon(pArr,[1, 4, 10]);
    Game.pushPolygon(pArr,[1, 10, 20]);
    Game.pushPolygon(pArr,[1, 18, 4]);
    Game.pushPolygon(pArr,[1, 20, 16]);
    Game.pushPolygon(pArr,[2, 5, 8]);
    Game.pushPolygon(pArr,[2, 8, 21]);
    Game.pushPolygon(pArr,[2, 16, 5]);
    Game.pushPolygon(pArr,[2, 21, 18]);
    Game.pushPolygon(pArr,[3, 7, 11]);
    Game.pushPolygon(pArr,[3, 11, 23]);
    Game.pushPolygon(pArr,[3, 19, 7]);
    Game.pushPolygon(pArr,[3, 23, 17]);
    Game.pushPolygon(pArr,[4, 13, 10]);
    Game.pushPolygon(pArr,[4, 18, 15]);
    Game.pushPolygon(pArr,[5, 14, 8]);
    Game.pushPolygon(pArr,[5, 16, 12]);
    Game.pushPolygon(pArr,[6, 12, 9]);
    Game.pushPolygon(pArr,[6, 17, 14]);
    Game.pushPolygon(pArr,[7, 15, 11]);
    Game.pushPolygon(pArr,[7, 19, 13]);
    Game.pushPolygon(pArr,[8, 14, 23]);
    Game.pushPolygon(pArr,[9, 12, 20]);
    Game.pushPolygon(pArr,[10, 13, 22]);
    Game.pushPolygon(pArr,[11, 15, 21]);
    Game.pushPolygon(pArr,[12, 16, 20]);
    Game.pushPolygon(pArr,[13, 19, 22]);
    Game.pushPolygon(pArr,[14, 17, 23]);
    Game.pushPolygon(pArr,[15, 18, 21]);

    Game.pushPolygon(pArr,[0, 19, 3, 17]);
    Game.pushPolygon(pArr,[1, 16, 2, 18]);
    Game.pushPolygon(pArr,[4, 15, 7, 13]);
    Game.pushPolygon(pArr,[5, 12, 6, 14]);
    Game.pushPolygon(pArr,[8, 23, 11, 21]);
    Game.pushPolygon(pArr,[9, 20, 10, 22]);

    return {vertices: vArr, polygons: pArr};
};

Game.generateIcosidodecahedron = function () {
    var vArr = {}, pArr = [],
        scaleFact = 1.2,
        a = 0.0,
        b = (1.0 + Math.sqrt (5.0)) * scaleFact / 2.0,
        c = scaleFact / 2.0,
        d = b / 2.0,
        e = (1.0 * scaleFact + b) / 2.0;

    Game.pushVertex(vArr,+a, +a, +b);
    Game.pushVertex(vArr,+a, +a, -b);
    Game.pushVertex(vArr,+a, +b, +a);
    Game.pushVertex(vArr,+a, -b, +a);
    Game.pushVertex(vArr,+b, +a, +a);
    Game.pushVertex(vArr,-b, +a, +a);

    Game.pushVertex(vArr,+c, +d, +e);
    Game.pushVertex(vArr,+c, +d, -e);
    Game.pushVertex(vArr,+c, -d, +e);
    Game.pushVertex(vArr,-c, +d, +e);
    Game.pushVertex(vArr,+c, -d, -e);
    Game.pushVertex(vArr,-c, +d, -e);
    Game.pushVertex(vArr,-c, -d, +e);
    Game.pushVertex(vArr,-c, -d, -e);

    Game.pushVertex(vArr,+d, +e, +c);
    Game.pushVertex(vArr,+d, -e, +c);
    Game.pushVertex(vArr,-d, +e, +c);
    Game.pushVertex(vArr,+d, +e, -c);
    Game.pushVertex(vArr,-d, -e, +c);
    Game.pushVertex(vArr,+d, -e, -c);
    Game.pushVertex(vArr,-d, +e, -c);
    Game.pushVertex(vArr,-d, -e, -c);

    Game.pushVertex(vArr,+e, +c, +d);
    Game.pushVertex(vArr,-e, +c, +d);
    Game.pushVertex(vArr,+e, +c, -d);
    Game.pushVertex(vArr,+e, -c, +d);
    Game.pushVertex(vArr,-e, +c, -d);
    Game.pushVertex(vArr,-e, -c, +d);
    Game.pushVertex(vArr,+e, -c, -d);
    Game.pushVertex(vArr,-e, -c, -d);

    Game.pushPolygon(pArr,[0, 6, 9]);
    Game.pushPolygon(pArr,[0, 12, 8]);
    Game.pushPolygon(pArr,[1, 10, 13]);
    Game.pushPolygon(pArr,[1, 11, 7]);
    Game.pushPolygon(pArr,[2, 14, 17]);
    Game.pushPolygon(pArr,[2, 20, 16]);
    Game.pushPolygon(pArr,[3, 18, 21]);
    Game.pushPolygon(pArr,[3, 19, 15]);
    Game.pushPolygon(pArr,[4, 22, 25]);
    Game.pushPolygon(pArr,[4, 28, 24]);
    Game.pushPolygon(pArr,[5, 26, 29]);
    Game.pushPolygon(pArr,[5, 27, 23]);
    Game.pushPolygon(pArr,[6, 22, 14]);
    Game.pushPolygon(pArr,[7, 17, 24]);
    Game.pushPolygon(pArr,[8, 15, 25]);
    Game.pushPolygon(pArr,[9, 16, 23]);
    Game.pushPolygon(pArr,[10, 28, 19]);
    Game.pushPolygon(pArr,[11, 26, 20]);
    Game.pushPolygon(pArr,[12, 27, 18]);
    Game.pushPolygon(pArr,[13, 21, 29]);

    Game.pushPolygon(pArr,[0, 8, 25, 22, 6]);
    Game.pushPolygon(pArr,[0, 9, 23, 27, 12]);
    Game.pushPolygon(pArr,[1, 7, 24, 28, 10]);
    Game.pushPolygon(pArr,[1, 13, 29, 26, 11]);
    Game.pushPolygon(pArr,[2, 16, 9, 6, 14]);
    Game.pushPolygon(pArr,[2, 17, 7, 11, 20]);
    Game.pushPolygon(pArr,[3, 15, 8, 12, 18]);
    Game.pushPolygon(pArr,[3, 21, 13, 10, 19]);
    Game.pushPolygon(pArr,[4, 24, 17, 14, 22]);
    Game.pushPolygon(pArr,[4, 25, 15, 19, 28]);
    Game.pushPolygon(pArr,[5, 23, 16, 20, 26]);
    Game.pushPolygon(pArr,[5, 29, 21, 18, 27]);

    return {vertices: vArr, polygons: pArr};
};

Game.generateRhombicuboctahedron = function ()
{
    var vArr = {}, pArr = [],
        scaleFact = 0.7,
        a = 1.0 * scaleFact,
        b = (1.0 + Math.sqrt (2.0)) * scaleFact;

    Game.pushVertex(vArr,+a, +a, +b);
    Game.pushVertex(vArr,+a, +a, -b);
    Game.pushVertex(vArr,+a, -a, +b);
    Game.pushVertex(vArr,-a, +a, +b);
    Game.pushVertex(vArr,+a, -a, -b);
    Game.pushVertex(vArr,-a, +a, -b);
    Game.pushVertex(vArr,-a, -a, +b);
    Game.pushVertex(vArr,-a, -a, -b);

    Game.pushVertex(vArr,+a, +b, +a);
    Game.pushVertex(vArr,+a, +b, -a);
    Game.pushVertex(vArr,+a, -b, +a);
    Game.pushVertex(vArr,-a, +b, +a);
    Game.pushVertex(vArr,+a, -b, -a);
    Game.pushVertex(vArr,-a, +b, -a);
    Game.pushVertex(vArr,-a, -b, +a);
    Game.pushVertex(vArr,-a, -b, -a);

    Game.pushVertex(vArr,+b, +a, +a);
    Game.pushVertex(vArr,+b, +a, -a);
    Game.pushVertex(vArr,+b, -a, +a);
    Game.pushVertex(vArr,-b, +a, +a);
    Game.pushVertex(vArr,+b, -a, -a);
    Game.pushVertex(vArr,-b, +a, -a);
    Game.pushVertex(vArr,-b, -a, +a);
    Game.pushVertex(vArr,-b, -a, -a);

    Game.pushPolygon(pArr, [0, 16, 8]);
    Game.pushPolygon(pArr, [1, 9, 17]);
    Game.pushPolygon(pArr, [2, 10, 18]);
    Game.pushPolygon(pArr, [3, 11, 19]);
    Game.pushPolygon(pArr, [4, 20, 12]);
    Game.pushPolygon(pArr, [5, 21, 13]);
    Game.pushPolygon(pArr, [6, 22, 14]);
    Game.pushPolygon(pArr, [7, 15, 23]);

    Game.pushPolygon(pArr, [0, 2, 18, 16]);
    Game.pushPolygon(pArr, [0, 3, 6, 2]);
    Game.pushPolygon(pArr, [0, 8, 11, 3]);
    Game.pushPolygon(pArr, [1, 4, 7, 5]);
    Game.pushPolygon(pArr, [1, 5, 13, 9]);
    Game.pushPolygon(pArr, [1, 17, 20, 4]);
    Game.pushPolygon(pArr, [2, 6, 14, 10]);
    Game.pushPolygon(pArr, [3, 19, 22, 6]);
    Game.pushPolygon(pArr, [4, 12, 15, 7]);
    Game.pushPolygon(pArr, [5, 7, 23, 21]);
    Game.pushPolygon(pArr, [8, 9, 13, 11]);
    Game.pushPolygon(pArr, [8, 16, 17, 9]);
    Game.pushPolygon(pArr, [10, 12, 20, 18]);
    Game.pushPolygon(pArr, [10, 14, 15, 12]);
    Game.pushPolygon(pArr, [11, 13, 21, 19]);
    Game.pushPolygon(pArr, [14, 22, 23, 15]);
    Game.pushPolygon(pArr, [16, 18, 20, 17]);
    Game.pushPolygon(pArr, [19, 21, 23, 22]);

    return {vertices: vArr, polygons: pArr};
};

}(window));