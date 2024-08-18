import React, {Component} from 'react';
import 'dhtmlx-scheduler';
import 'dhtmlx-scheduler/codebase/dhtmlxscheduler.css';

const scheduler = window.scheduler;

export default class Scheduler extends Component {
    componentDidMount() {
        scheduler.skin = 'material';
        scheduler.config.header = [
            'day',
            'week',
            'month',
            'date',
            'prev',
            'today',
            'next'
        ];

        const { events } = this.props;
        scheduler.init(this.schedulerContainer, new Date(2022, 10, 15));
        scheduler.clearAll();
        scheduler.parse(events);
    }

    render() {
        return (
            <div 
            ref={ (input) => {this.schedulerContainer = input} }
            style={ {width: '100%', height: '100%' } }
            ></div>
        );
    }
}