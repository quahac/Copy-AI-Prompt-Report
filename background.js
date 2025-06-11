if (typeof browser === "undefined") {
  var browser = chrome;
}

browser.runtime.onInstalled.addListener(() => {
  browser.contextMenus.removeAll(() => {
    createContextMenus();
  });
});

browser.runtime.onMessage.addListener((message) => {
  if (message.action === "reloadContextMenus") {
    browser.contextMenus.removeAll(() => {
      createContextMenus();
    });
  }
});

function createContextMenus() {
  browser.storage.sync.get(["customTemplates"], (result) => {
    const templates = result.customTemplates || [];

    templates.forEach((template) => {
      browser.contextMenus.create({
        id: `customTemplate-${template.id}`,
        title: template.title,
        contexts: ["all"]
      });
    });
  });
}

browser.contextMenus.onClicked.addListener((info, tab) => {
  if (!tab?.id || !info.menuItemId.startsWith("customTemplate-")) return;

  const templateId = info.menuItemId.replace("customTemplate-", "");

  browser.storage.sync.get(["customTemplates"], (result) => {
    const templates = result.customTemplates || [];
    const selected = templates.find(t => t.id === templateId);
    if (!selected) return;

    browser.tabs.executeScript(tab.id, { file: "content.js" }, () => {
      browser.tabs.sendMessage(tab.id, { action: "getPageText", info }, (response) => {
        if (!response) return;

        const baseText = response.text || "";
        const finalText = selected.content.replace(/\${content}/g, baseText);

        browser.tabs.executeScript(tab.id, {
          code: `
            (function() {
              const textarea = document.createElement("textarea");
              textarea.value = ${JSON.stringify(finalText)};
              document.body.appendChild(textarea);
              textarea.select();
              document.execCommand("copy");
              document.body.removeChild(textarea);
            })();
          `
        });
      });
    });
  });
});
