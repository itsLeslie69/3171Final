import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm"

export default async function returnLoyalCustomers () {
    // Getting data
    const data = await d3.csv('/data/customer_satisfaction.csv');
    // Number of loyal customers is equal to the length of an array that stores all records of customers who have a
    // Customer type of Loyal Customer 
    var loyalCustNum = data.filter((record) => record["Customer Type"] == "Loyal Customer").length
    // Return a Promise to asynchronously handle data without breaking the DOM
    return new Promise ((resolve) => {resolve(loyalCustNum)})

}

