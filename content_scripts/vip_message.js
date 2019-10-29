(async function() {

function consolelog(log) {
	var today = new Date();
	var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
	var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
	var dateTime = date+' '+time;
	console.log(`[SHiFTLANDS][${dateTime}] ${log}`);
}

document.getElementsByClassName('text-shadow-heading mb-lg')[0].innerText="TRYING VIP CODES";
document.getElementsByClassName('max-w-subheading mx-auto')[0].innerHTML="SHiFTLANDS will now download and run <a href=\"https://github.com/rockdevourer/borderlands/blob/master/borderlands3/bl3_vip_code_redeem.js\"><b>bl3_vip_code_redeem.js</b></a> by <a href=\"https://github.com/rockdevourer\"><b>rockdevourer</b></a>. <br>An alert should appear shortly.";

consolelog(`Testing connection to https://2kgames.crowdtwist.com/`);
var codes = [];
try { 
	codes =  await (await fetch("https://2kgames.crowdtwist.com/"));
	consolelog(`Succeeded on connection test.`);
} catch(e) {
	document.getElementsByClassName('text-shadow-heading mb-lg')[0].innerText="FAILED!!";
	document.getElementsByClassName('max-w-subheading mx-auto')[0].innerHTML="Something is blocking our connection. Whitelist crowdtwist.com in all ad-blocking extensions, even if they are off. <a href=\"https://imgur.com/a/BFsyaau\"><br><b>uBlock users click here</b></a>.";
	consolelog(`Failed on connection test.`);
}


})();