import axios from 'axios';
import cheerio from 'cheerio';
import fs from 'fs';
import path from 'path';

interface City {
    name:string;
    country:string;
    area:number;
    population:number;
    flagImagePath:string;
}



export class CapitalCityScraper {
    async scrapeCity(url: string):Promise<City> {

            // axios makes a get request with the given url, and returns a promise which will 
            // hold the response with an HTML source code
        const response = await axios.get(url)
        const html = response.data;

            // cheerio parses the HTML and returns a querying function bound to a document
            // based on that HTML markup. The querying function accepts CSS selectors 
            // to find corresponding elements
        const $ = cheerio.load(html);

            // use the querying function to find an element with an id of "firstHeading" 
            // convert the content of the following 'td' to text, then remove trailing whitespace
        const cityName = $('#firstHeading').text().trim();

        const country = $(".mergedtoprow th:contains(Country) + td").text().trim();


            // access element with class name "mergedtoprow", containing a 'th' with content of "Area"(string)
            // access that elements parents, and store all sibling elements up to but not including the next elment
            // with a class of "mergedtoprow"
        const areaRows = $('.mergedtoprow th:contains(Area)').parent().nextUntil('.mergedtoprow');
            // then, get the descendant of areaRows with a th containing the text "Capital city", 
            // and a child 'td' element 
            // also remove unwanted text with .replace() method
        const area:string = areaRows.find(`th:contains(Capital city) + td`).text().trim().replace(/km2.*$/, '');
            // remove commas from area, convert to number
        const areanum:number = parseFloat(area.replace(/,/g,''));

        const popRows = $('.mergedtoprow th:contains(Population)').parent().nextUntil('.mergedtoprow');
        const pop:string = popRows.find('th:contains(Capital city) + td').text().trim();
            // replaces any text after the number with an empty string
        const population:number = parseFloat(pop.replace(/,/g,''));
       

            // selecting the div containg 'Flag' that is immediately next to the <a> element with a class of 'image'
            // .prev() then gets the previous sibling of that
            // .attr() is used to get the value of that element's href attribute
            //  NOTE: .attr() canbe used to dynamically set or change an href attribute, or get the value of any attribute
            // NOTE: the non-null assertion operator('!') is used here to assrt that the value of 'flagPageLink' is
            //    non-null and non-undefined -since the type checker is unable to conclude that fact before the app is run
        const flagPageLink = $('.mergedtoprow a.image + div:contains(Flag)').prev().attr('href')!;
        const flagPageUrl:string = new URL(flagPageLink, url).toString();
            // here we use 'this' to access the function "scrapeImage()" because it is out of scope from within the 
            // scrapeCity() function. 'this' refers to the class instance
        const flagImagePath = await this.scrapeImage(flagPageUrl);
        

        const city:City = {
            name:cityName,
            country:country,
            area:areanum,
            population:population,
            flagImagePath:flagImagePath
        }
        return city;
    }

        // this function can be used to scrape the image from any wikipedia image detail page
    protected async scrapeImage(url:string){

            // these lines take the passed in url of the image, and pass it into the cheerio querying function
        const response = await axios.get(url);
        const html = response.data;
        const $ = cheerio.load(html);

        const imageLink = $('#file a').attr('href')!;
        const imageUrl = new URL(imageLink, url).toString();


        const imagePath = await this.downloadFile(imageUrl, 'flags');
        return imagePath;
    }


    protected async downloadFile(url:string, dir:string) {
            // fetch the given file url and store the response in an arrayBuffer object containing the file's binary data
            // setting the responseType to 'arraybuffer' tells axios not to parse the response as text
        const response = await axios.get(url, { 
            responseType: 'arraybuffer'
        });

            // creates a directory with given input (here will be called 'flags')
            // setting recursive:true means that this will return the first directory path created
        fs.mkdirSync(dir, {recursive:true});

            // joins 'dir' with the last portion of the path of the given url to create a local filepath for the image
        const filePath = path.join(dir, path.basename(url));
            // writes the response.data(typed array from the arrayBuffer object) to the new file
        fs.writeFileSync(filePath, response.data)
        return filePath;
    }

}

async function main(city:string, obj?:object):Promise<void> {
    const scraper = new CapitalCityScraper();
    const city1:City = await scraper.scrapeCity(city)
    console.log(city1);
}



const cities: string[] = ["https://en.wikipedia.org/wiki/Prague", "https://en.wikipedia.org/wiki/Brno", "https://en.wikipedia.org/wiki/Trieste", "https://en.wikipedia.org/wiki/Framingham,_Massachusetts"] 


async function scrapeCities():Promise<void> {
  
    for(const city in cities) {
        await main(cities[city])
    }
   
}

const scraped = scrapeCities()

console.log(scraped)