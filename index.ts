import axios from 'axios';
import cheerio from 'cheerio';

export class CapitalCityScraper {
    async scrapeCity(url: string):Promise<void> {

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
        console.log(cityName);

        const country = $(".mergedtoprow th:contains(Country) + td").text().trim();
        console.log(country);


            // access element with class name "mergedtoprow", containing a 'th' with content of "Area"(string)
            // access that elements parents, and store all sibling elements up to but not including the next elment
            // with a class of "mergedtoprow"
        const areaRows = $('.mergedtoprow th:contains(Area)').parent().nextUntil('.mergedtoprow');
            // then, get the descendant of areaRows with a th containing the text "Capital city", 
            // and a child 'td' element 
        const area = areaRows.find(`th:contains(Capital city) + td`).text().trim();
        console.log(area)

        const popRows = $('.mergedtoprow th:contains(Population)').parent().nextUntil('.mergedtoprow');
        const pop = popRows.find('.mergedtoprow th:contains(Capital city) + td').text().trim();
        console.log("---",)
    }
}

async function main(city:string, obj?:object):Promise<void> {
    const scraper = new CapitalCityScraper();
    await scraper.scrapeCity(city)
}



const cities: string[] = ["https://en.wikipedia.org/wiki/Prague", "https://en.wikipedia.org/wiki/Brno", "https://en.wikipedia.org/wiki/Trieste", "https://en.wikipedia.org/wiki/Framingham,_Massachusetts"] 


async function scrapeCities():Promise<void> {
  
    for(const city in cities) {
        await main(cities[city])
    }
   
}

const scraped = scrapeCities()

console.log(scraped)