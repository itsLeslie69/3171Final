import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";


export default function getGraph4 () {
       // Set chart dimensions
       const width = 500;
       const height = 500;
       const margin = {top: 30, right: 50, bottom: 60, left: 70};

       // Load and process CSV data
       d3.csv("../data/customer_satisfaction.csv").then((data) => {
           // Parse and structure data
           data.forEach(d => {
               d["Total Delay Minutes"] = +d["Total Departure and Arrival Delay in Minutes"];
               d["Convenience Satisfaction"] = +d["Departure/Arrival time convenient"];
           });

           // Aggregate delay by satisfaction level
           const delayByConvenience = d3.rollup(data,
               v => ({
                   "Low Delay": d3.sum(v.filter(d => d["Total Delay Minutes"] < 30), d => d["Total Delay Minutes"]),
                   "Moderate Delay": d3.sum(v.filter(d => d["Total Delay Minutes"] >= 30 && d["Total Delay Minutes"] < 100), d => d["Total Delay Minutes"]),
                   "High Delay": d3.sum(v.filter(d => d["Total Delay Minutes"] >= 100), d => d["Total Delay Minutes"])
               }),
               d => d["Convenience Satisfaction"]
           );

           // Convert rollup data for D3 stack layout
           const chartData = Array.from(delayByConvenience, ([key, value]) => ({
               "Convenience Level": key,
               ...value
           }));

           // Set up scales
           const x = d3.scaleBand()
               .domain(chartData.map(d => d["Convenience Level"]))
               .range([margin.left, width - margin.right])
               .padding(0.2);

           const y = d3.scaleLinear()
               .domain([0, d3.max(chartData, d => d["Low Delay"] + d["Moderate Delay"] + d["High Delay"])]).nice()
               .range([height - margin.bottom, margin.top]);

           const color = d3.scaleOrdinal()
               .domain(["Low Delay", "Moderate Delay", "High Delay"])
               .range(["#F58634", "#54433A", "#008970"]);

           // Stack layout
           const stack = d3.stack().keys(["Low Delay", "Moderate Delay", "High Delay"]);
           const series = stack(chartData);

           // Add SVG
           const svg = d3.select("#q4Container").append("svg")
               .attr("width", width)
               .attr("height", height)
               .attr('id', 'pieContainer')


            // Graph title
            d3.select('#pieContainer')
            .append("text")
            .attr("class", "axis-label")
            .attr("x", width / 2)
            .attr("y", 20)
            .attr("text-anchor", "middle")
            .text("Total departure/arrival delay (minutes) convenience")

           // X-axis
           svg.append("g")
               .attr("transform", `translate(0,${height - margin.bottom})`)
               .call(d3.axisBottom(x))
               .selectAll("text")
               .style("text-anchor", "middle");

           // Y-axis
           svg.append("g")
               .attr("transform", `translate(${margin.left},0)`)
               .call(d3.axisLeft(y));

           // Bars
           svg.append("g")
               .selectAll("g")
               .data(series)
               .join("g")
               .attr("fill", d => color(d.key))
               .selectAll("rect")
               .data(d => d)
               .join("rect")
               .attr("class", "bar")
               .attr("x", d => x(d.data["Convenience Level"]))
               .attr("y", d => y(d[1]))
               .attr("height", d => y(d[0]) - y(d[1]))
               .attr("width", x.bandwidth())
               .on('mouseover', function (event, d) {
                    //console.log('mouse over q4!')
                    console.log(d)
                    if (d.data["Convenience Level"] == 4) {
                        svg.append('text')
                        .attr("class", "toolTip")
                        .attr("x", 160)
                        .attr("y", height - (height / 3) - 90)
                        .attr("text-anchor", "middle")
                        .text("Level: " + d.data['Convenience Level'])

                        svg.append('text')
                        .attr("class", "toolTip")
                        .attr("x", 182)
                        .attr("y", height - (height / 3) - 60)
                        .attr("text-anchor", "middle")
                        .text("Low Delay: " + d.data['Low Delay'])
                        .style('fill', "#F58634")

                        svg.append('text')
                        .attr("class", "toolTip")
                        .attr("x", 205)
                        .attr("y", height - (height / 3) - 30)
                        .attr("text-anchor", "middle")
                        .text("Moderate Delay: " + d.data['Moderate Delay'])
                        .style('fill', "#54433A")

                        svg.append('text')
                        .attr("class", "toolTip")
                        .attr("x", 188)
                        .attr("y", height - (height / 3))
                        .attr("text-anchor", "middle")
                        .text("High Delay: " + d.data['High Delay'])
                        .style('fill', "#008970")
                    }
               })
               .on('mouseout', function () {
                    d3.selectAll('.toolTip').remove();
                })
               

           // Labels
           svg.append("text")
               .attr("class", "axis-label")
               .attr("x", width / 2)
               .attr("y", height - margin.bottom / 2 + 20)
               .attr("text-anchor", "middle")
               .text("Departure/Arrival Time Convenience Satisfaction Level");

           svg.append("text")
               .attr("class", "axis-label")
               .attr("text-anchor", "middle")
               .attr("transform", `translate(${margin.left / 2},${height / 2})rotate(-90)`)
               .text("Total Delay Minutes");

           // Legend
           const legend = svg.append("g")
               .attr("class", "legend")
               .attr("transform", `translate(${width - margin.right - 120},${margin.top})`);

           ["Low Delay", "Moderate Delay", "High Delay"].forEach((level, i) => {
               const legendRow = legend.append("g")
                   .attr("transform", `translate(0, ${i * 20})`);

               legendRow.append("rect")
                   .attr("width", 15)
                   .attr("height", 15)
                   .attr("fill", color(level));

               legendRow.append("text")
                   .attr("x", 20)
                   .attr("y", 12)
                   .text(level);
           });
       });
}