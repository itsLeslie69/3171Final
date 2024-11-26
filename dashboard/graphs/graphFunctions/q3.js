import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

import { appendToolTip } from "../../utilities/toolTips.js";

import resetGraph from "./q3Functions/reset.js"

import returnCheckIn from "./q3Functions/checkIn.js"
import returnBooking from "./q3Functions/booking.js"
import returnGateLocation from "./q3Functions/booking.js"
import returnOnBoardService from "./q3Functions/booking.js"
import returnBaggageHandling from "./q3Functions/booking.js"

export default async function getGraph3 () {

    var checkInData = await returnCheckIn()
    var bookingData = await returnBooking()
    var gateData = await returnGateLocation()
    var serviceData = await returnOnBoardService()
    var baggageData = await returnBaggageHandling()

    var select = document.getElementById('dropDown')


    // Defining chart dimensions
    var width = 500
    var height = 500

    var padding = 100

    var innerWidth = width - padding
    var innerHeight = height - padding

    var color = ["#54433A", "#F58634", "#008970", "#00C0A3", "#bba79c"]

    // Appending svg
    var graph = d3.select('#q3Container')
                    .append('svg')
/*                     .attr('height', height)
                    .attr('width', width) */
                    .attr('id', 'q3SVG')
                    .attr('viewBox',
                        "0 0 " + width + " " + height
                    )
    
    // Appending group container to svg
    var graphGroup = graph.append('g')
                            .attr('class', 'gGroup')
                            .attr('id', 'gGroup')
                            .attr("transform", "translate(50, 50)")
    
    d3.csv('/data/customer_satisfaction.csv').then((data) => {

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
        
        // Title and default text
            graphGroup.append("text")
            .attr("id", "q3Title")
            .attr("x", innerWidth / 2)
            .attr("y", -30)
            .attr("text-anchor", "middle")
            

       select.onchange = function (e) {
            //resetGraph()

            function removeTitle () {
                let tempTitle = document.getElementById('q3Title')
                if (tempTitle) {
                    tempTitle.remove()
                }
            }

            removeTitle()
            
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
            d3.select("#q3Title")
                .text(getTitle(e.target.selectedIndex));

            d3.select("#q3SVG").selectAll(".path-" + e.target.selectedIndex)
                .transition()
                .duration(50)
                .style('opacity', 1)

            // Select all paths
            var paths = d3.select("#q3SVG").selectAll("path");

            // Filter for paths that do not match the selected index
            var invalidPaths = paths.filter(function() {
            // Extract the class suffix and check if it doesn't match the selectedIndex
            var classSuffix = d3.select(this).attr("class").split("-").pop();
            return classSuffix != e.target.selectedIndex; // Compare as a string
            });

            // Apply styles to the invalid paths
            invalidPaths.style("opacity", 0.1); // Example style

        }

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

            for (let i = 1; i < 6; i++) {
                var graph = graphGroup.selectAll('.graph')
                .data([getDataForSelection(1)])
                .enter()
            
                // Area chart
                var createAreaChart = d3.area()
                // First area chart, check-in satisfaction
                graph.append('path')
                    .datum(getDataForSelection(i))
                    .attr('d', createAreaChart
                        .x((d) => {return xScale(parseFloat(d.ranking))})
                        .y0(innerHeight)
                        .y1((d) => {return yScale(parseFloat(d.value))})
                    )
                    .attr('fill', () => {return color[i - 1]})
                    .attr('stroke', '#d3d3d3')
                    .attr('stroke-width', 2.5)
                    .style('opacity', 0.65)
                    .attr("class", "path-" + i)
                    
            }
                
/*             graph.append("rect")
                    .attr('class', 'bar')
                    .on('mouseover', function (event, d) {
                        appendToolTip(graphGroup, this.x.baseVal.value, this.y.baseVal.value, d, 0, d.value, -30, -100, 'n')    
                    })
                    .on('mouseout', function () {
                        d3.selectAll('.toolTip').remove();
                    })
                    .attr("x", (d) => { return xScale(parseInt(d.ranking)) }) 
                    .transition()
                        .delay(50)
                        .duration(1500)
                    .attr('y', (d) => { return yScale(d.value) })
                    .attr('width', xScale.bandwidth())
                    .attr('height', (d) => { return innerHeight - yScale(d.value) })
                    .attr("fill", (d, i) => color[i % color.length])
                } */



                // Brush handler functions
 /*                function updateChart (event) {
                    var selection = event.selection
                    d3.select('#q3SVG').selectAll('.bar').classed("selected", function (d) {
                        console.log(d)
                        return isBrushed (selection, xScale(Number(d.ranking)), yScale(d.value))
                    })
        
                }
        
                function isBrushed (edge, x, y) {
                    var x0 = edge[0][0],
                        x1 = edge[1][0],
                        y0 = edge[0][1],
                        y1 = edge[1][1]
                        return x0 <= x && x1 >= x && y0 <= y && y1 >= y 
                }
        
                // Calling brush
                d3.select('#q3SVG').call(
                    d3.brush()
                        .extent([[0, 0], [500, 500]])
                        .on('start brush', updateChart)
                )     */

}
)
}
