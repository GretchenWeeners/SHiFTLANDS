var BL3_SHIFTS = [];
var BL3_SHIFTS_R = 0;
var TWOKAY = 0;
var TWOKAYF = 0;
var iframeReturncode = 0;
var safetabs = [];


function consolelog(log) {
	var today = new Date();
	var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
	var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
	var dateTime = date+' '+time;
	console.log(`[SHiFTLANDS][${dateTime}] ${log}`);
    statuslog(log);
}

function statuslog(log) {
	document.querySelector("#status-content").classList.remove("hidden");
	var item = document.createElement('div');
	item.innerText = ">" + log;
	item.className = "log";
	document.getElementsByClassName("status")[0].appendChild(item);
}

function getActiveTab() 
{
	//thought id put this in a function and barely ever use it
	return browser.tabs.query({active: true, currentWindow: true});
}

function sleep(ms) {
	return new Promise(resolve => setTimeout(resolve, ms));
}

async function tab_inject(tab_url, script_url) {
	getActiveTab().then((tabs) => {
	//if borderlands vip page is active
		if (tabs[0].url != tab_url) {
			consolelog(`Opening new tab`);
			browser.tabs.create({url: tab_url});
		}
    
	});
	
	var tabLoaded = false;
	while (tabLoaded == false)
	{
		await sleep(100);
		if (tabLoaded == true) {break;}
		getActiveTab().then((tabs) => {
			if (tabs[0].url == tab_url) {
				consolelog(`Tab loaded`);
				tabLoaded = true;
				
				var vip_logo_url = browser.runtime.getURL("images/shiftlands-vip-logo.png");
				var css = `.sprite-vip-logo { background-image: url(\"${vip_logo_url}"); background-position: 0px 0px; width: 227px; height: 147px; }`
				browser.tabs.insertCSS({
					code: css
				});
				
				consolelog(`Trying to inject code into tab`);
				fetch(script_url)
					.then(response => response.text())
					.then((data) => {
						browser.tabs.executeScript({
							code: data
						});
					});
			} 
		});
		
	}
}

async function tab_inject_code(tab_url, data, verbose) {
	getActiveTab().then((tabs) => {
	//if borderlands vip page is active
		if (tabs[0].url != tab_url) {
			if (verbose) {consolelog(`Opening new tab`);}
			browser.tabs.create({url: tab_url});
		}
	});
	var tabLoaded = false;
	while (tabLoaded == false)
	{
		await sleep(100);
		if (tabLoaded == true) {break;}
		getActiveTab().then((tabs) => {
			if (tabs[0].url == tab_url) {
				if (verbose) {consolelog(`Tab loaded`);}
				tabLoaded = true;
				var vip_logo_url = browser.runtime.getURL("images/shiftlands-vip-logo.png");
				var css = `.sprite-vip-logo { background-image: url(\"${vip_logo_url}"); background-position: 0px 0px; width: 227px; height: 147px; }`
				browser.tabs.insertCSS({
					code: css
				});
				if (verbose) {consolelog(`Trying to inject code into tab`);}
				browser.tabs.executeScript({
					code: data
				});	
			}
		});
		
	}
}

async function iframe_inject(iframe_url, script_url) {
	consolelog(`Trying to find iframe`);
	iframeReturncode = 0;
	while (iframeReturncode == 0) {
		await getActiveTab().then((tabs) => {
			browser.webNavigation.getAllFrames({tabId: tabs[0].id}).then((framesInfo) => {	
				var i;
				for (i = 1; i < framesInfo.length; i++) { 
					if (framesInfo[i].url.includes(iframe_url)) {
						iframeReturncode = 1;
						TWOKAY = framesInfo[i].frameId;
						consolelog(`Trying to inject code into iframe: ${TWOKAY}`);
						fetch(script_url)
							.then(response => response.text())
							.then((data) => {
								browser.tabs.executeScript({
									code: data,
									frameId: TWOKAY
								});
							});
						consolelog(`Running code`);
					}
				}
			});
		});
		await sleep(100);
	}
}

//just like iframe_inject, but doesnt fetch the url for you
async function iframe_inject_code(iframe_url, data) {
	consolelog(`Trying to find iframe`);
	iframeReturncode = 0;
	while (iframeReturncode == 0) {
		await getActiveTab().then((tabs) => {
			browser.webNavigation.getAllFrames({tabId: tabs[0].id}).then((framesInfo) => {	
				var i;
				for (i = 1; i < framesInfo.length; i++) { 
					if (framesInfo[i].url.includes(iframe_url)) {
						iframeReturncode = 1;
						TWOKAY = framesInfo[i].frameId;
						consolelog(`Trying to inject code into iframe: ${TWOKAY}`);
							browser.tabs.executeScript({
								code: data,
								frameId: TWOKAY
							});
						consolelog(`Running code`);
					}
				}
			});
		});
		await sleep(100);
	}
}


//see what the user clicks
function listenForClicks() {
	document.addEventListener("click", (e) => {	
		//shift button
		if (e.target.classList.contains("shift")) {
			toggleRunning("#button-shift", "on");
			tab_inject("https://borderlands.com/en-US/vip-codes/", browser.runtime.getURL("content_scripts/shift_redemption.js"));
		} //update button
		else if (e.target.classList.contains("shupdate")) {
			toggleRunning("#button-shupdate", "on");
			consolelog(`Trying to check for updates`);
			//get background.js and send to run_shupdate command
			browser.runtime.getBackgroundPage().then((page) => {
				page.tryGetLatestCodes();
			});
		} //VIP button
		else if (e.target.classList.contains("vip")) {
			toggleRunning("#button-vip", "on");
			tab_inject("https://borderlands.com/en-US/vip-codes/", browser.runtime.getURL("content_scripts/vip_message.js"));
		} else if (e.target.classList.contains("reset")) {
			//clear settings and reload
			consolelog(`Clearing settings`);
			browser.storage.local.clear();
			//consolelog(`Reloading`);
			//browser.runtime.reload()
		} else if (e.target.classList.contains("status-content") || e.target.classList.contains("status") || e.target.classList.contains("log")) {
			document.querySelector("#status-content").classList.add("hidden");
		} else if (e.target.classList.contains("settings-icon")) {
			browser.runtime.openOptionsPage();
		} else if (e.target.classList.contains("activities")) {
			getActiveTab().then((tabs) => {
				if (tabs[0].url != "https://borderlands.com/en-US/vip-activities/") {
					tab_inject("https://borderlands.com/en-US/vip-activities/", browser.runtime.getURL("content_scripts/vip_activities.js"));
				} else {
					toggleRunning("#button-activities", "on");
					safetabs = [];
					var querying = browser.tabs.query({});
					querying.then((tabs) => {
						for (let tab of tabs) {
							safetabs.push(tab.id);
						}
					});
					fetch(browser.runtime.getURL("content_scripts/vip_activities_iframe.js"))
					.then(response => response.text())
					.then((data) => {
						iframe_inject_code("2kgames.crowdtwist.com/widgets/t/activity-list/9446", data);
					});
				}
			});
		}
	});
}

function findIfExists(array, elementToFind){
  if(array.includes(elementToFind)){
    return true;
  } else {
    return false;
  }
}

function toggleRunning(elementName, onOff) {
	if (onOff == "on") {
		document.querySelector(elementName).classList.add("running");
	}else if (onOff == "off") {
		document.querySelector(elementName).classList.remove("running");
	}
}

document.querySelector("#status-content").classList.add("hidden");
browser.storage.local.get().then((item) => { 
	if (item.openonclick) {
		getActiveTab().then((tabs) => {
			if (tabs[0].url != "https://borderlands.com/en-US/vip-codes/") {
				browser.tabs.create({url: "https://borderlands.com/en-US/vip-codes/"});
			}
		});
	}
	if (item.activities) {
		document.querySelector("#button-activities").classList.remove("hidden");
	}
});

	browser.runtime.getPlatformInfo()
	.then((platforminfo) => {
		if (platforminfo.os == "android") {
			document.getElementById("menu").style.width = "100%";
			document.getElementById("status").style.width = "100%";
			document.getElementById("status-content").style.height = "200px";
			document.getElementById("status-content").style.fontSize = "2em";
			document.getElementsByClassName("logo")[0].style.height = "400px";
			document.getElementsByClassName("logo")[0].style.width = "auto";
			document.getElementsByClassName("settings-icon")[0].style.height = "100px";
			document.getElementsByClassName("settings-icon")[0].style.width = "auto";
			for (let i = 0; i < document.getElementsByClassName("button").length; i++) {
				document.getElementsByClassName("button")[i].style.height = "100px";
				document.getElementsByClassName("button")[i].style.fontSize = "4em";
			}
			for (let i = 0; i < document.getElementsByClassName("image").length; i++) {
				document.getElementsByClassName("image")[i].style.height = "100%";
				document.getElementsByClassName("image")[i].style.width = "auto";
			}
			
		}
	});


//listen for the user clicking stuff, like user do
listenForClicks();

browser.runtime.onMessage.addListener((message) => {
	if (message.statuscommand) {
		statuslog(message.statuscommand);
		if (message.statuscommand == "Succeeded on connection test") {
			iframe_inject("2kgames.crowdtwist.com", browser.runtime.getURL("content_scripts/vip_functions.js"));
			fetch("https://raw.githubusercontent.com/rockdevourer/borderlands/master/borderlands3/bl3_vip_code_redeem.js")
				.then(response => response.text())
				.then((data) => {
					data = data.replace("console.log(\"Total Points: \", totalpoints);","consolelog(\"Total VIP points redeemed: \" + totalpoints);togglerunningoff(\"#button-vip\");return;");
					data = data.replace("function(email) {","function(email) { \nconsolelog(\"Trying email code: \" + email);");
					data = data.replace("function(creator) {","function(creator) { \nconsolelog(\"Trying creator code: \" + creator);");
					data = data.replace("function(vault) {","function(vault) { \nconsolelog(\"Trying vault code: \" + vault);");
					iframe_inject_code("2kgames.crowdtwist.com", data);
				});
		} else if (message.statuscommand.includes("Total VIP points redeemed")) {
			fetch(browser.runtime.getURL("content_scripts/vip_complete.js"))
				.then(response => response.text())
				.then((data) => {
					data = data.replace("message1",message.statuscommand);
					data = data.replace("message2","SHiFTLANDS does not automatically check for new VIP codes,<br>so run this every few days.");
					tab_inject_code("https://borderlands.com/en-US/vip-codes/", data);
				});
		} else if (message.statuscommand.includes("Activity opened")) {
		/*	var querying = browser.tabs.query({});
				querying.then((tabs) => {
					for (let tab of tabs) {
						if (findIfExists(safetabs, tab.id) == false) {
							browser.tabs.remove(tab.id);
								consolelog("Activity " + tab.id + " closed");
						}
					}
				}); */
		} else if (message.statuscommand.includes("Activity redeem complete")) {
			fetch(browser.runtime.getURL("content_scripts/vip_complete.js"))
				.then(response => response.text())
				.then((data) => {
					data = data.replace("message1","All done");
					data = data.replace("message2","You may want to run this a couple of times, as is doesnt always register the clicks.");
					tab_inject_code("https://borderlands.com/en-US/vip-activities/", data);
				});
			var querying = browser.tabs.query({});
			querying.then((tabs) => {
				for (let tab of tabs) {
					if (findIfExists(safetabs, tab.id) == false) {
						browser.tabs.remove(tab.id);
							consolelog("Activity " + tab.id + " closed");
					}
				}
			});
		}
	}
	if (message.togglerunningoff) {
		toggleRunning(message.togglerunningoff, "off");
	}
	
});







