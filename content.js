if (typeof browser === "undefined") {
  var browser = chrome;
}

browser.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "getPageText") {
    let text = "";

    if (request.info?.linkUrl) {
      text = request.info.linkUrl;
    } else {
      const selection = window.getSelection()?.toString().trim();
      text = selection && selection.length > 0 ? selection : document.body.innerText;
    }

    sendResponse({ text });
  }

  return true;
});
