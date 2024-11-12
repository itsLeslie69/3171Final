import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

export default function getGraph5 () {
           // Defining chart dimensions
           var width = 500
           var height = 500
   
           var padding = 100
           var barWidth = 15
   
           var innerWidth = width - padding
           var innerHeight = height - padding

           var color = ["#F58634", "#54433A"]
   
           // Appending svg
           var graph = d3.select('#q5Container')
                           .append('svg')
                           .attr('height', height)
                           .attr('width', width)
           
           // Appending group container to svg
           var graphGroup = graph.append('g')
                                   .attr("transform", "translate(50, 50)")
   
       d3.csv('../data/customer_satisfaction.csv').then((d) => {
           //console.log(d)
   
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
   
           //console.log(seatClasses)
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
               console.log(tempTotal/(Number(arr.length) - 1))
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
           console.log(graphData)
           // Array now structured as [] => ['Eco, 3.12'] etc
   
           // x-axis scale
           var xScale = d3.scaleBand()
                           .domain([graphData[0][0], graphData[1][0], graphData[2][0]])  
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
           
           graphGroup.append('g')
                       .attr('transform', "translate(0," + innerHeight + ")" )
                       .call(xAxis)
   
           graphGroup.append('g')
                       .call(yAxis)
   
           var graph = graphGroup.selectAll('.graph')
                                   .data(graphData)
                                   .enter()
                                   .append('g')
           
           graph.append("rect")
                   .attr('class', 'bar')
                   .attr("x", (z) => { return xScale(z[0]) }) // As attribute callbacks iterate, corresponding index for seat class name or avg are referenced as return values
                   .attr('y', (z) => { return yScale(z[1]) })
                   .attr('width', xScale.bandwidth())
                   .attr('height', (z) => { return innerHeight - yScale(z[1]) })
                   .attr("fill", (d, i) => color[i % color.length])
               })   
}