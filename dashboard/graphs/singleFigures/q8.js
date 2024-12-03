import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm"

export default async function returnTotalFlightDist () {
    // Returning data from CSV
    const data = await d3.csv('/data/customer_satisfaction.csv');
    // Initializing array to store records with flight distances
    var flightDistArr = []
    // Initialized variable to store total flight distance
    var distance = 0
    // Pushing all flight distance records to flightDistArr
    var distFilter = data.filter((record) => {flightDistArr.push(parseInt(record["Flight Distance"]))})
    // For loop to use distance as a running total that adds all the pushed distances together
    for (let i = 0; i < flightDistArr.length; i++) {
        distance += flightDistArr[i]
    }
    // Once finished, return Promise that resovles to the sum of all flown distance records
    return new Promise ((resolve) => {resolve(distance)})

}

