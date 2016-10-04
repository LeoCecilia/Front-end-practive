window.onload = inputFormat();
function inputFormat() {
	var input = $('input'),
    btn = $('#btn'),
    show = $('div');
	$.click(btn, function start(){
		var Value = input.value.match(/(^\d{4})-(\d{2})-(\d{2}$)/);
		if (Value !== null) {
			var d = new Date(),
			time = new Date(Value[1],Value[2]-1,Value[3]),
			t = time - d;
			if(t<=0){
				clearTimeout(start);//clearTimeout() 方法可取消由 setTimeout()方法设置的 timeout
				show.innerHTML = '时间已经到了';
			}else{
				var day =  parseInt(t/1000/24/60/60),
					hour = parseInt(t/(1000*60*60)%24),
					minute = parseInt(t/(1000*60)%60),
					sec = parseInt(t/1000%60);
				show.innerHTML = '距离' + time.getFullYear() + '年' + (time.getMonth() + 1) +'月' + time.getDate() + '日，还有'+day +'天'+hour +'时'+minute+'分'+sec+'秒';
				setTimeout(start,1000);//使用回调函数，定时执行
			}

		}else{
			show.innerHTML = '输入有误，请按指定格式输入';
		}
	});
}