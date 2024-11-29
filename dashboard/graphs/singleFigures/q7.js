import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

//fetching customer_satisfaction.csv
//making sure our directory path is correct
const csvPath = "../data/customer_satisfaction.csv";
fetch(csvPath)
  .then((response) => {
    if (!response.ok)
      throw new Error(`Failed to fetch FOR q7.js: ${response.statusText}`);
    return response.text();
  })
  .then((data) => console.log("q7.js csv data successfully recieved: " + data))
  .catch((error) => console.error(error));

export default async function returnLoyalCustomers() {
  const data = await d3.csv("../data/customer_satisfaction.csv");

  var loyalCustNum = data.filter(
    (record) => record["Customer Type"] == "Loyal Customer"
  ).length;

  return loyalCustNum;
}
