let tabWipeButton = document.getElementById("tabWipe");
let savedButton = document.getElementById("savedTabs");
let unsavedButton = document.getElementById("unsavedTabs");
let titleSpan = document.getElementById("list");

tabWipeButton.addEventListener("click", async () => {
    let currentWindow = chrome.windows.WINDOW_ID_CURRENT
  
    chrome.tabs.query(
      {windowId: currentWindow},
      (tabs) => {
        for(let i=0; i<tabs.length; i++){
            chrome.tabs.remove(tabs[i].id)
        }
      }
    );
  });

  savedButton.addEventListener("click", async () => {
    titleSpan.innerText="Saved Tabs"
  });

  unsavedButton.addEventListener("click", async () => {
    titleSpan.innerText="Unsaved Tabs"
  });