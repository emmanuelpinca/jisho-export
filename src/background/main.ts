console.log("Background script running");

// example listener
browser.runtime.onMessage.addListener((msg) => {
  console.log("Got message", msg);
});
