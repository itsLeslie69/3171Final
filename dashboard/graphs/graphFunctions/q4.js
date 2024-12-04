import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

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
        .attr('id', 'q4SVG')
        .attr('viewBox',
            "0 0 " + width + " " + height
        )

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
        //console.log(result)
        
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
                .transition()
                .delay(500)
                .duration(1000)
                .attr('y', d => { return yScale(Number(d.totalDelay)) })
                .attr('width', xScale.bandwidth())
                .attr('height', (d) => { return innerHeight - yScale(Number(d.totalDelay)) })
                .attr('fill', (d, i) => color[i % color.length])
                .attr('class', 'bar')


        // Brush handler functions
        function updateChart (event) {
            var selection = event.selection

            d3.select('#q4SVG').selectAll('.bar').classed("selected", function (d) {
                console.log(d)
                return isBrushed (selection, xScale(d.group) + 50, yScale(Number(d.totalDelay)) + 50)
            })

        }

        function isBrushed (edge, x, y) {
            var x0 = edge[0][0],
                x1 = edge[1][0],
                y0 = edge[0][1],
                y1 = edge[1][1]
                return x0 <= x && x1 >= x && y0 <= y && y1 >= y 
        }

        var brushGroup = svg.append("g").attr("class", "brush");


        // Calling brush
        brushGroup.call(
            d3.brush()
                .extent([[50, 50], [490, 470]])
                .on('start brush', updateChart)
        );    

            // Graph title
            svg.append("text")
            .attr("class", "axis-label")
            .attr("x", width / 2)
            .attr("y", 20)
            .attr("text-anchor", "middle")
            .text("Departure/Arrival Time Convenience Satisfaction Level");


           // Labels
           svg.append("text")
           .attr("class", "axis-label")
           .attr("x", width / 2)
           .attr("y", innerHeight + 90)
           .attr("text-anchor", "middle")
           .text("Customer Satisfaction by Total Delay");

           svg.append("text")
               .attr("class", "axis-label")
               .attr("text-anchor", "middle")
               .attr("transform", `translate(${14},${height / 2})rotate(-90)`)
               .text("Total Delay Minutes");

         
       });
}