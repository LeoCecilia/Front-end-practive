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
			if (str[i] !== ' ' && str[i] !== '\t' && str[i] !== '\n') {
				break;
			}
		}
		for(var j = str.length-1; j>0;j--){
			if (str[j] !== '' && str[j] !== '\t' && str[j] !== '\n') {
				break;
			}
		}
		result = str.substring(i,j+1);//很重要!!!
		return result;
	}

window.onload = function(){
	var container = document.getElementById('show'),
		textarea = document.getElementById('text'),//必须用id获取
		button = document.getElementsByTagName('input')[0];
		//记得用数组啊
		function queue() {
			this.str = [];
		}
		queue.prototype = {
			Push : function(num){
				if (num !== '') {
					this.str.push(num);
				}
			},
			getArr :function () {
				return this.str;
			},
			leftPush: function(num){
				if (num !== '') {
					this.str.unshift(num);
					this.uniqArr();
					this.limitTen();
					this.render();
				}
			},
			rightPush: function(num) {
				if (num !== '') {
					this.str.push(num);
					this.uniqArr();
					this.limitTen();
					this.render();
				}
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
			//flag表示是否进行模糊匹配
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
			uniqArr : function () {
				for (var i = 0; i < this.str.length-1; i++) {
					for (var j = i+1; j < this.str.length; j++) {
						if (this.str[i] === this.str[j]) {
							this.delId(j);
						}
					}
				}
			},
			fuzzySearch : function (search,searched) {
				var reg = new RegExp(search,'gi');
				if (searched.match(reg)) 
					return true;
				else
					return false;				
			},
			limitTen : function () {
				if (this.str.length <= 10) {
					return;
				}else{
					while(this.str.length > 10){
						this.delId(0);
					}
				}
			}
		};
		var Queue = new queue();
		function addDivDelEvent () {
			 for (var i = 0; i < container.childNodes.length; i++) {
			 	addEventHandler(container.childNodes[i],'mouseover', function (m){
			 		return function () {			 			
			 			var a = container.childNodes[m].innerHTML;
			 			container.childNodes[m].innerHTML = '删除：'+ a;
			 		};
			 	}(i));
			 	addEventHandler(container.childNodes[i],'mouseout', function (m){
			 		return function () {
			 			container.childNodes[m].innerHTML = Queue.getArr()[m];
			 		};
			 	}(i));
			  	addEventHandler(container.childNodes[i], 'click', function (m){
			  		//此处必须使用闭包，不然的话，i永远是鼠标相对于界面的值！
			  		//若用了事件管理，则不需要使用闭包
			  		return function () {
			  			 Queue.delId(m);
			  		};
			  	}(i));
			 }
		}
		addEventHandler(button,'click',function () {
			 var input = simpleTrim(textarea.value).split(/\n|\s+|\,|\，|\;|\；|、|\.|。/);
			 for (var i = 0; i < input.length; i++) {			 
			 	Queue.Push(input[i]);
			 }
			 Queue.uniqArr();
			 Queue.limitTen();
			 Queue.render();
		});
};