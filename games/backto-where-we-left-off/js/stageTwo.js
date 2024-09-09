var a = 1;
var check1 = document.getElementById("check1");
var check2 = document.getElementById("check2");
var check3 = document.getElementById("check3");
var ipcolor = document.getElementById("ipColor");
var value1 = document.getElementById("value1");
var value2 = document.getElementById("value2");
var value3 = document.getElementById("value3");
var result1 = document.getElementById("resultCheck1");
var result2 = document.getElementById("resultCheck2");

function sendNew() {
    run();
    var msg = document.getElementById('txt').value.toString().trim();
    if (msg !== "") {
        document.getElementById('txt').value = "";
    }
    //textarea string check
    function run() {
        if (document.getElementById("txt").value.includes(":/police activated") && (check2.checked == false) && (check3.checked == true) && (value1.selected == true)) {
            var x = document.getElementById("onestageone");
            x.style.display = "block";
            ipcolor.style.backgroundColor = "#8BE78B";//green
            document.getElementById("node").innerHTML = "N3";
        } else if (document.getElementById("txt").value.includes(":/security close") && (check2.checked == true) && (check3.checked == false) && (value3.selected == true)) {
            var y = document.getElementById("onestagetwo");
            y.style.display = "block";
            ipcolor.style.backgroundColor = "#8BE78B";//green
            document.getElementById("node").innerHTML = "N1";
        } else if (document.getElementById("txt").value.includes(":/special username") && (check2.checked == true) && (check3.checked == false) && (value1.selected == true)) {
            var z = document.getElementById("onestagethree");
            z.style.display = "block";
            ipcolor.style.backgroundColor = "#0097DF";//blue
            document.getElementById("node").innerHTML = "N2";
        } else if (document.getElementById("txt").value.includes(":/breach file") && (check2.checked == false) && (check3.checked == true) && (value2.selected == true)) {
            var xy = document.getElementById("onestagefour");
            xy.style.display = "block";
            ipcolor.style.backgroundColor = "#0097DF";//blue
            document.getElementById("node").innerHTML = "N3";
        } else if (document.getElementById("txt").value.includes(":/creature steps") && (check2.checked == false) && (check3.checked == true) && (value3.selected == true)) {
            var xz = document.getElementById("onestagefive");
            xz.style.display = "block";
            clickMenu1.style.display = "block";
            clickMenu2.style.display = "block";
            ipcolor.style.backgroundColor = "#8BE78B";//green
            document.getElementById("node").innerHTML = "N3";
        } else if (document.getElementById("txt").value.includes(":/sasquatch") && (check2.checked == true) && (check3.checked == false) && (value3.selected == true) && (result1.style.display === "block") && (result2.style.display === "block")) {
            var xz = document.getElementById("onestagesix");
            xz.style.display = "block";
            ipcolor.style.backgroundColor = "#0097DF";//blue
            document.getElementById("node").innerHTML = "$_";
        } else {
            var k = document.getElementById("error");
            k.innerHTML += "<li>:/Error #" + a + " check line and word";
            a++;
        }
    }
}
window.onkeydown = function (event) {
    if (event.keyCode == 13) {
        sendNew();
        return false;
    }
}

function copyBar() {
    var elem1 = document.getElementById("progressBar1");
    var width = 0;
    var id = setInterval(frame, 100);

    function frame() {
        if (width >= 100) {
            clearInterval(id);
            result1.style.display = "block";
        } else {
            width++;
            elem1.style.width = width + '%';
            elem1.innerHTML = width * 1 + '%';
        }
    }
}
function clearBar() {
    var elem1 = document.getElementById("progressBar2");
    var width = 0;
    var id = setInterval(frame, 50);

    function frame() {
        if (width >= 100) {
            clearInterval(id);
            result2.style.display = "block";
        } else {
            width++;
            elem1.style.width = width + '%';
            elem1.innerHTML = width * 1 + '%';
        }
    }
}