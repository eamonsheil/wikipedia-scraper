import axios from 'axios';
import cheerio from 'cheerio';
import fs from 'fs';
import path from 'path';

interface Musician {
    name: string;

}
const musiciansarr: Musician[] = [];

export class AllMusiciansScraper {
    async scrapeMusicians(url: string): Promise<void> {

        const response = await axios.get(url);
        const html = response.data;

        const $ = cheerio.load(html);


        const musicians = await this.getmusicians(html);


        const listlinks = $('div.hatnote > a').each(
            async (i, ref) => {
                const link = $(ref).attr('href')!;
                const listUrl = new URL(link, url).toString();
                const response = await axios.get(listUrl)
                // console.log(response.data)
                console.log(listUrl)
                try {
                    const othermusicians = await this.getmusicians(response.data)
                    console.log(othermusicians)
                }
                catch (err) {
                    console.log(err)
                }

            }
        )

        // console.log($(listlinks).text())
        console.log(musicians.length)


    }

    protected async getmusicians(obj) {
        const musiciansarr: Musician[] = [];
        const $ = cheerio.load(obj)
        const list = $('h2 + ul > li a');
        list.each((i, ref) => {
            const text = $(ref).text().replace(/\[\d\]/, '')
            if (!!text) {

                musiciansarr.push({ name: text })
            }
        })
        return musiciansarr;
    }
}

async function main(): Promise<void> {
    const scraper = new AllMusiciansScraper();
    await scraper.scrapeMusicians('https://en.wikipedia.org/wiki/List_of_jazz_musicians')
}

main()