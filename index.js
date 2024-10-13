const puppeteer = require("puppeteer");
const url = "https://books.toscrape.com/";

const main = async () => {
  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox"],
  });
  const page = await browser.newPage();
  await page.goto(url);

  const bookData = await page.evaluate((url) => {
    const bookPods = Array.from(document.querySelectorAll(".product_pod"));
    const data = bookPods.map((book) => ({
      title: book.querySelector("h3 a").getAttribute("title"),
      price: book.querySelector(".price_color").innerText,
      imgSrc: url + book.querySelector("img").getAttribute("src"),
      rating: book.querySelector(".star-rating").classList[1],
    }));
    return data;
  }, url);
  console.log(bookData);
  await browser.close();
};
main();
