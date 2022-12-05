import { VegaLite } from "react-vega"
import { useState, useEffect, useRef } from 'react';
import aggregatedCSV from '../data/aggregated.csv'
import Papa from "papaparse"
import { useSelector } from "react-redux";

const selectList = ["alcohol-use", "alcohol-frequency", "marijuana-use", "marijuana-frequency"];
const axisList = ["Median age", "happiness_score", "gdp", "health"]

export function ScatterPlot() {
  const { age, gender, gdp, health, happy, alcohol } = useSelector(state => state)
  const [medata, setMeData] = useState({"gdp": gdp, "happiness_score": happy, "Median age": age, "health": health})
  
  const ref = useRef();
  const [width, setWidth] = useState(0)
  const [height, setHeight] = useState(0)

  const [countryList, setCountryList] = useState(["Republic of Korea", "Albania", 'c', 'd', 'e'])
  const [xaxis, setXaxis] = useState("gdp");
  const [yaxis, setYaxis] = useState("happiness_score");
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
    setWidth(ref.current.offsetWidth * 2 / 3)
    setHeight(ref.current.offsetHeight * 2 / 3)
  }, [ref.current])

  useEffect(() => {
    setMeData({"gdp": gdp, "happiness_score": happy, "Median age": age, "health": health})
    if(aggdata){
      let x = [...aggdata]
      // console.log(x.map(d => Number(d[xaxis])||null))
      let xmax = Math.max(...x.map(d => Number(d[xaxis])||null))
      let xmin = Math.min(...x.map(d => Number(d[xaxis])||null))
      let ymax = Math.max(...x.map(d => Number(d[yaxis])||null))
      let ymin = Math.min(...x.map(d => Number(d[yaxis])||null))
      x = x.map(d => {
        let x = ((d[xaxis] - medata[xaxis]) / (xmax - xmin)) ** 2 + ((d[yaxis] - medata[yaxis]) / (ymax - ymin)) ** 2;
        if(isNaN(x)) {x = 1}
        d['diff'] = x
        return d
      })
      x = x.sort((a, b) => a.diff - b.diff)
      console.log(x.map(d => {return {'name':d.Name, 'diff':d.diff}}))
      x = x.map(d => d.Name)
      setCountryList(x.slice(0, 5))
    }
  }, [xaxis, yaxis, aggdata, age, gdp, happy, health])
  let spec = {
    "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
    "description": "Google's stock price over time.",
    "width": width,
    "height": width,
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
                "test": {"field": "Name", "oneOf": [Selected]}
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
                "test": {"field": "Name", "oneOf": [Selected]}
              },
            ],
            "value": "gray"
          },
          "tooltip": [
            {"field": "Name"},
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
    <div className="place-items-center pt-5 pl-5">
      <div className="w-2/3 float-left px-10 ">
        <div ref={ref}>
          <VegaLite spec={spec} className='w-full'/>
          <div className="my-1">
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
        <div className="my-5">
          Top Similar Country
        </div>

        {
         countryList.map((d, i) => {
          return (
            <div className="text-left ml-10" onMouseOver={() => setSelected(d)} onMouseOut={() => setSelected("")}>
              {i + 1}. {d}
            </div>
          )
         }) 
        }
      </div>
    </div>
  )
}