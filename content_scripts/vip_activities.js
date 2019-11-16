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
	
	consolelog(`Testing connection to https://2kgames.crowdtwist.com/`);
	var codes = [];
	try { 
		codes =  await (await fetch("https://2kgames.crowdtwist.com/"));
		consolelog(`Nothing is blocked`);
	} catch(e) {
		document.getElementsByClassName('text-shadow-heading mb-lg')[0].innerText="FAILED!!";
		document.getElementsByClassName('max-w-subheading mx-auto')[0].innerHTML="Something is blocking our connection. Whitelist crowdtwist.com in all ad-blocking extensions, even if they are off. <a href=\"https://imgur.com/a/BFsyaau\"><br><b>uBlock Origin / Nano users click here</b></a>.";
		consolelog(`Failed on connection test`);
		return;
	}
	
	consolelog("Testing if popups are being blocked");
	var url = "https://borderlands.com/en-US/vip-activities/";
	var newWin = window.open(url); 
	if(!newWin || newWin.closed || typeof newWin.closed=='undefined') { 
		document.getElementsByClassName('text-shadow-heading mb-lg')[0].innerText="POPUPS BLOCKED";
		document.getElementsByClassName('max-w-subheading mx-auto')[0].innerHTML="Please enable popups for all of \"Borderlands.com\" then try again.";
		return;
	} else {
		newWin.close();
		consolelog("Popups allowed");
		document.getElementsByClassName('text-shadow-heading mb-lg')[0].innerText="Ready to run";
		document.getElementsByClassName('max-w-subheading mx-auto')[0].innerHTML="This will open and (hopefully) close a LOT of tabs. <br>Please wait for the page to completely load, then click the \"Redeem VIP Activities\" button again when you are ready.";
	}

	//var i;
	//for (i = 0; i < document.getElementsByTagName('li').length; i++) { 
	//	if (!document.getElementsByTagName('li')[i].className.includes("completed")) {document.getElementsByTagName('li')[i].click()}
	//}
	
})();