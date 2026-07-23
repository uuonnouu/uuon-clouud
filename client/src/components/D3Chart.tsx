
import React, { useEffect, useRef } from "react";
import * as d3 from "d3";

const D3Chart: React.FC = () => {
  const ref = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    if (ref.current) {
      const svg = d3.select(ref.current);
      svg.selectAll("*").remove(); // Clear previous content
      
      const data = [12, 36, 6, 25, 20];

      const width = 200;
      const height = 100;
      const margin = { top: 10, right: 10, bottom: 10, left: 10 };

      svg
        .attr("width", width)
        .attr("height", height)
        .style("overflow", "visible")
        .style("margin", "10px");

      const x = d3.scaleBand().range([0, width]).domain(data.map((_, i) => i.toString())).padding(0.4);
      const y = d3.scaleLinear().range([height, 0]).domain([0, d3.max(data) ?? 0]);

      const xAxis = d3.axisBottom(x);
      const yAxis = d3.axisLeft(y);

      svg.append("g").call(xAxis).attr("transform", `translate(0, ${height})`);
      svg.append("g").call(yAxis);

      svg
        .selectAll(".bar")
        .data(data)
        .enter()
        .append("rect")
        .attr("x", (_, i) => x(i.toString()) ?? 0)
        .attr("y", y)
        .attr("width", x.bandwidth())
        .attr("height", d => height - y(d))
        .attr("fill", "tomato");
    }
  }, []);

  return <svg ref={ref}></svg>;
};

export default D3Chart;
