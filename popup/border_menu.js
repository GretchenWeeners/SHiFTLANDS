var BL3_SHIFTS = [];
var BL3_SHIFTS_R = 0;

function getActiveTab() 
{
	//thought id put this in a function and barely ever use it
	return browser.tabs.query({active: true, currentWindow: true});
}

//see what the user clicks
function listenForClicks() {
	document.addEventListener("click", (e) => {
		//send message to shift_redeemer.js to try codes
		function run_shift(tabs) {
			browser.tabs.sendMessage(tabs[0].id, {
				command: "shift",
			});
		}
		//run tryLatestCodes function from background script
		function run_shupdate(page) {
			page.tryGetLatestCodes()
		}
		
		//shift button
		if (e.target.classList.contains("shift")) {
			//get aactive tab ID and send to run_shifts command
			browser.tabs.query({active: true, currentWindow: true})
				.then(run_shift);
		} //update button
		else if (e.target.classList.contains("shupdate")) {
			//get background.js and send to run_shupdate command
			browser.runtime.getBackgroundPage()
				.then(run_shupdate, onError);
		} //VIP button
		else if (e.target.classList.contains("vip")) {
			//get active tab
			getActiveTab().then((tabs) => { //if its 2kgames... run script
				if (tabs[0].url == "https://2kgames.crowdtwist.com/") {
					browser.tabs.executeScript({file: "/content_scripts/bl3_vip_code_redeem.js"});
				} else { //if not, open new tab then run script
					browser.tabs.create({url: "https://2kgames.crowdtwist.com/"}).then(() => {
						browser.tabs.executeScript({file: "/content_scripts/bl3_vip_code_redeem.js"});
					});
				}
			}); //reset button
		} else if (e.target.classList.contains("reset")) {
			//clear settings and reload
			browser.storage.local.clear();
			browser.runtime.reload()
		}
	});
}

function onError(error) {
	//barf
	console.log(`Error: ${error}`);
}

//get active tab when icon is pressed
getActiveTab().then((tabs) => {
	//if borderlands vip page is active
    if (tabs[0].url == "https://borderlands.com/en-US/vip-codes/") {
		//run script and tell it to get settings
		browser.tabs.executeScript({file: "/content_scripts/shift_redemption.js"});
		browser.tabs.sendMessage(tabs[0].id, {
			command: "getsettings",
		});
	} else if (tabs[0].url == "https://2kgames.crowdtwist.com/") {
		//do nothing
	} else { //otherwise open a new tab, then do all the things it says up there ^^
		browser.tabs.create({url: "https://borderlands.com/en-US/vip-codes/"}).then(() => {
			browser.tabs.executeScript({file: "/content_scripts/shift_redemption.js"});
		});
		browser.tabs.sendMessage(tabs[0].id, {
			command: "getsettings",
		});
	}
    
});

//listen for the user clicking stuff, like user do
listenForClicks();







