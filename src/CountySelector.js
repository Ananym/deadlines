import { useState, useEffect } from "react";
import { Radio, Select, Space } from "antd";
const { Option } = Select;

function CountySelector({deadlineData, setSelectedCounties}) {
    const [selectedStateIndex, setSelectedStateIndex] = useState(0);
    const [selectedCountyIndexes, setSelectedCountyIndexes] = useState([]);

    const stateRadioButtons = deadlineData.map( 
        (state, index) => ( <Radio.Button size='large' value={index} key={state.name}>{state.name}</Radio.Button> 
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
            <label>
                <div class="controlLabel">State:</div>
                <Radio.Group className="radioGroup" 
                    defaultValue={selectedStateIndex}
                    onChange={e=>setSelectedStateIndex(e.target.value)}>
                    {/* <Space direction="vertical"> */}
                        {stateRadioButtons}
                    {/* </Space> */}
                </Radio.Group>
            </label>

            <label>
            <div class="controlLabel">Counties:</div>
            <Select className="select horizontalControl"
                mode='multiple'
                allowClear
                placeholder="Select Counties"
                showSearch
                value={selectedCountyIndexes}
                size='large'
                onChange={setSelectedCountyIndexes}>
                {countyOptions}
            </Select>
            </label>
        </div>
        ) 
    }

export default CountySelector
