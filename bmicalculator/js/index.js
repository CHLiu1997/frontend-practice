//變數設定
function getDom(target) {
    return document.querySelector(target)
}

const submitBtn = getDom('.submitBtn');
const result = getDom('.result');
const resultNum = getDom('.resultNum');
const resultStatu = getDom('.resultStatu');
const retestText = getDom('.retestText');
const retestBtn = getDom('.retestBtn');
const list = getDom('.list');
const height = getDom('#height');
const weight = getDom('#weight');
const clearBtn = getDom('.clearBtn');
let data = JSON.parse(localStorage.getItem('bmiData')) || [];

submitBtn.addEventListener('click', bmiCaculator);
retestBtn.addEventListener('click', retest);
retestBtn.addEventListener('mouseenter', fadein);
retestBtn.addEventListener('mouseleave', fadeout);
list.addEventListener('click', deleteData);
clearBtn.addEventListener('click',clearData);
updateList(data); // 為了使每次重開網頁都能跑出資料

// bmi判斷
function bmiCaculator() {
    let hValue = height.value;
    let wValue = weight.value;
    if (hValue === ''|| wValue === ''){
        getDom('.noValueAlert').textContent = '*請輸入身高和體重';
        alert('輸入錯誤');
        return;
    }else if (hValue < 0 || hValue >= 1000 || wValue < 0 || wValue >= 1000){
        getDom('.noValueAlert').textContent = '*請輸入身高和體重';
        alert('請輸入0~1000的數字');
        return;
    }
    else {
        getDom('.noValueAlert').textContent = '';
    }

    let hMeter = hValue/100;
    let bmi = Math.round((wValue/hMeter**2)*10)/10;
    if (bmi < 18.5){
        statu = '過輕';
        color = 'green';
    } else if (18.5 <= bmi && bmi < 24){
        statu = '理想';
        color = 'blue';
    } else if (24 <= bmi && bmi < 27){
        statu = '過重';
        color = 'lightorange';
    } else if (27 <= bmi && bmi < 30){
        statu = '輕度肥胖';
        color = 'orange';
    } else if (30 <= bmi && bmi < 35){
        statu = '中度肥胖';
        color = 'orange';
    } else {
        statu = '重度肥胖';
        color = 'red';
    }
    updateData(hValue, wValue, bmi, statu, color);
    updateList(data);
    submitBtn.classList.add('d-none');
    result.setAttribute('class', `result result-${color}`);
    retestBtn.setAttribute('class', `retestBtn retestBtn-${color}`);
    resultStatu.setAttribute('class', `resultStatu resultStatu-${color}`);
    resultNum.textContent = `${bmi}`;
    resultStatu.textContent = `${statu}`;
}

// 將新結果存入data
function updateData(hValue, wValue, bmi, statu, color) {
    let date = new Date();
    let year = date.getFullYear();
    let month = date.getMonth()+1; //月份取出來是0~11，所以要+1
    let day = date.getDay();
    let bmiData = {
        statu: statu,
        bmi: bmi,
        weight: wValue,
        height: hValue,
        date: month + '-' + day + '-' + year,
        color: color
    };
    data.push(bmiData);
    localStorage.setItem('bmiData',JSON.stringify(data));
}

// 將data渲染成list
function updateList(item) {
    let str = '';
    let len = item.length
    for (let i = 0; i < len; i++) {
        str +=
            `<ul class="contentBox content-${item[i].color}">
                <li><span class="content">${item[i].statu}</span></li>
                <li>BMI <span class="content">${item[i].bmi}</span></li>
                <li>weight <span class="content">${item[i].weight}kg</span></li>
                <li>height <span class="content">${item[i].height}cm</span></li>
                <li>${item[i].date}</li>
                <li><a href="#" data-index="${i}" class="deleteBtn">delete</a></li>
            </ul>`
    }
    list.innerHTML = str;
}

// 刪除單筆資料
function deleteData(e) {
    e.preventDefault();
    if (e.target.nodeName !== 'A') {return};
    let index = e.target.dataset.index;
    data.splice(index, 1);
    localStorage.setItem('bmiData', JSON.stringify(data));
    updateList(data);
}

// 刪除全部資料
function clearData(e) {
    e.preventDefault();
    if (e.target.nodeName !== 'A') {return};
    let c = confirm('確定要清除所有資料?')
    if (c==true) {
        localStorage.clear();
    data = [];
    alert('已刪除所有資料');
    updateList(data);
    }
}

// 回復原始畫面
function retest() {
    submitBtn.classList.remove('d-none');
    result.setAttribute('class', 'result d-none');
}

// 淡入淡出動畫
function fadein() {
    retestText.setAttribute('class', 'retestText fadeinAnime');
}

function fadeout() {
    retestText.setAttribute('class', 'retestText fadeoutAnime');
}