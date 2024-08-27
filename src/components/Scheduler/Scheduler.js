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

    formatDate = (date) => {
        const d = new Date(date);
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        const hours = String(d.getHours()).padStart(2, '0');
        const minutes = String(d.getMinutes()).padStart(2, '0');
        return `${year}-${month}-${day} ${hours}:${minutes}`;
    };

    addEventToFirestore = async (event) => {
        try {
            const eventsCollection = collection(firestore, "events");
            const formattedEvent = {
                start_date: this.formatDate(event.start_date),
                end_date: this.formatDate(event.end_date),
                text: event.text,
                id: event.id,
            };
            await addDoc(eventsCollection, formattedEvent);
            console.log("Event added to Firestore:", formattedEvent);
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
