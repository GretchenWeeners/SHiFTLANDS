(async function() {


	var BL3_SHIFTS = [];
	var BL3_SHIFTS_R = 0;
	var BL3_SHIFTS_S = 0;

	//better sleep function
	function sleep(ms) {
		return new Promise(resolve => setTimeout(resolve, ms));
	}

	function consolelog(log) {
		var today = new Date();
		var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
		var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
		var dateTime = date+' '+time;
		console.log(`[SHiFTLANDS][${dateTime}] ${log}`);
		browser.runtime.sendMessage({
			statuscommand: log
		});
	}

	async function try_SHiFT(shiftcode, cur, last) {
		//cuz math
		cur++;

		var btnShift = 0;
		while (btnShift == 0) {
      if (typeof(document.getElementsByClassName('block sprite-nav-shift-hover')[0]) != 'undefined') {btnShift = 1;}
			await sleep(1);
		}
		//click SHiFT code button
    document.getElementsByClassName('block sprite-nav-shift-hover')[0].click();
    document.getElementsByClassName('block transitions hover:text-yellow text-shadow-diffuse ng-scope pt-md')[0].click();

		//steal shift logo for title
		document.getElementsByClassName('sprite-modal-shift')[0].outerHTML="<div><h5>SHiFTLANDS</h5></div>";

		//steal text for status
		document.getElementsByClassName('text-white mt-lg')[0].innerText="Trying SHiFT code " + cur + " of " + last;

		//insert code
		document.getElementsByName('code')[0].value=shiftcode;

		//trigger change event
		document.getElementsByName('code')[0].dispatchEvent(new Event('change'));


		var btnCheck = 0;
		while (btnCheck == 0) {
			await sleep(1);
			if (typeof(document.getElementsByClassName('absolute pin bg-full bg-repeat')[9]) != 'undefined') {
				btnCheck = 1;
				break;
			}

		}
		await sleep(100);
		document.getElementsByClassName('absolute pin bg-full bg-repeat')[9].click();
		//click check button



		while(true) {
			//success
			if(typeof(document.getElementsByClassName('text-red')[0]) == 'undefined'){
				consolelog(`${shiftcode} :: succeeded`);
				//try to close window
				try {document.getElementsByClassName('sprite-close-white-modal')[0].click();}
				catch(e) {break;}
				BL3_SHIFTS_S++;
				break;
			}
			//error
			if (document.getElementsByClassName('text-red')[0].innerText.length > 1){
				var errMessage = document.getElementsByClassName('text-red')[0].innerText;
				consolelog(`${shiftcode} :: ${errMessage}`);
				if (errMessage == "You have attempted this too many times. Please try again later.") {
					//document.getElementsByClassName('text-shadow-heading mb-lg')[0].innerText="RATE LIMITED";
          var numbrr = 0;
          while (true) {
          	try {document.getElementsByClassName('mb-sm ng-binding')[numbrr].innerText = "RATE LIMITED";}
          				catch(e) {break;}
          	numbrr++;
          }


				}
				//reset error message
				document.getElementsByClassName('text-red')[0].innerText=" ";
				//close window
				document.getElementsByClassName('sprite-close-white-modal')[0].click();
				break;
			}
			await sleep(1);
		}
		await sleep(1);
	}

	async function getsettings() {
		//set settings from local storage
		await browser.storage.local.get().then((item) => {
			BL3_SHIFTS = item.BL3_SHIFTS;
			BL3_SHIFTS_R = item.BL3_SHIFTS_R;
			consolelog(`Successfully loaded settings :: ${BL3_SHIFTS_R}/${BL3_SHIFTS.length} codes have been tried`);
		});

	}

	async function main() {
		BL3_SHIFTS_S = 0;
		//try all the codes
		if (BL3_SHIFTS_R == undefined) {
			BL3_SHIFTS_R = 0;
		}
		if (BL3_SHIFTS_R < BL3_SHIFTS.length || BL3_SHIFTS_R == undefined) {
			var newcodes = (BL3_SHIFTS.length - BL3_SHIFTS_R);
			consolelog(`Proceeding with ${newcodes} new codes`);
		} else {
			consolelog(`Canceling, no new codes`);
	//		document.getElementsByClassName('text-shadow-heading mb-lg')[0].innerText="NO NEW CODES TO REDEEM";
	//		document.getElementsByClassName('max-w-subheading mx-auto')[0].innerText="SHiFTLANDS checks for new codes every 10 minutes. When new codes are ready the SHiFTLANDS icon will light up.";
        var numbrr = 0;
        while (true) {
        try {document.getElementsByClassName('mb-sm ng-binding')[numbrr].innerText = "NO NEW CODES TO REDEEM";}
          catch(e) {break;}
        try {document.getElementsByClassName('normal-case ng-binding')[numbrr].innerText = "SHiFTLANDS checks for new codes every 10 minutes. When new codes are ready the SHiFTLANDS icon will light up.";}
          catch(e) {break;}
        numbrr++;
        }

        var numbrr = 0;
        while (true) {

        numbrr++;
        }
      return;
		}

		//document.getElementsByClassName('text-shadow-heading mb-lg')[0].innerText="TRYING SHIFT CODES";
		//document.getElementsByClassName('max-w-subheading mx-auto')[0].innerText="Please stay on this tab until the process is complete.";
    var numbrr = 0;
    while (true) {
    try {document.getElementsByClassName('mb-sm ng-binding')[numbrr].innerText = "TRYING SHIFT CODES";}
      catch(e) {break;}
    try {document.getElementsByClassName('normal-case ng-binding')[numbrr].innerText = "Please stay on this tab until the process is complete.";}
      catch(e) {break;}
    numbrr++;
    }

		await sleep(1000);

		var index;
		var index_start = BL3_SHIFTS_R;
		for (index = index_start; index < BL3_SHIFTS.length; ++index) {
			await try_SHiFT(BL3_SHIFTS[index], index - index_start, BL3_SHIFTS.length - index_start);
			//var ratelimited = document.getElementsByClassName('text-shadow-heading mb-lg')[0].innerText;
      var ratelimited = document.getElementsByClassName('mb-sm ng-binding')[0].innerText;
			if (ratelimited == "RATE LIMITED") {
				break;
			} else {
				BL3_SHIFTS_R++;
				browser.storage.local.set({BL3_SHIFTS_R});
			}
		}
		//set all codes redeemed
		browser.storage.local.set({BL3_SHIFTS_R});
		//display successful redemptions
		consolelog(`Successfully redeemed ${BL3_SHIFTS_S} new codes`);
//		document.getElementsByClassName('text-shadow-heading mb-lg')[0].innerText=BL3_SHIFTS_S + " NEW CODES REDEEMED";
      var numbrr = 0;
      while (true) {
      try {document.getElementsByClassName('mb-sm ng-binding')[numbrr].innerText=BL3_SHIFTS_S + " NEW CODES REDEEMED";}
        catch(e) {break;}
      numbrr++;
      }
		if (BL3_SHIFTS_R < BL3_SHIFTS.length) {
//		document.getElementsByClassName('max-w-subheading mx-auto')[0].innerText="Your account has reached the max amount of codes it can try. Please try again in an hour.";
      var numbrr = 0;
      while (true) {
      	try {document.getElementsByClassName('normal-case ng-binding')[numbrr].innerText = "Your account has reached the max amount of codes it can try. Please try again in an hour.";}
      				catch(e) {break;}
      	numbrr++;
      }
		} else {
//			document.getElementsByClassName('max-w-subheading mx-auto')[0].innerText="SHiFTLANDS checks for new codes every 10 minutes. When new codes are ready the SHiFTLANDS icon will light up.";
        var numbrr = 0;
        while (true) {
        	try {document.getElementsByClassName('normal-case ng-binding')[numbrr].innerText = "SHiFTLANDS checks for new codes every 10 minutes. When new codes are ready the SHiFTLANDS icon will light up.";}
        				catch(e) {break;}
        	numbrr++;
        }
		}
		//TODO: statistics of every responce gathered from red-text

		//check updates again, because we can
		browser.runtime.sendMessage({
			menucommand: "silentshupdate"
		});
	}

	async function togglerunningoff(buttonName) {
		browser.runtime.sendMessage({
			togglerunningoff: buttonName
		});
	}


	consolelog("Successfully injected code into page");

	//get settings on load
	await getsettings();


	await main();

	togglerunningoff("#button-shift");




})();
