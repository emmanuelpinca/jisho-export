console.log("Content script running on", window.location.href);

browser.runtime.sendMessage({ hello: "from content" });
