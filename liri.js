//===========================================Functions=========================================================
// Grab or assemble the movie name and store it in a variable called "movieName"
var searchThis = function (a) {
    var array = a.slice(3, a.length);
    if (array.length > 1)
    {
        search2 = array[0];
        for(var i=1; i < array.length; i++){
            search2 = search2 +'+'+ array[i];
        }
    }
    else{
        search2 = a[2];
    }

    return search2;
};

function movieCall (URL){

    request(URL, function(err, response, body){
        var object = JSON.parse(body);
        if (!err && response.statusCode === 200){
            console.log("This is the movie title: "+title+".\nThe movie was released in the year of: "+object.Year+
                ".\nThe IMDB rating is: "+object.Rated+".\n"+title+" was produced in "+ object.Country+".");
        }
    });
}

//=======================================additional global variables===============================================
var title = process.argv.slice(3, process.argv.length).join(" ");
var auth = require("./keys.js"), access = auth.twitterKeys;
var fs = require("fs"), request = require("request"), spotify = require("spotify");
var search = process.argv[3], inputCmd = process.argv[2]; //options my-tweets, spotifiy-this-song, movie-this, do-what-it-says
//var msg = "If you haven't watched Mr.Nobody, then you should: <a href='http://www.imdb.com/title/tt0485947'>Click here</a>";
var movieURL = "http://www.omdbapi.com/?t=" + searchThis(process.argv) + "&r=json";
var twitterURL = "https://api.twitter.com/1.1/statuses/user_timeline.json"; //%40coding_n00bie

var Twitter = require("twitter"), twitterClient = Twitter(access);
var twitParams = {screen_name: "coding_n00bie", count: 20, exclude_replies: true};
//you need your api key for the OMDB site


//==========================================Program=========================================================
switch(inputCmd){
 case "movie-title":	if(process.argv[3]){
 						 movieCall(movieURL);
	  					}else{
	  						movieCall("http://www.omdbapi.com/?t=Mr.+Nobody&r=json");
	  						console.log(msg+".\nIt's on Netflix.");
	  					} break;

 case "my-tweets": twitterClient.get('statuses/user_timeline', twitParams, function(err, tweets){
     if(err){
 		console.log("Something went wrong. Here is the error: "+ err);
 	}else {
         var userView = tweets.length;
        for (var i = 0; i < userView; i++) {
            console.log("++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++\nAh, here's tweet #"+ (userView - i));
          console.log("%s : %s ", tweets[i].text, tweets[i].created_at);
        }
    }
 }); break;

 case "spotify-track":  spotify.search ({type: "track", query: title}, function(err, spotifyData){
 	if(err){
        console.log("Ah, an error: "+err);
        return;
    }else if(!title){
        spotify.search ({type: "track", query: "The Sign"}, function (err2, spotData) {
            if(err2) {
                console.log('Error occurred when title was not given: ' + err);
                return;
            } else {
                var objPath = spotData.tracks.items[14];
                console.log("Track name: " + objPath.name + "\n");
                console.log("Here's a preview link: " + objPath.preview_url + "\n");
                console.log("Album: " + objPath.album.name + "\n");
                console.log("Artist: " + objPath.artists[0].name + "\n");
            }
        });
 	}else{
        var objPath = spotifyData.tracks.items[0];
 		console.log("Track name: "+objPath.name+"\n");
        console.log("Here's a preview link: "+objPath.preview_url+"\n");
        console.log("Album: "+objPath.album.name+"\n");
        console.log("Artist: "+objPath.artists[0].name+"\n");
    }
 }); break;

 case "do-what-it-says":
 	fs.readFile("random.txt", "utf8", function(fileErr, fileData){
 	    if(fileErr){
 	        console.log("This is the callback error for file: "+err);
        }else {
            var textArray = fileData.split(",");
            spotify.search({type: "track", query: textArray[1]}, function (spotErr, spotData) {
                if (spotErr) {
                    console.log("Oh, this is a spotify error...see: " + spotErr);
                } else {
                    console.log("This is the track searched: "+ spotData.tracks.items[0].name);
                    console.log("An artist(s) for this track: " + spotData.tracks.items[0].artists[0].name);
                }
            });
        }
    }); break;

    default: console.log("Something went wrong. First enter movie-title, my-tweets, spotify-track, or do-what-it-says." + inputCmd);
}



//data.tracks.items.length  data.tracks.items.artist.length