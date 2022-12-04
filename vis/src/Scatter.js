import { Vega } from 'react-vega';

const spec = {
  "config": {"view": {"continuousWidth": 500, "continuousHeight": 500}},
  "data": {"url": "data/scatter/data_final.csv"},
  "params": [
    {
      "name": "x",
      "value": "happiness score",
      "bind": {
        "input": "select",
        "options": [
          "COVID cases/100k",
          "capital city latitude",
          "GDP real growth rate",
          "unemployment rate",
          "gini index",
          "inflation rate",
          "median age",
          "total fertility rate",
          "life expectancy",
          "HDI index",
          "GDP per capita",
          "happiness score",
          "corruption index(cpi)",
          "abstainer(lifetime)",
          "abstainer(12 month)",
          "consumer(12 month)",
          "consumer gender ratio(male/female)",
          "heavy episodic drinking(30 days)",
          "alcohol attributable death",
          "years of life lost by alcohol",
          "gender gap index",
          "work hours (unpaid+paid+study)",
          "alcohol consumption",
          "alcohol consumption(drinkers only)"
        ]
      }
    },
    {
      "name": "y",
      "value": "alcohol consumption",
      "bind": {
        "input": "select",
        "options": [
          "abstainer(lifetime)",
          "abstainer(12 month)",
          "consumer(12 month)",
          "consumer gender ratio(male/female)",
          "heavy episodic drinking(30 days)",
          "alcohol attributable death",
          "years of life lost by alcohol",
          "alcohol consumption",
          "alcohol consumption(drinkers only)"
        ]
      }
    }
  ],
  "transform": [
    {"calculate": "datum[x]", "as": "xcalc"},
    {"calculate": "datum[y]", "as": "ycalc"},
    {"filter": [
      {"field": "xcalc", "valid": true},
      {"field": "ycalc", "valid": true}
    ]}
  ],
  "mark": "point",
  "encoding": {
    "color": {
      "field": "continent",
      "type": "nominal",
    },
    "tooltip": [
      {"field": "country", "type": "nominal"},
      {"field": "alcohol consumption", "type": "quantitative"},
      {"field": "xcalc", "type": "quantitative", "title": "x"},
      {"field": "ycalc", "type": "quantitative", "title": "y"}
    ],
    "x": {
      "field": "xcalc",
      "type": "quantitative",
      "axis": {"title": {"expr": "x"}}
    },
    "y": {
      "field": "ycalc",
      "type": "quantitative",
      "axis": {"title": {"expr": "y"}}
    }
  }
}


function Scatter() {
    return (
      <div className="Scatter">
        <h1>Scatter</h1>
        <Vega spec={spec}/>
      </div>
    );
  }
  
  export default Scatter;
  