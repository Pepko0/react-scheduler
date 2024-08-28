import React, { Component } from 'react';
import 'dhtmlx-scheduler';
import 'dhtmlx-scheduler/codebase/dhtmlxscheduler.css';
import 'dhtmlx-scheduler/codebase/locale/locale_pl';
import { collection, addDoc, deleteDoc, doc, getDoc } from "firebase/firestore";
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

        scheduler.init(this.schedulerContainer, new Date());
        scheduler.clearAll();
        scheduler.parse(this.props.events);

        scheduler.attachEvent("onEventAdded", (id, ev) => {
            this.addEventToFirestore(ev);
        });

        scheduler.attachEvent("onEventDeleted", (id) => {
            this.deleteEventFromFirestore(id);
        });

        console.log("Loaded events into scheduler:", scheduler.getEvents()); 
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
            };
            const docRef = await addDoc(eventsCollection, formattedEvent);
            console.log("Generated ID from Firestore:", docRef.id);
            scheduler.changeEventId(event.id, docRef.id);
            event.id = docRef.id;
        } catch (error) {
            console.error("Error adding event to Firestore:", error);
        }
    };

    getEventFromFirestore = async (id) => {
        try {
            const eventDoc = doc(firestore, "events", id);
            const docSnap = await getDoc(eventDoc);
            if (docSnap.exists()) {
                return { id: docSnap.id, ...docSnap.data() };
            } else {
                console.log("No such document!");
                return null;
            }
        } catch (error) {
            console.error("Error fetching event from Firestore:", error);
            return null;
        }
    };

    deleteEventFromFirestore = async (id) => {
        console.log("Attempting to delete event with ID:", id);
        try {
            const event = await this.getEventFromFirestore(id);
            if (event) {
                const eventDoc = doc(firestore, "events", id);
                await deleteDoc(eventDoc);
                console.log("Event deleted from Firestore:", id);
                scheduler.deleteEvent(id);
            } else {
                console.log("Event with ID not found in Firestore:", id);
            }
        } catch (error) {
            console.error("Error deleting event from Firestore:", error);
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
