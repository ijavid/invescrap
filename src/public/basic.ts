import $ from 'jquery';
import * as _ from 'lodash';
import {Position} from "../position/position.interface";
import {PerformanceData} from "../routes/position.resource";

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
