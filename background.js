chrome.runtime.onInstalled.addListener(function () {
    chrome.storage.sync.set({
        color: '#3aa757',
        type: "Any",
        neighborhood: "Any",
        open: "Any",
        hide: false
    }, function () {
        console.log("Storage set.");
    });
});