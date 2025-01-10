import http from "http";
import fs from "fs/promises";
import { v4 as uuid } from "uuid";
import homePage from "./views/home/index.html.js";
import siteCss from "./content/styles/site.css.js";
import addBreedPage from "./views/addBreed.html.js";
import addCatPage from "./views/addCat.html.js";

let cats = [];

initCats();

const server = http.createServer((req, res) => {

    if (req.method === 'POST') {
        let body = '';
        
        req.on('data', chunk => {
            body += chunk.toString();
        })

        req.on('end', () => {
            const data = new URLSearchParams(body)
            
            cats.push({
                id: uuid(),
                ...Object.fromEntries(data.entries()),
            })

            saveCats();

            console.log(cats);
            

            res.writeHead(302, {
                'location': '/',
            })

            res.end();
        })

        return;
    }

    if (req.url === '/styles/site.css') {

        res.writeHead(200, {
            "content-type": 'text/css'
        })

        res.write(siteCss)

        return res.end()
    }

    res.writeHead(200, {
        "content-type": 'text/html'
    })

    switch (req.url) {
        case '/':
            res.write(homePage(cats))
            break;
        case '/cats/add-breed': 
            res.write(addBreedPage())   
            break;
        case '/cats/add-cat': 
            res.write(addCatPage())   
            break;
        default:
            res.write('Page Not Found!')
            break;
    }
    
    res.end();
})

async function initCats() {
    const catsJson = await fs.readFile('./cats.json', { encoding: 'utf-8' })
    cats = JSON.parse(catsJson)
}

async function saveCats() {
    const catsJson = JSON.stringify(cats, null, 2)
    await fs.writeFile('./cats.json', catsJson, { encoding: 'utf-8' })
}

server.listen(5000)
console.log('Server is listening on http://localhost:5000...');
