import { VegaLite } from "react-vega"
import { useState, useEffect } from 'react';
import { useSelector, shallowEqual } from 'react-redux';
import drugusebyageCSV from '../data/drug-use-by-age.csv'
import Papa from "papaparse"

const columnList = ["alcohol-use", "marijuana-use", "crack-use", "heroin-use"]
const selectList = ["all"].concat(columnList)

export function LineChart() {
  console.log(selectList)
  const [drugusedata, setDrugUseData] = useState();
  const [Selected, setSelected] = useState(selectList[0]);
  const { age, alcohol } = useSelector(state => state, () => {})
  useEffect(() => {
    Papa.parse(
      drugusebyageCSV,
      {
        delimiter: ",",
        header: true,
        download: true,
        complete: (result) => {
          setDrugUseData(result.data)
        }
      }
    );
  }, []);
  let layerList = Selected == "all"?columnList:[Selected]
  let spec = {
    "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
    "description": "Google's stock price over time.",
    "width": "300",
    "height": "300",
    
    "repeat": {
      "layer": layerList
    },
    // "transform": [{"filter": "datum.symbol==='GOOG'"}],
    "spec":{
      "layer":[
        {"data": {
          "values": drugusedata
          },
          "mark": "line",
          "encoding": {
            "x": {"field": "age", "type": "quantitative"},
            "y": {"field": {"repeat":"layer"}, "type": "quantitative", "title":Selected == "all"?"drug-use": Selected},
            "stroke": {"datum": {"repeat": "layer"}, "type": "nominal"},
          },
        },
        Selected != "all"?
        {"data": {
          "values": [
            {"age": age, "alcohol-use": alcohol, "marijuana-use": 30, "crack-use": 0.3, "heroin-use": 1},
          ]},
          "layer":[
            {
              "mark": {
                "type": "text",
                "align": "left",
                "baseline": "middle",
                "dx": 3
              },
            },
            {"mark": "point"},
          ],
          "encoding": {
            "text": {
              "value": "Me"
            },
            x: {"field": "age", "type": "quantitative"},
            y: {
              field: Selected, 
              type: "quantitative",
              axis: {
                title: Selected
              }},
              color: {
                "value":"red"
              },
          },
        }
        :{"data": {
          "values": [
            {"age": age},
          ]},
          "mark": "rule",
          "encoding": {
            x: {"field": "age","type": "quantitative"},
            color: {
              "value":"red"
            },
            strokeDash: {"value": [5, 2]}
          },
        },
      ],
    }
  }
  return (
    <div className="place-items-center">
      <div className="pt-3">
        average <select onChange={e => setSelected(e.target.value)} value={Selected} className='border'>
          {selectList.map((item) => (
            <option value={item} key={item}>
              {item}
            </option>
          ))}
        </select> status by age
      </div>
      <VegaLite spec={spec}/>
    </div>
  )
}