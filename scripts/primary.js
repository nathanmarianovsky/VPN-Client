/*

Declare all of the necessary variables.

	- ipcRenderer provides the means to operate the Electron app.
	- fs and path provide the means to work with local files.

*/
const { ipcRenderer } = require("electron"),
	path = require("path"),
	fs = require("fs");



/*

Loads the introductory modal if necessary.

    - modalInstances is an array containing all modal instances on the page.

*/
var introductionModal = modalInstances => {
	// Iterate through all modal instances until the helpModal is found.
	for(var k = 0; k < modalInstances.length; k++) {
		if(modalInstances[k].id == "helpModal") {
			// Change the title of the helpModal from "Help" to "Introduction" on an initial load.
			modalInstances[k].el.children[0].children[0].innerText = "Introduction";
			// Open the introductory modal.
			modalInstances[k].open();
			// Define the callback that will handle a change in the helpModal title.
			var mutationCaller = (mutationsList, observer) => {
			    mutationsList.forEach(mutation => {
			        if (mutation.attributeName === "class") {
			            if(mutation.target.id == "helpModal" && !mutation.target.classList.contains("open")) {
							mutation.target.children[0].children[0].innerText = "Help";
			            }
			        }
			    })
			};
			// Define an observer and let it trigger an event whenever the class list of the helpModal changes.
			const mutationObserver = new MutationObserver(mutationCaller);
			mutationObserver.observe(modalInstances[k].el, { attributes: true });
		}
	}
};



// Wait for the window to finish loading.
window.addEventListener("load", () => {
	// // Fix the placement of all roulette table markers.
	// markerPlacement(6, 12);
	// // Add all roulette table listeners.
	// addListeners(betArrays());
	// Introduce a small delay to allow the tooltips and modals to properly initialize.
	setTimeout(() => {
		// Initialize the modals and tooltips after a small delay.
	    var tooltipElems = document.querySelectorAll(".tooltipped"),
	    	modalElems = document.querySelectorAll(".modal"),
	    	selectElems = document.querySelectorAll("select"),
	    	tooltipInstancesList = M.Tooltip.init(tooltipElems),
    		modalInstancesList = M.Modal.init(modalElems),
    		selectInstances = M.FormSelect.init(selectElems),
    		dir = path.resolve(__dirname, "../parameters.json");
    	// Check if a parameters file exists.
		if(!fs.existsSync(dir)) {
			introductionModal(modalInstancesList);
		}
		else {
			// If a parameters file exists then check the introductionCheck on the helpModal.
			const parameters = JSON.parse(fs.readFileSync(dir, "UTF8"));
			parameters.introduction == true ? introductionModal(modalInstancesList) : document.getElementById("introductionCheck").checked = true;
		}
		// Listen for a check/uncheck on the introductionCheck located in the helpModal.
		document.getElementById("introductionCheck").addEventListener("change", () => {
			// Write a parameters file to indicate whether the introductory message is to be showed or not.
			document.getElementById("introductionCheck").checked
				? fs.writeFileSync(dir, JSON.stringify({"introduction": false}), "UTF8")
				: fs.writeFileSync(dir, JSON.stringify({"introduction": true}), "UTF8");
		});
		// Listen for a resize of the window.
		// $(window).resize(() => {
		// 	// Remove any bubble on a resize.
		// 	if($("#bubble").length > 0) { $("#bubble").remove(); }
		// 	// Fix the placement of all roulette table markers.
		// 	markerPlacement(6, 12);
		// });
	}, 50);
});