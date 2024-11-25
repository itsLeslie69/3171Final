import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm"

export default async function returnNoDelayCust () {
    const data = await d3.csv('/data/customer_satisfaction.csv');

    const num = data.filter((record) => record["Departure Delay in Minutes"] == 0 && record["Arrival Delay in Minutes"] == 0).length

    return new Promise ((resolve) => {resolve(num)})

}

