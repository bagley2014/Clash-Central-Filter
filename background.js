chrome.runtime.onInstalled.addListener(function () {
    chrome.storage.sync.set({
        type: "Any",
        neighborhood: "Any",
        open: "Any",
        hide: false,
        self: true
    }, function () {
        console.log("Storage set.");
    });
});