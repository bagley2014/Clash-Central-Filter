/** Relevant existing page elements **/
let mainContent = document.getElementById('all-groups')
let header = document.getElementsByClassName("toolbar-new")[0]

mainContent.style.display = "none"
header.style.margin = "81px 0 0 0"

//Need a new div for the content to handle updating issues
let altContentDisplay = document.createElement('div')
//altContentDisplay.style = mainContent.style
altContentDisplay.style.display = "flex"
altContentDisplay.style.flexWrap = "wrap"
altContentDisplay.style.justifyContent = "center"
altContentDisplay.style.margin = 0
altContentDisplay.style.marginLeft = "50px"
altContentDisplay.style.marginRight = "50px"
mainContent.after(altContentDisplay)

/**
 * Section to create and populate my toolbar
 */
let myBar = document.createElement('div')
myBar.className = "toolbar-new"
//myBar.style.height = "35px"
myBar.style.margin = "0 0 50px 0"
myBar.style.backgroundColor = "rgb(70, 145, 70)"

//addSelector(myBar, "Neighborhood", "neighborhood", ["Any", "Central", "Boatyard", "Ye Olde", "Gardens", "Melodyland", "Brrgh", "Dreamland", "Acorn", "Sellbot", "Cashbot", "Lawbot", "Bossbot", "Boardbot"])
addSelector(myBar, "Group Type", "type", ["Any", "Building", "Boss", "Facility", "Mini-boss", "Minigame"])
addSelector(myBar, "Open Slots", "open", ["Any", "Yes"])

addCheckbox(myBar, "Hide Groups?", "hide")
addCheckbox(myBar, "Show Self?", "self")

mainContent.before(myBar)

/**
 * Helper functions for gathering relevant data about a group
 */
function isMyGroup(color) {
    return color == "rgb(255, 198, 40)"
    //return color == "#ffc628;"
}

 function isFull(toonCountLine) {
    return toonCountLine.match(/(4 \/ 4)|(8 \/ 8)|(6 \/ 6)/)
}

function getType(titleLine) {
    if (titleLine.match("Building")) return "Building"
    else if (
        titleLine.match("VP") ||
        titleLine.match("CFO") ||
        titleLine.match("CLO") ||
        titleLine.match("CEO")
    ) return "Boss"
    else if (
        titleLine.match("Factory") ||
        titleLine.match("Mint") ||
        titleLine.match("Lawfice") ||
        titleLine.match("Cog Golf")
    ) return "Facility"
    else if (
        titleLine.match("Derrick") ||
        titleLine.match("Director")
    ) return 'Mini-boss'
    else if (
        titleLine.match("Racing") ||
        titleLine.match("Fishing") ||
        titleLine.match("Trolley") ||
        titleLine.match("Golfing")
    ) return 'Minigame'
}

/**
 * Function to set the visibility of a given node based on the current parameters
 */
function updateDOM(nodeList) {
    chrome.storage.sync.get(["hide", "type", "neighborhood", "open"], function (storage) {
        altContentDisplay.style.height = altContentDisplay.offsetHeight + 'px';
        altContentDisplay.innerHTML = ""
        for (let element of nodeList) {
            if (element.nodeType != Node.TEXT_NODE) {
                var div = element.querySelector('div');
                var paragraphs = element.querySelectorAll('p');
                var button = element.querySelector('button');

                element.style.display = "block"
                button.disabled = false

                console.log(div.style.color)

                if(storage['self'] && div.style.color){
                    console.log("I have a group")
                    continue
                }

                var titleLine = paragraphs[0].innerText
                var toonCountLine = paragraphs[paragraphs.length - 1].innerText

                const hide = storage["hide"] ?
                    () => element.style.display = "none" :
                    () => button.disabled = true

                element.style.display = "block"
                button.disabled = false

                if (
                    (storage['open'] != 'Any' && isFull(toonCountLine)) ||
                    (storage['type'] != 'Any' && storage['type'] != getType(titleLine))
                ) {
                    hide()
                }
            }
            altContentDisplay.appendChild(element.cloneNode(true))
        }
        altContentDisplay.style.height = "auto"
    })
}

/**
 * Code for observing the DOM and modifying it when it updates 
 */
function updatedDOMCallback(mutationList, observer) {
    mutationList.forEach((mutation) => {
        updateDOM(mutation.addedNodes)
    });
}

const observerOptions = {
    childList: true
}

const observer = new MutationObserver(updatedDOMCallback);
observer.observe(mainContent, observerOptions);

updateDOM(mainContent.children)