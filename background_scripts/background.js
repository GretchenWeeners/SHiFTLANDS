
// SHiFTlands background.js
// checks for updates to codes every 10 minutes or on command

function foo() {
	//for testing
  console.log("communication open with background.js");
}

//for testing
console.log("background.js loaded");

var BL3_SHIFTS = [];
var BL3_SHIFTS_R = 0;

async function onGot(item) {
		
	console.log(item.BL3_SHIFTS.length);
	//apply current codes to array
	BL3_SHIFTS = item.BL3_SHIFTS;
	//apply current redeem state
	BL3_SHIFTS_R = item.BL3_SHIFTS_R;
	//set icon depending on if codes are ready to be redeemed
	if (BL3_SHIFTS_R == 1) {
		browser.browserAction.setIcon({path: "icons/border-32b.png"});
	} else {
		browser.browserAction.setIcon({path: "icons/border-32.png"});
	}
}

async function onError(error) {
	//display an error, sometimes, or crash if the error is bad enough, cuz javascript
	console.log(`Error: ${error}`);
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
		console.error('codes null');
		return;
	}

	//if we have new codes
	if (codes.length > BL3_SHIFTS.length) {
		var newcodes = codes.length - BL3_SHIFTS.length

		console.log(newcodes + " new codes");
		//apply new codes to array
		BL3_SHIFTS = codes;
		//set redeemed to false
		BL3_SHIFTS_R = 0;
		//store new codes
		browser.storage.local.set({BL3_SHIFTS});
		//store redeemed state
		browser.storage.local.set({BL3_SHIFTS_R});
		//change icon
		browser.browserAction.setIcon({path: "icons/border-32.png"})
	} else {
		//if we dont, try again in 10 min
		console.log('no new codes, will try again in 10 min.');
	}
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