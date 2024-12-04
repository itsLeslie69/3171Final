import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";
import { appendToolTip } from "../../utilities/toolTips.js";

export default function getGraph2() {
  // Defining chart dimensions
  var width = 500;
  var height = 500;

  // Inserting svg into graphDiv
  d3.select("#q2Container").append("svg").attr("id", "pieOne");

  // Graph title
  d3.select("#pieOne")
    .append("text")
    .attr("class", "axis-label")
    .attr("x", width / 2)
    .attr("y", 20)
    .attr("font-size", "16px")
    .attr("font-weight", "bold")
    .attr("text-anchor", "middle")
    .text("Proportion of satisfied/neutral or unsatisfied customers");
  // Loading data
  d3.csv("../data/customer_satisfaction.csv").then((data) => {
    // Filter method returns an array of objects according to a set condition
    // In this case, whether the returned row's satisfaction is satisfied or neutral or dissatisfied
    // The length of the returned arrays is equal to the raw amount of customers who voiced a given satisfaction
    var satisfiedResult = data.filter(
      (record) => record.satisfaction == "satisfied"
    ).length;
    var unsatisfiedResult = data.filter(
      (record) => record.satisfaction == "neutral or dissatisfied"
    ).length;
    //console.log(satisfiedResult, unsatisfiedResult)

    // Array to store an object for the satisfied and dissatisfied objects
    var userProportion = [
      {
        name: "Satisfied",
        value: parseInt((satisfiedResult / 99) * 100), // Value is a simple percentage
      },
      {
        name: "Unsatisfied/Neutral",
        value: parseInt((unsatisfiedResult / 99) * 100), // 99 records divides out the filtered value from the array length
      },
    ];
    // Array for color HEX values
    const color = ["#008970", "#F58634"];
    /* Build the pie and dataset */
    const svg = d3
      .select("#pieOne") // Making graph resonsive
      .attr("viewBox", "0 0 " + width + " " + height);

    const pie = d3.pie().value((d) => d.value); // Defining pie chart, passing in data values
    const propData = pie(userProportion);
    const arc = d3
      .arc()
      .innerRadius(100)
      .outerRadius(200)
      .cornerRadius(10)
      .padAngle(0.01); // Defining pie geometry

    /* Draw the pie */
    let mainG = svg
      .append("g")
      .attr("transform", `translate(${width / 2},${height / 2 + height / 10})`); // Positioning pie chart

    let innerG = mainG
      .selectAll("myPie")
      .append("g")
      .attr("name", "myPie")
      .data(propData) // Joining data to drawn elements
      .enter();
    // Variable for appended path elements joined to data
    var paths = innerG.append("path");

    paths
      .attr("d", arc) // Drawn path element dimensions are equal to the defined circular geometry above
      .transition()
      .delay(2000)
      .duration(2000)
      .ease(d3.easeSinInOut) // Smooth in and out transition from black to showing fill colours
      .attr("fill", (d, i) => color[i])
      .attr("id", "piePath")
      .attr("class", function (d, i) {
        return "_" + color[i].slice(1); // Return colour array value without the starting hashtag
      });

    // tooltip
    paths
      .on("mouseover", function (event, d) {
        // Showing tooltip on hover
        // Tooltip created via helper function
        appendToolTip(
          mainG,
          85, // x position for tooltip
          -35, // y position for tooltip
          d, // data
          50, // Offset
          d.data.value + "%", // shown value
          0, // x-offset
          0, // y-ffset
          "Satisfaction" // Shown field name
        );
      })
      .on("mouseout", function () {
        // Removing tooltip on mouseout
        d3.selectAll(".toolTip").remove();
      });

    // Legend
    const legend = svg
      .append("g")
      .attr("class", "legend")
      .attr("transform", `translate(10, 50)`);
    // Creating Legends from array
    ["Satisfied", "Unsatisifed/Neutral"].forEach((s, v) => {
      const legendRow = legend
        .append("g") // Appending each legend icon into a group element
        .attr("transform", `translate(0, ${v * 20})`) // Ofsetting position
        .on("mouseover", function () {
          d3.select("#pieOne")
            .selectAll("." + "_" + color[v].slice(1))
            .transition() // Filling in colours
            .duration(50) // If legend icon is hovered over, select all elements classed with the colour (fill) name in this container
            .style("opacity", 1); // that match a classname without the hashtag in colour. Ex: class="F58634" in this svg
        })
        .on("mouseout", function () {
          // Fill is used to make the class, which is what the hover targets
          d3.select("#pieOne")
            .selectAll("." + "_" + color[v].slice(1))
            .transition() // Restoring transparency on mouseout
            .duration(50)
            .style("opacity", 0.8);
        });
      // Creating coloured squares in legend
      legendRow
        .append("rect")
        .attr("width", 15)
        .attr("height", 15)
        .attr("fill", (d, i) => color[v]);

      legendRow.append("text").attr("x", 20).attr("y", 12).text(s);
    });
  });
}
