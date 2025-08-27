document.addEventListener("DOMContentLoaded", () => {
  const btn = document.getElementById("mergeTabs");

  btn.addEventListener("click", () => {
    console.log("Button clicked, sending message");
    chrome.runtime.sendMessage({ action: "mergeAndSortTabs" }, () => {
      if (chrome.runtime.lastError) {
        console.error("Message error:", chrome.runtime.lastError.message);
      } else {
        console.log("Message sent successfully");
      }
    });
  });
});
