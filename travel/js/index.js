// 讀取資料
let requestUrl =
  "https://raw.githubusercontent.com/hexschool/KCGTravel/master/datastore_search.json";
const xhr = new XMLHttpRequest();
xhr.open("get", requestUrl, false);
xhr.send();
const data = JSON.parse(xhr.response).result.records;

// 指定DOM元素
const menu = document.querySelector(".menu");
const Zuoying = document.querySelector(".Zuoying");
const content = document.querySelector(".content");
const switchPageBtn = document.querySelector(".switchPageBtn");

// 監聽事件
menu.addEventListener("change", updateList);
switchPageBtn.addEventListener("click", switchPage);

// 預設畫面
pagination(data, 1);

// 下拉式選單
let zone = [];
for (let i = 0; i < data.length; i++) {
  zone.push(data[i].Zone);
}
let uniqueZone = [...new Set(zone)];
let uniqueZoneLen = uniqueZone.length;
let zoneTxt = `<option value="全部行政區" selected> - - 全部行政區 - - </option>`;
for (let i = 0; i < uniqueZoneLen; i++) {
  zoneTxt += `<option value="${uniqueZone[i]}">${uniqueZone[i]}</option>`;
}
menu.innerHTML = zoneTxt;

// 頁面更新
function updateList(e) {
  let select = e.target.value;
  // console.log(select);
  let attractionsTxt = `<span class="districtTitle">${select}</span>`;
  for (let i = 0; i < data.length; i++) {
    if (select == data[i].Zone) {
      attractionsTxt += `
        <ul class="attractions">
          <li><img src="${data[i].Picture1}" class="attractionsPicture">
          </li>
          <li><span class="attractionsText"><img src="./img/icons_clock.png" class="attractionsIcons">${data[i].Opentime}</span></li>
          <li><span class="attractionsText"><img src="./img/icons_pin.png" class="attractionsIcons">${data[i].Add}</span></li>
          <li><span class="attractionsText"><img src="./img/icons_phone.png" class="attractionsIcons">${data[i].Tel}</span></li>
          <li class="attractionsName">${data[i].Name}</li>
          <li class="attractionsZone">${data[i].Zone}</li>
        </ul>
      `;
    } else if (select == "全部行政區") {
      attractionsTxt += `
        <ul class="attractions">
          <li><img src="${data[i].Picture1}" class="attractionsPicture">
          </li>
          <li><span class="attractionsText"><img src="./img/icons_clock.png" class="attractionsIcons">${data[i].Opentime}</span></li>
          <li><span class="attractionsText"><img src="./img/icons_pin.png" class="attractionsIcons">${data[i].Add}</span></li>
          <li><span class="attractionsText"><img src="./img/icons_phone.png" class="attractionsIcons">${data[i].Tel}</span></li>
          <li class="attractionsName">${data[i].Name}</li>
          <li class="attractionsZone">${data[i].Zone}</li>
        </ul>
      `;
    }
  }
  content.innerHTML = attractionsTxt;
}

// 分頁功能
function pagination(data, nowPage) {
  const dataTotal = data.length;
  const perpage = 6;
  // pageTotal 按鈕總數量 = 總資料數量 / 每一頁要顯示的資料 (因為有可能會出現餘數，所以要無條件進位。)
  const pageTotal = Math.ceil(dataTotal / perpage);
  let currentPage = nowPage;
  // 每頁第一筆資料
  const minData = currentPage * perpage - perpage + 1;
  // 每頁最後一筆資料
  const maxData = currentPage * perpage;

  let currentData = [];
  for (let i = minData - 1; i < maxData; i++) {
    currentData.push(data[i]);
  }

  const page = {
    pageTotal,
    currentPage,
    hasPrevBtn: currentPage > 1,
    hasNextBtn: currentPage < pageTotal,
  };
  displayData(currentData);
  pageBtn(page);
}

function displayData(currentData) {
  let contentText = `<span class="districtTitle">全部行政區</span>`;
  for (let i = 0; i < currentData.length; i++) {
    contentText += `
      <ul class="attractions">
          <li><img src="${currentData[i].Picture1}" class="attractionsPicture">
          </li>
          <li><span class="attractionsText"><img src="./img/icons_clock.png" class="attractionsIcons">${currentData[i].Opentime}</span></li>
          <li><span class="attractionsText"><img src="./img/icons_pin.png" class="attractionsIcons">${currentData[i].Add}</span></li>
          <li><span class="attractionsText"><img src="./img/icons_phone.png" class="attractionsIcons">${currentData[i].Tel}</span></li>
          <li class="attractionsName">${currentData[i].Name}</li>
          <li class="attractionsZone">${currentData[i].Zone}</li>
      </ul>
    `;
  }
  content.innerHTML = contentText;
}

function pageBtn(page) {
  let str = "";
  let total = page.pageTotal;
  // prev
  if (page.hasPrevBtn) {
    str += `<li><a href="#" class="pageBtn prev" data-page="${
      page.currentPage - 1
    }">Prev</a></li>`;
  } else {
    str += `<li><span class="prev disabled">Prev</span></li>`;
  }
  // page
  for (let i = 1; i < total; i++) {
    if (Number(page.currentPage) == i) {
      str += `<li><a href="#" class="pageBtn current" data-page="${i}">${i}</a></li>`;
    } else {
      str += `<li><a href="#" class="pageBtn" data-page="${i}">${i}</a></li>`;
    }
  }
  // next
  if (page.hasNextBtn) {
    str += `<li><a href="#" class="pageBtn next" data-page="${
      page.currentPage + 1
    }">Next</a></li>`;
  } else {
    str += `<li><span class="next disabled">Next</span></li>`;
  }
  switchPageBtn.innerHTML = str;
}

function switchPage(e) {
  e.preventDefault();
  if (e.target.nodeName !== "A") return;
  const page = e.target.dataset.page;
  pagination(data, page);
  updateList();
}
