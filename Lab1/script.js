var lab1 = document.getElementById("lr1");
var lab2 = document.getElementById("lr2");
var lab3 = document.getElementById("lr3");

var btn1 = document.getElementById("Btn1");
var btn2 = document.getElementById("Btn2");
var btn3 = document.getElementById("Btn3");
var btn4 = document.getElementById("Btn4");

function ChangeTab(number) {
    switch (number) {
        case 1:
            lab1.style.display = "inline";
            lab2.style.display = "none";
            lab3.style.display = "none";

            btn1.className = "labs_element_act";
            btn2.className = "labs_element";
            btn3.className = "labs_element";
            break;
        case 2:
            lab1.style.display = "none";
            lab2.style.display = "inline";
            lab3.style.display = "none";

            btn1.className = "labs_element";
            btn2.className = "labs_element_act";
            btn3.className = "labs_element";
            break;
        case 3:
            lab1.style.display = "none";
            lab2.style.display = "none";
            lab3.style.display = "inline";

            btn1.className = "labs_element";
            btn2.className = "labs_element";
            btn3.className = "labs_element_act";
            break;
        case 4:
            window.open("https://github.com/stankin/inet-2022/wiki/exam18");
            break;

    }
};
