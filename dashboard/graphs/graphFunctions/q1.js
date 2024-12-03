import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

export default function getGraph1() {
  const margin = { top: 20, right: 30, bottom: 50, left: 100 };
  const width = 1000 - margin.left - margin.right;
  const height = 500 - margin.top - margin.bottom;

  const xScale = d3.scaleLinear().range([0, width]);
  const yScale = d3.scaleLinear().range([height, 0]);

  const xAxis = d3.axisBottom(xScale);
  const yAxis = d3.axisLeft(yScale);

  // Select container and create SVG
  const svg = d3
    .select("#chart-container")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom);

  const axesGroup = svg
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  const chartArea = svg
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`)
    .attr("clip-path", "url(#clip)");

  // Add clipping path
  chartArea
    .append("defs")
    .append("clipPath")
    .attr("id", "clip")
    .append("rect")
    .attr("width", width)
    .attr("height", height);

  // Axes labels
  axesGroup
    .append("text")
    .attr("x", width / 2)
    .attr("y", height + margin.bottom - 10)
    .attr("text-anchor", "middle")
    .attr("font-size", "16px")
    .text("Flight ID");

  axesGroup
    .append("text")
    .attr("transform", "rotate(-90)")
    .attr("x", -height / 2)
    .attr("y", -margin.left + 20)
    .attr("text-anchor", "middle")
    .attr("font-size", "16px")
    .text("Flight Distance");

  // Tooltip
  const tooltip = d3
    .select("body")
    .append("div")
    .attr("class", "tooltip")
    .style("position", "absolute")
    .style("background", "#fff")
    .style("border", "1px solid #ccc")
    .style("padding", "5px")
    .style("border-radius", "5px")
    .style("opacity", 0);

  // Load data
  d3.csv("../data/customer_satisfaction.csv").then((data) => {
    const parsedData = data.map((d, i) => ({
      id: i,
      distance: +d["Flight Distance"],
      satisfied: d["satisfaction"] === "satisfied",
    }));

    const satisfiedData = parsedData.filter((d) => d.satisfied);
    const notSatisfiedData = parsedData.filter((d) => !d.satisfied);

    // Set domains
    xScale.domain([0, parsedData.length + 1]);
    yScale.domain([0, d3.max(parsedData, (d) => d.distance)]);

    // Satisfied line
    chartArea
      .append("path")
      .datum(satisfiedData)
      .attr("class", "line satisfied")
      .attr("d", d3.line().x((d) => xScale(d.id)).y((d) => yScale(d.distance)))
      .attr("stroke", "green")
      .attr("fill", "none");

    // Not satisfied line
    chartArea
      .append("path")
      .datum(notSatisfiedData)
      .attr("class", "line not-satisfied")
      .attr("d", d3.line().x((d) => xScale(d.id)).y((d) => yScale(d.distance)))
      .attr("stroke", "red")
      .attr("fill", "none");

    // Points
    chartArea
      .selectAll(".dot-satisfied")
      .data(satisfiedData)
      .join("circle")
      .attr("class", "dot-satisfied")
      .attr("cx", (d) => xScale(d.id))
      .attr("cy", (d) => yScale(d.distance))
      .attr("r", 5)
      .attr("fill", "green")
      .on("mouseover", (event, d) => {
        tooltip
          .style("opacity", 1)
          .html(`ID: ${d.id}<br>Distance: ${d.distance}<br>Status: Satisfied`)
          .style("left", `${event.pageX + 10}px`)
          .style("top", `${event.pageY - 10}px`);
      })
      .on("mousemove", (event) => {
        tooltip.style("left", `${event.pageX + 10}px`).style("top", `${event.pageY - 10}px`);
      })
      .on("mouseout", () => {
        tooltip.style("opacity", 0);
      });

    chartArea
      .selectAll(".dot-not-satisfied")
      .data(notSatisfiedData)
      .join("circle")
      .attr("class", "dot-not-satisfied")
      .attr("cx", (d) => xScale(d.id))
      .attr("cy", (d) => yScale(d.distance))
      .attr("r", 5)
      .attr("fill", "red")
      .on("mouseover", (event, d) => {
        tooltip
          .style("opacity", 1)
          .html(`ID: ${d.id}<br>Distance: ${d.distance}<br>Status: Not Satisfied`)
          .style("left", `${event.pageX + 10}px`)
          .style("top", `${event.pageY - 10}px`);
      })
      .on("mousemove", (event) => {
        tooltip.style("left", `${event.pageX + 10}px`).style("top", `${event.pageY - 10}px`);
      })
      .on("mouseout", () => {
        tooltip.style("opacity", 0);
      });

    // Render axes
    axesGroup.select(".x.axis").call(xAxis);
    axesGroup.select(".y.axis").call(yAxis);

    // Add zoom
    const zoom = d3
      .zoom()
      .scaleExtent([1, 10])
      .translateExtent([
        [0, 0],
        [width, height],
      ])
      .on("zoom", zoomed);

    chartArea
      .append("rect")
      .attr("width", width)
      .attr("height", height)
      .style("fill", "none")
      .style("pointer-events", "all")
      .call(zoom);

    function zoomed({ transform }) {
      const newXScale = transform.rescaleX(xScale);

      axesGroup.select(".x.axis").call(xAxis.scale(newXScale));

      chartArea.selectAll(".line.satisfied").attr(
        "d",
        d3.line().x((d) => newXScale(d.id)).y((d) => yScale(d.distance))
      );

      chartArea.selectAll(".line.not-satisfied").attr(
        "d",
        d3.line().x((d) => newXScale(d.id)).y((d) => yScale(d.distance))
      );

      chartArea
        .selectAll(".dot-satisfied")
        .attr("cx", (d) => newXScale(d.id))
        .attr("cy", (d) => yScale(d.distance));

      chartArea
        .selectAll(".dot-not-satisfied")
        .attr("cx", (d) => newXScale(d.id))
        .attr("cy", (d) => yScale(d.distance));
    }
  });
}
