import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm"

export default async function returnBaggageHandling () {
    const data = await d3.csv('/data/customer_satisfaction.csv');

    const oneStar = data.filter((record) => record["Baggage handling"] == 1).length;
    const twoStar = data.filter((record) => record["Baggage handling"] == 2).length;
    const threeStar = data.filter((record) => record["Baggage handling"] == 3).length;
    const fourStar = data.filter((record) => record["Baggage handling"] == 4).length;
    const fiveStar = data.filter((record) => record["Baggage handling"] == 5).length;

    const baggageData = [
        { ranking: "1", value: oneStar },
        { ranking: "2", value: twoStar },
        { ranking: "3", value: threeStar },
        { ranking: "4", value: fourStar },
        { ranking: "5", value: fiveStar }
    ];
    console.log(baggageData)
    return baggageData;
}
