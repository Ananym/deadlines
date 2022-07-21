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
      <div className="nameSection">{county.name}</div>
      <div className="dateSection">
        <table>
        {/* <div className="deadlineLabel">Due: {county.deadlineInfo.submissionDate.format("ddd Do MMM")} - {county.deadlineInfo.submissionTime}</div>
        <div className="publicationLabel">For: {county.deadlineInfo.publicationDate.format("ddd Do MMM")}</div> */}
          
            <tr className="deadlineLabel"><td>Due: </td><td>{county.deadlineInfo.submissionDate.format("ddd Do MMM")} - {county.deadlineInfo.submissionTime}</td></tr>
            <tr className="publicationLabel"><td>For: </td><td>{county.deadlineInfo.publicationDate.format("ddd Do MMM")}</td></tr>
          
        </table>
      </div>

    </div>)

  return (
      <main>
      <div className="inputPane">
      <header className="App-header"><h1>Priscilla's Amazing Publication Deadline Calculator</h1></header>
      <div className="input">
        <CountySelector className="countySelector" deadlineData={deadlineData} setSelectedCounties={setSelectedCounties}/>
        
      <label>
        <div className="controlLabel">Court deadline:</div>
        <DatePicker size='large' className="datePicker horizontalControl" onChange={setSelectedDate}/>
      </label>
      </div>
      </div>
      <div className="displayPane">
        {displayItems || <span className="label placeholderNote">Select some inputs yo</span>}
      </div>
    </main>
  );
}



export default App;
