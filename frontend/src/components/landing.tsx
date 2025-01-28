import { useState } from "react";
import { getProductReviews } from "../api/callApi";
import Swal from "sweetalert2";

const Landing = () => {
  const [productName, setProductName] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [website, setWebsite] = useState("g2");

  const [jsonContent, setJsonContent] = useState("");

  const handleSubmit = async () => {
    console.log(productName, startDate, endDate, website);
    // validation: check if all fields are filled and dates are correct (start date < end date)
    if (!productName || !startDate || !endDate || !website) {
      //   make border red for the fields that are empty
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "All fields are required!",
      });
      return;
    }

    if (startDate > endDate) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Start Date should be less than End Date!",
      });
      return;
    }

    // call the API to get the reviews
    const response = await getProductReviews(
      productName,
      startDate,
      endDate,
      website
    );

    setJsonContent(JSON.stringify(response, null, 2));
  };

  const [currentTab, setCurrentTab] = useState("json");

  return (
    <div className="w-screen h-screen bg-blue-300 flex flex-row py-12 font-[monospace]">
      <div className="h-full w-1/2 flex flex-col justify-center items-center">
        {/* page to enter the product name, start date and end date and website */}
        <div className="flex flex-col bg-white/90 border-2 border-blue-400 rounded-lg py-4 px-8 gap-y-8">
          {/* brand name: SAAS-Scrapper in monospace */}
          <div className="text-2xl font-mono font-semibold text-blue-500 text-center border-b-2 border-blue-200 pb-2 uppercase">
            SAAS Review Scrapper
          </div>

          {/* select box, with company names: G2, Capterra*/}
          <select
            className="border-2 border-blue-400 rounded-lg p-2"
            name="website"
            id="website"
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
          >
            <option value="g2">G2</option>
            <option value="capterra">CAPTERRA</option>
          </select>

          <input
            type="text"
            placeholder="Product Name"
            className="border-2 border-blue-400 rounded-lg p-2"
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
          />

          <div className="flex flex-row justify-between gap-x-4">
            <input
              type="date"
              placeholder="Start Date"
              className="border-2 border-blue-400 rounded-lg p-2"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
            <input
              type="date"
              placeholder="End Date"
              className="border-2 border-blue-400 rounded-lg p-2"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>
          <button
            className="bg-blue-400 text-white rounded-lg p-2 cursor-pointer hover:bg-blue-500 duration-200"
            onClick={handleSubmit}
          >
            Submit
          </button>

          {/* now i wall code the list of examples, that user can try */}
          <div className="text-sm text-blue-500 font-semibold">Examples:</div>
        </div>
      </div>
      <div className="h-full w-1/2 flex flex-col justify-start items-center h-full">
        {/* result side of it */}
        <div className="min-w-2/3 max-w-3/4 max-h-full bg-white/90 flex flex-col justify-center items-start rounded-lg p-4">
          {/* two tabs, JSON & Page */}
          <div className="w-full flex flex-row mb-4 gap-x-2 border-b-2 border-blue-200 pb-2">
            <div
              className={`border-2 border-blue-500 ${
                currentTab == "json"
                  ? "text-white bg-blue-500"
                  : "text-blue-500"
              } hover:bg-blue-500 hover:text-white font-semibold px-2 py-1 rounded-l cursor-pointer duration-200 uppercase`}
              onClick={() => setCurrentTab("json")}
            >
              JSON
            </div>
            <div
              className={`border-2 border-blue-500 ${
                currentTab == "page"
                  ? "text-white bg-blue-500"
                  : "text-blue-500"
              } hover:bg-blue-500 hover:text-white font-semibold px-2 py-1 rounded-r cursor-pointer duration-200 uppercase`}
              onClick={() => setCurrentTab("page")}
            >
              Page
            </div>
          </div>

          {
            // JSON tab
            currentTab === "json" && (
              <div className="flex flex-col gap-y-4 w-full overflow-y-auto max-h-11/12">
                <div className="text-xs text-blue-500 font-semibold">
                  {jsonContent}
                </div>
              </div>
            )
          }

          {
            // Page tab
            currentTab === "page" && (
              <div className="flex flex-col gap-y-4">
                <div className="text-xs text-blue-500 font-semibold">
                  Page Output will be shown here
                </div>
              </div>
            )
          }
        </div>
      </div>
    </div>
  );
};

export default Landing;
