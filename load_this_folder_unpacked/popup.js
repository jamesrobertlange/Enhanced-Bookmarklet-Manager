// popup.js
document.addEventListener('DOMContentLoaded', function() {
  const folderList = document.getElementById('folderList');
  const bookmarkletList = document.getElementById('bookmarkletList');
  const executeButton = document.getElementById('executeButton');
  const deleteButton = document.getElementById('deleteButton');
  const nameInput = document.getElementById('nameInput');
  const folderInput = document.getElementById('folderInput');
  const codeInput = document.getElementById('codeInput');
  const saveButton = document.getElementById('saveButton');
  const exportButton = document.getElementById('exportButton');
  const importButton = document.getElementById('importButton');
  const fileInput = document.getElementById('fileInput');

  function loadBookmarklets() {
    chrome.storage.sync.get(null, function(data) {
      const bookmarklets = {};
      const folders = new Set(['']);
      
      for (let key in data) {
        if (key.startsWith('bm_')) {
          const name = key.slice(3);
          bookmarklets[name] = data[key];
          folders.add(data[key].folder || '');
        }
      }

      folderList.innerHTML = '<option value="">Select a folder</option>';
      bookmarkletList.innerHTML = '<option value="">Select a bookmarklet</option>';
      
      for (let folder of folders) {
        let option = new Option(folder || '(No folder)', folder);
        folderList.add(option);
      }
    });
  }

  function updateBookmarkletList() {
    const selectedFolder = folderList.value;
    chrome.storage.sync.get(null, function(data) {
      bookmarkletList.innerHTML = '<option value="">Select a bookmarklet</option>';
      for (let key in data) {
        if (key.startsWith('bm_')) {
          const name = key.slice(3);
          const info = data[key];
          if (info.folder === selectedFolder) {
            let option = new Option(name, name);
            bookmarkletList.add(option);
          }
        }
      }
    });
  }

  loadBookmarklets();

  folderList.addEventListener('change', updateBookmarkletList);

  executeButton.addEventListener('click', function() {
    const selectedName = bookmarkletList.value;
    if (selectedName) {
      chrome.storage.sync.get(`bm_${selectedName}`, function(data) {
        const bookmarklet = data[`bm_${selectedName}`];
        executeBookmarklet(bookmarklet.code);
      });
    }
  });

  deleteButton.addEventListener('click', function() {
    const selectedName = bookmarkletList.value;
    if (selectedName) {
      if (confirm(`Are you sure you want to delete the bookmarklet "${selectedName}"?`)) {
        chrome.storage.sync.remove(`bm_${selectedName}`, function() {
          loadBookmarklets();
          alert(`Bookmarklet "${selectedName}" has been deleted.`);
        });
      }
    } else {
      alert('Please select a bookmarklet to delete.');
    }
  });

  saveButton.addEventListener('click', function() {
    const name = nameInput.value;
    const folder = folderInput.value;
    let code = codeInput.value;
    if (name && code) {
      // Remove 'javascript:' prefix if present
      code = code.replace(/^javascript:/, '');
      
      const bookmarklet = { code, folder };
      chrome.storage.sync.set({ [`bm_${name}`]: bookmarklet }, function() {
        if (chrome.runtime.lastError) {
          alert('Error saving bookmarklet: ' + chrome.runtime.lastError.message);
        } else {
          loadBookmarklets();
          nameInput.value = '';
          folderInput.value = '';
          codeInput.value = '';
          alert('Bookmarklet saved successfully!');
        }
      });
    } else {
      alert('Please enter both name and code for the bookmarklet.');
    }
  });

  exportButton.addEventListener('click', function() {
    chrome.storage.sync.get(null, function(data) {
      const exportData = {};
      for (let key in data) {
        if (key.startsWith('bm_')) {
          const name = key.slice(3);
          exportData[name] = {
            code: data[key].code,
            folder: data[key].folder
          };
        }
      }
      
      const bookmarkletsJson = JSON.stringify(exportData, null, 2);
      const blob = new Blob([bookmarkletsJson], {type: 'application/json'});
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `bookmarklets-export-${new Date().toISOString().slice(0, 10)}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    });
  });

  importButton.addEventListener('click', function() {
    fileInput.click();
  });

  fileInput.addEventListener('change', function(event) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function(e) {
        try {
          const importedBookmarklets = JSON.parse(e.target.result);
          const savePromises = Object.entries(importedBookmarklets).map(([name, info]) => {
            return new Promise((resolve) => {
              chrome.storage.sync.set({
                [`bm_${name}`]: {
                  code: info.code,
                  folder: info.folder
                }
              }, resolve);
            });
          });

          Promise.all(savePromises).then(() => {
            loadBookmarklets();
            alert('Bookmarklets imported successfully!');
          }).catch((error) => {
            alert('Error importing bookmarklets: ' + error.message);
          });
        } catch (error) {
          alert('Error importing bookmarklets: ' + error.message);
        }
      };
      reader.readAsText(file);
    }
  });

  function executeBookmarklet(code) {
    // Decode the URL-encoded bookmarklet
    code = decodeURIComponent(code);
    
    console.log('Executing bookmarklet:', code);
  
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      chrome.scripting.executeScript({
        target: {tabId: tabs[0].id},
        func: (bookmarkletCode) => {
          const script = document.createElement('script');
          script.textContent = `(() => { ${bookmarkletCode} })();`;
          document.body.appendChild(script);
          document.body.removeChild(script);
        },
        args: [code],
        world: "MAIN"
      }, handleExecutionResult);
    });
  }

  function injectAndExecuteCode(code) {
    console.log('Injected code:', code);  // Log the injected code
    try {
      // Wrap the code in a try-catch block to catch any runtime errors
      const result = eval(code);
      console.log('Bookmarklet execution result:', result);  // Log the result
      return { success: true, result: result };
    } catch (error) {
      console.error('Error in bookmarklet execution:', error);  // Log any errors
      return { error: error.toString() };
    }
  }

  function handleExecutionResult(results) {
    if (chrome.runtime.lastError) {
      console.error('Error executing bookmarklet:', chrome.runtime.lastError);
      alert('Error executing bookmarklet: ' + chrome.runtime.lastError.message);
    } else if (results && results[0]) {
      if (results[0].result && results[0].result.error) {
        console.error('Error in bookmarklet execution:', results[0].result.error);
        alert('Error in bookmarklet execution: ' + results[0].result.error);
      } else {
        console.log('Bookmarklet executed successfully:', results[0].result);
        alert('Bookmarklet executed successfully');
      }
    } else {
      console.log('Bookmarklet execution completed without result');
      alert('Bookmarklet execution completed');
    }
  }

});