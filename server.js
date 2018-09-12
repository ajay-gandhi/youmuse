/* global require, process, __dirname */

const path = require("path");
const express = require("express");
const ytdl = require("ytdl-core");
// const Logger = require("../util/logger");

// const LOG = new Logger("youmuse");
const LOG = { log: console.log };

const app = express();
const PORT = process.argv[2] || 8001;
app.use(express.static(__dirname + "/public"));

app.get("/getAudioUrl/:videoId", (req, res) => {

  const url = `https://www.youtube.com/watch?v=${req.params.videoId}`;

  // Download video information so that we can choose a format and get URL
  ytdl.getInfo(url, (err, info) => {
    if (err) return LOG.log("Error getting video info:", err);

    const format = info.formats.reduce(function (acc, c) {
      // Isn"t an audio format
      if (!c.type || c.type.indexOf("audio") < 0) return acc;

      // mp4 best
      if (c.container === "mp4") {
        if (acc.container !== "mp4") return c;
        if (c.audioBitrate > acc.audioBitrate && c.audioBitrate < 128) return c;

      // webm second best
      } else if (c.container === "webm" && acc.container !== "mp4") {
        if (c.audioBitrate > acc.audioBitrate) return c;
      }

      return acc;
    }, { container: "false", audioBitrate: 0 });

    res.send({
      "url": format.url,
      "duration": info.length_seconds
    });
  });
});

app.get("*", (req, res) => res.sendFile(path.resolve(__dirname, "public/index.html")));

app.listen(PORT, () => LOG.log(`Server running on port ${PORT}`));
