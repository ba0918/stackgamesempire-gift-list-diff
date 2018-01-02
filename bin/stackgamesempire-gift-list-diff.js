#!/usr/bin/env node
const { start } = require("../lib/index");
const meow = require("meow");

const cli = meow(
  `
    Usage
      $ stackgamesempire-gift-list-diff <url> --steamkey <Your SteamKey> --steamid <Your SteamID> --output <path>

    Options
      --steamkey Your Steam API Key
      --steamid Your SteamID
      --output Output to write gift list json file

    Examples
      $ stackgamesempire-gift-list-fetch "http://exmaple/path/to" --steamkey xxxxxx --steamid xxxxxxxxxxx --output result.json
`,
  {
    flags: {
      steamkey: {
        type: "string"
      },
      steamid: {
        type: "string"
      }
    }
  }
);

start(cli.input[0], cli.flags.steamkey, cli.flags.steamid, cli.flags.output)
  .then(() => {
    console.log("Done");
  })
  .catch(error => {
    console.error(error);
  });
