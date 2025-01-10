import http from "http";
import homePage from "./views/home/index.html.js";
import siteCss from "./content/styles/site.css.js";
import addBreedPage from "./views/addBreed.html.js";
import addCatPage from "./views/addCat.html.js";

const cats = [
    {
        id: 1,
        imageUrl: 'https://tse1.mm.bing.net/th/id/OIP.M-5ruDumHIwe6KvvYl1vBwHaEo?w=241&h=180&c=7&r=0&o=5&dpr=1.3&pid=1.7',
        name: 'Pretty Kitty',
        breed: 'Bombay Cat',
        description: 'Dominant and aggressive to other cats. Will probably eat you in your sleep. Very cute tho. ',
    },
    {
        id: 2,
        imageUrl: 'https://tse4.mm.bing.net/th/id/OIP.xNmHVmGh6h-YMTSalWZIAAHaEK?w=265&h=180&c=7&r=0&o=5&dpr=1.3&pid=1.7',
        name: 'Navcho',
        breed: 'Persian Cat',
        description: 'A talkative and affectionate cat with striking yellow eyes.',

    },
    {
        id: 3,
        imageUrl: 'https://tse4.mm.bing.net/th/id/OIP.kAIUTJrUWLaH5a60vbTgvwHaHa?w=156&h=180&c=7&r=0&o=5&dpr=1.3&pid=1.7',
        name: 'Sisa',
        breed: 'Siamese Cat',
        description: 'Loves to cuddle and nap. Requires regular grooming for its luxurious coat.',

    },
    {
        id: 4,
        imageUrl: 'https://th.bing.com/th/id/R.7ceb81f6b2c615743919109333a742d5?rik=4SXH%2bKdUQ%2fhIbQ&riu=http%3a%2f%2fimages2.fanpop.com%2fimage%2fphotos%2f9400000%2fFunny-Cats-cats-9473111-1600-1200.jpg&ehk=zpmRdnX5thsU88ZKDfowPaEEzpGU3oUdfHeu3d05ZNA%3d&risl=&pid=ImgRaw&r=0',
        name: 'Gary',
        breed: 'Bombay Cat',
        description: 'Mysterious and elegant. Often found lounging in sunny spots.', 

    }
]

const server = http.createServer((req, res) => {

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

server.listen(5000)
console.log('Server is listening on http://localhost:5000...');
