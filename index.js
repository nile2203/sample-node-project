const fs = require("fs");
const http = require("http");
const url = require("url");

// Synchronous file system
// const inputContent = fs.readFileSync('./text/input.txt', 'utf-8');
// console.log(inputContent);

// const outputContent = `Information regarding chole bhature: ${inputContent}.`;
// fs.writeFileSync('./text/output.txt', outputContent);

// Asynchronous file system
// fs.readFile('./text/input.txt', 'utf-8', (error, data) => {
//     console.log(data);
// });

// console.log('Started reading data..');
// fs.writeFile('./text/final.txt', 'I am writing asynchronously','utf-8', (error) => {
//     console.log('Finished writting data');
// });

// console.log('Started writing file..');

const replaceTemplateStrings = require('./modules/replace-template');

const data = fs.readFileSync(`${__dirname}/data/data.json`, "utf-8");
const overview = fs.readFileSync(`${__dirname}/template/overview.html`, "utf-8");
const cards = fs.readFileSync(`${__dirname}/template/cards.html`, "utf-8");
const product = fs.readFileSync(`${__dirname}/template/product.html`, "utf-8");
const productData = JSON.parse(data);

const server = http.createServer((request, response) => {
  const { query, pathname } = url.parse(request.url, true);

  if (pathname === "/" || pathname === "/overview") {
    response.writeHead(200, { "Content-type": "text/html" });
    const cardData = productData.map((element) =>
      replaceTemplateStrings(cards, element)
    );
    const output = overview.replace(/{%PRODUCT_CARDS%}/g, cardData);
    response.end(output);
  } else if (pathname === "/product") {
    const output = replaceTemplateStrings(product, productData[query.id]);
    response.writeHead(200, { "Content-type": "text/html" });
    response.end(output);
  } else {
    response.end("Hello world from the server");
  }
});

server.listen(8000, "127.0.0.1", () => {
  console.log("Started server");
});
