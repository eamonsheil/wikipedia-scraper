const express = require('express')
const http = require('http')

const app = express();
const server = http.createServer(app)
import { AllMusiciansScraper } from './music-scraper'
import { IMusician } from './Interfaces'


app.get('/', (req, res) => {
    res.send({ message: "welcome" })
})

app.get('/musicians', async (req, res) => {
    const scraper = new AllMusiciansScraper();
    const musicians = await scraper.scrapeMusicians('https://en.wikipedia.org/wiki/List_of_jazz_musicians')
    console.log(musicians.length)
    res.send({ musicians })

})


server.listen(4000, () => console.log("running on *:4000"))
