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
    try {
        const musicians = await scraper.scrapeMusicians('https://en.wikipedia.org/wiki/List_of_jazz_musicians')
        console.log("returned arr length: ", musicians.length)
        res.json(musicians)

    } catch (err) {
        console.log(err)
    }


})


server.listen(4000, () => console.log("running on *:4000"))
