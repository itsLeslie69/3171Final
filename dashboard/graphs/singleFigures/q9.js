import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

export default async function returnNoDelayCust () {
    const data = await d3.csv('../data/customer_satisfaction.csv');
    // Number of customers without any delay is acquired by pushing all records without any delay fields
    // Array length tells you the number of customers with no delay
    const num = data.filter((record) => record["Departure Delay in Minutes"] == 0 && record["Arrival Delay in Minutes"] == 0).length
    // Return Promise, resolve to variable which stores the array length
    return new Promise ((resolve) => {resolve(num)})
  
  return num;
}
