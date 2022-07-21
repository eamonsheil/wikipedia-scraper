import axios from 'axios';
import cheerio from 'cheerio';
import fs from 'fs';
import path from 'path';
import { IMusician } from './Interfaces';

export class SingleMusicianScraper {
    async scrapeMusician(url: string): Promise<void> {

        const response = axios.get(url);
        const html = (await response).data;

        const $ = cheerio.load(html);

        const name = $('.firstHeading').text().trim()
        console.log(name)

        const instrument = $('.infobox-label:contains(Instruments) + td').text().trim();
        console.log(instrument)

        const albums = $('h3 + ul > li > i').text()
        // albums.each((i: number, ref) => {
        //     const title = $(ref).text()
        //     console.log(title)
        //     // if (ref.type === "tag") {
        //     //     const link = $(ref).attr('href')!;
        //     //     const listUrl = new URL(link, url).toString()
        //     //     return listUrl
        //     // }
        // })
        console.log(albums)

    }
}

async function main(): Promise<void> {
    const scraper = new SingleMusicianScraper();
    await scraper.scrapeMusician("https://en.wikipedia.org/wiki/Eddie_Harris");
}

main();