

var BL3_SHIFTS = [];
var BL3_SHIFTS_R = 0;

//this is messy, im not sorry
async function onGot(item) {
	//populate settings if they are blank
	if (item.BL3_SHIFTS == undefined) {
		browser.storage.local.set({BL3_SHIFTS});
		browser.storage.local.set({BL3_SHIFTS_R});
		gettingStoredSettings = browser.storage.local.get();
		gettingStoredSettings.then(onGot, onError);
		return;
	}
	//apply current codes to array
	BL3_SHIFTS = item.BL3_SHIFTS;
	//apply current redeem state
	BL3_SHIFTS_R = item.BL3_SHIFTS_R;
	//set icon depending on if codes are ready to be redeemed

	if (BL3_SHIFTS_R < BL3_SHIFTS.length || BL3_SHIFTS_R == undefined || BL3_SHIFTS == undefined) {
		browser.browserAction.setIcon({path: "icons/border-32.png"});
		browser.browserAction.setTitle({title: "SHiFTLANDS: " + (BL3_SHIFTS.length - BL3_SHIFTS_R) + " new codes"});
		browser.browserAction.setBadgeText({text: (BL3_SHIFTS.length - BL3_SHIFTS_R).toString()});
	} else {
		browser.browserAction.setIcon({path: "icons/border-32b.png"});
		browser.browserAction.setTitle({title: "SHiFTLANDS"});
		browser.browserAction.setBadgeText({text: ""});
	}
}

async function onError(error) {
	//display an error, sometimes, or crash if the error is bad enough, cuz javascript
	console.log(`SHiFTLANDS:background.js Error: ${error}`);
}

async function tryGetLatestCodes() {
	//get settings from local storage
	gettingStoredSettings = browser.storage.local.get();
	gettingStoredSettings.then(onGot, onError);

	//grab new codes and put in array
	var codes = [];
	codes =  await (await fetch("https://suspicious-jennings-32bdb9.netlify.com/.netlify/functions/api")).json();
	
	//stop if we couldnt grab new codes
	if (codes == null) {
		onError("Couldnt grab code list");
		return;
	}
	//parse data for new codes
	let arrays = [codes, BL3_SHIFTS];
	var newcodelist = (arrays.reduce((a, b) => a.filter(c => !b.includes(c))));
	if (newcodelist == null || newcodelist == 0 || newcodelist.length == 0) {
		onError("No new codes");
		return;
	}

	var newcodes = newcodelist.length

	console.log("SHiFTLANDS:background.js: " + newcodes + " new codes");
	//apply new codes to array
	BL3_SHIFTS = BL3_SHIFTS.concat(newcodelist);
	//store new codes
	browser.storage.local.set({BL3_SHIFTS});
	//change icon by reading saved settings
	gettingStoredSettings = browser.storage.local.get();
	gettingStoredSettings.then(onGot, onError);

	//ensure out timer is dead
	clearTimeout(tglc);
	//set new timer for 10 min
	var tglc = setTimeout(tryGetLatestCodes, 600000);
}


//get new codes on load
tryGetLatestCodes();

//listen for messages from popup
browser.runtime.onMessage.addListener((message) => {
	if (message.menucommand === "shupdate") {
		tryGetLatestCodes();
	}
	
});