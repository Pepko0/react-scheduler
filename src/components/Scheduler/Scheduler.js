import React, { Component } from 'react';
import 'dhtmlx-scheduler';
import 'dhtmlx-scheduler/codebase/dhtmlxscheduler.css';
import 'dhtmlx-scheduler/codebase/locale/locale_pl';
import { collection, addDoc } from "firebase/firestore";
import { firestore } from '../../firebase';

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

        scheduler.init(this.schedulerContainer, new Date(2022, 10, 15));
        scheduler.clearAll();
        scheduler.parse(this.props.events);

        scheduler.attachEvent("onEventAdded", (id, ev) => {
            this.addEventToFirestore(ev);
        });
    }

    componentDidUpdate(prevProps) {
        if (prevProps.events !== this.props.events) {
            this.updateScheduler();
        }
    }

    updateScheduler = () => {
        const { events } = this.props;
        scheduler.clearAll();
        scheduler.parse(events);
    };

    addEventToFirestore = async (event) => {
        try {
            const eventsCollection = collection(firestore, "events");
            await addDoc(eventsCollection, {
                start_date: event.start_date,
                end_date: event.end_date,
                text: event.text,
                id: event.id,
            });
            console.log("Event added to Firestore:", event);
        } catch (error) {
            console.error("Error adding event to Firestore:", error);
        }
    };

    render() {
        return (
            <div 
                ref={(input) => { this.schedulerContainer = input; }}
                style={{ width: '100%', height: '100%' }}
            ></div>
        );
    }
}
