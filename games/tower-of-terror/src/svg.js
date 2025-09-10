function svgRect(x, y, w, h, fill) {
    let r = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    r.setAttribute("x", x);
    r.setAttribute("y", y);
    r.setAttribute("width", w);
    r.setAttribute("height", h);
    r.setAttribute("fill", fill);
    return r;
}

function svgLine(x1, y1, x2, y2, stroke, strokeWidth = 1) {
    let l = document.createElementNS("http://www.w3.org/2000/svg", "line");
    l.setAttribute("x1", x1);
    l.setAttribute("y1", y1);
    l.setAttribute("x2", x2);
    l.setAttribute("y2", y2);
    l.setAttribute("stroke", stroke);
    l.setAttribute("stroke-width", strokeWidth);
    return l;
}

function svgCircle(cx, cy, r, fill) {
    let c = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    c.setAttribute("cx", cx);
    c.setAttribute("cy", cy);
    c.setAttribute("r", r);
    c.setAttribute("fill", fill);
    return c;
}

function svgText(txt, x, y, color = "black", font = "Arial", size = 20) {
    let t = document.createElementNS("http://www.w3.org/2000/svg", "text");
    t.setAttribute("x", x);
    t.setAttribute("y", y);
    t.setAttribute("fill", color);
    t.setAttribute("font-family", font);
    t.setAttribute("font-size", size);
    t.textContent = txt;
    return t;
}

function svgPath(path, color) {
    let p = document.createElementNS("http://www.w3.org/2000/svg", "path");
    p.setAttribute("d", path);
    p.setAttribute("fill", color);
    return p;
}

function svgUse(href, x, y, scale = 1.0) {
    let u = document.createElementNS("http://www.w3.org/2000/svg", "use");
    u.setAttributeNS("http://www.w3.org/1999/xlink", "href", `#${href}`);
    u.setAttribute("transform", `translate(${x} ${y}) scale(${scale})`);
    return u;
}

function svgGroup() {
    return document.createElementNS("http://www.w3.org/2000/svg", "g");
}

function svgCat(x, y) {
    return svgUse("cat", x, y);
}

function svgPortal(x, y) {
    return svgUse("portal", x, y);
}

function svgBadLuck(x, y) {
    return svgUse("badluck", x, y);
}

function svgGoodLuck(x, y) {
    return svgUse("goodluck", x, y);
}

function svgHorseshoe(x, y) {
    return svgUse("horseshoe", x, y);
}

function svgTower(x, y, activeLevel, opacity = 1.0) {
    let scene = svgGroup();
    let moon = svgCircle(x + 80, x + 100, 80, "red");
    scene.appendChild(moon);

    let s = `M ${_t[0][0]} ${0} `
    s += `L ${_t[0][1]} ${0} `; // Top
    for (let i = 0; i < 19; i++) { // Right
        s += `L ${_t[i][1]} ${(i+1)*30} `;
        s += `L ${_t[i+1][1]} ${(i+1)*30} `;
    }
    s += `L ${_t[19][0]} ${19*30} `; // Bottom
    for (let i = 19; i > 0; i--) { // Left
        s += `L ${_t[i][0]} ${i*30} `;
        s += `L ${_t[i-1][0]} ${i*30} `;
    }
    s += "Z";

    let towerBlock = svgPath(s, "#080001");
    let towerOutline = svgPath(s, "none");
    towerOutline.setAttribute("stroke", "#B50405");
    towerOutline.setAttribute("stroke-width", "2");

    let tower = svgGroup();
    tower.appendChild(towerBlock);
    if (activeLevel != undefined) {
        tower.appendChild(svgRect(_t[activeLevel][0], activeLevel * 30, _t[activeLevel][1] - _t[activeLevel][0], 30, "yellow"));
    }
    tower.appendChild(towerOutline);
    tower.setAttribute("transform", `translate(${x-60} ${y+19})`);
    scene.appendChild(tower);

    scene.setAttribute("opacity", opacity);
    return scene;
}

let _t = [
    [40, 130],
    [40, 140],
    [40, 140],
    [45, 135],
    [40, 140],
    [45, 145],
    [40, 140],
    [40, 140],
    [40, 140],
    [45, 145],
    [45, 145],
    [40, 150],
    [35, 150],
    [30, 155],
    [30, 155],
    [25, 155],
    [20, 160],
    [15, 165],
    [10, 170],
    [5, 175]
]
