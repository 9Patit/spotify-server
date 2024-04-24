require('dotenv').config()
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const SpotifyWebApi = require("spotify-web-api-node");

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post("/refresh", (req, res) => {
  const refreshToken = req.body.refreshToken;

  console.log("Server runing");
  
  const spotifyApi = new SpotifyWebApi({
    redirectUri: process.env.REDIRECT_URI,
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    refreshToken,
  });

  spotifyApi
    .refreshAccessToken()
    .then((data) => {
      res.json({
        accessToken: data.body.access_token,
        expiresIn: data.body.expires_in,
      });
    })
    .catch(err => {
      console.log(err);
      res.sendStatus(400);
    });
});

app.post("/login", (req, res) => {
  const code = req.body.code;
  console.log(code);  
  const spotifyApi = new SpotifyWebApi({
    // redirectUri: "http://localhost:5173",
    redirectUri: "https://spotify-frontend-6zdvujwk7-gears-projects.vercel.app",
    clientId: "e0e2d01268884c5c86bef49f2533af70",
    clientSecret: "ac326f916d3e4c5fbf8000a5cb30fd22",
  });

  spotifyApi
    .authorizationCodeGrant(code)
    .then((data) => {
      console.log(data);
      res.json({
        accessToken: data.body.access_token,
        refreshToken: data.body.refresh_token,
        expiresIn: data.body.expires_in,
      });
    })
    .catch((err) => {
      console.log("Error!", err);
      res.sendStatus(400);
    });
});

app.listen(3001);