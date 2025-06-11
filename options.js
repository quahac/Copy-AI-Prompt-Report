if (typeof browser === "undefined") {
  var browser = chrome;
}

document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('templatesContainer');
  const status = document.getElementById('status');

  browser.storage.sync.get(['customTemplates'], (result) => {
    const templates = result.customTemplates || [];
    templates.forEach(addTemplateBlock);
  });

  document.getElementById('addTemplateBtn').addEventListener('click', () => {
    addTemplateBlock();
    saveTemplates(); 
  });

  document.getElementById('deleteAllBtn').addEventListener('click', () => {
    if (confirm("Are you sure you want to delete all templates?")) {
      browser.storage.sync.remove('customTemplates', () => {
        container.innerHTML = "";
        showStatus("All templates deleted.");
        browser.runtime.sendMessage({ action: "reloadContextMenus" });
      });
    }
  });

  function addTemplateBlock(template = { title: "", content: "${content} : Improve Content" }) {
    const div = document.createElement('div');
    div.className = 'template-block';

    const titleInput = document.createElement('input');
    titleInput.type = 'text';
    titleInput.className = 'template-title';
    titleInput.placeholder = 'Template title';
    titleInput.value = template.title;

    const contentTextarea = document.createElement('textarea');
    contentTextarea.className = 'template-content';
    contentTextarea.placeholder = 'Use ${content} as placeholder';
    contentTextarea.value = template.content;

    const insertBtn = document.createElement('button');
    insertBtn.textContent = '🔣 Insert ${content}';
    insertBtn.style.marginRight = '8px';
    insertBtn.addEventListener('click', () => {
      const cursorPos = contentTextarea.selectionStart;
      const textBefore = contentTextarea.value.substring(0, cursorPos);
      const textAfter = contentTextarea.value.substring(cursorPos);
      contentTextarea.value = textBefore + '${content}' + textAfter;
      contentTextarea.focus();
      contentTextarea.selectionEnd = cursorPos + '${content}'.length;
      saveTemplates();
    });

    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = '🗑️ Delete';
    deleteBtn.className = 'delete-button';
    deleteBtn.addEventListener('click', () => {
      div.remove();
      saveTemplates();
    });

    titleInput.addEventListener('input', saveTemplates);
    contentTextarea.addEventListener('input', saveTemplates);

    div.appendChild(titleInput);
    div.appendChild(contentTextarea);
    div.appendChild(insertBtn);
    div.appendChild(deleteBtn);

    container.appendChild(div);
  }

  function saveTemplates() {
    const blocks = document.querySelectorAll('.template-block');
    const templates = [];

    blocks.forEach((block, index) => {
      const title = block.querySelector('.template-title').value.trim();
      const content = block.querySelector('.template-content').value;

      if (title && content) {
        templates.push({
          id: `template${index + 1}`,
          title,
          content
        });
      }
    });

    browser.storage.sync.set({ customTemplates: templates }, () => {
      showStatus("Templates saved.");
      browser.runtime.sendMessage({ action: "reloadContextMenus" });
    });
  }

  function showStatus(message) {
    status.textContent = message;
    clearTimeout(status._timeout);
    status._timeout = setTimeout(() => status.textContent = "", 2000);
  }
});
