var regex = /[a-zA-Z0-9]{5}-[a-zA-Z0-9]{5}-[a-zA-Z0-9]{5}-[a-zA-Z0-9]{5}-[a-zA-Z0-9]{5}/g;
var default_list = [
  "https://www.reddit.com/r/Borderlandsshiftcodes/comments/d4510u/golden_key_mega_thread/.json",
  "https://www.reddit.com/r/borderlands3/comments/d41s0k/all_currently_available_shift_codes/.json",
  "https://www.reddit.com/r/Borderlandsshiftcodes/new/.json"
];
var bl3_list = [
  "https://www.reddit.com/r/borderlands3/comments/d41s0k/all_currently_available_shift_codes/.json",
  "http://ticklemezombie.com/shift/borderlands-3/"
];
var bl2_list = [
  "http://ticklemezombie.com/shift/borderlands-2/"
];
var goty_list = [
  "http://ticklemezombie.com/shift/borderlands-goty/"
];
var tps_list = [
  "http://ticklemezombie.com/shift/borderlands-tps/"
];


function saveOptions(e) {
  browser.storage.local.set({
    sources: document.querySelector("#settings-reddit-scrapers").value.split(","),
	openonclick: document.querySelector("#settings-enable-openonclick").checked,
	activities: document.querySelector("#settings-enable-activities").checked
  });
  
	if (document.querySelector("#settings-shift-codes").value) {
		browser.storage.local.get().then((item) => { 
			var currentlist = item.BL3_SHIFTS;
			var list = document.querySelector("#settings-shift-codes").value;
			var list = list.match(regex);
			let uniq = list => [...new Set(list)];
			umatches = uniq(list)
			let arrays = [umatches, currentlist];
			var newlist = (arrays.reduce((a, b) => a.filter(c => !b.includes(c))));
			if (newlist) {
				currentlist = currentlist.concat(newlist);
				browser.storage.local.set({
					BL3_SHIFTS: currentlist
				});
				alert(newlist.length + " new SHiFT codes added.");
			}
		});  
	}
	
	browser.storage.local.set({
		openonclick: document.querySelector("#settings-enable-openonclick").checked
	});
	
	
  e.preventDefault();
  
}

function restoreOptions() {
	browser.storage.local.get().then((item) => { 
		document.querySelector("#settings-reddit-scrapers").innerText = item.sources;
		document.querySelector("#settings-enable-openonclick").checked = item.openonclick;
		document.querySelector("#settings-enable-activities").checked = item.activities;
	});
}

function clicksHappened(e) {
	if ( e.target.innerText == "Add BL3" ) {
		sourcesAdd(bl3_list);
	} else if ( e.target.innerText == "Add BL2" ) {
		sourcesAdd(bl2_list);
	} else if ( e.target.innerText == "Add TPS" ) {
		sourcesAdd(tps_list);
	} else if ( e.target.innerText == "Add GOTY" ) {
		sourcesAdd(goty_list);
	} else if ( e.target.innerText == "Add Default List" ) {
		sourcesAdd(default_list);
	} else if ( e.target.innerText == "Add ALL" ) {
		sourcesAdd(bl3_list);
		sourcesAdd(bl2_list);
		sourcesAdd(tps_list);
		sourcesAdd(goty_list);
		sourcesAdd(default_list);
	} else if ( e.target.innerText == "Reset to Defaults" ) {
		document.querySelector("#settings-reddit-scrapers").innerText = default_list;
	} else if ( e.target.innerText == "Clear" ) {
		document.querySelector("#settings-reddit-scrapers").innerText = "";
	} else if ( e.target.innerText == "Edit" ) {
		if (confirm('Editing this list improperly could break all the things!\nAre you ready for this responcibility?')) {
			document.getElementById("settings-reddit-scrapers").disabled = false;
			var buttons = document.getElementsByTagName("button");
			for (var i = 0; i < (buttons.length-2); i++) {
				var button = buttons[i];
				button.disabled = true;
			}
		}
	} else if ( e.target.innerText == "Forget all known codes" ) {
		var BL3_SHIFTS = [];
		var BL3_SHIFTS_R = 0;
		browser.storage.local.set({BL3_SHIFTS_R});
		browser.storage.local.set({BL3_SHIFTS});
	}
}

function sourcesAdd(list) {
	if (document.querySelector("#settings-reddit-scrapers").value) {
	var currentlist = document.querySelector("#settings-reddit-scrapers").value.split(",");
	let uniq = list => [...new Set(list)];
	umatches = uniq(list)
	let arrays = [umatches, currentlist];
	var newlist = (arrays.reduce((a, b) => a.filter(c => !b.includes(c))));
	currentlist = currentlist.concat(newlist);
	document.querySelector("#settings-reddit-scrapers").innerText = currentlist;
	} else {
		document.querySelector("#settings-reddit-scrapers").innerText = list;
	}
	
}

document.addEventListener('DOMContentLoaded', restoreOptions);
document.querySelector("form").addEventListener("submit", saveOptions);
document.addEventListener("click", clicksHappened);