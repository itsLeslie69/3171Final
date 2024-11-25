import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

import { appendToolTip } from "../../utilities/toolTips.js";
    
export default function getGraph1 () {
    const svgwidth = 500 ;
    const svgheight = 500;

    const maxBrushWidth = svgwidth/2;

    const padding = 100;

    const inner_width = svgwidth - padding;
    const inner_height = svgheight - padding;
    


    const svg = d3
    .select("#q1Container")
    .append("svg")
    .attr("width", svgwidth)
    .attr("height", svgheight);

    svg
    .append("text")
    .attr("x", "20")
    .attr("y", padding / 2)
    .attr("text-anchor", "start")
    .style("font-size", "20px")
    .text("Flight Distance");

    const g = svg
    .append("g")
    .attr("transform", `translate(${padding-20}, ${padding-20})`);


    //load the data from the external file
    d3.csv("../data/customer_satisfaction.csv").then((data) => {
        // Extract the Flight Distance column
        const flightDistances = data.map((d) => +d["Flight Distance"]);
        //render chart start
        //console.log(flightDistances);

            
        //create scales for our data (ranges and domains allowing us to visualize data)
        const xscale = d3
            .scaleLinear()
            //this domain on the x axis represents the amount of data points we are looking at
            .domain([0, flightDistances.length - 1])
            //the range for the size of our graph
            .range([0, inner_width]);

            const yscale = d3
            .scaleLinear()
            .domain([0, d3.max(flightDistances)]) // Low at bottom, high at top
            .range([inner_height, 0]);
        

        //creating the axis
        //the data.length on line 78 defines how many ticks there will be
        //without this it will not show numbers 0 to 98 on our chart!
        const xaxis = d3.axisBottom(xscale).ticks(Math.min(flightDistances.length, 10));

        //this creates a y axis on the left side of the chart
        //ticks(5) tells us there are 8 tick marks on the x axis
        const yaxis = d3.axisLeft(yscale).ticks(8);
    
        //adding the axis to the graph with .append()
        //0 represents the x axis and inner height makes sure the x axis starts at the bottom of the
        //chart for proper rendering
        g.append("g")
            .attr("transform", `translate(0,${inner_height})`)
            //call renders the x axis when we are done
            .call(xaxis);
    
        //we now add the y axis to our graph
        g.append("g").call(yaxis);

        //creating a line for our linear graph
        const line = d3
            .line()
            //iterate through the values on the x scale with an arrow function
            .x((d, i) => xscale(i))
            .y((d) => yscale(d));

        //add our newly created line
        g.append("path")
        .datum(flightDistances)
        .attr("fill", "none")
        .attr("stroke", "blue")
        .attr("stroke-width", 2)
        .attr("d", line);
   
        //add circles for each data point
        g.selectAll("circle")
            .data(flightDistances)
            .join("circle")
            .style("opacity", "60%")

            .attr("id", "points_on_chart")
            .attr("cx", (d, i) => xscale(i))
            .attr("cy", (d) => yscale(d))
            //make the radius of each point (circle) 8
            .attr("r", 2)
            .attr("fill", "red")
            .on("mouseover", function (event, d) {
                appendToolTip(g, this.cx.baseVal.value, this.cy.baseVal.value, d, 0, d.toFixed(2), -50, -70, 'Distance')
            })
            .on('mouseout', function () {
                d3.selectAll('.toolTip').remove();
            })
        
    })
}