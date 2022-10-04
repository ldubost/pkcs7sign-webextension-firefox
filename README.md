# pkcs7sign-webextension-firefox

Firefox Web Extension to communicate between browser application and a pkcs7 nodejs signing application

This code implements a Firefox Web Extension which will listen to messages from a browser application which will request a signature from a PKCS7 device.
The signature request is then forwarded to a Native Message Application running on the user's device. 

The backend code implemented in node is available here: https://github.com/ldubost/pkcs7sign-host-nodesigning

The code calling the web extension is in a CryptPad experiment allowing to sign PDF documents online using a PKCS7 Hardware Token.
The hardware token used in a Chambersign Gemalto Hardware Token

