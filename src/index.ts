import { fetch } from "@ba0918/stackgamesempire-gift-list-fetch"
import * as fs from "fs"
import * as http from "http"
import * as querystring from "querystring"

const API_ENDPOINT = "http://api.steampowered.com"

export function start(
  url: string,
  steamkey: string,
  steamid: string,
  output: string
): Promise<void> {
  return diff(url, steamkey, steamid).then(res => {
    if (output) {
      fs.writeFileSync(output, JSON.stringify(res), "utf8")
    }
  })
}

export default async function diff(
  url: string,
  steamkey: string,
  steamid: string
): Promise<any> {
  const result = await Promise.all([
    fetch(url),
    getOwnedGames({ key: steamkey, steamid, include_appinfo: 1 })
  ])
  const gifts = result[0]
  const games: any[] = result[1].response.games

  const ownedGifts = gifts.filter(
    gift =>
      gift.category === "app" && games.find(game => game.appid === gift.appid)
  )
  const unownedGifts = gifts.filter(
    gift =>
      gift.category === "app" && !games.find(game => game.appid === gift.appid)
  )

  return {
    owned_gifts: ownedGifts,
    unowned_gifts: unownedGifts
  }
}

async function getOwnedGames(params: any): Promise<any> {
  const requestURL =
    `${API_ENDPOINT}/IPlayerService/GetOwnedGames/v0001?` +
    querystring.stringify(params)
  return await request(requestURL)
}

async function request(url: string): Promise<any> {
  return new Promise((resolve, reject) => {
    const req = http.get(url, response => {
      const statusCode = response.statusCode ? response.statusCode : 0
      if (statusCode < 200 || statusCode > 299) {
        reject(
          new Error("Failed to fetch response data. status_code: " + statusCode)
        )
      }
      const data: string[] = []
      response.on("data", (chunk: string) => data.push(chunk))
      response.on("end", () => {
        try {
          resolve(JSON.parse(data.join("")))
        } catch (err) {
          reject(err)
        }
      })
    })
    req.on("error", err => reject(err))
  })
}
