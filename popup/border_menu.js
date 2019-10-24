var BL3_SHIFTS = [];
var BL3_SHIFTS_R = 0;
var TWOKAY = 0;
var TWOKAYF = 0;

function getActiveTab() 
{
	//thought id put this in a function and barely ever use it
	return browser.tabs.query({active: true, currentWindow: true});
}

//see what the user clicks
function listenForClicks() {
	document.addEventListener("click", (e) => {	
		//shift button
		if (e.target.classList.contains("shift")) {
			//get active tab ID and inject shift_redemption
			getActiveTab().then((tabs) => { 
				fetch(browser.runtime.getURL("content_scripts/shift_redemption.js"))
				.then(response => response.text())
				.then((data) => {
					browser.tabs.executeScript({
						code: data
					});
				});
			});
		} //update button
		else if (e.target.classList.contains("shupdate")) {
			//get background.js and send to run_shupdate command
			browser.runtime.getBackgroundPage().then((page) => {
				page.tryGetLatestCodes();
			});
		} //VIP button
		else if (e.target.classList.contains("vip")) {
			//get active tab
			getActiveTab().then((tabs) => { 
				fetch(browser.runtime.getURL("content_scripts/vip_message.js"))
				.then(response => response.text())
				.then((data) => {
					browser.tabs.executeScript({
						code: data
					});
				});
				browser.webNavigation.getAllFrames({tabId: tabs[0].id}).then((framesInfo) => {	
					var i;
					for (i = 1; i < framesInfo.length; i++) { 
						if (framesInfo[i].url.includes("2kgames.crowdtwist.com")) {
							TWOKAY = framesInfo[i].frameId;
							fetch("https://raw.githubusercontent.com/rockdevourer/borderlands/master/borderlands3/bl3_vip_code_redeem.js")
							.then(response => response.text())
							.then((data) => {
								browser.tabs.executeScript({
									code: data,
									frameId: TWOKAY
								});
							});
						}
					}
				});
			});
		} else if (e.target.classList.contains("reset")) {
			//clear settings and reload
			browser.storage.local.clear();
			browser.runtime.reload()
		}
	});
}

//get active tab when icon is pressed
getActiveTab().then((tabs) => {
	//if borderlands vip page is active
    if (tabs[0].url != "https://borderlands.com/en-US/vip-codes/") {
		//otherwise open a new tab, then do all the things it says up there ^^
		browser.tabs.create({url: "https://borderlands.com/en-US/vip-codes/"});
	}
    
});

//listen for the user clicking stuff, like user do
listenForClicks();







