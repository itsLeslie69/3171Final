import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

import { appendToolTip } from "../../utilities/toolTips.js";

export default function getGraph5 () {
    // Defining chart dimensions
    var width = 500
    var height = 500

    var padding = 100

    var innerWidth = width - padding
    var innerHeight = height - padding
    // Array for graph colours
    var color = ["#F58634",  "#00C0A3", "#54433A"]

    // Appending svg
    var graph = d3.select('#q5Container')
                    .append('svg')
                    .attr('id', 'q5SVG')
                    .attr('viewBox',    // Making graph responsive
                    "0 0 " + width + " " + height
                )

    // Appending group container to svg
    var graphGroup = graph.append('g')
        .attr("transform", "translate(50, 50)")
   
    d3.csv('../data/customer_satisfaction.csv').then((d) => {
        // Getting classes
        var seatClasses
        // Function to get the seat classes
        function getClasses () {
            let tempArray = []
            for (let i = 0; i < d.length; i++) {
                tempArray.push(d[i].Class)
            }
            // Converting the array to a Set data type as it does not allow for duplicate values
            let outputArray = Array.from(new Set(tempArray)) // Convering back to Array data type from Set on same line
            return outputArray // Returning final array
        }
   
        seatClasses = getClasses()  // Storing the classes
   
        // Making new array with ratings grouped by satisfaction
        var groupedData = []    // Variable to store the classes and raw values
        // Simple for loops are used to push values
        for (let i = 0; i < seatClasses.length; i++) {
            groupedData.push([seatClasses[i]])  // Seats pushed as arrays into groupedData to make 3 sub-arrays
        }

        for (let i = 0; i < d.length; i++) {
            for (let z = 0; z < seatClasses.length; z++) {
                if (d[i].Class == seatClasses[z]) { // if the csv row's class matches the seat class, push the data to the matching index in groupedData
                    groupedData[z].push(d[i]["Average Satisfaction"]) // Brackets access values with spaces or otherwise irregular field names
                }
            }
        }

        // Calucating averages
        function calculateAvg (arr) { // Takes an array, adds all the values, performs avg calculation when loop ends
            let tempTotal = 0
            for (let i = 1; i < arr.length; i++) {
                tempTotal += parseFloat(arr[i])
                
            }
            //console.log(tempTotal/(Number(arr.length) - 1))
            return (tempTotal/(Number(arr.length) - 1))
        }
   
        // Variable to store the simplified data
        var graphData = []
        // Pushing from the seat clases again into a new array to create 3 sub-arrays like last time
        for (let i = 0; i < seatClasses.length; i++) {
            graphData.push([seatClasses[i]])
        }
        // Array indices correspond to class, so the index is used to match values from the sliced array
        for (let i = 0; i < graphData.length; i++) {
            graphData[i].push(calculateAvg(groupedData[i].slice(1)))    // Sliced array returns all numberical values after the sub-array class name
        }                                                               // calculateAvg is used to process the returned array at the matching index (seat class)
                                                                           // Final averages pushed to graphData
        // Array now structured as [] => ['Eco, 3.12'] etc

        // Geting min and max values of each class for multi-value display
        // Pushing Eco min
        graphData[0].push(Math.min(...groupedData[0].slice(1)))
        // Pushing Eco max
        graphData[0].push(Math.max(...groupedData[0].slice(1)))
        // Pushing Business min
        graphData[1].push(Math.min(...groupedData[1].slice(1)))
        // Pushing Business max
        graphData[1].push(Math.max(...groupedData[1].slice(1)))
        // Pusing Eco Plus min
        graphData[2].push(Math.min(...groupedData[2].slice(1)))
        // Pushing Eco Plus max
        graphData[2].push(Math.max(...groupedData[2].slice(1)))   
        // x-axis scale
        var xScale = d3.scaleBand()
                        .domain(seatClasses)  
                        .range([0, innerWidth])
                        .padding([0.2])
        var xAxis = d3.axisBottom()
                        .scale(xScale)

        // y-axis
        var yScale = d3.scaleLinear()
                        .domain([5, 0]) // Acquire dynamically?
                        .range([0, innerHeight])
        var yAxis = d3.axisLeft()
                        .scale(yScale)
        
        var createXaxis = graphGroup.append('g')
                    .attr('transform', "translate(0," + innerHeight + ")" )
                    .call(xAxis)

        var createYaxis = graphGroup.append('g')
                    .call(yAxis)

        // Labels
        graphGroup.append("text")
            .attr("class", "axis-label")
            .attr("x", innerWidth / 2)
            .attr("y", 440)
            .attr("text-anchor", "middle")
            .text("Class Flown");

        graphGroup.append("text")
            .attr("class", "axis-label")
            .attr("text-anchor", "middle")
            .attr("transform", `translate(${-35},${innerHeight / 2})rotate(-90)`)
            .text("Passenger Satisfaction");      
            
        //Title
        graphGroup.append("text")
            .attr("class", "axis-label")
            .attr("x", innerWidth / 2)
            .attr("y", -30)
            .attr("text-anchor", "middle")
            .text("Passenger Satisfaction by Class");

        graphGroup.append('g')
        .selectAll('g')
        .data(graphData)
        .join('g')
        //.attr('transform', (d, i) => `translate(${xScale(d[0])}, 0)`)  
        .selectAll('rect')
        .data(d => {
            // Flatten ticket prices into individual data items for each rect element
            return [
                { class: d[0], satisfaction: d[1] },
                { class: d[0], satisfaction: d[2]  },
                { class: d[0], satisfaction: d[3]  },
            ];
        })
        .join('rect')
        .attr('fill', (d, i) => {
            return color[i - 1]
        }) // Colour
        .attr('x', d => xScale(d.class))  // Position each ticket price with reference to the group
        .attr('y', d => yScale(parseFloat(d.satisfaction)))          // Set y position based on the price
        .attr('width', xScale.bandwidth())// Set width
        .attr('height', d => {return innerHeight - yScale(parseFloat(d.satisfaction))}) // Set height
        .on('mouseover', function (event, d) {
            appendToolTip(graphGroup, this.x.baseVal.value, this.y.baseVal.value, d, 0, parseFloat(d.satisfaction).toFixed(2), -10, -60, 'Satisfaction')
                console.log(d)
            })
            .on('mouseout', function () {
                d3.selectAll('.toolTip').remove();
            })   
        }
    )
}