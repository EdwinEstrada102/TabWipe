let tabWipeButton = document.getElementById("tabWipe");
let savedButton = document.getElementById("savedTabs");
let unsavedButton = document.getElementById("unsavedTabs");
let loadTabsButton = document.getElementById("loadTabs");
let body = document.body;
let titleSpan = document.getElementById("list");
let currentWindow = chrome.windows.WINDOW_ID_CURRENT
let listDiv = document.getElementById("listDiv");
let saved = [];
chrome.storage.sync.get("saved", (obj) => saved = obj["saved"]);
const unsaved = [];

chrome.tabs.query(
  {windowId: currentWindow},
  (tabs) => {
    for(let i=0; i<tabs.length; i++){
      if(saved.find( elements => elements.id=="checkbox"+i)==undefined){
        unsaved.push({"id": "checkbox"+i, "url": tabs[i].url, "tabId": tabs[i].id});
      }
    }
  }
);

tabWipeButton.addEventListener("click", () => {
    for(let i=0; i<unsaved.length; i++){
      chrome.tabs.remove(unsaved[i].tabId)
    }
    listDiv.innerHTML=""
  });

  savedButton.addEventListener("click", async () => {
    listDiv.innerHTML=""
    titleSpan.innerText="Saved Tabs"
    chrome.storage.sync.get("saved", (obj) => {saved = obj["saved"];
    saved.sort(function(a, b) {if(a.id<b.id){return -1;}if(a.id>b.id){return 1;}});
        for(let i=0; i<saved.length; i++){
			let newP = document.createElement("p");
			let newDiv = document.createElement("div");
			let newInput = document.createElement("input");
			let addDiv = listDiv.appendChild(newDiv);
			let addInput = addDiv.appendChild(newInput);
			let addP = addDiv.appendChild(newP);
			addDiv.setAttribute("class", "listItem");
			addInput.setAttribute("type", "checkbox");
      addInput.setAttribute("id", saved[i].id);
      addInput.setAttribute("checked", true);
      document.getElementById(saved[i].id).addEventListener("change", (event) => {let deleteDiv = document.getElementById(event.currentTarget.id).parentNode; deleteDiv.remove(); unsaved.push({"id": event.currentTarget.id, "url":saved.find(element => element.id == event.currentTarget.id).url, "tabId":saved.find(element => element.id == event.currentTarget.id).tabId}); saved.splice(saved.indexOf(saved.find(element => element.id == event.currentTarget.id)), 1); chrome.storage.sync.set({"saved": saved})});
            addP.innerText=saved[i].url;
        }});
  });

  unsavedButton.addEventListener("click", async () => {
    listDiv.innerHTML=""
    titleSpan.innerText="Unsaved Tabs"
    unsaved.sort(function(a, b) {if(a.id<b.id){return -1;}if(a.id>b.id){return 1;}});
        for(let i=0; i<unsaved.length; i++){
			let newP = document.createElement("p");
			let newDiv = document.createElement("div");
			let newInput = document.createElement("input");
			let addDiv = listDiv.appendChild(newDiv);
			let addInput = addDiv.appendChild(newInput);
			let addP = addDiv.appendChild(newP);
			addDiv.setAttribute("class", "listItem");
			addInput.setAttribute("type", "checkbox");
      addInput.setAttribute("id", unsaved[i].id);
      document.getElementById(unsaved[i].id).addEventListener("change", (event) => {let deleteDiv = document.getElementById(event.currentTarget.id).parentNode; deleteDiv.remove(); saved.push({"id": event.currentTarget.id, "url":unsaved.find(element => element.id == event.currentTarget.id).url, "tabId":unsaved.find(element => element.id == event.currentTarget.id).tabId}); unsaved.splice(unsaved.indexOf(unsaved.find(element => element.id == event.currentTarget.id)), 1); chrome.storage.sync.set({"saved": saved})});
            addP.innerText=unsaved[i].url;
        }
  })