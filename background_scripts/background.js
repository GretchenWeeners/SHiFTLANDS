

var BL3_SHIFTS = [];
var BL3_SHIFTS_R = 0;
var regex = /[a-zA-Z0-9]{5}-[a-zA-Z0-9]{5}-[a-zA-Z0-9]{5}-[a-zA-Z0-9]{5}-[a-zA-Z0-9]{5}/g;
var sources = [
  'https://www.reddit.com/r/Borderlandsshiftcodes/comments/d4510u/golden_key_mega_thread/.json',
  'https://www.reddit.com/r/borderlands3/comments/d41s0k/all_currently_available_shift_codes/.json',
  'https://www.reddit.com/r/Borderlandsshiftcodes/new/.json'
];

function consolelog(log) {
	var today = new Date();
	var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
	var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
	var dateTime = date+' '+time;
	console.log(`[SHiFTLANDS][${dateTime}] ${log}`);
}

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
	consolelog(`Error: ${error}`);
}

async function tryGetLatestCodes() {
	//get settings from local storage
	gettingStoredSettings = browser.storage.local.get();
	gettingStoredSettings.then(onGot, onError);

	//grab new codes and put in array
	var allcodes = [];
	var index;
	for (index = 0; index < sources.length; ++index) {
		consolelog(`Checking for new codes on ${sources[index]}`);
		var codes = [];
		codes =  await (await fetch(sources[index])).json();
		if (codes.data == undefined) {
			var allText = codes.map((response) => JSON.stringify(response.data));
		} else {
			var allText = codes.data.children.map((response) => JSON.stringify(response.data));
		}
		var matches = JSON.stringify(allText).match(regex);
		let uniq = matches => [...new Set(matches)];
		umatches = uniq(matches)
		let arrays = [umatches, allcodes];
		var newcodelist = (arrays.reduce((a, b) => a.filter(c => !b.includes(c))));
		if (newcodelist == null || newcodelist == 0 || newcodelist.length == 0) {
			return;
		}
		allcodes = allcodes.concat(newcodelist);
		consolelog(`Found ${matches.length} codes :: ${umatches.length} unique :: ${newcodelist.length} added :: ${allcodes.length} total`);
	}
	
	consolelog(`Comparing ${allcodes.length} codes against ${BL3_SHIFTS.length} known codes`);
	let arrays = [allcodes, BL3_SHIFTS];
	var newcodelist = (arrays.reduce((a, b) => a.filter(c => !b.includes(c))));
	if (newcodelist == null || newcodelist == 0 || newcodelist.length == 0) {
		consolelog(`No new codes`);
		return;
	}

	var newcodes = newcodelist.length
	if (newcodes == 0) {return;}

	consolelog(`${newcodes} new codes`);
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