// 最新資料
// const xhr = new XMLHttpRequest();
// const jsonURL = 'https://api.kcg.gov.tw/api/service/get/9c8e1450-e833-499c-8320-29b36b7ace5c';
// xhr.open('get', jsonURL, false);
// xhr.send();
// const jsonData = JSON.parse(xhr.responseText);
// const allData = jsonData.data.XML_Head.Infos.Info;

// const allDataLen = allData.length;

const xhr = new XMLHttpRequest();
const jsonURL = 'https://raw.githubusercontent.com/hexschool/KCGTravel/master/datastore_search.json';
xhr.open('get', jsonURL, false);
xhr.send();
const jsonData = JSON.parse(xhr.response);
const allData = jsonData.result.records;
const allDataLen = allData.length; 

let tempData = [];
let currentPageData = [];
let currentPage = 1;
let perPage = 6;

// 預設畫面
for (let i = 0; i < allDataLen; i++) {
  tempData.push(allData[i]);
}

// 指定 DOM 元素
const selector = document.querySelector('.selector');
const popularList = document.querySelector('.popularList');
const districtTitle = document.querySelector('.districtTitle');
const districtList = document.querySelector('.districtList');
const pageList = document.querySelector('.pageList');

// 監聽事件
selector.addEventListener('change', selectorList);
popularList.addEventListener('click', UpdatePopList);
pageList.addEventListener('click', switchPage);


renderSelector();
displayData();
renderList(currentPageData);
renderPageList(tempData);

function renderList(array) {
  let str = '';
  for (let i = 0; i < array.length; i++) {
    str +=
    `<li class="attraction">
      <div>
        <img src="${array[i].Picture1}" alt="" class="attractionPicture">
      </div>
      <div class="attractionText">
        <img src="./img/icons_clock.png" alt="" class="attractionIcon">
        <p>${array[i].Opentime}</p>
      </div>
      <div class="attractionText">
        <img src="./img/icons_pin.png" alt="" class="attractionIcon">
        <p>${array[i].Add}</p>
      </div>
      <div class="attractionText">
        <img src="./img/icons_phone.png" alt="" class="attractionIcon">
        <p>${array[i].Tel}</p>
      </div>
      <div class="attractionName">
        <p>${array[i].Name}</p>
      </div>
      <div class="attractionZone">
        <p>${array[i].Zone}</p>
      </div>
    </li>`;
  };
  districtList.innerHTML = str;
}

function renderSelector() {
  let districtList = [];
  for (let i = 0; i < allDataLen; i++) {
    districtList.push(allData[i].Zone);
  };

  let zone = ['全部行政區'];
  zone.push(... new Set(districtList));

  let str = '';
  for (let i = 0; i < zone.length; i++) {
    str += `<option value = "${zone[i]}">${zone[i]}</option>`;
  };
  selector.innerHTML = str;
}

function UpdatePopList(e) {
  let select = e.target.dataset.zone;
  if (e.target.nodeName != 'A') return;
  tempData.splice(0, tempData.length);
  districtTitle.innerHTML = select;
  for (let i = 0; i < allDataLen; i++) {
    if (select == allData[i].Zone) {
      tempData.push(allData[i]);
    };
  };
  currentPage = 1;
  displayData();
  renderList(currentPageData);
  renderPageList(tempData);
}

function selectorList(e) {
  let select = e.target.value;
  districtTitle.innerHTML = select;
  tempData.splice(0, tempData.length);
  if (select == "全部行政區") {
    for (let i = 0; i < allDataLen; i++) {
      tempData.push(allData[i]);
    }
  } else {
    for (let i = 0; i < allDataLen; i++) {
      if (select == allData[i].Zone) {
        tempData.push(allData[i]);
      };
    };
  }
  currentPage = 1;
  displayData();
  renderList(currentPageData);
  renderPageList(tempData);
}

function renderPageList(data) {
  let dataLen = data.length;
  let pageTotal = Math.ceil(dataLen/perPage);
  let pre = '';
  let str = '';
  let nxt = '';
  if (currentPage <= 1) {
    pre += `<li><span class="prev disabled">Prev</span></li>`;
  } else {
    pre += 
    `<li><a href="#" class="pageBtn prev" data-page="${currentPage - 1}">Prev</a></li>`;
  };

  if (currentPage >= pageTotal) {
    nxt += `<li><span class="next disabled">Next</span></li>`;
  } else {
    nxt += 
    `<li><a href="#" class="pageBtn next" data-page="${currentPage + 1}">Next</a></li>`;
  };

  if (pageTotal <= 10 && pageTotal > 1) {
    for(let i = 1; i <= pageTotal; i++) {
      if (Number(currentPage) == i) {
        str += `<li><a href="#" class="pageBtn current" data-page="${i}">${i}</a></li>`;
      } else {
        str += `<li><a href="#" class="pageBtn" data-page="${i}">${i}</a></li>`;
      }
    };
    pageList.innerHTML = 
    `${pre}${str}${nxt}`;
  } else {
    pageList.innerHTML = '';
  };
}

function displayData() {
  currentPageData.splice(0, currentPageData.length);
  let minData = (currentPage - 1) * perPage;
  let maxData = (currentPage * perPage) -1;
  let dataLen = tempData.length;
  let pageTotal = Math.ceil(dataLen/perPage);
  if (currentPage == pageTotal) {
    for (let i = minData; i < dataLen; i++) {
      currentPageData.push(tempData[i]);
    }
  } else {
    for (let i = minData; i <= maxData; i++) {
      currentPageData.push(tempData[i]);
    }
  }
  console.log(currentPageData);
}

function switchPage(e) {
  e.preventDefault();
  if (e.target.nodeName !== "A") return;
  let page = e.target.dataset.page;
  currentPage = page;
  displayData();
  renderList(currentPageData);
  renderPageList(tempData);
}