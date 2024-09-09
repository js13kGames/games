import {MapData} from "./MapData.js";
import {Renderer} from "./Renderer.js";
import {Controller} from "./Controller.js";
import {Player} from "./Player.js";
import {Projectile} from "./Projectile.js";
import {Portal} from "./Portal.js";

export class Game
{
    constructor()
    {
        this._renderer = new Renderer(document.querySelector('#camera'));

        this._controller = new Controller(document.querySelector('#camera'));

        this._player = new Player();
        this._player.addWinCallback(()=>this.win())

        this._controller.addJumpEvent(() => this._player.jump());

        this._projectiles = [];

        this._currentMap = 0;

        this._previousTimestamp = Date.now();

        this._portals = [
            new Portal(Portal.TYPE_BLUE),
            new Portal(Portal.TYPE_ORANGE)
        ];

        this.loop();

        this.gameRunning = false;

        window.game = this;

        this.buildMaps();

    }

    loadLevel(id)
    {
        document.getElementById('menu').hidden = true;
        document.getElementById('win').hidden = true;
       this._renderer.loadMap(this._mapData[id]);
        this._renderer.createPortals();
        this.gameRunning = true;
        const pos = this._mapData[id].startingPosition;
        this._player.teleportTo(pos)
        this._portals[0].reset();
        this._portals[1].reset();
        this._currentMap = id;
    }



    buildMaps()
    {

        function createFrame(x2,y2,z2,z3=-1)
        {
            const map = [];
            for(let x = 0; x < x2; ++x)
            {
                map[x] = [];
                for(let y = 0; y < y2; ++y)
                {
                    map[x][y] = [];
                    for(let z = 0; z < z2; ++z)
                    {
                        map[x][y][z] = ((y === 0 || y === y2-1) || (x === 0 || x === x2-1) || (z === 0 || z === z2-1 || z === z3 || z === z3 - 1)) ? MapData.BLOCK_WALL : MapData.BLOCK_EMPTY;
                    }
                }
            }

            return map;
        }

        const a = (i,x,y,z,b=MapData.BLOCK_WALL) => this._mapData[i].updateAtPosition(x,y,z,b);


        this._mapData = [];
        this._mapData[0] = new MapData(createFrame(10,9,10), {x:5,y:3,z:1}, {x:4,y:5,z:4}, 240);

        a(0,6,6,6);
        a(0,1,5,5);
        a(0,1,6,5);
        a(0,1,5,6);
        a(0,5,4,5);
        a(0,5,4,4);
        a(0,7,4,4);
        a(0,5,4,3);
        a(0,3,4,5);
        a(0,3,4,4);
        a(0,3,4,3);
        a(0,4,4,3);
        a(0,4,4,5);

        a(0,1,1,1);
        a(0,1,4,1);
        a(0,8,2,8);


        this._mapData[1] = new MapData(createFrame(5,20,5), {x:2,y:3,z:2},{x:2,y:13,z:2}, 120);

        a(1,2,4,2);
        a(1,2,4,1);
        a(1,1,4,2);
        a(1,1,4,1);
        a(1,3,4,1);
        a(1,3,4,2);


        a(1,2,8,2);
        a(1,2,8,3);
        a(1,3,8,2);
        a(1,3,8,3);
        a(1,1,8,3);
        a(1,1,8,2);


        a(1,2,12,2);
        a(1,2,12,1);


        this._mapData[2] = new MapData(createFrame(15,15,11, 7), {x:7,y:3,z:3},{x:1,y:11,z:9}, 0);


        for(let i = 0; i < 4; ++i)for(let j = 0; j < 4; ++j) for(let k = 0; k < j; ++k)
        {
            a(2,1 + j,1 + k,1 + i);
        }

        for(let i = 0; i < 13; ++i)
            a(2,1+i, 10, 3)

        a(2,6,8,7,0);
        a(2,6,8,6,0);
        a(2,2,1,2);
        a(2,4,2,2);
        a(2,4,3,3);
        a(2,6,4,3);

        a(2,1,10,8);
        a(2,1,10,9);


        a(2,4,10,9);
        a(2,7,10,8);
        a(2,5,10,9);


    }




    win()
    {
        setTimeout(()=>document.getElementById('menu').hidden = false,3000);
        document.getElementById('win').hidden = false;
        this.gameRunning = false;
        console.log('WON');
    }

    placePortal(type, block, side, mapData)
    {
        let canPlace = false;
        if(mapData.blockAt(block.x, block.y + 1, block.z) === MapData.BLOCK_WALL)
        {
            const j = type ? 0 : 1;
            if(!(this._portals[j].side === side && this._portals[j].pos.x === block.x && this._portals[j].pos.z === block.z && Math.abs(this._portals[j].pos.y - block.y) <= 1))
            {
                let xN = 0;
                let zN = 0;
                if(side === 0)
                    zN = -1;
                else if(side === 1)
                    zN = 1;
                else if(side === 2)
                    xN = -1;
                else if(side === 3)
                    xN = 1;

                const before1 = mapData.blockAt(block.x + xN, block.y, block.z + zN);
                const before2 = mapData.blockAt(block.x + xN, block.y + 1, block.z + zN);
                if(before1 === before2 && (before1 === MapData.BLOCK_EMPTY || before1 === MapData.BLOCK_VOID))
                {
                    canPlace = true;
                }
            }


        }
        if(canPlace)
        {
            this._portals[type].updatePosition(block, side);
            this._renderer.placePortal(type, block, side, this._mapData[this._currentMap], this._portals[type !== Portal.TYPE_BLUE ? Portal.TYPE_BLUE : Portal.TYPE_ORANGE]);
            this._renderer.refrestPortalInsides(this._portals, this._mapData[this._currentMap])
        }

    }

    loop()
    {

        const currentTimestamp = Date.now();
        const delta = Math.min(1000, currentTimestamp - this._previousTimestamp);
        this._previousTimestamp = currentTimestamp;

        if(this.gameRunning)
        {
            this._player.move(this._controller.movement, this._controller.rotation, delta, this._mapData[this._currentMap], this._portals)
            this._controller.resetRotation();
            this._renderer.updatePosition(this._player.getProperties());

            for(let i = 0; i < this._projectiles.length; ++i) if(this._projectiles[i] !== undefined)
            {
                const proj = this._projectiles[i]
                proj.move(delta);
                this._renderer.updateProjectile(i , this._projectiles[i].pos);

                if(proj.destinationReached)
                {
                    if(proj.portalSide > -1 && proj.type !== Projectile.TYPE_SHURIKEN)
                    {
                        this.placePortal(proj.type, proj.currentBlock, proj.portalSide, this._mapData[this._currentMap]);
                    }

                    if(proj.type !== Projectile.TYPE_SHURIKEN)
                        this._renderer.removeProjectile(i);
                    delete this._projectiles[i];
                }

            }

            this._player.shootCooldown = Math.max(0, this._player.shootCooldown - delta);
            if((this._controller.keyDown.lmb || this._controller.keyDown.rmb || this._controller.keyDown.mmb) && this._player.shootCooldown === 0)
            {
                let portalType
                if(this._controller.keyDown.lmb)
                    portalType = Projectile.TYPE_BLUE;
                else if(this._controller.keyDown.rmb)
                    portalType = Projectile.TYPE_ORANGE;
                else if(this._controller.keyDown.mmb)
                    portalType = Projectile.TYPE_SHURIKEN;



                const newProjectile = new Projectile({x: this._player.x, y: this._player.y, z: this._player.z}, {x: this._player.rotX, y: this._player.rotY}, portalType,  this._mapData[this._currentMap]);
                this._renderer.createProjectile(newProjectile.pos, newProjectile.rot, newProjectile.type);

                this._projectiles.push(newProjectile);

                this._player.shootCooldown = 500;
            }

        }


        const this2 = this;
        window.requestAnimationFrame(function (){this2.loop()});
    }
}