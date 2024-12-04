import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

export default function renderFlightDistanceChart() {
  //setting dimensions and margins
  const margin = { top: 20, right: 30, bottom: 50, left: 70 };
  const width = 500 - margin.left - margin.right;
  const height = 500 - margin.top - margin.bottom;

  const xScale = d3.scaleLinear().range([0, width ]);
  const yScale = d3.scaleLinear().range([height, 0]);

  const xAxis = d3.axisBottom(xScale);
  const yAxis = d3.axisLeft(yScale);

  const svg = d3
    .select("#q1Container")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
/*     .attr('viewBox',
        "0 0 " + Number(width + margin.left + margin.right) + " " + Number(height + margin.top + margin.bottom)
    ) */

  //adding groups for axes and zoomable area
  const axesGroup = svg
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  const focus = svg
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`)
    .attr("clip-path", "url(#clip)");

  //add a clipping path
  focus
    .append("defs")
    .append("clipPath")
    .attr("id", "clip")
    .append("rect")
    .attr("width", width)
    .attr("height", height);

  //add X-axis title
  axesGroup
    .append("text")
    .attr("id", "x-axis-title")
    .attr("x", width / 2)
    .attr("y", height + margin.bottom - 10)
    .attr("text-anchor", "middle")
    .attr("font-size", "16px")
    .attr("fill", "black")
    .text("Flight ID");

  //add Y-axis title
  axesGroup
    .append("text")
    .attr("id", "y-axis-title")
    .attr("transform", "rotate(-90)")
    .attr("x", -height / 2)
    .attr("y", -margin.left + 20)
    .attr("text-anchor", "middle")
    .attr("font-size", "16px")
    .attr("fill", "black")
    .text("Flight Distance");

  const xAxisGroup = axesGroup.append("g").attr("class", "x axis").attr("transform", `translate(0,${height})`);
  const yAxisGroup = axesGroup.append("g").attr("class", "y axis");

  const line = d3
    .line()
    .x((d) => xScale(d.id))
    .y((d) => yScale(d.distance));

  //tooltip container
  const tooltip = d3
    .select("body")
    .append("div")
    .attr("class", "tooltip")
    .style("position", "absolute")
    .style("background-color", "white")
    .style("border", "1px solid black")
    .style("border-radius", "5px")
    .style("padding", "10px")
    .style("pointer-events", "none")
    .style("opacity", 0);

  d3.csv("../data/customer_satisfaction.csv").then((data) => {
    const parsedData = data.map((d, i) => ({
      id: i,
      distance: +d["Flight Distance"],
      satisfied: d["satisfaction"] === "satisfied",
    }));

    const satisfiedData = parsedData.filter((d) => d.satisfied);
    const notSatisfiedData = parsedData.filter((d) => !d.satisfied);

    xScale.domain([0, parsedData.length + 1]);
    yScale.domain([0, d3.max(parsedData, (d) => d.distance)]);

    //the green path (satisfied)
    const satisfiedPath = focus
      .append("path")
      .datum(satisfiedData)
      .attr("class", "line satisfied")
      .attr("d", line)
      .attr("stroke", "green")
      .attr("fill", "none");

    //the red path (not satisfied)
    const notSatisfiedPath = focus
      .append("path")
      .datum(notSatisfiedData)
      .attr("class", "line not-satisfied")
      .attr("d", line)
      .attr("stroke", "red")
      .attr("fill", "none");

    const satisfiedDots = focus
      .selectAll(".dot-satisfied")
      .data(satisfiedData)
      .join("circle")
      .attr("class", "dot-satisfied")
      .attr("cx", (d) => xScale(d.id))
      .attr("cy", (d) => yScale(d.distance))
      .attr("r", 5)
      .attr("fill", "green")
      .on("mouseover", function (event, d) {
        tooltip
          .style("opacity", 1)
          .html(
            `<strong>Flight ID:</strong> ${d.id}<br>
            <strong>Distance:</strong> ${d.distance}<br>
            <strong>Status:</strong> Satisfied`
          )
          .style("left", `${event.pageX + 10}px`)
          .style("top", `${event.pageY - 10}px`);
        d3.select(this).attr("r", 8).attr("fill", "blue");
      })
      .on("mousemove", function (event) {
        tooltip.style("left", `${event.pageX + 10}px`).style("top", `${event.pageY - 10}px`);
      })
      .on("mouseout", function () {
        tooltip.style("opacity", 0);
        d3.select(this).attr("r", 5).attr("fill", "green");
      });

    const notSatisfiedDots = focus
      .selectAll(".dot-not-satisfied")
      .data(notSatisfiedData)
      .join("circle")
      .attr("class", "dot-not-satisfied")
      .attr("cx", (d) => xScale(d.id))
      .attr("cy", (d) => yScale(d.distance))
      .attr("r", 5)
      .attr("fill", "red")
      .on("mouseover", function (event, d) {
        tooltip
          .style("opacity", 1)
          .html(
            `<strong>Flight ID:</strong> ${d.id}<br>
            <strong>Distance:</strong> ${d.distance}<br>
            <strong>Status:</strong> Not Satisfied`
          )
          .style("left", `${event.pageX + 10}px`)
          .style("top", `${event.pageY - 10}px`);
        d3.select(this).attr("r", 8).attr("fill", "blue");
      })
      .on("mousemove", function (event) {
        tooltip.style("left", `${event.pageX + 10}px`).style("top", `${event.pageY - 10}px`);
      })
      .on("mouseout", function () {
        tooltip.style("opacity", 0);
        d3.select(this).attr("r", 5).attr("fill", "red");
      });

    xAxisGroup.call(xAxis);
    yAxisGroup.call(yAxis);

    const zoom = d3
      .zoom()
      .scaleExtent([1, 10])
      .translateExtent([
        [0, 0],
        [width, height],
      ])
      .on("zoom", zoomed);

    focus
      .append("rect")
      .attr("class", "zoom")
      .attr("width", width)
      .attr("height", height)
      .style("fill", "none")
      .style("pointer-events", "all")
      .lower()
      .call(zoom);

    function zoomed({ transform }) {
      const newXScale = transform.rescaleX(xScale);

      xAxisGroup.call(xAxis.scale(newXScale));

      satisfiedPath.attr(
        "d",
        d3.line().x((d) => newXScale(d.id)).y((d) => yScale(d.distance))
      );

      notSatisfiedPath.attr(
        "d",
        d3.line().x((d) => newXScale(d.id)).y((d) => yScale(d.distance))
      );

      satisfiedDots
        .attr("cx", (d) => newXScale(d.id))
        .attr("cy", (d) => yScale(d.distance));

      notSatisfiedDots
        .attr("cx", (d) => newXScale(d.id))
        .attr("cy", (d) => yScale(d.distance));
    }
  });
}
