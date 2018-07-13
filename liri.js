require("dotenv").config();
var keys = require("./keys.js");
var fs = require("fs");
var Twitter = require('twitter');
var Spotify = require('node-spotify-api');
var request = require('request');
var spotify = new Spotify(keys.spotify);
var client = new Twitter(keys.twitter);

var action = process.argv;
var command = process.argv[2];
var j = "";


for (var i = 3; i < action.length; i++) {
    if (i > 3 && i < action.length) {
        j = j + "+" + action[i];
    } else {
        j = j + action[i];
    }
}


switch (command) {
    case "my-tweets":
        tweet();
        break;

    case "spotify-this-song":
        if (j) {
            spotifySong(j);
        }
        else {
            spotifySong("The Sign");
        }
        break;

    case "movie-this":
        if (j) {
            movie(j);
        }
        else {
            movie("Mr. Nobody.");
        }
        break;

    case "do-what-it-says":
        doWhatItSays();
        break;

    default:
        console.log("Please enter a command: \nmy-tweets \nspotify-this-song \nmovie-this \ndo-what-it-says");
        break;
}


// my-tweets
function tweet() {

    var screenName = { screen_name: 'entyce4' };
    client.get('statuses/user_timeline', screenName, function (error, tweets, response) {
        if (error) throw error;

        for (var i = 0; i < tweets.length; i++) {
            var date = tweets[i].created_at;
            console.log("@ entyce4: " + tweets[i].text + " Created At: " + date.substring(0, 19));
            console.log("-----------------------");
        }
    });
    console.log("Tweets have been posted");
}


// spotify-this-song
function spotifySong(song) {
    spotify.search({ type: 'track', query: song }, function (error, data) {
        if (!error) {
            for (var i = 0; i < data.tracks.items.length; i++) {
                var songData = data.tracks.items[i];
                console.log("Artist: " + songData.artists[0].name);
                console.log("Song: " + songData.name);
                console.log("Preview URL: " + songData.preview_url);
                console.log("Album: " + songData.album.name);
                console.log("-----------------------");
            }
        } else {
            console.log('An error has occurred.');
        }
    });
}


// movie-this
function movie(movie) {
    var queryUrl = "http://www.omdbapi.com/?t=" + movie + "&y=&plot=short&apikey=trilogy";

    console.log(queryUrl);

    request(queryUrl, function (error, response, body) {

        if (!error && response.statusCode === 200) {
            console.log(JSON.parse(body))
            console.log("Movie Title: " + JSON.parse(body).Title);
            console.log("Release Year: " + JSON.parse(body).Year);
            console.log("IMDB Rating: " + JSON.parse(body).Ratings[0].Value);
            console.log("Rotten Tomatoes: " + JSON.parse(body).Ratings[1].Value);
            console.log("Country: " + JSON.parse(body).Country);
            console.log("Country: " + JSON.parse(body).Language);
            console.log("Plot: " + JSON.parse(body).Plot);
            console.log("Actors: " + JSON.parse(body).Actors);
        }
    });
}


// do-what-it-says
function doWhatItSays() {
    fs.readFile('random.txt', "utf8", function (error, data) {
        if (error) {
            return console.log(error);
        }
        var txt = data.split(',');
        spotifySong(txt[1]);
    });
}