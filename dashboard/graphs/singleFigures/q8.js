import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

//fetching customer_satisfaction.csv
//making sure our directory path is correct
const csvPath = "../data/customer_satisfaction.csv";
fetch(csvPath)
  .then((response) => {
    if (!response.ok)
      throw new Error(`Failed to fetch FOR q8.js: ${response.statusText}`);
    return response.text();
  })
  .then((data) => console.log("q8.js csv data successfully recieved: " + data))
  .catch((error) => console.error(error));

export default async function returnTotalFlightDist() {
  const data = await d3.csv("../data/customer_satisfaction.csv");

  var flightDistArr = [];

  var distance = 0;

  var distFilter = data.filter((record) => {
    flightDistArr.push(parseInt(record["Flight Distance"]));
  });

  for (let i = 0; i < flightDistArr.length; i++) {
    distance += flightDistArr[i];
  }

  return distance;
}
