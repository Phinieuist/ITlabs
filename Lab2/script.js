let canvas = document.getElementById('curve_chart');

//переменные для аппроксимации
let a;
let a0;
let a1;
let a2;
let b;
let n;
let x;
let y;
let ynl;
let ynp;

//создание таблицы для пар точек
function createTable(){
    let tableContainer = document.getElementById('tableContainer'); // находим div, в который нужно вложить таблицу
    let calculate_button = document.getElementById('calculate_button'); // находим div, в который нужно вложить кнопку рассчёта
    let count = document.getElementById("Input_n").value; // получаем значение количества пар точек
    
    let table = document.createElement('table'); //создаём тег таблицы
    
    let tr1 = document.createElement('tr'); //создаём тег строки

    let td1 = document.createElement('td'); //создаём тег столбца
    let td2 = document.createElement('td');

    let text1 = document.createTextNode('x'); //создаём текст для шапки таблицы
    let text2 = document.createTextNode('y');

    td1.appendChild(text1); //вкладываем текст в столбец
    td2.appendChild(text2);
    tr1.appendChild(td1); // столбец в строку
    tr1.appendChild(td2);

    table.appendChild(tr1);//строку в столбец

    for (let i = 0; i < count; i++)//повторяем для остальной таблицы
    {
        let tr1 = document.createElement('tr');  

        let td1 = document.createElement('td');
        let td2 = document.createElement('td');

        let input1 = document.createElement('input'); //вместо текста создаём тег input
        let input2 = document.createElement('input');

        input1.id = 'in_x_' + i; //присваиваем id, чтобы потом по нему вытянуть значение координаты точки
        input2.id = 'in_y_' + i;

        td1.appendChild(input1);
        td2.appendChild(input2);
        tr1.appendChild(td1);
        tr1.appendChild(td2);
        
        table.appendChild(tr1);
    }

    tableContainer.appendChild(table); //вкладываем созданную таблицу в div, в который нужно вложить таблицу

    let btn = document.createElement('div'); //создаём div, в котором будет кнопка
    btn.innerHTML = '<button class="input_calc_btn" onclick="calculate(' + count + ')">Рассчитать</button>'; //добавляем кнопку, также добавляем вызов функции calculate(n0) по клику 
    calculate_button.appendChild(btn); //вкладываем созданную кнопку в div, в который нужно вложить кнопку рассчёта
}

function calculate(n0){ //функция для заполнения всех переменных и вызова рассчётных функций
    n = n0;

    x = new Array(n);
    y = new Array(n);

    for (let i = 0; i < n; i++) //заполняем массивы с исходными точками
    {
        x[i] = Number(document.getElementById("in_x_" + i).value);
        y[i] = Number(document.getElementById("in_y_" + i).value);
    }

    console.log(x);
    console.log(y);
 
    a = 0;
    a0 = 0;
    a1 = 0;
    a2 = 0;
    b = 0;
    ynl = new Array(n);
    ynp = new Array(n);

    let minx = x[0];
    let miny = y[0];

    for (let i = 0; i < n; i++) // сортируем точки, т.к. они могут идти не по порядку
    {
        for (let j = 0; j < n; j++)
        {
            if (x[j] < x[j - 1])
            {
                minx = x[j - 1];
                x[j - 1] = x[j];
                x[j] = minx;
                miny = y[j - 1];
                y[j - 1] = y[j];
                y[j] = miny;
            }
        }
    }

    Main_calculation_Line(); //линейная аппроксимация
    Main_calculation_Kvadr(); //квадратичная аппроксимация

    console.log(ynl);
    console.log(ynp);

    let formula_lin = document.getElementById("formula_lin");
    let formula_kvadr = document.getElementById("formula_kvadr");
    let drawLine = document.getElementById("drawLine");
    let drawKvadr = document.getElementById("drawKvadr");


    formula_lin.innerHTML = "Линейная аппроксимация: y = " + a.toFixed(4) + "*x + " + b.toFixed(4);
    formula_kvadr.innerHTML = "Квадратичная аппроксимация: y = " + a0.toFixed(4) + " *x*x +" + a1.toFixed(4) + " *x + " + a2.toFixed(4);
    formula_lin.style.display = "inline";
    formula_kvadr.style.display = "inline";
    drawLine.style.display = "inline";
    drawKvadr.style.display = "inline";
    document.getElementById("checkboxLabel1").style.display = "inline";
    document.getElementById("checkboxLabel2").style.display = "inline";

    drawChart(drawLine.checked, drawKvadr.checked); //рисуем график
}

function drawChart(drawLine, drawKvadr) { //функция отрисовки графика, принимает две переменные, если их значения true = рисуем соответствующий график, false = не рисуем соответствующий график
    let drawLineWidth;
    let drawKvadrWidth;

    if (drawLine === true)
        drawLineWidth = 3;
    else
        drawLineWidth = 0;

    if (drawKvadr === true)
        drawKvadrWidth = 3;
    else
        drawKvadrWidth = 0;

    var data = new google.visualization.DataTable();
    data.addColumn('number', 'x');
    data.addColumn('number', 'Исходные точки');
    data.addColumn('number', 'Линейная аппроксимация');
    data.addColumn('number', 'Квадратичная аппроксимация');

    for (let i = 0; i < n; i++) //добавляем точки для графика
    {
        data.addRow([x[i], y[i], ynl[i], ynp[i]]);
    }

    var options = {
      legend: { position: 'bottom' },
      series: { //соединяем точки, которые получились после аппроксимации, прямыми, исходные точки не трогаем
        1: {
          lineWidth: drawLineWidth,
          pointSize: 0,
          curveType: 'none'
        },
        2: {
            lineWidth: drawKvadrWidth,
            pointSize: 0,
            curveType: 'function'
          }}
    };

    var chart = new google.visualization.ScatterChart(canvas);
    canvas.style.display = "inline"; //включаем отображение скрытого графика
    chart.draw(data, options); //рисуем график
}

function redrawChart(){
    drawChart(document.getElementById("drawLine").checked, document.getElementById("drawKvadr").checked); //перерисовываем график
}

//ниже идут функции для аппроксимации методом наименьших квадратов

function Sum(arr){
    let S = arr[0];
    for(let i = 1; i < arr.length; i++)
        S+=arr[i];
    return S;
}

function SXY() {
    let S = 0;
    for (let i = 0; i < n; i++)
    {
        S += x[i] * y[i];
    }
    return S;
}

function SXX(){
    let S = 0;
    for (let i = 0; i < n; i++)
    {
        S += x[i] * x[i];
    }
    return S;
}

function Main_calculation_Line() {
    a = ((SXY() * n) - (Sum(x) * Sum(y))) / ((SXX() * n) - (Sum(x) * Sum(x)));
    b = ((SXX() * Sum(y)) - (Sum(x) * SXY())) / ((SXX() * n) - (Sum(x) * Sum(x)));

    for (let i=0;i<n;i++)
    {
        ynl[i] = a * x[i] + b;
    }
}

function X2(){
    return SXX();
}

function X3() {
    let S = 0;
    for (let i = 0; i < n; i++)
    {
        S += Math.pow(x[i],3);
    }
    return S;
}

function X4() {
    let S = 0;
    for (let i = 0; i < n; i++)
    {
        S += Math.pow(x[i], 4);
    }
    return S;
}

function Z2() {
    return SXY();
}

function Z3()
{
    let S = 0;
    for (let i = 0; i < n; i++)
    {
        S += Math.pow(x[i], 2) * y[i];
    }
    return S;
}

function Det(a11, a12, a13, a21, a22, a23, a31, a32, a33)
{
    return ((a11 * a22 * a33) + (a12 * a23 * a31) + (a13 * a21 * a32) - (a13 * a22 * a31) - (a11 * a23 * a32) - (a12 * a21 * a33));
}

function Main_calculation_Kvadr()
{
    a0 = Det(Sum(y), Sum(x), X2(), Z2(), X2(), X3(), Z3(), X3(), X4()) / Det(n, Sum(x), X2(), Sum(x), X2(), X3(), X2(), X3(), X4());
    a1 = Det(n, Sum(y), X2(), Sum(x), Z2(), X3(), X2(), Z3(), X4()) / Det(n, Sum(x), X2(), Sum(x), X2(), X3(), X2(), X3(), X4());
    a2 = Det(n, Sum(x), Sum(y), Sum(x), X2(), Z2(), X2(), X3(), Z3()) / Det(n, Sum(x), X2(), Sum(x), X2(), X3(), X2(), X3(), X4());

    for (let i = 0; i < n; i++)
    {
        ynp[i] = a2 * x[i] * x[i] + a1 * x[i] + a0;
    }
}