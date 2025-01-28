# SAAS Review Scrapper

## Running the Project Locally

### Frontend

1. Navigate to the `frontend` directory:
    ```sh
    cd frontend
    ```
2. Install the dependencies:
    ```sh
    npm install
    ```
3. Start the development server:
    ```sh
    npm run dev
    ```

### Backend

1. Navigate to the `backend` directory:
    ```sh
    cd backend
    ```
2. Install the dependencies:
    ```sh
    npm install
    ```
3. Start the backend server:
    ```sh
    node server.js
    ```

### API Description 

    /**
     * POST /api/reviews
     * 
     * This API endpoint handles the submission of review scraping requests.
     * It accepts a JSON payload with the following properties:
     * 
     * - product_name: The name of the product to scrape reviews for.
     * - start_date: The start date for the review scraping period.
     * - end_date: The end date for the review scraping period.
     * - website: The website to scrape reviews from (currently only supports "g2").
     * 
     * If the website is "g2", it will scrape reviews from G2 for the specified product
     * and date range, and return the reviews as a JSON response.
     * 
     * If the website is not supported, it will return a 400 status code with an error message.
     * 
     * @param {Object} req - The request object.
     * @param {Object} res - The response object.
     * 
     * @returns {JSON} - A JSON object containing the scraped review data or an error message.
     */