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


function handleSubmit(e) {
  if (spotifyEnabled) {
    var artist = encodeURIComponent(input.value.toLowerCase()).trim();
 
         getAndDisplayRelatedArtists(artist);
  
  }
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

})



function makeRequest() {

        /**
         * Obtains parameters from the hash of the URL
         * @return Object
         */
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


function showArtist (artist) {
    console.log('retrieved artist ', artist)
}

function showRelatedArtists (artists) {
  console.log('retrieved related artists ', artists)
}

 makeRequest();
