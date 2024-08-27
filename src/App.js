import React, { Component } from 'react';
import Scheduler from './components/Scheduler';
import './App.css';
import { collection, addDoc, getDocs } from "firebase/firestore";
import { firestore } from './firebase'; 

class App extends Component {
  state = {
    events: [] 
  };

  addEventsToFirestore = async () => {
    const eventsCollection = collection(firestore, "events");

    const eventSnapshot = await getDocs(eventsCollection);
    const existingEvents = eventSnapshot.docs.map(doc => doc.data());

    const newEvents = [
      { start_date: '2022-11-15 06:00', end_date: '2022-11-15 08:00', text: 'Event 1', id: 1 },
      { start_date: '2022-11-15 10:00', end_date: '2022-11-15 18:00', text: 'Event 2', id: 2 },
      { start_date: '2022-11-16 09:00', end_date: '2022-11-16 11:00', text: 'Event 3', id: 3 }
    ];

    try {
      for (const event of newEvents) {

        if (!existingEvents.some(e => e.id === event.id)) {
          await addDoc(eventsCollection, event);
          console.log(`Event added: ${event.text}`);
        } else {
          console.log(`Event already exists: ${event.text}`);
        }
      }
      console.log("All events processed!");
      this.fetchEventsFromFirestore();
    } catch (error) {
      console.error("Error adding events: ", error);
    }
      
};


  fetchEventsFromFirestore = async () => {
    try {
      const eventsCollection = collection(firestore, "events");
      const eventSnapshot = await getDocs(eventsCollection);
      const eventsList = eventSnapshot.docs.map(doc => doc.data());
      this.setState({ events: eventsList });
      console.log("Events fetched:", eventsList);
    } catch (error) {
      console.error("Error fetching events: ", error);
    }
  };

  async componentDidMount() {
    await this.addEventsToFirestore();
    this.fetchEventsFromFirestore();
  }

  render() {
    const { events } = this.state;

    return (
      <div>
        <div className='scheduler-container'>
          <Scheduler events={events} /> 
        </div>
      </div>
    );
  }
}

export default App;
