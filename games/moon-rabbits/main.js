// #region Open / Close
var Item = {
    metal : 0,
    plastic : 0,
    glass : 0,
    rubber : 0,
    carrot : 0
}
var Compound = {
    core : 0,
    parts : 0,
    fuel : 0,
    gather : 0
}
var Input = {
    core : 0,
    parts : 0,
    fuel : 0
}
var queue_log;
class NumRabbits {
    constructor() {
        this.working = 0;
        this.together = 2;
    }
    getWorking() {
        return this.working;
    }
    getTogether() {
        return this.together;
    }
    getRemains() {
        return this.together - this.working;
    }
}
var iCurRabbits;
function Open() {
    // :: Reset : Rabbit
    iCurRabbits = new NumRabbits();
    ShowRabbits();

    // :: Reset : Item
    ResetItem();
    
    // :: Reset : Compound
    ResetCompound();
    
    // :: Reset : Area
    ResetSec(eArea.field);
    ResetSec(eArea.plantation);
    ResetSec(eArea.city);

    // :: Reset : Input
    ResetInput();
    
    // :: Reset : Percent
    this.percent_rocket = 0;
    this.iExtraPercent = 0;
    count_return_rocket = 0;

    // :: Reset : Level
    this.iLevel_City = 0;
    this.iLevel_Plantation = 0;
    this.iLevel_Field = 0;

    // :: Reset : Quest
    UpdateStatus_Quest();
    document.getElementById("quest_mother").style.display = "none";
    document.getElementById("quest_father").style.display = "none";
    
    // :: Log
    queue_log = new Queue();

    // :: Button : Mouse Over
    SetMouseOver();

    // :: UI
    UpdateUI();
    UpdateText_Compound();
    UpdateText_PlantationEa();
    UpdateText_CityEa();
    UpdateText_FieldEa();
    UpdateStatus_BuildRocket();
}
function ShowEnding() {
    var scene =
`
<pre id="ending_center">


THANK YOU FOR PLAYING!



















    ▲
    ▲■▲
    ■□■
    ■□■
<em id="field_ending_rabbits">🐇🐇🐇🐇</em>
<em class="color_moon">#####################
###############################
###############################################
###########################################################
###################################################################
#########################################################################
###################################################################################
############################################################################################
#################################################################################################
#########################################################################################################
#############################################################################################################
##################################################################################################################
######################################################################################################################
##########################################################################################################################</em>
            </pre>
`;

    document.getElementById("field_body")
    .innerHTML = scene;
}
function ShowScene_Launch(num) {
    var scene_1 =
`
<pre id="scene_1">

















▲
▲■▲
■□■
■□■
■■■
□□□
■■■
<em id="effect_fire_1" class="effect_fire">###</em>
=======
                </pre>
`;
    var scene_2 =
`

<pre id="scene_2">











▲
▲■▲
■□■
■□■
■■■
□□□
<em id="effect_fire_2" class="effect_fire">###</em>

                </pre>
`;

var scene_3 =
`
<pre id="scene_3">
<em class="color_moon">=============================================
========================================
================================
==================</em>




▲
▲■▲
■□■
■□■
■■■
□□□
<em id="effect_fire_3" class="effect_fire">###</em>

</pre>
`;


    var field = document.getElementById("field_display_center");
    switch(num) {
        case 1:
            off_scene02();
            field.innerHTML = scene_1;
            DoFire("effect_fire_1");
            break;
        case 2:
            field.innerHTML = scene_2;
            DoFire("effect_fire_2");
            break;
        case 3:
            field.innerHTML = scene_3;
            DoFire("effect_fire_3");
            break;
    }
}
var interval_fire;
function DoFire(text) {
    clearInterval(interval_fire);
    var fire_check = true;
    interval_fire = setInterval(() => {
        if(fire_check) {
            document.getElementById(text)
            .innerHTML = "###";
            fire_check = false;
        } else {
            document.getElementById(text)
            .innerHTML = "***";
            fire_check = true;
        }
    }, 1000);
}
function OffFire() {
    clearInterval(interval_fire);
}
// #endregion

//#region Rabbits
function ShowRabbits() {
    var doc = document.getElementById("field_rabbit");
    doc.innerHTML = "";
    doc.innerHTML = 
        iCurRabbits.getTogether() == 2 ? "🐇🐇" : 
        iCurRabbits.getTogether() == 3 ? "🐇🐇🐇" : "🐇🐇🐇🐇";
}
//#endregion

//#region MouseOver
var cColor = {
    work : "#FC5130",
    can : "#1A2656",
    cant : "#000000",
    complete : "#AA9102"
}
function SetMouseOver() {
    var BUTTON_Field_Plantation = document.getElementById("button_city");
    BUTTON_Field_Plantation.style.backgroundColor = cColor.can;

    var BUTTON_Field_Plantation = document.getElementById("button_plantation");
    BUTTON_Field_Plantation.style.backgroundColor = cColor.can;

    var BUTTON_Field_Plantation = document.getElementById("button_field");
    BUTTON_Field_Plantation.style.backgroundColor = cColor.can;
}
//#endregion

// #region Reset
function ResetItem() {
    Item.metal = 0;
    Item.plastic = 0;
    Item.glass = 0;
    Item.rubber = 0;
    Item.carrot = 0;

    UpdateUI();
}
function ResetCompound() {
    Compound.core = 0;
    Compound.parts = 0;
    Compound.fuel = 0;
}
function ResetInput() {
    Input.core = 0;
    Input.parts = 0;
    Input.fuel = 0;
    
    this.UpdateUI();
}
// #endregion

// #region Go
const eArea = {
    field : 1,
    plantation : 2,
    city : 3
}
const pAreaSec = {
    field : "field_sec_field",
    plantation : "field_sec_plantation",
    city : "field_sec_city"
}

var iLevel_Plantation;
const dPlantation = {
    0 : {
        min : 1,
        max : 3,
        Need : {
            core : 2,
            parts : 3,
            fuel : 1
        }
    },
    1 : {
        min : 2,
        max : 6,
        Need : {
            core : 4,
            parts : 5,
            fuel : 3
        }
    },
    2 : {
        min : 6,
        max : 24,
        Need : {
            core : 6,
            parts : 7,
            fuel : 5
        }
    },
    3 : {
        min : 12,
        max : 48,
        Need : {
            core : 9999,
            parts : 9999,
            fuel : 9999
        }
    }
}
function GoToPlantation() {
    if(iCurRabbits.getRemains() <= 0) {
        return;
    } else {
        iCurRabbits.working += 1;
    }
    // :: Metal
    var BUTTON_Field = document.getElementById("button_plantation");
    BUTTON_Field.disabled = true;
    BUTTON_Field.style.backgroundColor = cColor.work;
    this.WaitAndDo(eArea.plantation, () => {

        // :: Rubber
        var rubber = this.GetRandom(dPlantation[iLevel_Plantation].min, dPlantation[iLevel_Plantation].max);
        AddItem(eItem.rubber, rubber);
    
        queue_log.enqueue("[PLANTATION] Rubber : " + rubber);
        UpdateText_Log();

        BUTTON_Field.style.backgroundColor = cColor.can;
        BUTTON_Field.disabled = false;

        iCurRabbits.working -= 1;
    });
}
function UpdateText_PlantationEa() {
    document.getElementById("field_plantation_ea").innerHTML = 
        dPlantation[iLevel_Plantation].min + "~" + dPlantation[iLevel_Plantation].max + " ea";
}

var iLevel_City;
const dCity = {
    0 : {
        min : 2,
        max : 6,
        Need : {
            core : 3,
            parts : 1,
            fuel : 2
        }
    },
    1 : {
        min : 4,
        max : 12,
        Need : {
            core : 5,
            parts : 3,
            fuel : 4
        }
    },
    2 : {
        min : 6,
        max : 24,
        Need : {
            core : 7,
            parts : 5,
            fuel : 6
        }
    },
    3 : {
        min : 12,
        max : 48,
        Need : {
            core : 9999,
            parts : 9999,
            fuel : 9999
        }
    }
}
function GoToCity() {
    if(iCurRabbits.getRemains() <= 0) {
        return;
    } else {
        iCurRabbits.working += 1;
    }

    // :: Plastic
    var BUTTON_Field = document.getElementById("button_city");
    BUTTON_Field.disabled = true;
    BUTTON_Field.style.backgroundColor = cColor.work;
    this.WaitAndDo(eArea.city, () => {

        var metal = this.GetRandom(dCity[iLevel_City].min, dCity[iLevel_City].max);
        AddItem(eItem.metal, metal);
        
        var glass = this.GetRandom(dCity[iLevel_City].min, dCity[iLevel_City].max);
        AddItem(eItem.glass, glass);

        var plastic = this.GetRandom(dCity[iLevel_City].min, dCity[iLevel_City].max);
        AddItem(eItem.plastic, plastic);
    
        queue_log.enqueue("[CITY] Metal : " + metal 
        + " / Glass : " + glass + " / Plastic : " + plastic);
        UpdateText_Log();

        BUTTON_Field.style.backgroundColor = cColor.can;
        BUTTON_Field.disabled = false;

        iCurRabbits.working -= 1;
    });
}
function UpdateText_CityEa() {
    document.getElementById("field_city_ea").innerHTML = 
        dCity[iLevel_City].min + "~" + dCity[iLevel_City].max + " ea";
}

var iLevel_Field;
const dField = {
    0 : {
        min : 1,
        max : 3,
        Need : {
            core : 1,
            parts : 2,
            fuel : 3
        }
    },
    1 : {
        min : 2,
        max : 6,
        Need : {
            core : 3,
            parts : 4,
            fuel : 5
        }
    },
    2 : {
        min : 6,
        max : 24,
        Need : {
            core : 5,
            parts : 6,
            fuel : 7
        }
    },
    3 : {
        min : 12,
        max : 48,
        Need : {
            core : 9999,
            parts : 9999,
            fuel : 9999
        }
    }
}
function GoToField() {
    if(iCurRabbits.getRemains() <= 0) {
        return;
    } else {
        iCurRabbits.working += 1;
    }

    // :: Glass
    var BUTTON_Field = document.getElementById("button_field");
    BUTTON_Field.disabled = true;
    BUTTON_Field.style.backgroundColor = cColor.work;
    this.WaitAndDo(eArea.field, () => {
    
        // :: Carrot
        var carrot = this.GetRandom(dField[iLevel_Field].min, dField[iLevel_Field].max);
        AddItem(eItem.carrot, carrot);
    
        queue_log.enqueue("[FIELDS] Carrot : " + carrot);
        UpdateText_Log();

        BUTTON_Field.style.backgroundColor = cColor.can;
        BUTTON_Field.disabled = false;

        iCurRabbits.working -= 1;
    });
}
function UpdateText_FieldEa() {
    document.getElementById("field_field_ea").innerHTML = 
        dField[iLevel_Field].min + "~" + dField[iLevel_Field].max + " ea";
}


function GetRandom(min, max) {
    return Math.floor((Math.random() * (max - min + 1)) + min);
}
function WaitAndDo(rArea, Do) {
    // 2초 간격으로 메시지를 보여줌
    var index = 0;
    var count = GetSec(rArea);
    SetSec(rArea, count, index);
    let timerId = setInterval(() => {
        index += 1;
        SetSec(rArea, count, index);
        if(index >= count) {
            clearInterval(timerId);
            Do();
            ResetSec(rArea);
        }
    }, 1000);
}
function GetSec(rArea) {
    switch(rArea) {
        case eArea.field:
            return 2;
        case eArea.plantation:
            return 2;
        case eArea.city:
            return 2;
    }
}
function ResetSec(rArea) {
    SetSec(rArea, GetSec(rArea), 0);
}
function SetSec(rArea, count, index) {
    switch(rArea) {
        case eArea.field:
            document.getElementById(pAreaSec.field).innerHTML
            = (count - index) + " sec";
            break;
        case eArea.plantation:
            document.getElementById(pAreaSec.plantation).innerHTML
            = (count - index) + " sec";
            break;
        case eArea.city:
            document.getElementById(pAreaSec.city).innerHTML
            = (count - index) + " sec";
            break;
    }
}
// #endregion

// #region UI
function UpdateUI() {
    // :: Item
    this.UpdateItem(eItem.metal);
    this.UpdateItem(eItem.plastic);
    this.UpdateItem(eItem.glass);
    this.UpdateItem(eItem.rubber);
    this.UpdateItem(eItem.carrot);
    
    // :: Compound
    
    // :: Input
    UpdateInput(eCompound.core);
    UpdateInput(eCompound.parts);
    UpdateInput(eCompound.fuel);
    
    // :: Rocket
    this.UpdatePercent_Rocket();
}
// #endregion

// #region Item
const eItem = {
    metal : 1,
    plastic : 2,
    glass : 3,
    rubber : 4,
    carrot : 5
}
const pItem = {
    metal : "item_metal",
    plastic : "item_plastic",
    glass : "item_glass",
    rubber : "item_rubber_tree",
    carrot : "item_tree"
}
function AddItem(eType, addItem) {
    switch(eType) {
        case eItem.metal:
            Item.metal += addItem;
            break;
        case eItem.plastic:
            Item.plastic += addItem;
            break;
        case eItem.glass:
            Item.glass += addItem;
            break;
        case eItem.rubber:
            Item.rubber += addItem;
            break;
        case eItem.carrot:
            Item.carrot += addItem;
            break;
    }
    this.UpdateItem(eType);
    UpdateText_Compound();
}
function GetItem(eType) {
    switch(eType) {
        case eItem.metal:
            return Item.metal;
        case eItem.plastic:
            return Item.plastic;
        case eItem.glass:
            return Item.glass;
        case eItem.rubber:
            return Item.rubber;
        case eItem.carrot:
            return Item.carrot;
    }
}
function UpdateItem(eType) {
    var TEXT_Field;
    switch(eType) {
        case eItem.metal:
            TEXT_Field = document.getElementById(pItem.metal);
            break;
        case eItem.plastic:
            TEXT_Field = document.getElementById(pItem.plastic);
            break;
        case eItem.glass:
            TEXT_Field = document.getElementById(pItem.glass);
            break;
        case eItem.rubber:
            TEXT_Field = document.getElementById(pItem.rubber);
            break;
        case eItem.carrot:
            TEXT_Field = document.getElementById(pItem.carrot);
            break;
    }
    TEXT_Field.innerHTML = this.GetItem(eType);
}
// #endregion


//#region Compound
const eCompound = {
    core : 101,
    parts : 102,
    fuel : 103
}
const pCompound = {
    core : "compound_core",
    parts : "compound_parts",
    fuel : "compound_fuel"
}
const pCompoundButton = {
    core : "button_comp_core",
    parts : "button_comp_parts",
    fuel : "button_comp_fuel"
}
function GetCompound(eType) {
    switch(eType) {
        case eCompound.core:
            return Compound.core;
        case eCompound.parts:
            return Compound.parts;
        case eCompound.fuel:
            return Compound.fuel;
    }
}
var isFirstCompound = false;
function AddCompound(eType, addValue) {
    switch(eType) {
        case eCompound.core:
            Compound.core += addValue;
            if(Compound.core < Input.core)
                Input.core = Compound.core;
            break;
        case eCompound.parts:
            Compound.parts += addValue;
            if(Compound.parts < Input.parts)
                Input.parts = Compound.parts;
            break;
        case eCompound.fuel:
            Compound.fuel += addValue;
            if(Compound.fuel < Input.fuel)
                Input.fuel = Compound.fuel;
            break;
    }
    if(addValue > 0) {
        Compound.gather += addValue;
        if(Compound.gather >= 2
            && iCurRabbits.together < 3) {
            document.getElementById("quest_mother").style.display = "";
        }
        if(!isFirstCompound) {
            scene02_ingame();
            isFirstCompound = true;
        }
    }
    UpdateInput(eType);
}
function UpdateCompound(eType) {
}
//#endregion

//#region Input
const pInput = {
    core : "input_core",
    parts : "input_parts",
    fuel : "input_fuel"
}
function GetInput(eType) {
    switch(eType) {
        case eCompound.core:
            return Input.core;
        case eCompound.parts:
            return Input.parts;
        case eCompound.fuel:
            return Input.fuel;
    }
}
function AddInput(eType, addValue) {
    switch(eType) {
        case eCompound.core:
            Input.core += addValue;
            if(Input.core < 0)
                Input.core = 0;
            if(Input.core > Compound.core)
                Input.core = Compound.core;
            break;
        case eCompound.parts:
            Input.parts += addValue;
            if(Input.parts < 0)
                Input.parts = 0;
            if(Input.parts > Compound.parts)
                Input.parts = Compound.parts;
            break;
        case eCompound.fuel:
            Input.fuel += addValue;
            if(Input.fuel < 0)
                Input.fuel = 0;
            if(Input.fuel > Compound.fuel)
                Input.fuel = Compound.fuel;
            break;
    }
    
    UpdateText_Log();
    UpdateInput(eType);
}
function UpdateInput(eType) {
    var TEXT_Field;
    switch(eType) {
        case eCompound.core:
            TEXT_Field = document.getElementById(pInput.core);
            break;
        case eCompound.parts:
            TEXT_Field = document.getElementById(pInput.parts);
            break;
        case eCompound.fuel:
            TEXT_Field = document.getElementById(pInput.fuel);
            break;
    }
    TEXT_Field.innerHTML = this.GetInput(eType) + "/" + this.GetCompound(eType);
    UpdateStatus_BuildRocket();
}
//#endregion

// #region Compound : Steel
function CompoundItem_Steel() {
    var metalCompNum = parseInt(Item.metal / 15);
    var plasticCompNum = parseInt(Item.plastic / 20);

    var min = Math.min(metalCompNum, plasticCompNum);

    if(min <= 0)
        return;
    
    AddItem(eItem.metal, -min * 15);
    AddItem(eItem.plastic, -min * 20)
    AddCompound(eCompound.core, min);
    
    Input.core = Compound.core;
    
    UpdateInput(eCompound.core);

    queue_log.enqueue("&lt;COMPONENT&gt;<br />Metal : " + metalCompNum * 15
    + " / Plastic : " + plasticCompNum + " => Steel x" + metalCompNum);
    
    UpdateText_Log();
    UpdateText_Compound();
}
function UpdateText_CompoundSteel() {
    var TEXT_Field = document.getElementById(pCompoundButton.core);
    TEXT_Field.innerHTML
    = "Metal " + Item.metal + "/15" + " : Plastic " + Item.plastic + "/20";

    if(Item.metal >= 15 && Item.plastic >= 20)
        TEXT_Field.style.backgroundColor = cColor.can;
    else
        TEXT_Field.style.backgroundColor = cColor.cant;
}
// #endregion

// #region Compound : Fiber
function CompoundItem_Fiber() {
    var glassCompNum = parseInt(Item.glass / 15);
    var rubberTreeCompNum = parseInt(Item.rubber / 10);
    var metalCompNum = parseInt(Item.metal / 5);
    
    var min = Math.min(metalCompNum, glassCompNum, rubberTreeCompNum);

    if(min <= 0)
        return;

    AddItem(eItem.glass, -min * 15);
    AddItem(eItem.rubber, -min * 10);
    AddItem(eItem.metal, -min * 5);
    
    AddCompound(eCompound.parts, min);
    
    
    Input.parts = Compound.parts;
    
    UpdateInput(eCompound.parts);

    queue_log.enqueue("&lt;COMPONENT&gt;<br />Glass : " + min * 15 + " / Rubber : " + min * 10 
    + " / Metal : " + min * 5
    + " => Fiber x" + min);
    
    UpdateText_Log();
    UpdateText_Compound();
}
function UpdateText_CompoundFiber() {
    var TEXT_Field = document.getElementById(pCompoundButton.parts);
    TEXT_Field.innerHTML
    = "Glass " + Item.glass + "/15 | "
    + "Rubber " + Item.rubber + "/10 | "
    + "Metal " + Item.metal + "/5";

    if(Item.glass >= 15
        && Item.rubber >= 10
        && Item.metal >= 5)
        TEXT_Field.style.backgroundColor = cColor.can;
    else
        TEXT_Field.style.backgroundColor = cColor.cant;
}
// #endregion

// #region Compound : Fuel
function CompoundItem_Fuel() {
    var treeCompNum = parseInt(Item.carrot / 10);

    if(treeCompNum <= 0)
        return;
    
    AddItem(eItem.carrot, -treeCompNum * 10);
    AddCompound(eCompound.fuel, treeCompNum);
    
    Input.fuel = Compound.fuel;
    
    UpdateInput(eCompound.fuel);

    queue_log.enqueue("&lt;COMPONENT&gt;<br />Carrot : " + treeCompNum * 10 + " => Fuel x" + treeCompNum);
    
    UpdateText_Log();
    UpdateText_Compound();
}
function UpdateText_CompoundFuel() {
    var TEXT_Field = document.getElementById(pCompoundButton.fuel);
    TEXT_Field.innerHTML
    = "Carrot " + Item.carrot + "/" + "10";

    if(Item.carrot >= 10)
        TEXT_Field.style.backgroundColor = cColor.can;
    else
        TEXT_Field.style.backgroundColor = cColor.cant;
}
// #endregion

// #region Compound
function CompoundItem() {
    this.CompoundItem_Steel();
    this.CompoundItem_Fiber();
    this.CompoundItem_Fuel();
}
function UpdateText_Compound() {
    UpdateText_CompoundSteel();
    UpdateText_CompoundFiber();
    UpdateText_CompoundFuel();
}
// #endregion

// #region Build Rocket
var percent_rocket;
var cNeed = {
    core : 10,
    parts : 20,
    fuel : 15
}
function UpdateStatus_BuildRocket() {
    if(Input.core <= 0
        || Input.parts <= 0
        || Input.fuel <= 0)
    {
        document.getElementById("button_build_rocket").style.backgroundColor = cColor.cant;
        return;
    }
    document.getElementById("button_build_rocket").style.backgroundColor = cColor.can;
}

var dPrev = {
    core : 0,
    parts : 0,
    fuel : 0,
    percent : 0
}
function BuildRocket() {
    if(Input.core <= 0
        || Input.parts <= 0
        || Input.fuel <= 0)
        return;
    
    if(percent_rocket > 0)
        return;

    // :: 여기 하는 중
    var checkCore = Input.core > cNeed.core ? cNeed.core - (Input.core - cNeed.core) : Input.core;
    var coreDif = (checkCore / cNeed.core) * 100;
    if(coreDif <= 0) {
        coreDif = 0;
    }

    var checkParts = Input.parts > cNeed.parts ? cNeed.parts - (Input.parts - cNeed.parts) : Input.parts;
    var partsDif = (checkCore / cNeed.parts) * 100;
    if(partsDif <= 0) {
        partsDif = 0;
    }

    var checkFuel = Input.fuel > cNeed.fuel ? cNeed.fuel - (Input.fuel - cNeed.fuel) : Input.fuel;
    var fuelDif = (checkFuel / cNeed.fuel) * 100;
    if(fuelDif <= 0) {
        fuelDif = 0;
    }

    percent_rocket = (coreDif + partsDif + fuelDif) / 3;
    percent_rocket = parseInt(percent_rocket);

    dPrev.core = Input.core;
    dPrev.parts = Input.parts;
    dPrev.fuel = Input.fuel;
    dPrev.percent = percent_rocket;
    
    UpdatePercent_Rocket();
    
    AddCompound(eCompound.core, -Input.core);
    AddCompound(eCompound.parts, -Input.parts);
    AddCompound(eCompound.fuel, -Input.fuel);
    ResetInput();

    queue_log.enqueue("ROCKET IS .......... READY!!!<br />MOON ARRIVAL PROBABILITY : " + percent_rocket + "%");
    UpdateText_Log();

    UpdateText_Compound();
    UpdateStatus_LaunchRocket();
}
function UpdatePercent_Rocket() {
    var TEXT_Rocket = document.getElementById('percent_rocket');
    var TEXT_Extra = document.getElementById('percent_extra');
    TEXT_Rocket.innerHTML = this.percent_rocket;

    if(iExtraPercent == 0) {
        TEXT_Extra.innerHTML = "";
    } else {
        TEXT_Extra.innerHTML = "+" + iExtraPercent + "%";
    }
}
function ResetPercent_Rocket() {
    percent_rocket = 0;
    UpdatePercent_Rocket();
    UpdateStatus_LaunchRocket();
}
// #endregion

// #region Launch Rocket
function UpdateStatus_LaunchRocket() {
    if(percent_rocket <= 0)
    {
        document.getElementById("button_launch_rocket").style.backgroundColor = cColor.cant;
        return;
    }
    document.getElementById("button_launch_rocket").style.backgroundColor = cColor.can;
}
var result_rocket = false;
var count_return_rocket = 0;
function LaunchRocket() {
    if(percent_rocket <= 0)
        return;

    var rand = Math.floor(Math.random() * 100) + 1;
    
    if(rand <= this.percent_rocket)
        this.result_rocket = true;
    else {
        this.result_rocket = false;
        if(!iComeFather) {
            if(count_return_rocket >= 1
                && iCurRabbits.together == 3) {
                document.querySelector("#quest_father").style.display = "";
                iComeFather = true;
            }
        }
    }
    
    this.ResetPercent_Rocket();

    queue_log.enqueue("Rocket Launched : " + (this.result_rocket ? "발사 성공" : "발사 실패"));
    UpdateText_Log();
}
// #endregion

//#region Class
class Queue {
    constructor() {
        this._arr = [];
    }
    copyFrom(arr) {
        this._arr = arr;
    }
    enqueue(item) {
        this._arr.push(item);
        if(this.count() > 5) {
            this.dequeue();
        }
    }
    dequeue() {
        return this._arr.shift();
    }
    count() {
        return this._arr.length;
    }
}
class Stack {
    constructor() {
      this._arr = [];
    }
    push(item) {
      this._arr.push(item);
    }
    pop() {
      return this._arr.pop();
    }
    peek() {
      return this._arr[this._arr.length - 1];
    }
  }
//#endregion

//#region Log
function UpdateText_Log() {
    var TEXT_Field = document.getElementById('field_story');

    var stringData = "";

    // :: Copy
    var copyQueue = new Queue();
    copyQueue.copyFrom(queue_log._arr.slice());

    // :: Change Stack
    var tempStack = new Stack();
    var count = copyQueue.count();
    for(var index = 0; index < count; index++) {
        tempStack.push(copyQueue.dequeue());
    }

    // :: String
    for(var index = 0; index < count; index++) {
        var tempString = tempStack.pop();
        if(tempString.includes('@')) {
            tempString = tempString.replace('@', '');
            stringData += `<div class="text_log text_important">${tempString}</div>`;
        } else {
            stringData += `<div class="text_log">${tempString}</div>`;
        }
    }
    
    if(TEXT_Field != null) {
        TEXT_Field.innerHTML = stringData;
        UpdateStatus_Quest();
    }
}
//#endregion

//#region Quest
function UpdateStatus_Quest() {
    UpdateStatus_QuestCity();
    UpdateStatus_QuestField();
    UpdateStatus_QuestPlantation();
    UpdateStatus_QuestMother();
    UpdateStatus_QuestFather();
}
function UpdateStatus_QuestCity() {
    var field = document.querySelector("#quest_upgrade_city");
    var field_mission = field.querySelector(".field_display_quest_mid");
    var field_need = field.querySelector(".field_display_quest_up");
    var field_result = field.querySelector(".field_display_quest_down");
    if(iLevel_City < 3) {
        field_need.innerHTML = "Use " 
            + "Core x" + dCity[iLevel_City].Need.core
            + " | Parts x" + dCity[iLevel_City].Need.parts
            + " | Fuel x" + dCity[iLevel_City].Need.fuel;
        field_mission.innerHTML = "Upgrade City Road Lv " + (iLevel_City + 1);
        field_result.innerHTML
            = dCity[iLevel_City].min + "~" + dCity[iLevel_City].max + " ea"
            + " → "
            + dCity[iLevel_City + 1].min + "~" + dCity[iLevel_City + 1].max + " ea";

        if(Compound.core >= dCity[iLevel_City].Need.core
            && Compound.parts >= dCity[iLevel_City].Need.parts
            && Compound.fuel >= dCity[iLevel_City].Need.fuel) {
            field.style.backgroundColor = cColor.can;
        } else {
            field.style.backgroundColor = cColor.cant;
        }

    } else {
        field_need.innerHTML = "Complete!"
        field_result.innerHTML
            = dCity[iLevel_City].min + "~" + dCity[iLevel_City].max;
        document.querySelector("#quest_upgrade_city").style.backgroundColor = cColor.complete;
    }
}
function UpdateStatus_QuestPlantation() {
    var field = document.querySelector("#quest_upgrade_plantation");
    var field_mission = field.querySelector(".field_display_quest_mid");
    var field_need = field.querySelector(".field_display_quest_up");
    var field_result = field.querySelector(".field_display_quest_down");
    if(iLevel_Plantation < 3) {
        field_need.innerHTML = "Use " 
            + "Core x" + dPlantation[iLevel_Plantation].Need.core
            + " | Parts x" + dPlantation[iLevel_Plantation].Need.parts
            + " | Fuel x" + dPlantation[iLevel_Plantation].Need.fuel;
        field_mission.innerHTML = "Upgrade Plantation Lv " + (iLevel_Plantation + 1);
        field_result.innerHTML
            = dPlantation[iLevel_Plantation].min + "~" + dPlantation[iLevel_Plantation].max + " ea"
            + " → "
            + dPlantation[iLevel_Plantation + 1].min + "~" + dPlantation[iLevel_Plantation + 1].max + " ea";

        if(Compound.core >= dPlantation[iLevel_Plantation].Need.core
            && Compound.parts >= dPlantation[iLevel_Plantation].Need.parts
            && Compound.fuel >= dPlantation[iLevel_Plantation].Need.fuel) {
            field.style.backgroundColor = cColor.can;
        } else {
            field.style.backgroundColor = cColor.cant;
        }

    } else {
        field_need.innerHTML = "Complete!"
        field_result.innerHTML
            = dPlantation[iLevel_Plantation].min + "~" + dPlantation[iLevel_Plantation].max;
        document.querySelector("#quest_upgrade_plantation").style.backgroundColor = cColor.complete;
    }
}
function UpdateStatus_QuestField() {
    var field = document.querySelector("#quest_upgrade_field");
    var field_mission = field.querySelector(".field_display_quest_mid");
    var field_need = field.querySelector(".field_display_quest_up");
    var field_result = field.querySelector(".field_display_quest_down");
    if(iLevel_Field < 3) {
        field_need.innerHTML = "Use " 
            + "Core x" + dField[iLevel_Field].Need.core
            + " | Parts x" + dField[iLevel_Field].Need.parts
            + " | Fuel x" + dField[iLevel_Field].Need.fuel;
        field_mission.innerHTML = "Upgrade Field Lv " + (iLevel_Field + 1);
        field_result.innerHTML
            = dField[iLevel_Field].min + "~" + dField[iLevel_Field].max + " ea"
            + " → "
            + dField[iLevel_Field + 1].min + "~" + dField[iLevel_Field + 1].max + " ea";

        if(Compound.core >= dField[iLevel_Field].Need.core
        && Compound.parts >= dField[iLevel_Field].Need.parts
        && Compound.fuel >= dField[iLevel_Field].Need.fuel) {
            field.style.backgroundColor = cColor.can;
        } else {
            field.style.backgroundColor = cColor.cant;
        }

    } else {
        field_need.innerHTML = "Complete!"
        field_result.innerHTML
            = dField[iLevel_Field].min + "~" + dField[iLevel_Field].max;
        document.querySelector("#quest_upgrade_field").style.backgroundColor = cColor.complete;
    }
}

function UpdateStatus_QuestMother() {
    var field = document.querySelector("#quest_mother");
    if(iCurRabbits.together >= 3) {
        return;
    }

    if(Compound.gather < 3) {
        field.style.backgroundColor = cColor.cant;
        return;
    }

    field.style.backgroundColor = cColor.can;
}
function Quest_Mother() {
    if(iCurRabbits.together >= 3) {
        return;
    }

    if(Compound.gather < 3) {
        return;
    }

    iCurRabbits.together = 3;
    ShowRabbits();
    document.getElementById("quest_mother").style.backgroundColor = cColor.complete;

    rabbit_count += 1;
    off_scene02();
    scene02_ingame();

    queue_log.enqueue("@\'THANKS MOM!\' Rabbit brother said<br />Mom is going to another location to collect");
    UpdateText_Log();
}

function UpdateStatus_QuestFather() {
    var field = document.querySelector("#quest_father");
    if(iCurRabbits.together >= 4) {
        return;
    }

    if(count_return_rocket < 3) {
        field.style.backgroundColor = cColor.cant;
        return;
    }

    field.style.backgroundColor = cColor.can;
}
var iExtraPercent;
var iComeFather = false;
function Quest_Father() {
    if(iExtraPercent >= 5) {
        return;
    }

    if(count_return_rocket < 3) {
        return;
    }

    if(iCurRabbits.together == 3) {
        iCurRabbits.together = 4;
        ShowRabbits();
    } else if(iCurRabbits.together != 4) {
        return;
    }

    iExtraPercent += 5;
    if(iExtraPercent >= 5) {
        iExtraPercent = 5;
        document.getElementById("quest_father").style.backgroundColor = cColor.complete;
    }
    UpdatePercent_Rocket();

    rabbit_count += 1;
    off_scene02();
    scene02_ingame();

    queue_log.enqueue("@\'THANKS DAD!\' Rabbit brother said<br />Moon arrival probability + 5%");
    UpdateText_Log();
}
function Quest_Upgrade_City() {
    if(iLevel_City >= 3) {
        return;
    }

    if(dCity[iLevel_City].Need.core > Compound.core
    || dCity[iLevel_City].Need.parts > Compound.parts
    || dCity[iLevel_City].Need.fuel > Compound.fuel) {
        return;
    }
    
    AddCompound(eCompound.core, -dCity[iLevel_City].Need.core);
    AddCompound(eCompound.parts, -dCity[iLevel_City].Need.parts);
    AddCompound(eCompound.fuel, -dCity[iLevel_City].Need.fuel);

    iLevel_City += 1;
    if(iLevel_City >= 3) {
        iLevel_City = 3;
    }

    UpdateText_CityEa();
    UpdateStatus_Quest();

    queue_log.enqueue("LEVEL UP!!!<br />City Lv " 
    + (iLevel_City - 1) + "=> City Lv " + iLevel_City);
    UpdateText_Log();
}
function Quest_Upgrade_Field() {
    if(iLevel_Field >= 3) {
        return;
    }

    if(dField[iLevel_Field].Need.core > Compound.core
    || dField[iLevel_Field].Need.parts > Compound.parts
    || dField[iLevel_Field].Need.fuel > Compound.fuel) {
        return;
    }
    
    AddCompound(eCompound.core, -dField[iLevel_Field].Need.core);
    AddCompound(eCompound.parts, -dField[iLevel_Field].Need.parts);
    AddCompound(eCompound.fuel, -dField[iLevel_Field].Need.fuel);

    iLevel_Field += 1;
    if(iLevel_Field >= 3) {
        iLevel_Field = 3;
    }
    UpdateText_FieldEa();
    UpdateStatus_Quest();

    queue_log.enqueue("LEVEL UP!!!<br />Field Lv " 
    + (iLevel_Field - 1) + "=> Field Lv " + iLevel_Field);
    UpdateText_Log();
}
function Quest_Upgrade_Plantation() {
    if(iLevel_Plantation >= 3) {
        return;
    }

    if(dPlantation[iLevel_Plantation].Need.core > Compound.core
    || dPlantation[iLevel_Plantation].Need.parts > Compound.parts
    || dPlantation[iLevel_Plantation].Need.fuel > Compound.fuel) {
        return;
    }
    
    AddCompound(eCompound.core, -dPlantation[iLevel_Plantation].Need.core);
    AddCompound(eCompound.parts, -dPlantation[iLevel_Plantation].Need.parts);
    AddCompound(eCompound.fuel, -dPlantation[iLevel_Plantation].Need.fuel);

    iLevel_Plantation += 1;
    if(iLevel_Plantation >= 3) {
        iLevel_Plantation = 3;
    }
    UpdateText_PlantationEa();
    UpdateStatus_Quest();

    queue_log.enqueue("LEVEL UP!!!<br />Plantation Lv " 
    + (iLevel_Plantation - 1) + "=> Plantation Lv " + iLevel_Plantation);
    UpdateText_Log();
}
//#endregion

function GetPercent() {
    var note = {
        percent: percent_rocket
    }
    return note;
}

function SetLog(log) {
    queue_log.enqueue(log);
    UpdateText_Log();
}