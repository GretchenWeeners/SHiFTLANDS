
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

		
	if (BL3_SHIFTS_R < BL3_SHIFTS.length || BL3_SHIFTS_R == undefined) {
		browser.browserAction.setIcon({path: "icons/border-32.png"});
	} else {
		browser.browserAction.setIcon({path: "icons/border-32b.png"});
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
	let arrays = [codes, BL3_SHIFTS];
	//console.log(arrays.reduce((a, b) => a.filter(c => !b.includes(c))));
	var newcodelist = (arrays.reduce((a, b) => a.filter(c => !b.includes(c))));
	console.log(newcodelist);
	
	if (newcodelist == null || newcodelist == 0 || newcodelist.length == 0) {
		console.error('newcodelist null: no new codes');
		return;
	}

	var newcodes = newcodelist.length

	console.log(newcodes + " new codes");
		//apply new codes to array
	BL3_SHIFTS = BL3_SHIFTS.concat(newcodelist);
		//store new codes
	browser.storage.local.set({BL3_SHIFTS});
		//change icon
	browser.browserAction.setIcon({path: "icons/border-32.png"})

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