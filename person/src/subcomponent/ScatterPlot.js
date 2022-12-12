import { VegaLite } from "react-vega"
import { useState, useEffect, useRef } from 'react';
import aggregatedCSV from '../data/data_final_nominal.csv'
import Papa from "papaparse"
import { useSelector } from "react-redux";

const selectList = ["alcohol-use", "alcohol-frequency", "marijuana-use", "marijuana-frequency"];
const axisList = ["median age", "happiness score", "GDP per capita", "health", "alcohol consumption"]

export function ScatterPlot() {
  const { age, gender, gdp, health, happy, alcohol } = useSelector(state => state)
  const [medata, setMeData] = useState({"GDP per capita": gdp, "happiness score": happy, "median age": age, "health": health, "alcohol consumption": alcohol})
  
  const ref = useRef();
  const [width, setWidth] = useState(0)
  const [height, setHeight] = useState(0)

  const [countryList, setCountryList] = useState([1])
  const [xaxis, setXaxis] = useState("GDP per capita");
  const [yaxis, setYaxis] = useState("happiness score");
  const [aggdata, setAggData] = useState();
  const [Selected, setSelected] = useState();

  useEffect(() => {
    Papa.parse(
      aggregatedCSV,
      {
        delimiter: ",",
        header: true,
        download: true,
        complete: (result) => {
          setAggData(result.data)
        }
      }
    );
  }, []);
  useEffect(() => { 
    setWidth(ref.current.offsetWidth)
    setHeight(ref.current.offsetHeight * 2 / 3)
  }, [ref.current])

  useEffect(() => {
    let new_data = {"GDP per capita": gdp, "happiness score": happy, "median age": age, "health": health, "alcohol consumption": alcohol}
    setMeData(new_data)
    if(aggdata){
      let x = [...aggdata]
      // console.log(x.map(d => Number(d[xaxis])||null))
      let xmax = Math.max(...x.map(d => Number(d[xaxis])||null))
      let xmin = Math.min(...x.map(d => Number(d[xaxis])||null))
      let ymax = Math.max(...x.map(d => Number(d[yaxis])||null))
      let ymin = Math.min(...x.map(d => Number(d[yaxis])||null))
      x = x.map(d => {
        let x = ((d[xaxis] - new_data[xaxis]) / (xmax - xmin)) ** 2 + ((d[yaxis] - new_data[yaxis]) / (ymax - ymin)) ** 2;
        if(isNaN(x)) {x = 1}
        d['diff'] = x
        return d
      })
      x = x.sort((a, b) => a.diff - b.diff)
      x = x.map(d => ({'country': d.country, 'value': d.diff}))
      x = x.slice(0, 5)
      let sum = 0
      x.forEach(d => sum += 1 / d.value)
      x = x.map(d => {
        d.value = 1 / d.value / sum
        return d
      })
      setCountryList(x.slice(0, 5))
    }
  }, [xaxis, yaxis, aggdata, age, gdp, happy, health])
  let spec = {
    "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
    "description": "Google's stock price over time.",
    "width": width,
    "height": "200",
    // "transform": [{"filter": "datum.symbol==='GOOG'"}],
    "layer":[
      {"data": {
        "values": aggdata
        },
        "mark": "point",
        "encoding": {
          "x": {"field": xaxis, "type": "quantitative", "title": xaxis},
          "y": {"field": yaxis, "type": "quantitative", "title": yaxis},
          "strokeWidth": {
            "condition": [
              {
                "param": "highlight",
                "empty": false,
                "value": 10
              },
              {
                "value": 10,
                "test": {"field": "country", "oneOf": [Selected]}
              },
            ],
            "value": 1
          },
          "color": {
            "condition": [
              {
                "param": "highlight",
                "empty": false,
                "value": "blue"
              },
              {
                "value": "green",
                "test": {"field": "country", "oneOf": [Selected]}
              },
            ],
            "value": "gray"
          },
          "tooltip": [
            {"field": "country"},
            {"field": xaxis, "type": "quantitative"},
            {"field": yaxis, "type": "quantitative"},
            {"field": "diff", "type": "quantitative"},
          ],
        },    
        "params": [
          {
            "name": "highlight",
            "select": {"type": "point", "on": "mouseover"}
          },
        ],
      },
      {"data": {
        "values": [
          medata
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
          x: {"field": xaxis, "type": "quantitative"},
          y: {"field": yaxis, "type": "quantitative"},
          color: {
            "value":"red"
          },
          "tooltip": [
            {"field": xaxis, "type": "quantitative"},
            {"field": yaxis, "type": "quantitative"},
            {"field": "diff", "type": "quantitative"},
          ],
        },
      }, 
    ],
  }
  return (
    <div className="place-items-center pt-5">
      <div className="w-2/3 float-left px-8">
        <div ref={ref}>
          <VegaLite spec={spec} className='w-full' actions={false}/>
          <div className="my-1 content-center">
            x-axis : 
            <select onChange={e => setXaxis(e.target.value)} value={xaxis} className='border'>
              {axisList.map((item) => (
                <option value={item} key={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>
          <div>
            y-axis : 
            <select onChange={e => setYaxis(e.target.value)} value={yaxis} className='border'>
              {axisList.map((item) => (
                <option value={item} key={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
      <div className="w-1/3 float-left">
        <div className="my-2">
          Top Similar Country
        </div>

        {
         countryList.map((d, i) => {
          return (
            <div className="text-left ml-5" onMouseOver={() => setSelected(d.country)} onMouseOut={() => setSelected("")}>
              {i + 1}. {d.country}
              <div className="w-[10rem] bg-gray-300 h-4">
                  <div className="bg-blue-600 text-xs font-medium text-blue-100 text-center p-0.5 leading-none" 
                      style={{width: 100 * d.value + '%'}}>{ (100 * d.value).toFixed(3) + "%"}</div>
              </div>
            </div>
          )
         }) 
        }
      </div>
    </div>
  )
}