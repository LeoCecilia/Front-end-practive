/* 数据格式演示
var aqiSourceData = {
  "北京": {
    "2016-01-01": 10,
    "2016-01-02": 10,
    "2016-01-03": 10,
    "2016-01-04": 10
  }
};
*/
//学会怎么用浏览器调试
// 以下两个函数用于随机模拟生成测试数据

function getDateStr(dat) {
  var y = dat.getFullYear();
  var m = dat.getMonth() + 1;
  m = m < 10 ? '0' + m : m;
  var d = dat.getDate();
  d = d < 10 ? '0' + d : d;
  return y + '-' + m + '-' + d;
}
function randomBuildData(seed) {
  var returnData = {},
      dat = new Date("2016-01-01"),
      datStr = '';
  for (var i = 1; i < 92; i++) {
    datStr = getDateStr(dat);
    returnData[datStr] = Math.ceil(Math.random() * seed);
    dat.setDate(dat.getDate() + 1);
  }
  return returnData;
}

var aqiSourceData = {
  "北京": randomBuildData(500),
  "上海": randomBuildData(300),
  "广州": randomBuildData(200),
  "深圳": randomBuildData(100),
  "成都": randomBuildData(300),
  "西安": randomBuildData(500),
  "福州": randomBuildData(100),
  "厦门": randomBuildData(100),
  "沈阳": randomBuildData(500)
},

// 用于渲染图表的数据
   chartData = {},

// 记录当前页面的表单选项
   pageState = {
      nowSelectCity: '北京',//这个要更改!!!
      nowGraTime: "day"
},

//学会怎么弄好看的UI
  color = [
    '#16324a', '#24385e', '#393f65', '#4e4a67', '#5a4563', '#b38e95',
    '#edae9e', '#c1b9c2', '#bec3cb', '#9ea7bb', '#99b4ce', '#d7f0f8'
  ],
  formGraTime = document.getElementById('form-gra-time'),
  chart = document.getElementsByClassName('aqi-chart-wrap')[0],
  citySelect = document.getElementById('city-select');

/**
 * 渲染图表
 */
function addEventHandler(ele,event,handler){
  if (ele.addEventListener) {
    ele.addEventListener(event,handler,false);
  }else if (ele.attachEvent) {
    ele.attachEvent('on' + event, handler);
  }else {
    ele['on'+event] = handler;
  }
 }

function initMargin(){
  if (pageState.nowGraTime === 'day') {
    return '5px';

  }else if (pageState.nowGraTime === 'week') {
    return '20px';

  }else{
    return '50px';

  }
}

function renderChart() {
  var text = '';   
  for (var item in chartData){//返回的是数组的所有属性   
      Color = color[parseInt(Math.random()*11)];
      //在渲染表格当中设置margin-left的属性
      text += '<div title="'+item+":  "+chartData[item]+'" style="margin-left:'+initMargin()+'; height:'+chartData[item]+'px; background-color:'+Color+'"></div>';
  }
  chart.innerHTML = text;
}

/**
 * 日、周、月的radio事件点击时的处理函数
 */
function graTimeChange(radio) {
  // 确定是否选项发生了变化 

  if (pageState.nowGraTime === this.value) {
    return;
  }else {
    pageState.nowGraTime = this.value;
  } 
   // 设置对应数据
  initAqiChartData();
  // 调用图表渲染函数
  renderChart();
}

/**
 * select发生变化时的处理函数
 */
function citySelectChange() {
  // 确定是否选项发生了变化 
  //this指向的是select,因为这个函数是内嵌于函数addEventListener当中
  if (pageState.nowSelectCity === this.value) {
    return;
  }else {
     pageState.nowSelectCity = this.value;
  }  
  // 设置对应数据
   initAqiChartData();
  // 调用图表渲染函数
   renderChart();
}


/**
 * 初始化日、周、月的radio事件，当点击时，调用函数graTimeChange
 */
function initGraTimeForm() {
  var radio = formGraTime.getElementsByTagName('input');
  for(var i=0; i<radio.length;i++){
    addEventHandler(radio[i],'click',graTimeChange);
  }
}

/**
 * 初始化城市Select下拉选择框中的选项
 */
function initCitySelector() {
  // 读取aqiSourceData中的城市，然后设置id为city-select的下拉列表中的选项
    var cityArr = Object.getOwnPropertyNames(aqiSourceData),

    //注意不能直接用aqiSourceData来是使用map映射

    //可用for(var i in aqiSourceData)替代
        htmlArr = cityArr.map(function(item){
           return '<option>' + item + '</option>';//提取的是键，若想提取
        });
    citySelect.innerHTML = htmlArr;
  
  // 给select设置事件，当选项发生变化时调用函数citySelectChange
  addEventHandler(citySelect, 'change', citySelectChange);//onchange,选项发生变化时
}

/**
 * 初始化图表需要的数据格式
 */
function initAqiChartData() {
  // 将原始的源数据处理成图表需要的数据格式
  // 处理好的数据存到 chartData 中
  var nowCityData = aqiSourceData[pageState.nowSelectCity];
  if (pageState.nowGraTime === 'day') {
    chartData = nowCityData;
  }
  if (pageState.nowGraTime === 'week') {
    chartData = {};
   
    var countSum = 0, daySum = 0, week = 0;
    for(var item in nowCityData){
      countSum += nowCityData[item];
      daySum++;
      if((new Date(item)).getDay() === 6){//周日至周六为一周
        week ++;
        chartData['第'+week+'周'] = Math.floor(countSum/daySum);
        countSum = 0;
        daySum = 0;
      }
    }
    if (daySum !== 0) {
      week ++;
      chartData['第'+week+'周']=Math.floor(countSum/daySum);
    } 
  }
  if (pageState.nowGraTime === 'month') {
    chartData = {};
    var countSum = 0, daySum = 0, month = 0;
    for(var Item in nowCityData){
      if ((new Date(Item)).getMonth() === month) {
        countSum += nowCityData[Item];
        daySum++;
      }else {
        month++;
        chartData['第'+month+'月'] = Math.floor(countSum/daySum);
        countSum = nowCityData[Item];
        daySum = 1;
      }
    }
    if(daySum !== 0){
      month ++;
      chartData['第'+month+'月']=Math.floor(countSum/daySum);
    }
  }
}
/**
 * 初始化函数
 */
function init() {
  initGraTimeForm();
  initCitySelector();
  initAqiChartData();
}

init();