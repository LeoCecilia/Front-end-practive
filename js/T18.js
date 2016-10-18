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

window.onload = function(){
	var container = document.getElementById('show'),
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
			render: function () {
				var items = '';
				for(var Int in this.str){
					items += '<div>'+this.str[Int]+'</div>';
				}
				document.getElementById('show').innerHTML = Int ? items : '';
				addDivDelEvent();				  
			},
			delId: function (id) {
				this.str.splice(id, 1);
				this.render();
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
		addEventHandler(buttonList[1],'click',function () {
			 var input = buttonList[0].value.trim();
			 if (input.match(/^\d+$/)) {
			 	queue.leftPush(input);
			 }else {
			 	alert("plz enter an interger!");
			 }
		});
		addEventHandler(buttonList[2],'click',function () {
			console.log(buttonList[0].value);
			 var input = buttonList[0].value.trim();
			 if (input.match(/^\d+$/)) {
			 	queue.rightPush(input);
			 }else {
			 	alert("plz enter an interger!");
			 }
		});
		addEventHandler(buttonList[3],'click',function () {
			 queue.leftPop(); 
		});
		addEventHandler(buttonList[4],'click',function () {
			 queue.rightPop(); 
		});				
};