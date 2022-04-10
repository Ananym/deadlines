import { useState, useEffect } from "react";
import { Radio, Select, Space } from "antd";
const { Option } = Select;

function CountySelector({deadlineData, setSelectedCounties}) {
    const [selectedStateIndex, setSelectedStateIndex] = useState(0);
    const [selectedCountyIndexes, setSelectedCountyIndexes] = useState([]);

    const stateRadioButtons = deadlineData.map( 
        (state, index) => ( <Radio value={index} key={state.name}>{state.name}</Radio> 
        ));

    const countyOptions = deadlineData[selectedStateIndex].counties.map( 
        (county, index) => ( <Option value={index} key={county.name}>{county.name}</Option> 
        ));

    useEffect( ()=>setSelectedCountyIndexes([]), [selectedStateIndex] )
    
    useEffect( ()=>setSelectedCounties(selectedCountyIndexes.map( 
        countyIndex=>deadlineData[selectedStateIndex].counties[countyIndex] )), 
        [selectedCountyIndexes] )

    return(
        <div>
            <Radio.Group 
                defaultValue={selectedStateIndex}
                onChange={e=>setSelectedStateIndex(e.target.value)}>
                <Space direction="vertical">
                    {stateRadioButtons}
                </Space>
            </Radio.Group>
            <br/>
            <Select
                mode='multiple'
                allowClear
                placeholder="Select Counties"
                showSearch
                value={selectedCountyIndexes}
                onChange={setSelectedCountyIndexes}>
                {countyOptions}
            </Select>
        </div>
        ) 
    }

export default CountySelector
