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
    <div className="resultItem" key={county.name}>
      <div className="countyNameLabel">{county.name}</div>
      <div className="deadlineLabel">{county.deadlineInfo.submissionDate.format("ddd MMM Do")} @ {county.deadlineInfo.submissionTime}</div>
    </div>)

  return (
      <main>
      <div className="inputPane">
      <header className="App-header"><h1>Priscilla's Amazing Publication Deadline Calculator</h1></header>
      <div className="input">
        <CountySelector className="countySelector" deadlineData={deadlineData} setSelectedCounties={setSelectedCounties}/>
        
      <label>
        <div class="controlLabel">Court deadline:</div>
        <DatePicker size='large' className="datePicker horizontalControl" onChange={setSelectedDate}/>
      </label>
      </div>
      </div>
      <div className="displayPane">
        {displayItems || <div class="placeholderNote">Select some inputs yo</div>}
      </div>
    </main>
  );
}



export default App;
