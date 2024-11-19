import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";
import { appendStackedBarToolTip } from "../../utilities/toolTips.js";


export default function getGraph4 () {
       // Set chart dimensions
       var width = 500
       var height = 500
       var padding = 100

       var innerWidth = width - padding
       var innerHeight = height - padding

       var color = ["#54433A", "#F58634", "#008970", "#00C0A3"]


        // Add SVG
        var svg = d3.select("#q4Container").append("svg")
        .attr("width", width)
        .attr("height", height)
        .attr('id', 'pieContainer')

        var graphGroup = svg.append('g')
            .attr("transform", "translate(50, 50)")

       // Load and process CSV data
       d3.csv("../data/customer_satisfaction.csv").then((data) => {
           // Parse and structure data

           const groupedData = data.reduce((acc, item) => {
            const groupKey = item["Departure/Arrival time convenient"]
            const delayMinutes = Number(item["Total Departure and Arrival Delay in Minutes"])
            
            // Initialize the group if it doesn't exist
            if (!acc[groupKey]) {
                acc[groupKey] = { group: groupKey, totalDelay: 0 }
            }
        
            // Add the delay minutes to the group's total
            acc[groupKey].totalDelay += delayMinutes
        
            return acc;
        }, {})

        // Convert the grouped data object into an array
        const result = Object.values(groupedData)
        console.log(result)
        
        var xScale = d3.scaleBand()
                        .domain(result.map(d => d.group))
                        .range([0, innerWidth])
                        .padding([0.2])

        var xAxis = d3.axisBottom()
                        .scale(xScale)
        
        var yScale = d3.scaleLinear()
                        .domain([0, 900])
                        .range([innerHeight, 0])
        
        var yAxis = d3.axisLeft()
                        .scale(yScale)

        graphGroup.append('g')
            .attr('transform', 'translate(0, ' + innerHeight + ')')
            .call(xAxis)
        
        graphGroup.append('g')
            .call(yAxis)
        
        
        var gGraph = graphGroup.selectAll('.gBar')
                                .data(result)
                                .enter()
                                .append('g')
                                .attr('class', 'gBar')
        gGraph.append('rect')
                .attr('x', d => { return xScale(d.group)})
                .attr('y', d => { return yScale(Number(d.totalDelay)) })
                .attr('width', xScale.bandwidth())
                .attr('height', (d) => { return innerHeight - yScale(Number(d.totalDelay)) })
                .attr('fill', (d, i) => color[i % color.length])
                .on('mouseover', function (event, d) {
                    appendStackedBarToolTip (graphGroup, innerHeight, this.x.baseVal.value + 10, d, [], 3, d.totalDelay, 0, [], 0)  
                })
               .on('mouseout', function () {
                    d3.selectAll('.toolTip').remove()
                })

            // Graph title
            d3.select('#pieContainer')
            .append("text")
            .attr("class", "axis-label")
            .attr("x", width / 2)
            .attr("y", 20)
            .attr("text-anchor", "middle")
            .text("Customer Satisfaction by Total Delay")

           // Labels
           svg.append("text")
               .attr("class", "axis-label")
               .attr("x", width / 2)
               .attr("y", innerHeight + 90)
               .attr("text-anchor", "middle")
               .text("Departure/Arrival Time Convenience Satisfaction Level");

           svg.append("text")
               .attr("class", "axis-label")
               .attr("text-anchor", "middle")
               .attr("transform", `translate(${20},${height / 2})rotate(-90)`)
               .text("Total Delay Minutes");

         
       });
}