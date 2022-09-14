import {MapData} from "./MapData.js";

import{Projectile} from "./Projectile.js";

export class Renderer {


    constructor(container) {

        this._camera = container;

        this.projectiles = [];


        this.portalPositions = [
            {
                x: 0,
                y: 0,
                z: 0,
                side: 0,
                visible: false
            },
            {
                x: 0,
                y: 0,
                z: 0,
                side: 0,
                visible: false
            }
        ]

        this.cssProperties =
            {
                x: 0,
                y: 0,
                z: 0,
                rotX: 0,
                rotY: 0
            }

    }

    loadMap(mapData)
    {
        console.log(mapData);
        this._scene = this.buildMap(mapData);
        this._camera.innerHTML =  '';
        this._camera.appendChild(this._scene);

    }

    createPortals()
    {
        this.portals = [
            this.createPortal(0),
            this.createPortal(1)
        ];

    }

    createPortal(type)
    {
        const elem = document.createElement('div');
        elem.className = 'portalV2 camera ' + (type === 0 ? 'portalBlue' : 'portalOrange');
        this._scene.appendChild(elem);
        elem.hidden = true;

        const this2 = this;

        return elem;
    }

    placePortal(id, pos, angle, mapData, portalOther)
    {
        const portal = this.portals[id];
        portal.style.setProperty('--x', Tools.posToCSS(pos.x + 1 - .05));
        portal.style.setProperty('--y', Tools.posToCSS(-pos.y - 2 + .15));
        portal.style.setProperty('--z', Tools.posToCSS(pos.z));
        portal.hidden = false;



        this.portalPositions[id].x = pos.x;
        this.portalPositions[id].y = pos.y;
        this.portalPositions[id].z = pos.z;
        this.portalPositions[id].side = angle;

        switch (angle)
        {
            case 0:
                portal.style.setProperty('--rot', '180deg');
                break;

            case 1:
                portal.style.setProperty('--rot', 0);
                break;

            case 2:
                portal.style.setProperty('--rot', '-90deg');
                break;

            case 3:
                portal.style.setProperty('--rot', '90deg');
                break;

        }

    }

    refrestPortalInsides(portals, mapData)
    {

        for(let i = 0; i <= 1; ++i)
        {
            const j = i ? 0 : 1;

            this.portals[i].innerHTML = '';
            const inside = this.buildMap(this.buildPortalMap(mapData, portals[j].side, portals[j].side >= 2 ? portals[j].pos.x : portals[j].pos.z));
            this.portals[i].appendChild(inside);


            if(portals[j].side === 0)
            {
                this.portals[i].firstChild.style.setProperty('--z', Tools.posToCSS(-portals[j].pos.z - (innerHeight / 200)));
                this.portals[i].firstChild.style.setProperty('--y', Tools.posToCSS(portals[j].pos.y + 1));
                this.portals[i].firstChild.style.setProperty('--x', Tools.posToCSS(-portals[j].pos.x - .5));
            }
            else if(portals[j].side === 1)
            {
                this.portals[i].firstChild.style.setProperty('--z', Tools.posToCSS(-portals[j].pos.z - 1 + (innerHeight / 200)));
                this.portals[i].firstChild.style.setProperty('--y', Tools.posToCSS(portals[j].pos.y + 1));
                this.portals[i].firstChild.style.setProperty('--x', Tools.posToCSS(-portals[j].pos.x - .5));
            }
            else if(portals[j].side === 2)
            {
                this.portals[i].firstChild.style.setProperty('--x', Tools.posToCSS(-portals[j].pos.x + 0 - (innerHeight / 200)));
                this.portals[i].firstChild.style.setProperty('--y', Tools.posToCSS(portals[j].pos.y + 1));
                this.portals[i].firstChild.style.setProperty('--z', Tools.posToCSS(-portals[j].pos.z - .5));
            }
            else if(portals[j].side === 3)
            {
                this.portals[i].firstChild.style.setProperty('--x', Tools.posToCSS(-portals[j].pos.x - 1 + (innerHeight / 200)));
                this.portals[i].firstChild.style.setProperty('--y', Tools.posToCSS(portals[j].pos.y + 1));
                this.portals[i].firstChild.style.setProperty('--z', Tools.posToCSS(-portals[j].pos.z - .5));
            }

            this.portals[i].firstChild.style.setProperty('--rotX', [0, .5, .75 , .25][portals[j].side] + 'turn');
        }

    }

    buildPortalMap(mapData, orientation, position)
    {
        const tempData = new MapData([[[]]], mapData.startingPosition);
        tempData.size = mapData.size;
        tempData.hue = mapData.hue;
        const size = mapData.size;
        for (let x = 0; x < size.x; ++x) {
            tempData.blocks[x] = [];
            for (let y = 0; y < size.y; ++y) {
                tempData.blocks[x][y] = [];
                for (let z = 0; z < size.z; ++z) {

                    if((orientation === 3 && x > position) ||
                        (orientation === 2 && x < position) ||
                        (orientation === 1 && z > position) ||
                        (orientation === 0 && z < position) ||
                        (orientation === 4 && y < position) ||
                        (orientation === 5 && y > position))


                        tempData.blocks[x][y][z] = mapData.blockAt(x,y,z);

                    else
                        tempData.blocks[x][y][z] = MapData.BLOCK_VOID;

                }
            }
        }

        return tempData;

    }

    buildMap(mapData) {

        const scene = document.createElement('div')
        scene.className = 'scene';
        scene.style.setProperty('--hue', mapData.hue + 'deg');

        const blocks = mapData.blocks;
        const size = mapData.size;
        const sideRendered = [];
        for (let x = 0; x < size.x; ++x) {
            sideRendered[x] = [];
            for (let y = 0; y < size.y; ++y) {
                sideRendered[x][y] = [];
                for (let z = 0; z < size.z; ++z) {
                    sideRendered[x][y][z] = [false, false, false, false, false, false];
                }
            }
        }

        for (let i = 0; i < 6; ++i) {


            let startZ = 0;
            let startY = 0;
            let startX = 0;

            for (let x = 0; x < size.x; ++x) {
                for (let y = 0; y < size.y; ++y) {
                    for (let z = 0; z < size.z; ++z) {

                        const thisBlock = mapData.blockAt(x, y, z);
                        const valuesCompFirst = this.createCompValues(i, x, y, z, 0);
                        const nextBlock = mapData.blockAt(valuesCompFirst.x, valuesCompFirst.y, valuesCompFirst.z);
                        if (!sideRendered[x][y][z][i] && thisBlock === MapData.BLOCK_WALL && nextBlock === MapData.BLOCK_EMPTY) {
                            startZ = z;
                            startY = y;
                            startX = y;
                            let width = 0;
                            let height = 0;
                            const limits = this.getLimits(i, {x: x, y: y, z: z}, size);
                            let limitA = limits.a;
                            let limitB = limits.b;

                            loopA:
                                for (let a = 0; a < limitA; ++a) {
                                    let rowComplete = false;
                                    const valuesA = this.createValues(i, x, y, z, a);
                                    const valuesCompA = this.createCompValues(i, x, y, z, a);
                                    if (!sideRendered[valuesA.x][valuesA.y][valuesA.z][i] && mapData.blockAt(valuesA.x, valuesA.y, valuesA.z) === MapData.BLOCK_WALL && mapData.blockAt(valuesCompA.x, valuesCompA.y, valuesCompA.z) === MapData.BLOCK_EMPTY) {
                                        loopB:
                                            for (let b = 0; b < limitB; ++b) {
                                                const valuesB = this.createValues(i, x, y, z, a, b);
                                                const valuesCompB = this.createCompValues(i, x, y, z, a, b);
                                                if (!sideRendered[valuesB.x][valuesB.y][valuesB.z][i] && mapData.blockAt(valuesB.x, valuesB.y, valuesB.z) === MapData.BLOCK_WALL && mapData.blockAt(valuesCompB.x, valuesCompB.y, valuesCompB.z) === MapData.BLOCK_EMPTY) {
                                                    if (a === 0) {
                                                        width++;
                                                    }
                                                } else {
                                                    if (a === 0) {
                                                        limitB = width;
                                                        rowComplete = true;
                                                    }
                                                    break loopB;
                                                }
                                                if (b === limitB - 1) {
                                                    rowComplete = true;
                                                }
                                            }
                                    }
                                    if (rowComplete) {
                                        height++;
                                        for (let b = 0; b < limitB; ++b) {
                                            const values = this.createValues(i, x, y, z, a, b);
                                            sideRendered[values.x][values.y][values.z][i] = true;
                                        }

                                    } else {
                                        break loopA;
                                    }
                                }
                            const side = this.renderSide(x, y, z, width, height, i);
                            scene.appendChild(side);

                        }

                    }
                }
            }
        }

        if(scene.children.length > 0)
        {
            const endOrb = document.createElement('div');
            endOrb.className = 'projectile end';
            endOrb.style.setProperty('--x', Tools.posToCSS(mapData.endPos.x + .5));
            endOrb.style.setProperty('--y', Tools.posToCSS(mapData.endPos.y + .5));
            endOrb.style.setProperty('--z', Tools.posToCSS(mapData.endPos.z + .5));
            scene.appendChild(endOrb);
        }


        return scene;


    }

    getLimits(orientation, startPos, size)
    {
        const limits = {a:0,b:0};

        switch (orientation)
        {
            case 0:
            case 1:

                limits.a = size.y - startPos.y;
                limits.b = size.z - startPos.z;

                break;

            case 2:
            case 3:

                limits.a = size.y - startPos.y;
                limits.b = size.x - startPos.x;

                break;

            case 4:
            case 5:

                limits.a = size.x - startPos.x;
                limits.b = size.z - startPos.z;

                break;
        }

        return limits;
    }

    createValues(orientation,x,y,z,a = 0,b = 0)
    {
        switch (orientation)
        {
            case 0:
            case 1:
                return {
                    x: x,
                    y: y + a,
                    z: z + b
                }

            case 2:
            case 3:
                return {
                    x: x + b,
                    y: y + a,
                    z: z
                }

            case 4:
            case 5:
                return {
                    x: x + a,
                    y: y,
                    z: z + b
                }

            default:
                return {
                    x: x,
                    y: y,
                    z: z
                }
        }
    }

    createCompValues(orientation,x,y,z,a = 0,b = 0)
    {
        const value = this.createValues(orientation,x,y,z,a,b);

        switch (orientation)
        {
            case 0:
                value.x += 1;
                break;

            case 1:
                value.x -= 1;
                break;

            case 2:
                value.z += 1;
                break;

            case 3:
                value.z -= 1;
                break;

            case 4:
                value.y += 1;
                break;

            case 5:
                value.y -= 1;
                break;
        }

        return value;

    }


    renderSide(x,y,z,width,height,orientation, end) {
        const side = document.createElement('div');
        side.className = 'faceV2 orientation' + orientation + (orientation > 3 ? ' floorTexture' : ' wallTexture');

        side.style.setProperty('--x', (x * 100) + 'px');

        if(orientation < 4)
            side.style.setProperty('--y', -(y * 100) + 'px');
        else
            side.style.setProperty('--y', -((y - (height - 1)) * 100) + 'px');

        if(orientation < 2)
            side.style.setProperty('--z', ((width + z) * 100) + 'px');
        else if(orientation < 4)
            side.style.setProperty('--z', ((z) * 100) + 'px');
        else
            side.style.setProperty('--z', ((width + z) * 100) + 'px');


        side.style.setProperty('--width', (width * 100) + 'px');
        side.style.setProperty('--height', (height * 100) + 'px');


        side.setAttribute('side', String(orientation));

        return side;

    }

    updatePosition(properties)
    {

        if(!(properties.x === this.cssProperties.x))
        {
            this.cssProperties.x = properties.x;
            this._camera.style.setProperty('--x', -properties.x * 100 + 'px');
        }
        if(!(properties.y === this.cssProperties.y))
        {
            this.cssProperties.y = properties.y;
            this._camera.style.setProperty('--y', properties.y * 100 + 'px');
        }
        if(!(properties.z === this.cssProperties.z))
        {
            this.cssProperties.z = properties.z;
            this._camera.style.setProperty('--z', -properties.z * 100 + 'px');
        }
        if(!(properties.rotX === this.cssProperties.rotX))
        {
            this.cssProperties.rotX = properties.rotX;
            this._camera.style.setProperty('--rotX', properties.rotX + 'rad');
        }
        if(!(properties.rotY === this.cssProperties.rotY))
        {
            this.cssProperties.rotY = properties.rotY;
            this._camera.style.setProperty('--rotY', properties.rotY + 'rad');
        }

        this.updatePortalInside();
    }

    updatePortalInside()
    {
        for(let i = 0; i < this.portals.length; ++i)
        {

            const dif = {
                px: 0,
                py: 0,
                p: 0
            }
            const camera = this.portals[i];
            let distX;
            let distY;
            let distZ;
            switch(this.portalPositions[i].side)
            {
                case 0:

                    distX = (this.portalPositions[i].x + 1) - this.cssProperties.x
                    distY = (this.portalPositions[i].y + 2) - this.cssProperties.y
                    distZ = this.portalPositions[i].z - this.cssProperties.z;
                    dif.px = distX;
                    dif.py = distY;
                    dif.p = distZ;


                    break;

                case 1:

                    distX = (this.portalPositions[i].x + 1) - this.cssProperties.x
                    distY = (this.portalPositions[i].y + 2) - this.cssProperties.y
                    distZ = this.cssProperties.z - (this.portalPositions[i].z + 1) ;
                    dif.px = -distX + 1;
                    dif.py = distY;
                    dif.p = distZ;


                    break;

                case 2:

                    distX = (this.portalPositions[i].z + 1) - this.cssProperties.z
                    distY = (this.portalPositions[i].y + 2) - this.cssProperties.y
                    distZ =  this.portalPositions[i].x - this.cssProperties.x;
                    dif.px = -distX + 1;
                    dif.py = distY;
                    dif.p = distZ;

                    break;

                case 3:

                    distX = (this.portalPositions[i].z + 1) - this.cssProperties.z
                    distY = (this.portalPositions[i].y + 2) - this.cssProperties.y
                    distZ =  this.cssProperties.x - this.portalPositions[i].x - 1;
                    dif.px = distX;
                    dif.py = distY;
                    dif.p = distZ;

                    break;
            }


            if(camera)
            {
                camera.style.perspectiveOrigin = Tools.posToCSS((dif.px)) + ' ' + Tools.posToCSS(dif.py);
                camera.style.perspective = Tools.posToCSS(dif.p);
            }


        }
    }

    createProjectile(pos, rot, type)
    {
        let extraClass = '';
        if(type === Projectile.TYPE_BLUE)
            extraClass = 'projectileBlue';
        else if(type === Projectile.TYPE_ORANGE)
            extraClass = 'projectileOrange';
        else if(type === Projectile.TYPE_SHURIKEN)
            extraClass = 'projectileShuriken';


        const elem = document.createElement('div');

        elem.className = 'projectile ' + extraClass;
        elem.style.setProperty('--x', Tools.posToCSS(pos.x));
        elem.style.setProperty('--y', Tools.posToCSS((pos.y)));
        elem.style.setProperty('--z', Tools.posToCSS(pos.z));
        elem.style.setProperty('--rotX', -rot.x + 'rad');
        elem.style.setProperty('--rotY', -rot.y + 'rad');
        this._scene.appendChild(elem);

        this.projectiles.push(elem)
    }

    updateProjectile(id, pos)
    {
        const elem = this.projectiles[id];
        elem.style.setProperty('--x', Tools.posToCSS(pos.x));
        elem.style.setProperty('--y', Tools.posToCSS(pos.y));
        elem.style.setProperty('--z', Tools.posToCSS(pos.z));
    }

    removeProjectile(id)
    {
        const proj = this.projectiles[id];
        proj.parentElement.removeChild(proj);
        delete this.projectiles[id];
    }
}