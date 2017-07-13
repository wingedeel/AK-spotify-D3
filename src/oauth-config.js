var OAuthConfig = (function() {
  'use strict';

var clientId = '72ac1ab19aee4448ad8177a8a9362079'; 

  var redirectUri;
  if (location.host === 'localhost:8000') {
    redirectUri = 'http://localhost:8000/callback.html';
    //redirectUri = 'http://localhost:8000/callback';
  } else {
    redirectUri = 'http://www.annekotecha.co.uk/experiments/d3_spotify/callback.html';
  }
  var host = /http[s]?:\/\/[^/]+/.exec(redirectUri)[0];

  // Return the clientId, redirectUri and host as variables
  return {
    clientId: clientId,
    redirectUri: redirectUri,
    host: host
  };
})();