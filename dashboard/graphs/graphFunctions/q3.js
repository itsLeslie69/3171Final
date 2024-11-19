import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";
import { appendStackedBarToolTip } from "../../utilities/toolTips.js";

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
    var barWidth = 15

    var innerWidth = width - padding
    var innerHeight = height - padding

    var color = ["#F58634", "#54433A"]

    // Appending svg
    var graph = d3.select('#q3Container')
                    .append('svg')
                    .attr('height', height)
                    .attr('width', width)
    
    // Appending group container to svg
    var graphGroup = graph.append('g')
                            .attr('class', 'gGroup')
                            .attr('id', 'gGroup')
                            .attr("transform", "translate(50, 50)")
    
    d3.csv('/data/customer_satisfaction.csv').then((data) => {

        // x-axis scale
        var xScale = d3.scaleBand()
                        .domain([1, 2, 3, 4, 5])  
                        .range([0, innerWidth])
                        .padding([0.2])
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
            
        //Title
        graphGroup.append("text")
            .attr("class", "axis-label")
            .attr("x", innerWidth / 2)
            .attr("y", -30)
            .attr("text-anchor", "middle")
            .text("Reported Satisfaction By Category");

        select.onchange = function (e) {
            console.log(e.target.selectedIndex)
            resetGraph()

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

            var graph = graphGroup.selectAll('.graph')
                            .data(getDataForSelection(e.target.selectedIndex))
                            .enter()
                            .append('g')
                
            graph.append("rect")
                    .attr('class', 'bar')
                    .attr("x", (d) => { return xScale(parseInt(d.ranking)) }) 
                    .attr('y', (d) => { return yScale(d.value) })
                    .attr('width', xScale.bandwidth())
                    .attr('height', (d) => { return innerHeight - yScale(d.value) })
                    .attr("fill", (d, i) => color[i % color.length])
                    .on('mouseover', function (event, d) {
                        console.log('mouse over bar 3!')
                        console.log(d)
                        // graphGroup, 500, xScale(parseInt(d.ranking)) + 30, d, [], 0, "value", 0, []
                        appendStackedBarToolTip (
                            graphGroup, 
                            500, 
                            xScale(parseInt(d.ranking)) + 15, 
                            d, 
                            [], 
                            3, 
                            "n = " + d.value,
                            90,
                            [],
                            (innerHeight / 2) - (d.value / 2) - 130
                        )
                    })
                    .on('mouseout', function () {
                        d3.selectAll('.toolTip').remove();
                    });
        }

    })
}
