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
 
          // Hardcoded artist id of 'Elvis Presley'
          // Retrieve artist
         //var artistId = '43ZHCT0cAZBISjO8DG9PnE';
         //spotifyApi.getArtist(artistId).then(showArtist);

          // Retrieve related artists
         ///spotifyApi.getArtistRelatedArtists(artistId).then(showRelatedArtists);
         getAndDisplayRelatedArtists(artist);
        
    /*
    spotifyApi.searchArtists(
                artist,
                userCountry
                ).then(function (data) {

                  //console.log('retrieve artist ', data);
                  if (data.artists.items.length > 0) {
                  // Get  artist id
                  var artistId = data.artists.items[0].id;
                  //console.log('artistId ' ,  artistId);
                  spotifyApi.getArtistRelatedArtists(artistId).then((data)=>{

                    // Get related artists
                    //console.log('related artists ' , data);
                   
                   //var json =  JSON.stringify(data);
                   //console.log(json);

                   // Create a copy of the returned 'artists' object
                   // Set key name to 'children', and value to artists.value
                   // Display that new object.
                   
                    // Display related artists
                    //displayAsList(data)
                    displayAsTree(data);
                  })
                }
                //if (data.artists && data.artists.items.length) {
                //    initRootWithArtist(data.artists.items[0]);
                //}
     
    
   */
  }
}

/*
function getRelatedArtists(artist) {
   spotifyApi.searchArtists( artist,userCountry)
    .then(function (data) {
        var artistId = data.artists.items[0].id;
        spotifyApi.getArtistRelatedArtists(artistId)
              .then((data)=>{
                return data;
              })
  });           
}
*/

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

    // Init results container
    /*
    var formArtist = document.getElementById('searchForm');
        formArtist.addEventListener('submit', function (e) {
            showCompletion = false;
            e.preventDefault();
            var search = document.getElementById('textInput');
            currentApi.searchArtists(
                search.value.trim(),
                userCountry
                ).then(function (data) {
                  console.log('searchArtist', data)
                //if (data.artists && data.artists.items.length) {
                //    initRootWithArtist(data.artists.items[0]);
                //}
            });

        }, false);
      */
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
/*
            // Make a call to Spotify for my credentials
            $.ajax({
                url: 'https://api.spotify.com/v1/me',
                headers: {
                  'Authorization': 'Bearer ' + access_token
                },
                success: function(response) {
                  console.log('get my credentials: ', response);
                }
            });
*/

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
