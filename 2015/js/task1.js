/*可是我怎么那么笨呢，哪里出现了问题，
就得先看调用它的地方，有没有出现问题啊*/

window.onload = function handle_1(){
	var input = $('textarea'),
		btn = $('#btn'),
		ul = $('#userOutput'),
		text = '';

	$.click(btn, function(argument) {
		ul.innerHTML = '';
		var Value = input.value.split(/\n|\s+|\,|\，|\;|\；|、|\.|。/),
			unValue = util.uniqArray(Value);
			//Value = [''];
			//console.log(Value === ['']);   false
			//console.log(Value == '');      true
		if (Value == '' || Value.length > 10) {
			$("p").style.display = "block";
		}else {
			$("p").style.display = "none";
			for(var i in unValue){
				if (unValue[i] !== '') {
					//checkbox放在label里面
					//点击爱好时,同时能选中多选框
					text += '<li>'+"<label>" + "<input type='checkbox'>" +' '+ unValue[i] + "</label>"+'</li>';
				}
			}
			ul.innerHTML = text;	
			text = '';
		}
		Value = '';
	});	

};