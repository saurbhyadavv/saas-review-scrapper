import express from "express";
import cors from "cors";
import { scrapeG2Reviews } from "./scrappers/g2.js";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors());

const FRONTEND_URL = "http://localhost:5173";

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", FRONTEND_URL);
  res.setHeader("Access-Control-Allow-Headers", "Content-type,Authorization");
  next();
});

app.get("/", (req, res) => {
  res.send("Hello World");
});

const websiteSearchPageMap = {
  g2: "https://www.g2.com",
  capterra: "https://www.capterra.com",
  trustpilot: "https://www.trustpilot.com",
};

app.post("/api/reviews", (req, res) => {
  const { product_name, start_date, end_date, website } = req.body;
  console.log(product_name, start_date, end_date, website);

  if (website === "g2") {
    // Scrape G2 reviews
    scrapeG2Reviews(product_name, start_date, end_date)
      .then((reviews) => {
        res.json(reviews);
      })
      .catch((error) => {
        console.error("Error scraping G2 reviews:", error.message);
        res
          .status(500)
          .json({ error: "An error occurred while scraping G2 reviews" });
      });
  } else {
    res.status(400).json({ error: "Unsupported website" });
  }
  // to return: JSON object with the review data
});

app.listen(5000, () => {
  console.log("Server is running on http://localhost:5000");
});
