import http from "http";
import fs from "fs/promises";
import { v4 as uuid } from "uuid";
import homePage from "./views/home/index.html.js";
import siteCss from "./content/styles/site.css.js";
import addBreedPage from "./views/addBreed.html.js";
import addCatPage from "./views/addCat.html.js";
import editCatPage from "./views/editCat.html.js";
import catShelterPage from "./views/catShelter.html.js";

let cats = [];
let breeds = [];

initCats();

initBreeds();

const server = http.createServer((req, res) => {

    if (req.method === 'POST') {
        let body = '';

        req.on('data', chunk => {
            body += chunk.toString();
        })

        req.on('end', () => {
            const data = new URLSearchParams(body)
            const method = data.get('_method')

            if (req.url === '/cats/add-cat') {
                cats.push({
                    id: uuid(),
                    ...Object.fromEntries(data.entries()),
                })

                saveCats();
            }
            else if (req.url === '/cats/add-breed') {
                const dataBreed = Object.fromEntries(data.entries());
                const breed = dataBreed['breed']

                breeds.push(breed)

                saveBreeds();
            }
            else if (method === 'PUT' && req.url.includes('/cats/edit-cat/')) {
                const catId = req.url.split('/').pop();

                const findCat = cats.find(cat => cat.id === catId)

                if (findCat) {
                    console.log(Object.fromEntries(data.entries()));
                    
                    
                    findCat.name = data.get('name') || findCat.name
                    findCat.description = data.get('description') || findCat.description
                    findCat.imageUrl = data.get('imageUrl') || findCat.imageUrl
                    findCat.breed = data.get('breed') || findCat.breed
                    
                    saveCats();
                }
            }
            // else if (req.url.includes('/cats/edit-cat/')) {
            //     '???'
            // }

            res.writeHead(302, {
                'location': '/',
            })

            res.end();
        })

        return;
    }

    if (req.method === 'PUT') {
        console.log('Misho');
        
    }

    if (req.method === 'DELETE' && req.url.includes('/cats/delete-cat/')) {
        const catId = req.url.split('/').pop()

        const catIndex = cats.findIndex(cat => cat.id === catId)

        if (catIndex !== -1) {
            cats.splice(catIndex, 1)
            saveCats();

            res.writeHead(302, {
                'location': '/',
            })
        }
        return res.end()
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

    let urlPath = req.url.split('/')

    if (req.url === '/') {
        res.write(homePage(cats))
    }
    else if (req.url === '/cats/add-breed') {
        res.write(addBreedPage())
    }
    else if (req.url === '/cats/add-cat') {
        res.write(addCatPage(breeds))
    }
    else if (req.url.includes('/cats/edit-cat/')) {
        const catId = urlPath[urlPath.length - 1];

        let findCat = cats.find(cat => cat.id === catId)

        if (findCat) {
            res.write(editCatPage(findCat, breeds))
        } else {
            res.write('Cat Not Found!')
        }
    }
    else if (req.url.includes('/cats/shelter-cat/')) {
        const catId = urlPath[urlPath.length - 1]

        let findCat = cats.find(cat => cat.id === catId)

        if (findCat) {
            res.write(catShelterPage(findCat, breeds))
        }
        else {
            res.write('Cat Not Found!')
        }
    }
    else if (req.url.includes('/cats/delete-cat/')) {
        const catId = req.url.split('/').pop()

        const catIndex = cats.findIndex(cat => cat.id === catId)

        if (catIndex !== -1) {
            cats.splice(catIndex, 1)
            saveCats();

            res.writeHead(302, {
                'location': '/',
            })
        }
    }
    else {
        res.write('Page Not Found!')
    }

    res.end();
})

async function initCats() {
    const catsJson = await fs.readFile('./cats.json', { encoding: 'utf-8' })
    cats = JSON.parse(catsJson)
}

async function initBreeds() {
    const breedsJson = await fs.readFile('./breed.json', { encoding: 'utf-8' })
    breeds = JSON.parse(breedsJson)
}

async function saveCats() {
    const catsJson = JSON.stringify(cats, null, 2)
    await fs.writeFile('./cats.json', catsJson, { encoding: 'utf-8' })
}

async function saveBreeds() {
    const breedsJson = JSON.stringify(breeds, null, 2)
    await fs.writeFile('./breed.json', breedsJson, { encoding: "utf-8" })
}

server.listen(5000)
console.log('Server is listening on http://localhost:5000...');
