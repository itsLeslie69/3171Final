import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

import { appendToolTip } from "../../utilities/toolTips.js";
// Importing functions to get category data
import returnCheckIn from "./q3Functions/checkIn.js"
import returnBooking from "./q3Functions/booking.js"
import returnGateLocation from "./q3Functions/booking.js"
import returnOnBoardService from "./q3Functions/booking.js"
import returnBaggageHandling from "./q3Functions/booking.js"

export default async function getGraph3 () {
    // Getting data for all categories via async functions
    var checkInData = await returnCheckIn()
    var bookingData = await returnBooking()
    var gateData = await returnGateLocation()
    var serviceData = await returnOnBoardService()
    var baggageData = await returnBaggageHandling()
    // Creating reference to category selection dropdown
    var select = document.getElementById('dropDown')
    // Defining chart dimensions
    var width = 500
    var height = 500

    var padding = 100

    var innerWidth = width - padding
    var innerHeight = height - padding
    // Array for graph colours
    var color = ["#54433A", "#F58634", "#008970", "#00C0A3", "#bba79c"]

    // Appending svg
    var graph = d3.select('#q3Container')
                    .append('svg')
                    .attr('id', 'q3SVG')
                    .attr('viewBox',    // Making chart responsive
                        "0 0 " + width + " " + height
                    )
    
    // Appending group container to svg
    var graphGroup = graph.append('g')
                            .attr('class', 'gGroup')
                            .attr('id', 'gGroup')
                            .attr("transform", "translate(50, 10)")

    d3.csv('../data/customer_satisfaction.csv').then((data) => {


        // x-axis scale
        var xScale = d3.scaleLinear()
                        .domain([1, 5])  
                        .range([0, innerWidth])
                        
        var xAxis = d3.axisBottom()
                        .scale(xScale)
        // y-axis
        var yScale = d3.scaleLinear()
                        .domain([50, 0]) // Acquire dynamically?
                        .range([0, innerHeight])
        var yAxis = d3.axisLeft()
                        .scale(yScale)
        // Calling axes
        graphGroup.append('g')
                    .attr('transform', "translate(0," + innerHeight + ")" )
                    .attr('class', 'xAxis')
                    .call(xAxis)

        graphGroup.append('g')
                    .attr('class', 'yAxis')
                    .call(yAxis)
        // Labels
        graphGroup.append("text")
            .attr("class", "axis-label")
            .attr("x", innerWidth / 2)
            .attr("y", 440)
            .attr("text-anchor", "middle")
            .text("Reported Level of Satisfaction");

        graphGroup.append("text")
            .attr("class", "axis-label")
            .attr("text-anchor", "middle")
            .attr("transform", `translate(${-35},${innerHeight / 2})rotate(-90)`)
            .text("Number of Respondents (n)");      
        
        // Handling dropdown changing category, changing data styles and title    
       select.onchange = function (e) {
            // Function to remove title on dropdown input
            function removeTitle () {
                let tempTitle = document.getElementById('q3Title')
                if (tempTitle) {
                    tempTitle.remove()
                }
            }
            // Removing title after dropdown changes
            removeTitle()
            
            // Function to format title based off of dropdown input
            function getTitle(index) {
                switch (index) {
                    case 1: return "Reported Check-In Satisfaction"
                    case 2: return "Reported Booking Ease Satisfaction"
                    case 3: return "Reported Satisfaction"
                    case 4: return "Reported Gate Location Satisfaction"
                    case 5: return "Reported Baggage Handling Satisfaction"
                    default: return "Overview"
                }
            }

            //Title  
            graphGroup.append("text")
            .attr("id", "q3Title")
            .attr('class', 'axis-label')
            .attr("x", innerWidth / 2)
            .attr("y", 20)
            .attr("text-anchor", "middle")
            .text(getTitle(e.target.selectedIndex));

            d3.select("#q3SVG").selectAll("#path-" + e.target.selectedIndex)
                .transition()
                .duration(50)
                .style('opacity', 1)

            // Select all invalid paths
            d3.select("#q3SVG").selectAll("path" + ":not(#" + "path-" + e.target.selectedIndex + ")")
                                .style("opacity", 0.1)
                                
            // Ensuring axes labels do not change opacity
            d3.select("#q3SVG").selectAll("path.domain")
                                .style('opacity', 1)

        }
            // Swtich statement to return data from helper functions
            // Each function corresponds to each required category of information
            // Each helper function returns an array of objects
            // which store a ranking as well as the number of respondents for that ranking
            function getDataForSelection(index) {
                switch (index) {
                    case 1: return checkInData
                    case 2: return bookingData
                    case 3: return gateData
                    case 4: return serviceData
                    case 5: return baggageData
                    default: return []
                }
            }
            // Loop to create area charts
            for (let i = 1; i < 6; i++) {
                var graph = graphGroup.selectAll('.graph')
                .data([getDataForSelection(i)]) // Returning values at each iteration, correspond to data
                .enter()
            
                // Area chart creation
                var createAreaChart = d3.area()
                
                graph.append('path')
                    .datum(getDataForSelection(i))
                    .attr('d', createAreaChart // Positioning
                        .x((d) => {return xScale(parseFloat(d.ranking)) + 0.65}) // Ofsetting to prevent stroke and axis overlap
                        .y0(innerHeight - 0.65)
                        .y1((d) => {return yScale(parseFloat(d.value))})
                    )
                    .attr('fill', () => {return color[i - 1]}) // Offsetting index due to loop starting at 1
                    .attr('stroke', '#F5F5DC')
                    .attr('stroke-width', 2.5)
                    .style('opacity', 0.65)
                    .attr("id", "path-" + i)
            };
        // Appending legend
        const legend = graphGroup.append("g")
            .attr("class", "legend")
            .attr("transform", `translate(${250}, 45)`);
        // Manually setting and iterating legend text
        // Array order corresponds to colour, which orresponds to area chart data
        ["Check-In", "Booking", "Gate Location", "Service", "Baggage Handling"].forEach((s, v) => {
            const legendRow = legend.append("g")
                .attr("transform", `translate(0, ${v * 20})`)
                
            legendRow.append("rect")
                .attr("width", 15)
                .attr("height", 15)
                .attr("fill", (d, i) => color[v]);

            legendRow.append("text")
                .attr("x", 20)
                .attr("y", 12)
                .text(s);
        });
    })
}
