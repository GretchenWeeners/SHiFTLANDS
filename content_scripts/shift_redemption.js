(async function() {

  
	var BL3_SHIFTS = [];
	var BL3_SHIFTS_R = 0;
	var BL3_SHIFTS_S = 0;

	//better sleep function
	function sleep(ms) {
		return new Promise(resolve => setTimeout(resolve, ms));
	}

	async function try_SHiFT(shiftcode, cur, last) {
		//cuz math
		cur++;

		//click SHiFT code button
		document.getElementsByClassName('absolute pin bg-black opacity-0 group-hover:opacity-40 transitions-fast')[0].click();

		//steal shift logo for title
		document.getElementsByClassName('sprite-modal-shift')[0].outerHTML="<div><h5>SHiFTlands</h5></div>";
		
		//steal text for status
		document.getElementsByClassName('text-white mt-lg')[0].innerText="Trying SHiFT code " + cur + " of " + last;
		
		//insert code
		document.getElementsByName('code')[0].value=shiftcode;

		//trigger change event
		document.getElementsByName('code')[0].dispatchEvent(new Event('change'));


		//click button
		document.getElementsByClassName('absolute pin bg-full bg-repeat')[2].click();


		while(true) {
			//success
			if(typeof(document.getElementsByClassName('text-red')[0]) == 'undefined'){
				//close window
				document.getElementsByClassName('sprite-close-white-modal')[0].click();
				BL3_SHIFTS_S++;
				break;
			}
			//error
			if (document.getElementsByClassName('text-red')[0].innerText.length > 1){
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

	async function onGot(item) {
		//update array with current codes
		
		BL3_SHIFTS = item.BL3_SHIFTS;
		BL3_SHIFTS_R = item.BL3_SHIFTS_R;
	}

	async function onError(error) {
		console.log(`SHiFTLANDS:shift_redemption.js Error: ${error}`);
	}

	async function getsettings() {
		//set settings from local storage
		await browser.storage.local.get().then((item) => { 
			BL3_SHIFTS = item.BL3_SHIFTS;
			BL3_SHIFTS_R = item.BL3_SHIFTS_R;
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
			console.log("SHiFTLANDS:shift_redemption.js: proceeding with " + newcodes + " new codes");
		} else {

			onError("canceling, no new codes");
			document.getElementsByClassName('text-shadow-heading mb-lg')[0].innerText="NO NEW CODES TO REDEEM";
			document.getElementsByClassName('max-w-subheading mx-auto')[0].innerText="SHiFTLANDS checks for new codes every 10 minutes. When new codes are ready the SHiFTLANDS icon will light up.";
			return;
		}
		
		document.getElementsByClassName('text-shadow-heading mb-lg')[0].innerText="TRYING SHIFT CODES";
		document.getElementsByClassName('max-w-subheading mx-auto')[0].innerText="Please stay on this tab until the process is complete.";

		var index;
		for (index = BL3_SHIFTS_R; index < BL3_SHIFTS.length; ++index) {
			await try_SHiFT(BL3_SHIFTS[index], index - BL3_SHIFTS_R, BL3_SHIFTS.length - BL3_SHIFTS_R);
		}
		//set all codes redeemed
		BL3_SHIFTS_R = BL3_SHIFTS.length;
		browser.storage.local.set({BL3_SHIFTS_R});
		//display successful redemptions
		console.log("SHiFTLANDS:shift_redemption.js: " + BL3_SHIFTS_S + " new codes redeemed");
		document.getElementsByClassName('text-shadow-heading mb-lg')[0].innerText=BL3_SHIFTS_S + " NEW CODES REDEEMED";
		document.getElementsByClassName('max-w-subheading mx-auto')[0].innerText="SHiFTLANDS checks for new codes every 10 minutes. When new codes are ready the SHiFTLANDS icon will light up.";
		//check updates again to clear icon
		browser.runtime.sendMessage({
			menucommand: "shupdate"
		});
	}
	
  
	//get settings on load
	await getsettings();
	
	await main();

})();