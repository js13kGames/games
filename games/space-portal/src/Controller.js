export class Controller
{
    constructor(camera)
    {

        this._camera = camera;

        this.keyDown = {
            left: false,
            right: false,
            forward: false,
            backward: false,
            ascend: false,
            descend: false,
            jump: false,
            lmb: false,
            rmb: false,
            mmb: false
        }

        this.movement = {
            x: 0,
            y: 0,
            z: 0
        }

        this.createKeyBinds();

        window.addEventListener('keydown', (e) => {this.keyDownEvent(e.code)});
        window.addEventListener('keyup', (e) => {this.keyUpEvent(e.code)});
        window.addEventListener('mousedown', (e) => {this.onMouseDown(e.button)});
        window.addEventListener('mouseup', (e) => {this.onMouseUp(e.button)});


        this.mousetracking = false;
        this.rotation = {
            x: 0,
            y: 0
        }


        this.mouseArea = document.querySelector('#mousearea');
        this.mouseArea.addEventListener('dblclick', ()=>{this.onPointerLockRequest()});
        document.addEventListener('pointerlockchange', ()=>this.onPointerLockChange());
        window.addEventListener('mousemove', e => {this.onMouseMove(e)});

    }

    addJumpEvent(funct)
    {
        this._onJump = funct;
    }

    createKeyBinds()
    {
        this.keybinds = {
            left: 'KeyA',
            right: 'KeyD',
            forward: 'KeyW',
            backward: 'KeyS',
            ascend: 'KeyE',
            descend: 'KeyQ',
            jump: 'Space'
        }
    }

    onPointerLockRequest()
    {
        this._camera.requestPointerLock();
    }
    onPointerLockChange()
    {
        this.mousetracking = !(document.pointerLockElement === null);
    }
    onMouseMove(e)
    {
        if(this.mousetracking)
        {
            this.rotation.x += (e.movementX / 275);
            this.rotation.y -= (e.movementY / 275);
        }
    }

    onMouseDown(button)
    {
        switch (button)
        {
            case 0:

                this.keyDown.lmb = true;
                break;


            case 2:

                this.keyDown.rmb = true;
                break;
        }
    }

    onMouseUp(button)
    {
        switch (button)
        {
            case 0:

                this.keyDown.lmb = false;
                break;


            case 2:

                this.keyDown.rmb = false;
                break;
        }
    }

    resetRotation()
    {
        this.rotation.x = this.rotation.y = 0;
    }

    keyDownEvent(code)
    {
        switch (code)
        {
            case this.keybinds.left:
                if(!this.keyDown.left)
                {
                    this.keyDown.left = true;
                    this.movement.x += -1;
                    this.movementUpdated();
                }
                break;

            case this.keybinds.right:
                if(!this.keyDown.right)
                {
                    this.keyDown.right = true;
                    this.movement.x += 1;
                    this.movementUpdated();
                }
                break;

            case this.keybinds.forward:
                if(!this.keyDown.forward)
                {
                    this.keyDown.forward = true;
                    this.movement.z += -1;
                    this.movementUpdated();
                }
                break;

            case this.keybinds.backward:
                if(!this.keyDown.backward)
                {
                    this.keyDown.backward = true;
                    this.movement.z += 1;
                    this.movementUpdated();
                }
                break;



            case this.keybinds.jump:

                if(this._onJump)
                    this._onJump();

                break;
        }
    }

    keyUpEvent(code)
    {
        switch (code)
        {
            case this.keybinds.left:

                if(this.keyDown.left)
                {
                    this.movement.x -= -1;
                    this.movementUpdated();
                }
                this.keyDown.left = false;

                break;

            case this.keybinds.right:
                if(this.keyDown.right)
                {
                    this.movement.x -= 1;
                    this.movementUpdated();
                }
                this.keyDown.right = false;

                break;

            case this.keybinds.forward:
                if(this.keyDown.forward)
                {
                    this.movement.z -= -1;
                    this.movementUpdated();
                }
                this.keyDown.forward = false;

                break;

            case this.keybinds.backward:
                if(this.keyDown.backward)
                {
                    this.movement.z -= 1;
                    this.movementUpdated();
                }
                this.keyDown.backward = false;

                break;

            case this.keybinds.ascend:


        }
    }

    movementUpdated()
    {

    }
}