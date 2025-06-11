if (typeof browser === "undefined") {
  var browser = chrome;
}

document.getElementById('openOptions').addEventListener('click', () => {
  if (browser.runtime.openOptionsPage) {
    browser.runtime.openOptionsPage();
  } else {
    window.open(browser.runtime.getURL('options.html'));
  }
});
