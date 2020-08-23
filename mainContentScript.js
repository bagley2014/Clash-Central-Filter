/** Relevant existing page elements **/
let mainContent = document.getElementById('all-groups')
let header = document.getElementsByClassName("toolbar-new")[0]

header.style.margin = "81px 0 0 0"

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

mainContent.before(myBar)

/**
 * Function to set the visibility of a given node based on the current parameters
 */
function updateDOM(nodeList) {
    mainContent.style.display = "none"
    chrome.storage.sync.get(["hide", "type", "neighborhood", "open"], function (storage) {
        for (let element of nodeList) {
            if (element.nodeType != Node.TEXT_NODE) {

                var paragraphs = element.querySelectorAll('p');
                var button = element.querySelector('button');

                var titleLine = paragraphs[0].innerText

                function hide() {
                    if (storage["hide"]) element.style.display = "none"
                    else button.disabled = true
                }

                element.style.display = "block"
                button.disabled = false

                if (storage['open'] != 'Any') {
                    var full = paragraphs[paragraphs.length - 1].innerText.match(/(4 \/ 4)|(8 \/ 8)|(6 \/ 6)/)
                    if (full) {
                        hide()
                        continue
                    }
                }

                if (storage['type'] != 'Any') {
                    if (storage['type'] == 'Building') {
                        var building = titleLine.match("Building")
                        if (!building) {
                            hide()
                            continue
                        }
                    } else if (storage['type'] == 'Boss') {
                        var boss =
                            titleLine.match("VP") ||
                            titleLine.match("CFO") ||
                            titleLine.match("CLO") ||
                            titleLine.match("CEO")
                        if (!boss) {
                            hide()
                            continue
                        }
                    } else if (storage['type'] == 'Facility') {
                        var facility =
                            titleLine.match("Factory") ||
                            titleLine.match("Mint") ||
                            titleLine.match("Lawfice") ||
                            titleLine.match("Cog Golf")
                        if (!facility) {
                            hide()
                            continue
                        }
                    } else if (storage['type'] == 'Mini-boss') {
                        var miniboss =
                            titleLine.match("Derrick") ||
                            titleLine.match("Director")
                        if (!miniboss) {
                            hide()
                            continue
                        }
                    } else if (storage['type'] == 'Minigame') {
                        var minigame =
                            titleLine.match("Racing") ||
                            titleLine.match("Fishing") ||
                            titleLine.match("Trolley") ||
                            titleLine.match("Golfing")
                        if (!minigame) {
                            hide()
                            continue
                        }
                    }
                }

            }
        }
        mainContent.style.display = "flex"
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