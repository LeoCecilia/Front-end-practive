/*我终于学会怎么用chrome调试js了*/
function addEventHandler(ele, event,handler)  {
	if (ele.addEventListener) {
		ele.addEventListener(event, handler, false);
	}else if (ele.attachEvent) {
		ele.attachEvent('on'+event, handler);
	}else {
		ele['on'+event] = handler;
	}
}
	function simpleTrim (str){
		//字符串匹配
		var result = '';
		for (var i = 0; i < str.length; i++) {
			if (str[i] !== ' ' && str[i] !== '\t') {
				break;
			}
		}
		for(var j = str.length-1; j>0;j--){
			if (str[j] !== '' && str[j] !== '\t') {
				break;
			}
		}
		result = str.substring(i,j+1);//很重要!!!
		return result;
	}

window.onload = function(){
	var container = document.getElementById('show'),
		textarea = document.getElementById('text'),//必须用id获取
		buttonList = document.getElementsByTagName('input'),
		//记得用数组啊
		queue = {
			str: [],
			leftPush: function(num){
				this.str.unshift(num);
				this.render();
			},
			rightPush: function(num) {
				this.str.push(num);
				this.render();
			},
			isEmpty: function () {
				return (this.str.length === 0);
			},
			leftPop: function (num) {
				if (!this.isEmpty()) {
				 	alert(this.str.shift());
				 	this.render();
				}else {
					alert('the queue is empty');
				}
			},
			rightPop: function (num) {
				if (!this.isEmpty()) {
				 	alert(this.str.pop());
				 	this.render();
				}else {
					alert('the queue is empty');
				}
			},
			//调用了fuzzySearch方法(模拟匹配)
			render: function (flag,search) {
				var items = '';
				flag = flag || 0;
				for(var Int of this.str){
					if (flag) {
						if (this.fuzzySearch(search,Int)) {	
						//RegExp["$&"]显示的是最近一次匹配项						
							items += '<div>'+RegExp["$`"]+'<span>'+RegExp["$&"]+'</span>'+RegExp["$'"]+'</div>';
						}else{
							items += '<div>'+Int+'</div>';
						}
					}else{
						items += '<div>'+Int+'</div>';
					}
				}
				document.getElementById('show').innerHTML = Int ? items : '';
				addDivDelEvent();				  
			},
			delId: function (id) {
				this.str.splice(id, 1);
				this.render();
			},
			fuzzySearch : function (search,searched) {
				var reg = new RegExp(search,'gi');
				if (searched.match(reg)) 
					return true;
				else
					return false;				
			}
		};
		function addDivDelEvent () {
			 for (var i = 0; i < container.childNodes.length; i++) {
			  	addEventHandler(container.childNodes[i], 'click', function (m){
			  		//此处必须使用闭包，不然的话，i永远是鼠标相对于界面的值！
			  		//若用了事物管理，则不需要使用闭包
			  		return function () {
			  			 queue.delId(m);
			  		};			  			  			  				  
			  	}(i));
			 } 
		}
		addEventHandler(buttonList[0],'click',function () {
			 var input = simpleTrim(textarea.value).split(/\n|\s+|\,|\，|\;|\；|、|\.|。/);
			 for (var i = 0; i < input.length; i++) {
			 	queue.leftPush(input[i]);
			 }
		});
		addEventHandler(buttonList[1],'click',function () {
			 var input = simpleTrim(textarea.value).split(/\n|\s+|\,|\，|\;|\；|、|\.|。/);
			 for (var i = 0; i < input.length; i++) {
			 	queue.rightPush(input[i]);
			 }			 
		});
		addEventHandler(buttonList[2],'click',function () {
			 queue.leftPop(); 
		});
		addEventHandler(buttonList[3],'click',function () {
			 queue.rightPop(); 
		});
		addEventHandler(buttonList[5],'click',function () {
			var input = simpleTrim(buttonList[4].value);
			if (queue.str.length > 0) {
				queue.render(1,input);//render会调用fuzzySearch方法
			}else{
				alert('queue is empty!');
			}
		});
};