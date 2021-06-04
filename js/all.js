var btn = document.querySelector('.btn');
var list = document.querySelector('.list');
var delAll = document.querySelector('.delLog');
var sync = document.querySelector('.fa-sync-alt');

//example
var data = [
    {
        status: 0,//過輕
        bmi: 20.0,
        height: 174,
        weight: 80,
        logdate: '2020-12-21'
    }
];
var standard = ['過輕','理想','過重','輕度肥胖','中度肥胖','重度肥胖'];
var standard_c = ['#31BAF9','#86D73F','#FF982D','#FF6C03','#FF6C03','#FF1200'];

function calBMI(h,w){
    var h_m = h/100;
    return Number.parseFloat(w / (h_m*h_m)).toFixed(2);
}

function formatDateNow() {
    var d = new Date;
    var month = '' + (d.getMonth() + 1);
    var day = '' + d.getDate();
    var year = d.getFullYear();

    if (month.length < 2) 
        month = '0' + month;
    if (day.length < 2) 
        day = '0' + day;

    return [month, day , year].join('-');
    //https://stackoverflow.com/questions/23593052/format-javascript-date-as-yyyy-mm-dd
}

function getlocal(){
    var str = localStorage.getItem('bmi');
    return JSON.parse(str) || [];
}

function updateList(){
    var loc = getlocal();
    var str = '';
    for(var i = 0 ; i < loc.length ; i++){
        str += `
        <li class="bmi${loc[i].status}">
        <div class="status">${standard[loc[i].status]}</div>
        <div class="bmi"><span>BMI</span> ${loc[i].bmi}</div>
        <div class="wg"><span>weight</span> ${loc[i].weight}kg</div>
        <div class="ht"><span>height</span> ${loc[i].height}cm</div>
        <div class="dt"><span>${loc[i].logdate}</span></div>
        <i class="fas fa-times" data-num='${i}' ></i>
        </li>
        `;//JavaScript 陣列處理必學巧技直播學到的
    }
    if(loc.length > 0){
        delAll.setAttribute("style","display: block;");
    }else{
        delAll.setAttribute("style","display: none;");
    }
    list.innerHTML = str;
}

function savBMI(){
    var height = parseInt(document.querySelector('.inheight').value);
    var weight = parseInt(document.querySelector('.inweight').value);
    var bmivalue = calBMI(height,weight);
    var status = 0.0;

    if (bmivalue < 18.5) {
        status = 0;//'過輕'
      } else if (18.5 <= bmivalue && bmivalue < 24) {
        status = 1;//'理想'
      } else if (24 <= bmivalue && bmivalue < 27) {
        status = 2;//'過重'
      } else if (27 <= bmivalue && bmivalue < 30) {
        status = 3;//'輕度肥胖'
      } else if (30 <= bmivalue && bmivalue < 35) {
        status = 4;//'中度肥胖'
      } else if (35 <= bmivalue) {
        status = 5;//'重度肥胖'
      }

    var newdata = {
        status: status,
        bmi: bmivalue,
        height: height,
        weight: weight,
        logdate: formatDateNow()
    };

    var arr = getlocal();
    arr.push(newdata);

    var jstr = JSON.stringify(arr);
    localStorage.setItem('bmi',jstr);

    setResulBtn(status , bmivalue);

    updateList();
}
function delLog(event){
    event.preventDefault();
    localStorage.removeItem('bmi');
    updateList();
}

function saveAndCheck(e){
    e.preventDefault();
    if(checkNUM()){
        savBMI();
    }
}

function checkNUM(){
    //https://stackoverflow.com/questions/1779013/check-if-string-contains-only-digits
    var h = document.querySelector('.inheight').value;
    var w = document.querySelector('.inweight').value;
    let h_isnum = /^\d+$/.test(h);
    let w_isnum = /^\d+$/.test(w);
    var hwarn = document.querySelector('.w-height');
    var wwarn = document.querySelector('.w-weight');
    if(!h_isnum){
        hwarn.setAttribute('style','visibility: visible;');
    }
    else{
        hwarn.setAttribute('style','visibility: hidden;');
    }
    if(!w_isnum){
        wwarn.setAttribute('style','visibility: visible;');
    }
    else{
        wwarn.setAttribute('style','visibility: hidden;');
    }
    if(h_isnum && w_isnum){
        return true;
    }
    return false;
}

function checkList(e){
    var el = e.target.nodeName;
    if(el === 'I'){
        var num = e.target.dataset.num;

        delItem(num);
        updateList();
    }
}

function delItem(num){
    var arr = getlocal();
    if(arr.length>0){
        arr.splice(num,1);
        jstr = JSON.stringify(arr);
        localStorage.setItem('bmi',jstr);
    }
}

function setResulBtn( s , b){
    var calBtn = document.querySelector('.interaction .btn');
    calBtn.setAttribute('style','display: none;');

    var status = document.querySelector('.interaction .status');
    var bmi = document.querySelector('.rebutton .text .bmi');
    var reBtn = document.querySelector('.rebutton');
    var recy = document.querySelector('.fa-sync-alt');

    reBtn.setAttribute('style',`display: flex; color: ${standard_c[s]};`);
    status.setAttribute('style',`visibility: visible; color: ${standard_c[s]};`);
    recy.setAttribute('style',`background: ${standard_c[s]};`);
    status.innerHTML = standard[s];
    bmi.innerHTML = b;

    document.querySelector('.inheight').readOnly = true;
    document.querySelector('.inweight').readOnly = true;
}
function resetBtn(){
    var calBtn = document.querySelector('.interaction .btn');
    calBtn.setAttribute('style','display: block;');

    var reBtn = document.querySelector('.rebutton');
    var status = document.querySelector('.interaction .status');
    reBtn.setAttribute('style','display: none;');
    status.setAttribute('style','visibility: hidden;');

    document.querySelector('.inheight').value = '';
    document.querySelector('.inweight').value = '';
    document.querySelector('.inheight').readOnly = false;
    document.querySelector('.inweight').readOnly = false;
}

updateList();
delAll.addEventListener('click',delLog,false);
btn.addEventListener('click',saveAndCheck,false);
list.addEventListener('click',checkList,false);
sync.addEventListener('click',resetBtn,false);