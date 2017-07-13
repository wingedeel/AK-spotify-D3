/* 
This script is placed in callback.html
Establish if this window has been opened (the child)
or has done the opened (the parent)
*/
var target = window.self === window.top ? window.opener : window.parent;

/* 
If url contains a hash return part after hash
Retrieve the token
Send the 'token' as a message to the target window
(which has to be the same id as the OAuthConfig.host variable)
*/
var hash = window.location.hash;
if (hash) {
  var token = window.location.hash.split('&')[0].split('=')[1];
  target.postMessage(token, OAuthConfig.host);
}