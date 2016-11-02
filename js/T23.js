var btn = document.getElementsByTagName('button'),
	widthTraverseBtn = btn[0],
	breadthTraverseBtn = btn[1],
	widthSearch = btn[2],
	breadthSearch = btn[3],
	treeRoot = document.getElementById('root'),
	TraversalList = [],
	timer = null;

function addEventHandler(ele, event,handler)  {
	if (ele.addEventListener) {
		ele.addEventListener(event, handler, false);
	}else if (ele.attachEvent) {
		ele.attachEvent('on'+event, handler);
	}else {
		ele['on'+event] = handler;
	}
}
//跨浏览器兼容
function content(ele) {
	if (ele.innerText) {
		return ele.innerText;
	}
	if (ele.textContent) {
		return ele.textContent;
	}
}
//widthTraversal
//stack LIFO
function traverseDF(Root) {
	(function recurse(currentNode) {	
		for (var i = 0; i < currentNode.children.length; i++) {
			recurse(currentNode.children[i]);
		}
		TraversalList.push(currentNode);
	})(Root);
}

//breadthTraversal
//queue FIFO
function traverseBF(Root) {
	var queue = [];//用数组模拟队列
	queue.unshift(this.root);
	currentNode = queue.shift();
	while(currentNode){
		for (var i = 0; i < currentNode.children.length; i++) {
			queue.push(currentNode.children[i]);
		}
		TraversalList.push(currentNode);
		currentNode = queue.shift();
	}
}

//颜色变化函数
function changeColor(searched,flag) {
	var i = 0;
	searched = searched || null;//不能设为''
	flag = (flag===0) ? flag : (flag || -1);//flag用来标志是否进行搜索,flag = 0搜索，flag = -1则不搜索
	TraversalList[i].style.backgroundColor = '#EA384D';
	timer = setInterval(function () {
			if (i < TraversalList.length) {
				if (content(TraversalList[i]).match(new RegExp('^'+searched,'i'))) {
					flag = 1;
					if ((++i)<TraversalList.length) {//自加后再取值
						TraversalList[i].style.backgroundColor = '#EA384D';
					}					
				}else{
					TraversalList[i].style.backgroundColor = '#fff';
					if((++i)<TraversalList.length){
						TraversalList[i].style.backgroundColor = '#EA384D';
					}
				}
			}else{
				clearInterval(timer);
				if (!flag) {
					alert('搜索失败');
				}
			}
	},500);
}

//初始化样式
function reset() {
	var div = document.getElementsByTagName('div');
	TraversalList = [];
	clearInterval(timer);
	for (var i = 0; i < div.length; i++) {
		div[i].style.backgroundColor = '#fff';
	}
}

window.onload = function () {
	addEventHandler(widthTraverseBtn,'click',function () {
		reset();
		traverseDF(treeRoot);
		changeColor();
	});
	addEventHandler(breadthTraverseBtn,'click',function () {
		reset();
		traverseBF(treeRoot);
		changeColor();
	});	
	addEventHandler(widthSearch,'click',function () {
		var searched = document.getElementById('input').value;
		if (searched) {
			reset();
			traverseDF(treeRoot);
			changeColor(searched,0);
		}else{
			alert('输入值不能为空');
		}	
	});	
	addEventHandler(breadthSearch,'click',function () {
		var searched = document.getElementById('input').value;	
		if (searched) {
			reset();
			traverseBF(treeRoot);
			changeColor(searched,0);		
		}else{
			alert('输入值不能为空');
		}		
	});	
};