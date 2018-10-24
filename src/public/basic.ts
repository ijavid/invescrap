import $ from 'jquery';
import * as _ from 'lodash';
import {Position} from "../position/position.interface";
import {PerformanceData, Series} from "../routes/position.resource";

import * as d3 from 'd3';

let positionsTemplate = _.template($('#positionsTemplate').html());

$.getJSON('api/position/',  {}, (positions: Array<PerformanceData>) => {
    console.log(positions);

    const { totalValue, totalNetPl } = positions.reduce((total, value: PerformanceData) => {
        if(value.currency === 'HUF') {
            total.totalValue += value.currentValue;
            total.totalNetPl += value.netpl;
        }
        return total;
    }, { totalValue: 0, totalNetPl: 0 });


    $('#content').html(positionsTemplate({ positions,  totalValue, totalNetPl }));
});



$.getJSON('api/position/values/', {}, (result: Array<Series>) => {

    let data = result[0].data; // todo

    const mm = result.reduce(({ min, max }, { data }) => {
        const values = data.map( a => a.value);
        min = Math.min(min, ...values);
        max = Math.max(max, ...values);
        return {min, max}
    }, {min: 0, max: 0});

    const margin = {top: 20, right: 30, bottom: 30, left: 60};
    const height = 500;
    const width = 1000;
    const x =  d3.scaleTime()
        .domain(d3.extent(data, d => d.date))
        .range([margin.left, width - margin.right]);

    // console.log(data, x);

    const y = d3.scaleLinear()
        .domain([mm.min, mm.max]).nice()
        .range([height - margin.bottom, margin.top]);

    const xAxis = g => g
        .attr("transform", `translate(0,${height - margin.bottom})`)
        .call(d3.axisBottom(x).ticks(width / 80).tickSizeOuter(0));

    const yAxis = g => g
        .attr("transform", `translate(${margin.left},0)`)
        .call(d3.axisLeft(y))
        .call(g => g.select(".domain").remove())
        .call(g => g.select(".tick:last-of-type text").clone()
            .attr("x", 3)
            .attr("text-anchor", "start")
            .attr("font-weight", "bold")
            .text('Title'));

    const line = d3.line()
        .defined(d => !isNaN(d.value))
        .x(d => x(d.date))
        .y(d => y(d.value));

    const svg = d3.select('#chart')
        .attr("width", width)
        .attr("height", height);

    svg.append("g")
        .call(xAxis);

    svg.append("g")
        .call(yAxis);

    result.forEach((item) => {

        const data = item.data;

        svg.append("path")
            .datum(data)
            .attr("fill", "none")
            .attr("stroke", "steelblue")
            .attr("stroke-width", 1.5)
            .attr("stroke-linejoin", "round")
            .attr("stroke-linecap", "round")
            .attr("d", line);

    });


});