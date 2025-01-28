import puppeteer from "puppeteer-extra";
import StealthPlugin from "puppeteer-extra-plugin-stealth";

puppeteer.use(StealthPlugin());

/**
 * Scrape G2 reviews for a given product within a date range.
 * @param {string} productName - The name of the product to search for.
 * @param {string} startDate - The start date (YYYY-MM-DD).
 * @param {string} endDate - The end date (YYYY-MM-DD).
 * @returns {Promise<Array>} An array of reviews with date, content, and rating.
 */
export async function scrapeG2Reviews(productName, startDate, endDate) {
  // Convert dates to a comparable format (YYYY-MM-DD)
  const parseDate = (date) => new Date(date).toISOString().split("T")[0];

  const start = parseDate(startDate);
  const end = parseDate(endDate);

  const reviews = [];
  const browser = await puppeteer.launch({
    headless: false,
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-blink-features=AutomationControlled",
    ],
  });
  const page = await browser.newPage();

  await page.setUserAgent(
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36"
  );
  await page.setExtraHTTPHeaders({
    "Accept-Language": "en-US,en;q=0.9",
  });
  //   set referrer
  await page.setExtraHTTPHeaders({
    referer: "https://www.g2.com",
  });

  try {
    // Navigate to G2's website
    const g2SearchUrl = `https://www.g2.com/search?utf8=✓&query=${encodeURIComponent(
      productName
    )}`;
    // const g2SearchUrl = `https://www.g2.com/products/${encodeURIComponent(
    //   productName
    // )}/reviews`;
    await page.goto(g2SearchUrl, { waitUntil: "networkidle2" });

    await page.screenshot({ path: "debug.png" });
    const html = await page.content();
    console.log(html.length);

    // next action to click on the first product link
    const productSelector = "div.product-listing__body > ul > li > a"; // Adjust based on G2's actual product item class
    await page.waitForSelector(productSelector);
    const productLink = await page.$eval(productSelector, (el) => el.href);

    console.log("Product link:", productLink);

    await page.goto(productLink, { waitUntil: "networkidle2" });

    const reviewSelector = "div.nested-ajax-loading > div"; // Adjust based on G2's actual review item class
    await page.waitForSelector(reviewSelector, { timeout: 60000 });

    let hasNextPage = true;
    while (hasNextPage) {
      // Extract review data
      const pageReviews = await page.evaluate(
        (start, end) => {
          const reviews = [];
          document
            .querySelectorAll("div.nested-ajax-loading > div")
            .forEach((review) => {
              const dateElement = review.querySelector("time");
              const contentElement = review.querySelector(".m-0.l2");
              const ratingElement = review.querySelector(
                '[itemprop="reviewBody"]'
              );

              if (dateElement && contentElement && ratingElement) {
                const date = new Date(dateElement.innerText.trim());
                // if (date >= new Date(start) && date <= new Date(end)) {
                reviews.push({
                  date: date.toISOString().split("T")[0],
                  heading: contentElement.innerText.trim(),
                  body: ratingElement.innerText.trim(),
                });
                // }
              }
            });
          return reviews;
        },
        start,
        end
      );

      reviews.push(...pageReviews);

      // Check if there's a "Next" button and click it
      //   const nextPageButton = await page.$(".pagination__button--next");
      //   if (nextPageButton) {
      //     await nextPageButton.click();
      //     await page.waitForTimeout(2000); // Wait for the page to load
      //   } else {
      //     hasNextPage = false;
      //   }
      hasNextPage = false;
    }
  } catch (error) {
    console.error("Error scraping G2 reviews:", error.message);
  } finally {
    await browser.close();
  }

  return reviews;
}
