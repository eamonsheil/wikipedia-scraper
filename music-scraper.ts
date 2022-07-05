import axios from 'axios';
import cheerio from 'cheerio';
import fs from 'fs';
import path from 'path';

interface Musician {
    name: string;
    url?: string;
    birthdate?: string;

}
const musiciansarr: Musician[] = [];

export class AllMusiciansScraper {
    async scrapeMusicians(url: string): Promise<void> {

        const response = await axios.get(url);
        const html = response.data;

        const $ = cheerio.load(html);


        const musicians = await this.getmusicians(html);
        console.log("line 24:", musicians.length)


        const listlinks = $('div.hatnote > a').each(
            async (i, ref) => {
                const link = $(ref).attr('href')!;
                const listUrl = new URL(link, url).toString();
                const response = await axios.get(listUrl)
                // console.log(response.data)
                console.log(listUrl)
                try {
                    const othermusicians = await this.getmusicians(response.data)
                    console.log(othermusicians.length)
                    // console.log("totals:", musiciansarr.length)
                }
                catch (err) {
                    console.log(err)
                }

            }
        )
        // console.log(musiciansarr.length)
        // console.log($(listlinks).text())



    }

    protected async getmusicians(obj) {
        // const musiciansarr: Musician[] = [];
        const $ = cheerio.load(obj)

        const listastables = $('h2 + link + div.div-col ul > li a');
        const otherformat = $('div.div-col > ul > li a')
        // console.log($(listastables).text())
        const list = $('h2 + ul > li a'); //selects 100% banjoes, 

        const otherlistformat = $('h3 + ul > li a');
        if (!!list) {
            getnames(list)
        }

        if (!!listastables) {
            getnames(listastables)
        }

        if (!!otherformat) {
            getnames(otherformat)
        }

        if (!!otherlistformat) {
            getnames(otherlistformat)
        }


        async function getnames(list) {
            list.each((i, ref) => {
                const text = $(ref).text().replace(/\[\d\]/, '')
                if (!!text) {
                    musiciansarr.push({ name: text });
                }
            })
        }
        console.log("totals:", musiciansarr.length)
        return musiciansarr;
    }
}

async function main(): Promise<void> {
    const scraper = new AllMusiciansScraper();
    await scraper.scrapeMusicians('https://en.wikipedia.org/wiki/List_of_jazz_musicians')

}


main()
