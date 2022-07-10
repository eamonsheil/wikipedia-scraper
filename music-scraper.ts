import axios from 'axios';
import cheerio from 'cheerio';
import fs from 'fs';
import path from 'path';
import { IMusician } from './Interfaces';
// const writeStream = fs.createWriteStream('musicians.json')



export class AllMusiciansScraper {
    async scrapeMusicians(url: string): Promise<IMusician[]> {
        const musiciansarr: IMusician[] = [];

        const response = await axios.get(url);
        const html = response.data;

        const $ = cheerio.load(html);


        const listlinks = $('div.hatnote > a').each(
            async (i: number, ref) => {

                const link = $(ref).attr('href')!;
                const listUrl = new URL(link, url).toString();
                return listUrl;
            }
        )
        // console.log(musiciansarr.length)
        let arrlinks: string[] = [url];
        for (const link of listlinks) {
            const l = $(link).attr('href')!;
            const listUrl = new URL(l, url).toString();
            arrlinks.push(listUrl)
        }
        // console.log("listlinks text: ", $(listlinks).text())
        console.log("links array: ", arrlinks)



        for (const link of arrlinks) {
            console.log("link: ", link)
            try {
                const res = await axios.get(link);
                // console.log(res.data)
                const appendedMusicians = await this.getmusicians(res.data, musiciansarr);

                musiciansarr.concat(appendedMusicians);

                console.log("updated musicianarr after getmusicians() 38: ", musiciansarr.length);
            } catch (err) {
                console.log(err)
            }
        }



        // console.log("end of scrapemusicians(): ", musiciansarr.length)
        console.log("finalarr 54: ", musiciansarr.length)
        return musiciansarr;
    }

    protected getmusicians(obj, arr) {
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


        function getnames(list) {
            list.each((i: number, ref) => {
                const text = $(ref).text().replace(/\[\d\]/, '')
                if (!!text) {
                    arr.push({ name: text });
                }
            })
        }
        console.log("at end of getmusician():", arr.length)
        return arr;
    }
}

// export const main = async function (): Promise<void> {
//     const scraper = new AllMusiciansScraper();
//     const arrof = await scraper.scrapeMusicians('https://en.wikipedia.org/wiki/List_of_jazz_musicians')
//     console.log("returned arr: ", arrof)
// }


// main()
