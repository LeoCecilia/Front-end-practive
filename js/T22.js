var btn = document.getElementsByTagName('button'),
	preBtn = btn[0],
	midBtn = btn[1],
	postBtn = btn[2],
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
window.onload = function () {
	addEventHandler(preBtn,'click',function () {
		reset();
		preOrder(treeRoot);
		changeColor();
	});
	addEventHandler(midBtn,'click',function () {
		reset();
		midOrder(treeRoot);
		changeColor();
	});	
	addEventHandler(postBtn,'click',function () {
		reset();
		postOrder(treeRoot);
		changeColor();
	});	
};	
function preOrder(node) {
	if (node) {
		TraversalList.push(node);
		preOrder(node.firstElementChild);
		preOrder(node.lastElementChild);
	}
}
function midOrder(node) {
	if (node) {
		midOrder(node.firstElementChild);
		TraversalList.push(node);
		midOrder(node.lastElementChild);
	}
}
function postOrder(node) {
	if (node) {
		postOrder(node.firstElementChild);
		postOrder(node.lastElementChild);
		TraversalList.push(node);
	}
}
//颜色变化函数
function changeColor() {
	var i = 0;
	TraversalList[i].style.backgroundColor = '#EA384D';
	timer = setInterval(function () {
		i++;
		//很重要
		if (i < TraversalList.length) {
			TraversalList[i-1].style.backgroundColor = '#fff';
			TraversalList[i].style.backgroundColor = '#EA384D';
		}else{
			clearInterval(timer);
			TraversalList[TraversalList.length-1].style.backgroundColor = '#fff';
		}
	},500);
}

//初始化样式
function reset() {
	TraversalList = [];
	clearInterval(timer);
}