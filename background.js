chrome.runtime.onInstalled.addListener(() => {
    console.log("Service worker installed");
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log("Received message in background:", request);
    if (request.action === "mergeAndSortTabs") {
        mergeAndSortTabs();
    }
});

function mergeAndSortTabs() {
    console.log("Starting mergeAndSortTabs()");
    chrome.windows.getAll({populate: true}, (windows) => {
        if (!windows.length) return;
        const targetWindow = windows[0];
        let allTabs = [];

        for (let i = 0; i < windows.length; i++) {
            const windowTabs = windows[i].tabs;
            if (windows[i].id !== targetWindow.id) {
                const tabIds = windowTabs.map(tab => tab.id);
                chrome.tabs.move(tabIds, {windowId: targetWindow.id, index: -1});
            }
            allTabs = allTabs.concat(windowTabs);
        }

        setTimeout(() => {
            chrome.tabs.query({windowId: targetWindow.id}, (tabs) => {
                const sorted = [...tabs].sort((a, b) => a.title.localeCompare(b.title));
                sorted.forEach((tab, i) => {
                    chrome.tabs.move(tab.id, {index: i});
                });
                console.log("Tabs sorted.");
            });
        }, 1000);
    });
}
