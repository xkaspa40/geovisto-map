import * as d3 from 'd3';

export const drawChart = (node, data, width, height) => {
    const xScale = d3.scaleTime()
        .domain(d3.extent(data, ([time]) => time ))
        .range([ 0, width ]);

    const yScale = d3.scaleLinear()
        .domain([0, d3.max(data, ([_, value]) => value)]).nice()
        .range([height, 0]);

    const line = d3.line()
        .defined(([_, value]) => !isNaN(value))
        .x(([time]) => xScale(time))
        .y(([_, value]) => yScale(value))

    const svg = d3.select(node)
        .append('svg')
        .attr('viewBox', [0, 0, width, height])
        .attr('fill', 'none')
        .attr('stroke-linejoin', 'round')
        .attr('stroke-linecap', 'round');

    svg.append('path')
        .datum(data.filter(line.defined()))
        .attr('stroke', '#ccc')
        .attr('d', line);

    svg.append('path')
        .datum(data)
        .attr('stroke', 'steelblue')
        .attr('stroke-width', 1)
        .attr('d', line);
};
