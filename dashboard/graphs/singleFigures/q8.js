import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm"

export default async function returnTotalFlightDist () {
    const data = await d3.csv('/data/customer_satisfaction.csv');

    var flightDistArr = []

    var distance = 0

    var distFilter = data.filter((record) => {flightDistArr.push(parseInt(record["Flight Distance"]))})
    
    for (let i = 0; i < flightDistArr.length; i++) {
        distance += flightDistArr[i]
    }
    
    return distance

}

