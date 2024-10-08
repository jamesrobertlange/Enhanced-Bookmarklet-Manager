// background.js
chrome.runtime.onInstalled.addListener(function() {
  const initialBookmarklets = {
    "Highlight Text": {
      code: "(function(){var s=document.getSelection();var r=document.createElement('span');r.style.backgroundColor='yellow';s.getRangeAt(0).surroundContents(r);})();",
      folder: "Text Utilities"
    },
    "Count Words": {
      code: "(function(){var words = document.body.innerText.trim().split(/\s+/).length; alert('This page contains approximately ' + words + ' words.');})();",
      folder: "Text Utilities"
    },
    "Copy Full HTML": {
      code: "(function(){var h=document.documentElement.outerHTML;var t=document.createElement('textarea');t.value='<!DOCTYPE html>\\n'+h;document.body.appendChild(t);t.select();try{var s=document.execCommand('copy');var m=s?'successful':'unsuccessful';console.log('Copying HTML was '+m)}catch(e){console.error('Unable to copy HTML: ',e)}document.body.removeChild(t);alert('Full HTML has been copied to the clipboard! ('+h.length+' characters)')})();",
      folder: "DOM Tools"
    }
  };

  chrome.storage.sync.set({bookmarklets: initialBookmarklets}, function() {
    console.log("Initial bookmarklets created");
  });
});