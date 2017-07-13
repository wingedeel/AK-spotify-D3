//replace with configured servers uri
var serverBasePath = 'https://api.spotify.com/v1'; //"http://localhost:10000";
var spotifyApi;
var spotifyEnabled = false;
var userCountry;


/* -----------------  
  INITIALISATION
  ----------------- */

// Get references to DOM elements
const input = document.getElementById('textInput');
const submitBtn = document.getElementById('submitBtn');
const loginBtn = document.getElementById('loginBtn');


function handleSubmit(e) {
  if (spotifyEnabled) {
    var artist = encodeURIComponent(input.value.toLowerCase()).trim();
    getAndDisplayRelatedArtists(artist);
  }
}

function handleLogin(e) {
    login();
}


function getAndDisplayRelatedArtists(artist) {
   spotifyApi.searchArtists( artist,userCountry)
    .then(function (data) {
        if (data.artists.items.length > 0) {
            var artistId = data.artists.items[0].id;
            spotifyApi.getRelatedArtists(artistId)
              .then((data)=>{
                displayAsTree(data);
              })
        }
  });           
}


// Set event handlers
submitBtn.onclick = handleSubmit;
loginBtn.onclick = handleLogin;


window.addEventListener('load', function () {
  
  // Get user's country code
  $.ajax({
            url: "https://freegeoip.net/json/"
        }).done(function (data) {
            if (data.country_code) {
                userCountry = data.country_code;
                console.log('user country ', userCountry)
            }
        });

        spotifyApi = new spotifyApi();
        
        login();
})


/*
function makeRequest() {

        function getHashParams() {
          var hashParams = {};
          var e, r = /([^&;=]+)=?([^&;]*)/g,
              q = window.location.hash.substring(1);
          while ( e = r.exec(q)) {
             hashParams[e[1]] = decodeURIComponent(e[2]);
          }
          return hashParams;
        }

        var params = getHashParams();

        var access_token = params.access_token,
            refresh_token = params.refresh_token,
            error = params.error;

        if (error) {
          alert('There was an error during the authentication');
        } else {
          if (access_token) {

            spotifyApi = new spotifyApi(serverBasePath, access_token);
            spotifyEnabled = true;

          } else {
             
          }


        }

};
*/

 //makeRequest();

 function login() {

        return new Promise(function (resolve, reject) {
            OAuthManager.obtainToken({
              scopes: [
                  'playlist-read-private',
                  'playlist-modify-public',
                  'playlist-modify-private'
                ]
              }).then(function(token) {
                resolve(onTokenReceived(token));
              }).catch(function(error) {
                console.error(error);
              });
          });
  }


function onTokenReceived(access_token) {
  console.log('afterTokenReceived', access_token);
    spotifyApi.setServerBasePath(serverBasePath)
    spotifyApi.setAccessToken(access_token);
    spotifyEnabled = true;

        //return new Promise(function (resolve, reject) {
            //artistInfoModel.isLoggedIn(true);
           // spotifyWebApi.setAccessToken(accessToken);
           // localStorage.setItem('ae_token', accessToken);
           // localStorage.setItem('ae_expires', (new Date()).getTime() + 3600 * 1000); // 1 hour
            //spotifyWebApi.getMe().then(function(data){
               // artistInfoModel.userId(data.id);
                //artistInfoModel.displayName(getDisplayName(data.display_name));
                //artistInfoModel.userImage(data.images[0].url);
                //localStorage.setItem('ae_userid', data.id);
                //localStorage.setItem('ae_display_name', data.display_name);
                //localStorage.setItem('ae_user_image', data.images[0].url);
                //currentApi = spotifyWebApi;
                //resolve(checkArtistExplorerPlaylistExists(artistInfoModel.userId(), 0, 50));
           // });
        //});
}

