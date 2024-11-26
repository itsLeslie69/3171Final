import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm"

  //fetching customer_satisfaction.csv
      //making sure our directory path is correct
      const csvPath = "../../data/customer_satisfaction.csv";
      fetch(csvPath)
        .then((response) => {
          if (!response.ok)
            throw new Error(`Failed to fetch FOR onBoardService.js: ${response.statusText}`);
          return response.text();
        })
        .then((data) => console.log("onBoardService.js csv data successfully recieved: " + data))
        .catch((error) => console.error(error));


export default async function returnOnBoardService () {
    const data = await d3.csv('../../data/customer_satisfaction.csv');

    const oneStar = data.filter((record) => record["On-board service"] == 1).length;
    const twoStar = data.filter((record) => record["On-board service"] == 2).length;
    const threeStar = data.filter((record) => record["On-board service"] == 3).length;
    const fourStar = data.filter((record) => record["On-board service"] == 4).length;
    const fiveStar = data.filter((record) => record["On-board service"] == 5).length;

    const serviceData = [
        { ranking: "1", value: oneStar },
        { ranking: "2", value: twoStar },
        { ranking: "3", value: threeStar },
        { ranking: "4", value: fourStar },
        { ranking: "5", value: fiveStar }
    ];

    return serviceData;
}
