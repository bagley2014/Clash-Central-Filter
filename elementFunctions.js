//Private helper function
function createContainer() {
    let result = document.createElement('span')
    result.style.display = "inline-block"
    result.style.padding = "2px"
    result.style.marginRight = "1%"
    result.style.marginTop = "10px"
    result.style.border = "1px solid white"
    result.style.fontSize = "1.5em"
    result.style.whiteSpace = "nowrap"

    return result;
}

//Public functions t
function addSelector(parent, labelText, id, options) {
    chrome.storage.sync.get(id, function (current) {
        console.log(id + ' currently is ' + current[id]);

        let label = document.createElement('label')
        label.for = id
        label.innerText = labelText

        let select = document.createElement('select')
        select.name = id
        select.id = id
        select.style.width = "auto"
        select.style.height = "auto"
        select.style.padding = "0"
        select.style.fontSize = "1em"
        select.style.marginLeft = "10px"
        select.style.marginRight = "3px"
        select.style.textAlignLast = "center"
        options.map((option) => new Option(option, option, undefined, option == current[id])).forEach((option) => select.add(option))
        select.addEventListener("change", (event) => {
            chrome.storage.sync.set({
                    [event.currentTarget.id]: event.currentTarget.value
                },
                () => updateDOM(mainContent.children))
        });

        let result = createContainer()
        result.appendChild(label)
        result.appendChild(select)

        parent.appendChild(result)
    });
}

function addCheckbox(parent, labelText, id) {
    chrome.storage.sync.get(id, function (current) {
        console.log(id + ' currently is ' + current[id]);

        let label = document.createElement('label')
        label.for = id
        label.innerText = labelText

        let checkbox = document.createElement("input")
        checkbox.name = id
        checkbox.id = id
        checkbox.type = "checkbox"
        checkbox.checked = current[id]
        checkbox.style.margin = "3px"
        checkbox.style.marginRight = "7px"
        checkbox.addEventListener("change", (event) => {
            chrome.storage.sync.set({
                    [event.currentTarget.id]: event.currentTarget.checked
                },
                () => updateDOM(mainContent.children))
        });

        let result = createContainer()
        result.appendChild(checkbox)
        result.appendChild(label)

        parent.appendChild(result)
    });
}