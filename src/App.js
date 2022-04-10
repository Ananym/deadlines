import './App.css';
import CountySelector from './CountySelector';
import deadlineData from './deadlineData';
import { DatePicker } from 'antd';
import { useState } from 'react';
import calcDeadline from './deadlineCalculations.js'

//hi <3

function App() {
  const [selectedDate, setSelectedDate] = useState();
  const [selectedCounties, setSelectedCounties] = useState([]);
  const displayData = selectedDate ? selectedCounties.map( county => ({...county, deadlineInfo:calcDeadline(county, selectedDate) }) ) : [];

  const displayItems = displayData.map(county => 
    <div className="displayItem" key={county.name}>
      <div className="countyNameLabel">{county.name}</div>
      <div className="deadlineLabel">{county.deadlineInfo.submissionDate.format("ddd MMM Do")} @ {county.deadlineInfo.submissionTime}</div>
    </div>)

  return (
    <div className="App">
      <header className="App-header">

        <div className="inputPane">
          <CountySelector deadlineData={deadlineData} setSelectedCounties={setSelectedCounties}/>
          <DatePicker onChange={setSelectedDate}/>
        </div>
        <div className="displayPane">
          {displayItems}
        </div>

      </header>
    
    </div>
  );
}



export default App;
