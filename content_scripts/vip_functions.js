function consolelog(log) {
	var today = new Date();
	var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
	var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
	var dateTime = date+' '+time;
	console.log(`[SHiFTLANDS][${dateTime}] ${log}`);
	browser.runtime.sendMessage({
		statuscommand: log
	});
}

function togglerunningoff(buttonName) {
	browser.runtime.sendMessage({
		togglerunningoff: buttonName
	});
}

