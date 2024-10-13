const puppeteer = require("puppeteer");
const fs = require("fs");
const url = "https://books.toscrape.com/";

const main = async () => {
  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox"],
  });
  const page = await browser.newPage();
  await page.goto(url);

  const bookData = await page.evaluate((url) => {
    const convertPrice = (price) => {
      return parseFloat(price.replace("£", ""));
    };

    const convertRating = (rating) => {
      switch (rating) {
        case "one":
          return 1;
        case "Two":
          return 2;
        case "Three":
          return 3;
        case "Four":
          return 4;
        case "Five":
          return 5;
        default:
          return 0;
          break;
      }
    };
    const bookPods = Array.from(document.querySelectorAll(".product_pod"));
    const data = bookPods.map((book) => ({
      title: book.querySelector("h3 a").getAttribute("title"),
      price: convertPrice(book.querySelector(".price_color").innerText),
      imgSrc: url + book.querySelector("img").getAttribute("src"),
      rating: convertRating(book.querySelector(".star-rating").classList[1]),
    }));
    return data;
  }, url);

  await browser.close();

  const saveData = () => {
    fs.writeFile("data.json", JSON.stringify(bookData, null, 2), (err) => {
      if (err) throw err;
      console.log("Successfully saved JSON data");
    });
  };
  saveData();
};
main();
