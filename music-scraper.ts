import axios from 'axios';
import cheerio from 'cheerio';
import fs from 'fs';
import path from 'path';
import { IMusician } from './Interfaces';



export class AllMusiciansScraper {
    async scrapeMusicians(url: string): Promise<IMusician[]> {
        const musiciansarr: IMusician[] = [];

        const response = await axios.get(url);
        const html = response.data;

        const $ = cheerio.load(html);

        const finalarr = await this.getmusicians(html, musiciansarr)
        musiciansarr.concat(finalarr)

        // console.log("line 24:", musicians.length)

        const listlinks = $('div.hatnote > a')
        const arr1 = await listlinks.each(
            async (i: number, ref) => {
                const link = $(ref).attr('href')!;
                const listUrl = new URL(link, url).toString();
                // return listUrl;
                const res = await axios.get(listUrl)
                // console.log(response.data)
                // console.log(listUrl)
                // console.log(urls)
                // return listUrl.toString()
                try {
                    const appendedMusicians = await this.getmusicians(res.data, musiciansarr)
                    musiciansarr.concat(appendedMusicians)
                    // console.log(appendedMusicians)
                    // console.log("totals:", musiciansarr.length)
                    console.log("musiciansarr 38: ", musiciansarr.length)
                }
                catch (err) {
                    console.log(err)
                }

            }
        )
        // console.log(musiciansarr.length)
        // console.log($(listlinks).text())

        // return listlinks;

        console.log("musiciansarr 53: ", musiciansarr.length)
        console.log("finalarr 54: ", finalarr.length)
        return musiciansarr;
    }

    protected async getmusicians(obj, arr) {
        // const musiciansarr: Musician[] = [];
        const $ = cheerio.load(obj)

        const listastables = $('h2 + link + div.div-col ul > li a');
        const otherformat = $('div.div-col > ul > li a')
        // console.log($(listastables).text())
        const list = $('h2 + ul > li a'); //selects 100% banjoes, 

        const otherlistformat = $('h3 + ul > li a');
        if (!!list) {
            await getnames(list)
        }

        if (!!listastables) {
            await getnames(listastables)
        }

        if (!!otherformat) {
            await getnames(otherformat)
        }

        if (!!otherlistformat) {
            await getnames(otherlistformat)
        }


        async function getnames(list) {
            list.each((i: number, ref) => {
                const text = $(ref).text().replace(/\[\d\]/, '')
                if (!!text) {
                    arr.push({ name: text });
                }
            })
        }
        console.log("totals:", arr.length)
        return arr;
    }
}

export const main = async function (): Promise<void> {
    const scraper = new AllMusiciansScraper();
    const arrof = await scraper.scrapeMusicians('https://en.wikipedia.org/wiki/List_of_jazz_musicians')
    console.log("101: ", arrof)
}


main()
