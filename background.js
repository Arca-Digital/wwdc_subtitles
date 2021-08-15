/*
    Background action setup
    Author: Ricardo Sarmiento
    License: MIT
*/

function saveFile(contents, filename) {
    let blob = new Blob([contents], { type: "text/srt" });
    let url = URL.createObjectURL(blob);
    chrome.downloads.download({ filename: filename, saveAs: true, url: url })
}

/// Expect a message from the content script, with the subtitles text
chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
        if (request.subtitles !== undefined) {
            let filename = `${request.wwdc} ${request.topicNumber}.srt`
            saveFile(request.subtitles, filename)
        }
    }
)

// Executes main.js on the active tab
chrome.browserAction.onClicked.addListener(function (tab) {
    chrome.tabs.executeScript(null, { file: "main.js" })
})
