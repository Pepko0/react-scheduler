import React, { Component } from 'react';
import Scheduler from './components/Scheduler';
import './App.css';
import { collection, addDoc, getDocs } from "firebase/firestore";
import { firestore } from './firebase';

class App extends Component {
  state = {
    events: [], 
    newEvent: { start_date: '', end_date: '', text: '' }, 
    isAdding: false 
  };

  componentDidMount() {
    this.fetchEventsFromFirestore();
  }

  fetchEventsFromFirestore = async () => {
    try {
      const eventsCollection = collection(firestore, "events");
      
      const eventSnapshot = await getDocs(eventsCollection);
      
      const eventsList = eventSnapshot.docs.map(doc => doc.data());
      
      this.setState({ events: eventsList });
    } catch (error) {
      console.error("Error fetching events: ", error);
    }
  };

  handleInputChange = (e) => {
    const { name, value } = e.target;
    this.setState({ newEvent: { ...this.state.newEvent, [name]: value } });
  };

  addEventToFirestore = async () => {
    const { newEvent, isAdding } = this.state;
    if (isAdding) return;

    this.setState({ isAdding: true }); 

    try {
      await addDoc(collection(firestore, "events"), {
        ...newEvent, 
        id: Date.now()
      });
      

      this.setState({ newEvent: { start_date: '', end_date: '', text: '' }, isAdding: false });
      
      this.fetchEventsFromFirestore();
    } catch (error) {

      console.error("Error adding event:", error);
      this.setState({ isAdding: false }); 
    }
  };

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
