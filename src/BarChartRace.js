import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3';

const BarChartRace = ({ data, speed = 1000 }) => {
  const svgRef = useRef();

  useEffect(() => {
    if (!data || data.length === 0) return;

    const margin = { top: 20, right: 20, bottom: 30, left: 100 };
    const width = 800 - margin.left - margin.right;
    const height = 500 - margin.top - margin.bottom;

    // Clear existing content
    d3.select(svgRef.current).selectAll('*').remove();

    // Create main SVG
    const svg = d3.select(svgRef.current)
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Scales
    const x = d3.scaleLinear().range([0, width]);
    const y = d3.scaleBand().range([0, height]).padding(0.0); // Updated padding
    const color = d3.scaleOrdinal(d3.schemeCategory10.concat(d3.schemeDark2));

    // Axes
    const xAxis = d3.axisBottom(x);
    const yAxis = d3.axisLeft(y);

    const updateChart = (weekData) => {
      x.domain([0, d3.max(weekData, d => d.value)]);
      y.domain(weekData.map(d => d.name));

      // Bars
      const bars = svg.selectAll('.bar')
        .data(weekData, d => d.name);

      bars.enter()
        .append('rect')
        .attr('class', 'bar')
        .attr('x', 0)
        .attr('y', d => y(d.name))
        .attr('height', y.bandwidth())
        .attr('width', d => x(d.value))
        .attr('fill', d => color(d.name));

      bars.transition()
        .duration(speed)
        .attr('y', d => y(d.name))
        .attr('width', d => x(d.value));

      bars.exit().remove();

      // Point change bars
      const pointChangeBars = svg.selectAll('.point-change-bar')
        .data(weekData, d => `${d.name}-point-change`);

      pointChangeBars.enter()
        .append('rect')
        .attr('class', 'point-change-bar')
        .attr('x', d => x(d.previousValue))
        .attr('y', d => y(d.name))
        .attr('height', y.bandwidth())
        .attr('width', d => x(d.value - d.previousValue))
        .attr('fill', d => d3.color(color(d.name)).brighter(0.5));

      pointChangeBars.transition()
        .duration(speed)
        .attr('x', d => x(d.previousValue))
        .attr('y', d => y(d.name))
        .attr('width', d => x(d.value - d.previousValue));

      pointChangeBars.exit().remove();

      // Labels
      const labels = svg.selectAll('.label')
        .data(weekData, d => d.name);

      labels.enter()
        .append('text')
        .attr('class', 'label')
        .attr('x', d => x(d.value) + 5)
        .attr('y', d => y(d.name) + y.bandwidth() / 2)
        .attr('dy', '.35em')
        .attr('text-anchor', 'start')
        .attr('fill', 'black')
        .text(d => d.value);

      labels.transition()
        .duration(speed)
        .attr('x', d => x(d.value) + 5)
        .attr('y', d => y(d.name) + y.bandwidth() / 2)
        .text(d => d.value);

      labels.exit().remove();

      // Update axes
      svg.select('.x-axis')
        .transition()
        .duration(speed)
        .call(xAxis);

      svg.select('.y-axis')
        .transition()
        .duration(speed)
        .call(yAxis);
    };

    // Draw initial chart with empty data
    svg.append('g')
      .attr('class', 'x-axis')
      .attr('transform', `translate(0,${height})`)
      .call(xAxis);

    svg.append('g')
      .attr('class', 'y-axis')
      .call(yAxis);

    // Run animation for each game week
    const animateGameWeeks = async () => {
      let previousWeekData;
      for (const weekData of data) {
        if (previousWeekData) {
          weekData.forEach((team) => {
            const previousTeam = previousWeekData.find(d => d.name === team.name);
            team.previousValue = previousTeam ? previousTeam.value : 0;
          });
        }

        await new Promise((resolve) => {
          setTimeout(() => {
            updateChart(weekData);
            resolve();
          }, speed);
        });

        previousWeekData = weekData;
      }
    };

    animateGameWeeks();
  }, [data, speed]);

  return (
    <svg ref={svgRef} className="w-full h-full"></svg>
  );
};

export default BarChartRace;
