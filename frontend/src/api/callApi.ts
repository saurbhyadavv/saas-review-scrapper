import axios from "axios";

const ENDPOINT = "http://localhost:5000/api/reviews";

const getProductReviews = async (
  productName: string,
  startDate: string,
  endDate: string,
  website: string
) => {
  try {
    const response = await axios.post(ENDPOINT, {
      product_name: productName,
      start_date: startDate,
      end_date: endDate,
      website: website,
    });
    return response.data;
  } catch (error) {
    console.error(error);
  }
};

export { getProductReviews };
