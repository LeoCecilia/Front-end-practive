//太棒了，我终于能够独立地解决那个bug了，***of undefined的bug
function $(selector) {
	if (selector === document) {
		return document;
	}
	selector = util.simpleTrim(selector);
	if (selector.indexOf(' ') !== -1) {
		var selectorArr = selector.split(' ');//分割成两个数组，第一个是Parent，第二个是child
		return util.Vquery(selectorArr[1], util.Vquery(selectorArr[0])[0])[0];//只返回第一个匹配项
	}else {
		return util.Vquery(selector,document)[0];
	}
}
$.on = function(element,type,listener){
		return util.addEvent(element,type,listener);
};
$.un = function(element,type,listener){
		return util.removeEvent(element,type,listener);
};
$.click = function(element,listener){
		return util.addClickEvent(element,listener);
};
$.enter = function(element,listener){
		return util.addEnterEvent(element,listener);
};
$.delegate = function(element,tag,eventName,listener){
		return util.delegateEvent(element,tag,eventName,listener);
};	 

var util = {
	uniqArray: function (arr) {
		var a = [];
		for(var i = 0; i < arr.length; i++){
			if (a.indexOf(arr[i]) === -1) {
				a.push(arr[i]);
			}
		}
		return a;
	},
	cloneObject: function (obj) {
		var o;
		if(typeof(obj) !== "object" || obj === null)return obj;
		else if(obj instanceof(Array))
		{
			o=[];
			obj.forEach(function(item,index,array){
				if(typeof(item) === 'object' && item !== null){
					o[index] = arguments.callee(item);
				}else{
					o[index] = item;
				}
			});
		} 
		else
		{
			o = {};
			for(var i in obj)
			{
				if(typeof(obj[i]) === "object" && obj[i] !== null)
				{
					o[i]=arguments.callee(obj[i]);
				}
				else
				{
					o[i]=obj[i];
				}
			}
		}
 	
		return o;
	},
	getPosition: function (element) {
		var position = {};
    	//获取相对位置+滚动距离=绝对位置.
    	//document.body.scrollTop or document.documentElement.scrollTop
    	//前者是ff,opera,IE浏览器兼容的，后者是safari和chrome兼容的,故用他们的最大值解决兼容问题
    	position.x = element.getBoundingClientRect().left + Math.max(document.documentElement.scrollLeft, document.body.scrollLeft);
    	position.y = element.getBoundingClientRect().top + Math.max(document.documentElement.scrollTop, document.body.scrollTop);
    	return position;
	},
	//模拟querySelector
	Vquery: function (element, root) {
		var ele = [],
	    	allChildren = null;
		root = root || document;
		switch (element.charAt(0)) {
			case '#'://id
				ele.push(root.getElementById(element.substring(1)));
				break;
			case '.'://类
				if (root.getElementsByClassName) {
					ele = root.getElementsByClassName(element.substring(1));
				}else {//向后兼容低版本浏览器
					var reg = new RegExp('\\b'+element.substring(1)+'\\b');//  \b匹配单词边界 中间可加‘-’
					allChildren = root.getElementsByTagName('*');//返回所有的tagName节点
					for(var i of allChildren){
						if (reg.test(i.className)) {
							ele.push(i);
						}
					}
				}
	
				break;
	
			case '[':
				//不带值的属性
				if (element.indexOf('=') === -1) {
					allChildren = root.getElementsByTagName('*');
					for(var i of allChildren){
						if (i.getAttribute(element.slice(1,-1)) !== null) {
							ele.push(i);
						}
					}
				}
				//带值的属性
				else {
					var index = element.indexOf('=');//
					allChildren = root.getElementsByTagName('*');
					for(var i of allChildren){
						if (i.getAttribute(element.slice(1,index)) === element.slice(index + 1, -1)) {
							ele.push(i);
						}
					}
				}
				break;
	
			default://tagName
				ele = root.getElementsByTagName(element);
				break;
		}
		return ele;	
	},
	addEvent : function(ele,event,handler){
		if (ele.addEventListener) {
			ele.addEventListener(event, handler, false);
		}else if (ele.attachEvent) {
			ele.attachEvent('on'+event, handler);
		}else {
			ele['on'+event] = handler;
		}		
	},
	removeEvent: function(element,event,handler){
		if (element.removeEventListener) {
			element.removeEventListener(element,handler,false);
		}else if (element.detachEvent) {
			element.detachEvent('on'+event,handler);
		}else{
			element['on'+event] = null;
		}		
	},
	getTarget: function(event){
		return event.target || event.srcElement;
	},
	getEvent: function(event){
		return event ? event : window.event;
	},
	preventDefault: function(event){
		if (event.preventDefault) {
			event. preventDefault();
		}else{
			event.returnValue = false;
		}
	},
	stopPropagation: function(event){
		if (event.stopPropagation) {
			event.stopPropagation();
		}else{
			event.cancelBubble = true;
		}
	},
	getRelatedTarget: function(event){
		if (event.relatedTarget) {
			return event.relatedTarget;
		}else if (event.toElement) {
			return event.toElement;
		}else if (event.fromElement) {
			return event.fromElement;
		}else{
			return null;
		}
	},
	//
	delegateEvent : function(element,tag,eventName,listener) {

		return this.addEvent(element, eventName, function(ev){
			var oEvent = ev || event, //兼容处理
        		target = oEvent.target || oEvent.srcElement; //兼容处理
			if (target.tagName.toLocaleLowerCase() === tag || hasClass(target,tag)) {
				listener.call(target,oEvent);//使用call方法修改this的指向
			}
		});
	},	
	addClickEvent: function (element,listener){
		this.addEvent(element,'click',listener);
    },
	addEnterEvent: function (element,listener){
		this.addEvent(element,'keydown',function(ev){//这里本来就要传入一个函数来触发的事件的
			var oEvent = ev || window.event;
			if (oEvent.keyCode === 13) {
				listener();
			}
		});
	},


	isIE : function () {
		/*版本号*/
		/*Internet Explorer 11 的 user-agent: 
		Mozilla/5.0 (Windows NT 6.3; Trident/7.0; rv 11.0) like Gecko
		Internet Explorer 10及以前的ie浏览器的user-agent (on Windows 7): 
		Mozilla/5.0 (compatible; MSIE 10.0; Windows NT 6.1; WOW64; Trident/6.0)
		*/

		//在从网上了解到的资料来看，在对于某个功能事件的时候不要去做浏览器检测
		//而应该做特性检测。这样更符合要求，且浏览器的UserAgent可人为修改
		var uUserAgent = navigator.userAgent,
			isAgent = uUserAgent.match(/msie(\d+.\d)/i);
		if (isAgent) {
			return isAgent[1];//返回版本号
		}else if (uUserAgent.match(/Trident\/7.0;/i)) {//检测到IE11
			isAgent = uUserAgent.match(/rv (\d+.\d)/i);
			return isAgent[1];
		}
		return -1;//不是IE浏览器		
	},
	simpleTrim : function(str){
		//字符串匹配
		var result = '';
		for (var i = 0; i < str.length; i++) {
			if (str[i] !== ' ' && str[i] !== '\t') {
				break;
			}
		}
		for(var j = str.length-1; j>0;j--){
			if (str[j] !== '' && str[i] !== '\t') {
				break;
			}
		}
		result = ''+str+''.substring(i,j+1);//很重要!!!
		return result;
	}
/*	trim: function (str) {
		//正则表达式匹配;
		//[\s]表示出现空白就匹配;
		//[\S]表示非空白就匹配
		 var result = '';
		 result = str.replace(/^\s+|\s+$/g,'');
		 return result;
	}*/

},
cookie = {
	setCookie : function (cookieName, cookieValue,expiredays) {
		var oDate = new Date();//自动获取当前的日期
		oDate.setDate(oDate.getDate()+expiredays);
		document.cookie = cookieName + '=' + cookieValue + '; expire =' +expiredays;
	},
	getCookie: function (cookieName) {
		var arr = document.cookie.split('; ');
		for (var i = 0; i < arr.length; i++) {
			var arr2 = arr[i].split('=');
			if (arr2[0] === cookieName) {
				return arr2[1];
			}
		}
		return '';	
	},
	removeCookie: function (cookieName) {
		this.setCookie(cookieName,'',-1);
	}
};



function ajax(url, options){
	//创建XHR对象
	var oAjax = null;
	if (window.XMLHttpRequest) {
		oAjax = new XMLHttpRequest();
	}else {
		oAjax = new ActiveXObject('Microsoft.XMLHttpRequest');
	}

	//连接服务器
	var param = '',
	    data = options.data ? options.data : -1;
	 if (typeof(data) === 'object') {
	 	for(var key in data){//请求参数拼接
	 		if (data.hasOwnProperty(key)) {
	 			param += key + '=' + data[key] +'&';
	 		}
	 	}
	 	param.replace(/&$/,'');//去除结尾的&
	 }else {
	 	param = options.data;
	 }

	 //发送请求
	 var type = options.type ? options.type.toUpperCase() : 'GET';
	 if (type === 'GET') {
	 	oAjax.open('GET', url + '?' + param, true);
	 	oAjax.send(null);
	 }else {
	 	oAjax.open('POST',url,true);
	 	oAjax.setRequestHeader('Content-type','application/x-www-form-urlencoded');
	 	oAjax.send(param);
	 }

	 //接收返回
	 //onReadyStateChange事件
	 oAjax.onreadystatechange = function () {
	 	if (oAjax.readyState === 4) {
	 		try {
	 			if (oAjax.status === 200) {
	 				options.onsuccess(oAjax.responseText,oAjax);
	 			}else if(options.onfail){	 			  
	 					options.onfail(oAjax);
	 			}
	 		} catch(e) {
	 			// statements
	 			console.log('Request did not return in a second.');
	 		}
	 			
	 	}
	 	oAjax.timeout = 1000;
	 	oAjax.ontimeout = function () {
	 		console.log('Request did not return in a second.');
	 	};
	 };
	 return oAjax;
}

//DOM部分
function hasClass(element,sClass) {
	if (element && element.className) {
		return element.className.match(new RegExp('(\\s|^)'+sClass+'(\\s|$)'));
	}else{
		return false;
	}
}
function addClass(element,nClass) {
	if (!hasClass(element,nClass)) {
		element.className += ' ' + nClass;
	}
}
function removeClass(element,oldClass) {
	if (hasClass(element,oldClass)) {
		var reg = new RegExp('(\\s|^)' + oldClass + '(\\s|$)');
		element.className = element.className.replace(reg,'');
	}
}
function getStyle(element, attr) {
	if (element.currentStyle) {
		return element.currentStyle[attr];
	}else{
		return getComputedStyle(element,false)[attr];
	}
}
/**
 * 完美运动框架
 * @param {HTMLElement} element 运动对象
 * @param {JSON}        json    属性：目标值
 *   @property {String} attr    属性值
 *   @config   {Number} target  目标值
 * @param {function}    func    可选，回调函数，链式动画。
 */
 function startMove(element,json,func) {
 	clearInterval(element.timer);
 	var flag = true;
 	element.timer = setInterval(function(){
 		for(var attr in json){
 			var iCurrent = 0;
 			if (attr === 'opacity') {//Math.round()四舍五入
 				iCurrent = Math.round(parseFloat(getStyle(element,attr))*100);

 			}else{
 				iCurrent = parseInt(getStyle(element,attr));
 			}
 			//计算运动速度
 			var iSpeed = (json[attr] - iCurrent)/10;//(目标值-当前值)/缩放系数 = 速度
 			iSpeed = iSpeed > 0? Math.ceil(iSpeed):Math.floor(iSpeed);//速度取整
 			//未达到目标值，执行代码
 			if (iCurrent !== json[attr]) {
 				flag = false;
 				if (attr === 'opacity') {
 					////IE alpha是用来设置透明度的，其基本属性filter:alpha
 					//filter是滤镜函数
 					element.style.filter = 'alpha(opacity:'+(iCurrent + iSpeed) + ')';
 					element.style.opacity = (iCurrent+iSpeed)/100;//标准
 				}else{
 					element.style[attr] = iCurrent + iSpeed +'px';
 				}
 			}else{
 				flag = true;
 			}
 			//运动终止，是否回调
 			if (flag) {
 				clearInterval(element.timer);
 				if (func) {
 					func();
 				}
 			}

 		}
 	},30);
 }
 function getIndex(element) {
 	var aBrother = element.parentNode.children;
 	for (var i = 0; i < aBrother.length; i++) {
 		if (aBrother[i] === element) {
 			return i;
 		}
 	}
 }

 //task5
 function changeFormat(arg) {
    return parseInt(arg.substr(0,arg.length-2));
  }
 function MaxTop(arg) {
   var a = changeFormat(arg[0].style.top);
   for (var i = 0; i < arg.length; i++) {
      var b = changeFormat(arg[i].style.top);
      if (b>a) {
        a = b;
      }
   }
   return a;
}
  function compare(arg,ele) {//元素移到另一容器时使用
    var eTop = changeFormat(ele.style.top);
    for (var i = 0; i < arg.length; i++) {
      var aTop = changeFormat(arg[i].style.top);
      //37px>118px,故应先将其转化为整型
      if(aTop >= eTop){
          arg[i].style.top = (27+aTop)  + 'px';//20px为元素的高度，7px为元素间隙
      }
    } 
  }
