let tabWipeButton = document.getElementById("tabWipe");
let savedButton = document.getElementById("savedTabs");
let unsavedButton = document.getElementById("unsavedTabs");
let loadTabsButton = document.getElementById("loadTabs");
let body = document.body;
let titleSpan = document.getElementById("list");
let currentWindow = chrome.windows.WINDOW_ID_CURRENT
let listDiv = document.getElementById("listDiv");
let unsaved = [];
let saved = [];
let tabList = [];
let onUnsaved = false;
chrome.storage.local.get("saved", (obj) => { saved = obj["saved"];

chrome.tabs.query(
  {windowId: currentWindow},
  (tabs) => {
    if(saved!=undefined){
      for(let i=0; i<tabs.length; i++){
        if(saved.find(element => element.url==tabs[i].url)==undefined){
          unsaved.push({"id": "checkbox"+i, "url": tabs[i].url, "tabId": tabs[i].id});
          tabList.push(tabs[i]);
        }
      }
    }
    else{
      saved = [];
      for(let i=0; i<tabs.length; i++){
        unsaved.push({"id": "checkbox"+i, "url": tabs[i].url, "tabId": tabs[i].id});
      }
    }
  }
);

tabWipeButton.addEventListener("click", () => {
    if(onUnsaved){
      for(let i=0; i<unsaved.length; i++){
        document.getElementById(unsaved[i].id).parentNode.remove();
      }
    }
    for(let i=0; i<tabList.length; i++){
      if(saved.find(element => element.url == tabList[i].url) == undefined){
        chrome.tabs.remove(tabList[i].id);
        tabList.splice(i, 1);
        i--
      }
    }
    unsaved = [];
  });

  savedButton.addEventListener("click", async () => {
    onUnsaved = false;
    listDiv.innerHTML=""
    titleSpan.innerText="Saved Tabs"
    // chrome.storage.local.get("saved", (obj) => { saved = obj["saved"];
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
      document.getElementById(saved[i].id).addEventListener("change", (event) => {let deleteDiv = document.getElementById(event.currentTarget.id).parentNode; deleteDiv.remove(); unsaved.push({"id": event.currentTarget.id, "url":saved.find(element => element.id == event.currentTarget.id).url, "tabId":saved.find(element => element.id == event.currentTarget.id).tabId}); saved.splice(saved.indexOf(saved.find(element => element.id == event.currentTarget.id)), 1); chrome.storage.local.set({"saved": saved})});
            addP.innerText=saved[i].url;
        }});})

  unsavedButton.addEventListener("click", async () => {
    onUnsaved = true;
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
      document.getElementById(unsaved[i].id).addEventListener("change", (event) => {let deleteDiv = document.getElementById(event.currentTarget.id).parentNode; deleteDiv.remove(); saved.push({"id": event.currentTarget.id, "url":unsaved.find(element => element.id == event.currentTarget.id).url, "tabId":unsaved.find(element => element.id == event.currentTarget.id).tabId}); unsaved.splice(unsaved.indexOf(unsaved.find(element => element.id == event.currentTarget.id)), 1); chrome.storage.local.set({"saved": saved})});
            addP.innerText=unsaved[i].url;
        }
  })

  // chrome.storage.sync.get(["newURL", "tabId"], (obj) => {if(saved.find(element => element.tabId == obj["tabId"].tabId)!=undefined){saved[saved.indexOf(saved.find(element => element.tabId == obj["tabId"].tabId))].url = obj["newURL"].url}})