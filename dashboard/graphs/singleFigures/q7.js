import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm"

export default async function returnLoyalCustomers () {
    const data = await d3.csv('/data/customer_satisfaction.csv');

    var loyalCustNum = data.filter((record) => record["Customer Type"] == "Loyal Customer").length
    
    return loyalCustNum

}

