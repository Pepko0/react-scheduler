import React, {Component} from 'react';
import Scheduler from './components/Scheduler';
import './App.css';

const data = [
  { start_date: '2022-11-15 6:00', end_date: '2022-11-15 8:00', text:'Event 1', id: 1},
  { start_date: '2022-11-15 10:00', end_date: '2022-11-15 18:00', text:'Event 2', id: 2}
]

class App extends Component {
  render() {
    return (
      <div>
        <div className='scheduler-container'>
          <Scheduler events={data}/>
        </div>
      </div>
    );
  }
}

export default App;
