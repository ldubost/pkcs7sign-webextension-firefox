/*
On startup, connect to the "pkcs7sign" native app.
*/
let port = browser.runtime.connectNative("pkcs7sign");

var debugActive = true;

function debug(msg, variable) {
  if (debugActive) {
    if (variable)
      console.log(msg, variable);
    else
      console.log(msg);
  }
}

/*
Listen for messages from the app.
*/
port.onMessage.addListener((resp) => {
  var response = JSON.parse(resp);
  debug("RECEIVED FROM NODEJS: ", response);

  try {
    debug("CALLING CS");
    // Send message from active tab to background: 
    browser.tabs.query({ active: true, currentWindow: true }, function(tabs) {
      browser.tabs.sendMessage(tabs[0].id, response, function(response) {
         debug("CALLING CALLBACK");
      });
    });
    debug("CALLING CS DONE");
  } catch (e) { 
    debug("ERROR IN BACKGROUND ", e);
  } 
});

/*
On a click on the browser action, send the app a message.
*/
browser.browserAction.onClicked.addListener(() => {
  debug("TEST SIGNING");
  debug("CALLING CS");
  browser.tabs.query({ active: true, currentWindow: true }, function(tabs) {
      browser.tabs.sendMessage(tabs[0].id, { message : "passphrase" }, function(response) {
      });
  });

});

// background-script.js
function handleMessage(request, sender, sendResponse) {
  debug("SIGNDOCUMENT message from CS: ", request.data);
  if (request.data && request.data!="")
    port.postMessage({ message : "sign", data: request.data, passphrase : request.passphrase });
  else
    port.postMessage({ message : "certificate", data: "", passphrase: request.passphrase });
}

browser.runtime.onMessage.addListener(handleMessage);

