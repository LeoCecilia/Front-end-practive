//先设好所有想要调试的断点，再进行调试
window.onload = load();
function load() {
 var dragged,
     leftD = document.querySelectorAll('.left .draggable'),
     rightD = document.querySelectorAll('.right .draggable');
 display(leftD);
 display(rightD);
 DRAG('draggable');
 DropZone('dropzone');
 DDed('draggable');
 DDed('dropzone');
 function display(arg) {     
    //HTML的drag事件之后，且使用了removeChild之后，会以文本的形式存放，nodeName = '#text';
    for (var i = 0; i < arg.length; i++) {
       arg[i].style.top = (10+27*i) + 'px';     
    }
 }
 /* 可拖动的目标元素会触发事件 */
function DRAG(ele) {
  		$.delegate(document,ele,'dragstart',function(event) {
      		// 保存拖动元素的引用(ref.)
      		dragged = event.target;
      		var target = event.target;
      		event.dataTransfer.effectAllowed = 'move';
      		event.dataTransfer.setData(null,null);
      		// 使其半透明
      		event.style.opacity = 0.5;
  		});
  		$.delegate(document,ele,'drag',function (event) {
  			event.dataTransfer.effectAllowed = 'move';
  		});
  		$.delegate(document,ele,'dragend',function(event) {
			event.target.style.opacity = "";  			
  		});
  		$.delegate(document,ele,'drop',function(event) {
  			 event.preventDefault();
      		var event = event || window.event,
          		target = event.target || event.srcElement,
          		dTop = dragged.style.top,
          		thisTop = target.style.top,
          		dParent = dragged.parentNode,
          		thisParent = target.parentNode;
      		if (dParent.className === thisParent.className) {
          		dragged.style.top = thisTop;
          		target.style.top = dTop;
     		}else{
          		dParent.removeChild(dragged);
         		display(dParent.children);
          		dragged.style.top = thisTop;
          		compare(thisParent.children,dragged);
          		thisParent.appendChild(dragged);
      		}
        	target.style.opacity = '1';   		
  		});
  	
}
  //拖放区域触发事件
function DropZone(ele) {
  		$.delegate(document,ele,'drop',function(event) {
  			// 阻止默认动作（如打开一些元素的链接）
      		event.preventDefault();
      		// 移动拖动的元素到所选择的放置目标节点
        		var dParent =  dragged.parentNode;
         		event.target.style.opacity = "1";
         		//childNode返回的是所有节点、属性以及，children返回的是HTML节点
         		//使用removeChild之后，event.target.innerHTML !== null 而是 [text,text,text,text]
         		//text是文本节点
         		//这里有点问题
         	if (!event.target.children.length) {
           		dragged.parentNode.removeChild(dragged);
           		display(dParent.children);
           		event.target.appendChild(dragged);          
           		dragged.style.top = 10+'px';
         	}else{
           		dragged.parentNode.removeChild(dragged);
           		display(dParent.children);
           		//经过拖拽后，event.target.lastElementChild并不一定等于Top值最大的，故要找一个Top值最大的
           		dragged.style.top = 27 + MaxTop(event.target.children) + 'px';
           		event.target.appendChild(dragged);
         	}
         
  		});
}
//拖动区域与可拖动元素触发事件
function DDed(ele) {
 	$.delegate(document,ele,'dragover',function(event) {
  		//阻止默认行为 			
 		event.preventDefault();
      	event.dropEffect = 'move';
 	});
  	$.delegate(document,ele,'dragenter',function(event) {
  		//阻止默认行为
  		event.preventDefault();
        event.target.style.opacity = "0.5";
  	});
  	$.delegate(document,ele,'dragleave',function (event) {
  		event.target.style.opacity = "1";
  	});
 }
}