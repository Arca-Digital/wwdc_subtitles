/*
    Content script
    Author: Ricardo Sarmiento
    License: MIT
*/

/* Example of .SRT subtitle:
1
00:00:20,000 --> 00:00:24,400
a bla bla ble a bla bla ble
a bla bla ble
*/

function obtainSubtitles() {
  console.log("Obtaining strings from this webpage")
  let sentences = document.getElementsByClassName("sentence")
  let subtitles = produceSentences(sentences).join("\n")
  return subtitles
}

function timeString(time) {
  let hh = Math.floor(time / 3600)
  let mm = Math.floor((time - hh * 3600) / 60)
  let ss = time - hh * 3600 - mm * 60
  return `${hh}:${mm}:${ss},000`
}

function subtitleForSentence(index, text, prevText, start, end) {
  var lines = []
  if (text == null || end == null || start == null || text.trim() == "") { return lines }
  lines.push(index)
  lines.push(`${timeString(start)} --> ${timeString(end)}`)
  if (prevText.trim() != "") {
    lines.push(`<font color=#808080>${prevText}</font>`)
  }
  lines.push(`<b>${text.trim()}</b>`)
  lines.push("")
  return lines
}

function produceSentences(sentences) {
  var idx = 0
  var sText = ""
  var sPrevText = ""
  var sStart = null
  var lines = []
  for (let item of sentences) {
      let newStart = Number(item.href.substr(item.href.lastIndexOf("time=") + 5))
      let sentenceLines = subtitleForSentence(idx, sText, sPrevText, sStart, newStart)
      lines.push(...sentenceLines)
      sPrevText = sText
      sText = item.text
      sStart = newStart
      idx += 1
  }
  let sentenceLines = subtitleForSentence(idx, sText, sPrevText, sStart, sStart + 5)
  lines.push(...sentenceLines)
  return lines
}

/// Produce the output and send it back to background task
var pageUrl = window.location.href.split("/").slice(-3)
chrome.runtime.sendMessage({
  wwdc: pageUrl[0],
  topicNumber: pageUrl[1],
  subtitles: obtainSubtitles()
})
