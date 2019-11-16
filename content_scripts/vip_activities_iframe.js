(async function() {

	function sleep(ms) {
		return new Promise(resolve => setTimeout(resolve, ms));
	}
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


	var i;
	for (i = 0; i < document.getElementsByTagName('li').length; i++) { 
		if (!document.getElementsByTagName('li')[i].className.includes("completed")) {
			document.getElementsByTagName('li')[i].click();
			await sleep(1);
			consolelog("Activity opened");
		}
	}
	consolelog("Activity redeem complete");
	togglerunningoff("#button-activities");
})();