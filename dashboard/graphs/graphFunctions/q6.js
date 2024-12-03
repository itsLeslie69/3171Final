import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";
import { appendToolTip } from "../../utilities/toolTips.js";

export default function getGraph6 () {
    // Defining chart dimensions
    var width = 500 
    var height = 500

    var padding = 110

    var innerWidth = width - padding
    var innerHeight = height - padding
    // Array for graph colours
    var color = ["#54433A", "#F58634", "#008970", "#00C0A3"]
    // Appending svg
    var graph = d3.select('#q6Container')
                    .append('svg')
                    .attr('id', 'q6SVG')
                    .attr('viewBox',    // Making graph responsive
                        "0 0 " + width + " " + height
                    )
    
    // Graph title
    d3.select('#q6SVG')
    .append("text")
    .attr("class", "axis-label")
    .attr("x", width / 2)
    .attr("y", 20)
    .attr("text-anchor", "middle")
    .text("First 15 Disloyal Customers 4 ticket prices");

    // Appending group container to svg
    var graphGroup = graph.append('g')
                            .attr("transform", "translate(60, 10)")
    
    d3.csv('../data/customer_satisfaction.csv').then((data) => {
        // Getting first 15 customers from CSV directly
        var disloyalArray = data.slice(0, 15)
        // Creating groups based on the ids
        var groups = data.map(d => Number(d.id)).slice(0, 15)
        // Creating axes and axis scales
        var xScale = d3.scaleBand()
                        .domain(groups)
                        .range([0, innerWidth])
                        .padding([0.2])

        var xAxis = d3.axisBottom()
                        .scale(xScale)
        // Calling axes
        graphGroup.append('g')
                    .attr('transform', 'translate(0,' + innerHeight + ")") 
                    .call(xAxis)

        var yScale = d3.scaleLinear()
                        .domain([0, 2000])
                        .range([innerHeight, 0])
        var yAxis = d3.axisLeft()
                        .scale(yScale)
        graphGroup.append('g')
                    .call(yAxis)

        // Labels
        graphGroup.append("text")
        .attr("class", "axis-label")
        .attr("x", innerWidth / 2)
        .attr("y", 440)
        .attr("text-anchor", "middle")
        .text("Passenger ID");

        graphGroup.append("text")
            .attr("class", "axis-label")
            .attr("text-anchor", "middle")
            .attr("transform", `translate(${-48},${innerHeight / 2})rotate(-90)`)
            .text("Total Ticket(s) Cost");    

        // Graphing data
        graphGroup.append('g')
            .selectAll('g')
            .data(disloyalArray)
            .join('g')
            .attr('transform', d => `translate(${xScale(Number(d.id))}, 0)`)  
            .selectAll('rect')
            .data(d => {
                // Flatten ticket prices into individual data items for each rect element
                return [
                    { id: d.id, price: d["1st Ticket Price"], group: "1st" },
                    { id: d.id, price: d["2nd Ticket Price"], group: "2nd" },
                    { id: d.id, price: d["3rd Ticket Price"], group: "3rd" },
                    { id: d.id, price: d["4th Ticket Price"], group: "4th" }
                ];
            })
            .join('rect')
            .on('mouseover', function (event, d) {

                appendToolTip(graph, xScale(parseInt(d.id)), this.y.baseVal.value, d, 0, "$" + Number(d.price).toFixed(2), 0, -90, "Cost")
            }).on('mouseout', function () {
                d3.selectAll('.toolTip').remove()
            })
            .attr('x', d => xScale(d.group))  // Position each ticket price with reference to the group
            .attr('y', d => yScale(d.price))          // Set y position based on the price
            .attr('width', xScale.bandwidth())// Set width
            .transition()
            .duration(2000)
            .attr('height', d => innerHeight - yScale(d.price)) // Set height
            .transition()
            .delay(100)
            .duration(500)
            .ease(d3.easeSinInOut)
            .attr('fill', (d, i) => color[i]) // Colour
            .attr('class', function (d, i) {
                return "_" + color[i].slice(1) + " bar"
            })
           
            // Legend
            const legend = graphGroup.append("g")
            .attr("class", "legend")
            .attr("transform", `translate(${250}, 20)`);

            ["1st Ticket Price", "2nd Ticket Price", "3rd Ticket Price", "4th Ticket Price"].forEach((s, v) => {
                const legendRow = legend.append("g")
                    .attr("transform", `translate(0, ${v * 20})`)
                    .on('mouseover', function () {
                        d3.select('#q6SVG').selectAll('.' + '_' + color[v].slice(1)).transition()
                            .duration(50)
                            .style('opacity', 1)
                    }).on('mouseout', function () {
                        d3.select('#q6SVG').selectAll('.' + '_' + color[v].slice(1)).transition()
                        .duration(50)
                        .style('opacity', 0.8)
                    })

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