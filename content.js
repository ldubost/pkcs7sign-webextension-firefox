
var debugActive = true;

function debug(msg, variable) {
  if (debugActive) {
    if (variable)
      console.log(msg, variable);
    else  
      console.log(msg);
  }
}

debug("SIGNDOCUMENT CONTENT SCRIPT INIT");

function handleResponse(message) {
  debug("SIGNDOCUMENT handleResponse CB", message);
}

function handleError(error) {
  debug("SIGNDOCUMENT handleError CB", error);
}

function signDocument(data, passphrase) {
   debug("SIGNDOCUMENT in content script signDocument", data);
   const sending = browser.runtime.sendMessage({
    data: data,
    passphrase: passphrase
   });
   sending.then(handleResponse, handleError);
}

function getCertificate(passphrase) {
   debug("SIGNDOCUMENT in content script getCertificate");
   const sending = browser.runtime.sendMessage({
    data: "",
    passphrase: passphrase
   });
   sending.then(handleResponse, handleError);
}

function receiveMessageFromBackground(message, cb) {
   debug("SIGNDOCUMENT From background: " , message);
   if (message.message == "signature") {
    window.eval("window.signDocCB('" + message.signature + "');");
   } else if (message.message == "certificate") {
    window.eval("window.getCertificateCB('" + message.certificate + "');");
   } else if (message.message == "passphrase") {
    debug("In CS passphrase");
    var passphrase = prompt("Passphrase for hardware key");
    signDocument("Secret Message", passphrase);
   } else if (message.message == "fail") {
    debug("In fail");
    alert("Signature has failed. Either passphrase is incorrect or hardware key is absent: " + message.error);
   }
}

browser.runtime.onMessage.addListener(receiveMessageFromBackground);

debug("SIGNDOCUMENT insert listener");
window.addEventListener("message", function(event) {
    if (event.source != window)
        return;

    if (event.data.type && (event.data.type == "CRYPTPAD_SIGN")) {
        debug("SIGNDOCUMENT Message received from web page " + event.data.text);
        signDocument(event.data.data, event.data.passphrase);
    }

    if (event.data.type && (event.data.type == "CRYPTPAD_CERTIFICATE")) {
        debug("SIGNDOCUMENT Certificate Message received from web page");
        getCertificate(event.data.passphrase);
    }
}, false);

debug("SIGNDOCUMENT CONTENT SCRIPT INIT DONE");
