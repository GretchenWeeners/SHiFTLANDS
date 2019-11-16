

var BL3_SHIFTS = [];
var BL3_SHIFTS_R = 0;
var regex = /[a-zA-Z0-9]{5}-[a-zA-Z0-9]{5}-[a-zA-Z0-9]{5}-[a-zA-Z0-9]{5}-[a-zA-Z0-9]{5}/g;
var defaultsources = [
  "https://www.reddit.com/r/Borderlandsshiftcodes/comments/d4510u/golden_key_mega_thread/.json",
  "https://www.reddit.com/r/borderlands3/comments/d41s0k/all_currently_available_shift_codes/.json",
  "https://www.reddit.com/r/Borderlandsshiftcodes/new/.json"
];
var sources = "";

function sleep(ms) {
	return new Promise(resolve => setTimeout(resolve, ms));
}

function consolelog(log) {
	var today = new Date();
	var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
	var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
	var dateTime = date+' '+time;
	console.log(`[SHiFTLANDS][${dateTime}] ${log}`);
	var buttonoff = "#button-shupdate";
	browser.runtime.sendMessage({
		statuscommand: log
	});
}

function storageChange() {
    gettingStoredSettings = browser.storage.local.get();
	gettingStoredSettings.then(onGot, onError);
}


//this is messy, im not sorry
async function onGot(item) {
	//populate settings if they are blank
	if (item.sources == undefined) {
		sources = defaultsources;
		browser.storage.local.set({sources});
		gettingStoredSettings = browser.storage.local.get();
		gettingStoredSettings.then(onGot, onError);
		return;
	}
	if (item.BL3_SHIFTS == undefined) {
		browser.storage.local.set({BL3_SHIFTS});
		browser.storage.local.set({BL3_SHIFTS_R});
		gettingStoredSettings = browser.storage.local.get();
		gettingStoredSettings.then(onGot, onError);
		return;
	}
	sources = item.sources;
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

async function togglerunningoff(buttonName) {
	browser.runtime.sendMessage({
		togglerunningoff: buttonName
	});
}

async function togglerunningon(buttonName) {
	browser.runtime.sendMessage({
		togglerunningon: buttonName
	});
}

async function tryGetLatestCodes(silent) {
	togglerunningon("#button-shupdate");
	//get settings from local storage
	gettingStoredSettings = browser.storage.local.get();
	gettingStoredSettings.then(onGot, onError);
	while (!sources) {await sleep(1);}
	//grab new codes and put in array
	var allcodes = [];
	var index;
	for (index = 0; index < sources.length; ++index) {
		if (!silent) {consolelog(`Checking for new codes on ${sources[index]}`);}
		var codes = [];
		try {
			codes =  await (await fetch(sources[index])).json();
			if (codes.data == undefined) {
				var allText = codes.map((response) => JSON.stringify(response.data));
			} else {
				var allText = codes.data.children.map((response) => JSON.stringify(response.data));
			}
		} catch(e) {
			codes = await fetch(sources[index]);
			var html = await codes.text();
			var allText = JSON.stringify(html);
		}

		var matches = JSON.stringify(allText).match(regex);
		let uniq = matches => [...new Set(matches)];
		umatches = uniq(matches)
		let arrays = [umatches, allcodes];
		var newcodelist = (arrays.reduce((a, b) => a.filter(c => !b.includes(c))));
		allcodes = allcodes.concat(newcodelist);

		if (!silent) {consolelog(`${umatches.length} found (${matches.length - umatches.length} duplicates) :: ${newcodelist.length} unique :: ${allcodes.length} total`);}
	}
	
	if (!silent) {consolelog(`Comparing ${allcodes.length} codes against ${BL3_SHIFTS.length} known codes`);}
	let arrays = [allcodes, BL3_SHIFTS];
	var newcodelist = (arrays.reduce((a, b) => a.filter(c => !b.includes(c))));
	if (newcodelist == null || newcodelist == 0 || newcodelist.length == 0) {
		if (!silent) {consolelog(`No new codes`);}
		togglerunningoff("#button-shupdate");
		return;
	}

	var newcodes = newcodelist.length
	if (newcodes == 0) {return;}

	if (!silent) {consolelog(`${newcodes} new codes`);}
	//apply new codes to array
	BL3_SHIFTS = BL3_SHIFTS.concat(newcodelist);
	//store new codes
	browser.storage.local.set({BL3_SHIFTS});
	//change icon by reading saved settings
	gettingStoredSettings = browser.storage.local.get();
	gettingStoredSettings.then(onGot, onError);
	
	browser.runtime.sendMessage({
		togglerunningoff: "#button-shupdate"
	});

}

async function restoreDefaults() {
	await browser.storage.local.clear();
	browser.runtime.reload();
}

//get new codes on load and repeat every 10 minutes
setInterval(tryGetLatestCodes, 600000);
tryGetLatestCodes();

//listen for messages from popup
browser.runtime.onMessage.addListener((message) => {
	if (message.menucommand === "shupdate") {
		tryGetLatestCodes();
	} else if (message.menucommand === "silentshupdate") {
		tryGetLatestCodes(1);
	} else if (message.menucommand === "restoredefaults") {
		restoreDefaults();
	}
	
});

browser.storage.onChanged.addListener(storageChange);