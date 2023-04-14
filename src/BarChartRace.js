import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3';

// TODO: handle drawing elements that appear for the first time later in the data.

const BarChartRace = ({ data, speed = 1000 }) => {
    const svgRef = useRef();

    const createScales = (width, height) => {
        const x = d3.scaleLinear().range([0, width]);
        const y = d3.scaleBand().range([0, height]).padding(0.0);
        const color = d3.scaleOrdinal(d3.schemeCategory10.concat(d3.schemeDark2));
        return { x, y, color };
    };

    const createAxes = (svg, width, height) => {
        const xAxis = d3.axisBottom();
        const yAxis = d3.axisLeft();
        svg.append('g').attr('class', 'x-axis').attr('transform', `translate(0,${height})`);
        svg.append('g').attr('class', 'y-axis');
        return { xAxis, yAxis };
    };


    const updateChart = (svg, x, y, color, xAxis, yAxis, weekData, speed) => {
        // Sort data by descending value
        const sortedData = weekData.sort((a, b) => b.value - a.value);

        x.domain([0, Math.max(d3.max(weekData, d => d.value), 1)]);
        y.domain(sortedData.map(d => d.name));

        // Bars and point change bars
        const barGroups = svg.selectAll('.bar-group').data(sortedData, d => d.name);

        const newBarGroups = barGroups.enter().append('g').attr('class', 'bar-group');

        newBarGroups.append('rect')
            .attr('class', 'bar')
            .attr('y', d => y(d.name))
            .attr('height', y.bandwidth())
            .attr('width', 0); // Initialize the width to 0

        newBarGroups.append('rect')
            .attr('class', 'point-change-bar')
            .attr('y', d => y(d.name))
            .attr('height', y.bandwidth())
            .attr('width', 0); // Initialize the width to 0

        // Update bars
        barGroups.select('.bar')
            .transition()
            .duration(speed)
            .attr('x', 0)
            .attr('y', d => y(d.name))
            .attr('height', y.bandwidth())
            .attr('width', d => x(d.value))
            .attr('fill', d => color(d.name));

        barGroups.select('.point-change-bar')
            .transition()
            .duration(speed)
            .attr('x', d => x(d.previousValue))
            .attr('y', d => y(d.name))
            .attr('height', y.bandwidth())
            .attr('width', d => x(d.value - d.previousValue))
            .attr('fill', d => d3.color(color(d.name)).brighter(0.5));

        barGroups.transition()
            .duration(speed)
            .attr('y', d => y(d.name));

        barGroups.exit().remove();

        // Labels
        const labels = svg.selectAll('.label').data(sortedData, d => d.name);

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
            .call(xAxis.scale(x));

        svg.select('.y-axis')
            .transition()
            .duration(speed)
            .call(yAxis.scale(y));
    };

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

        // Scales and axes
        const { x, y, color } = createScales(width, height);
        const { xAxis, yAxis } = createAxes(svg, width, height);

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
                        updateChart(svg, x, y, color, xAxis, yAxis, weekData, speed);
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
