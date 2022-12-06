import { VegaLite } from 'react-vega';

const spec = {
  "config": {"view": {"continuousWidth": 500, "continuousHeight": 500}},
  "data": {"url": "http://147.46.240.50:4999/scatter/data_final.csv"},
  "usermeta": [
    "country",
    "continent",
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
  ],
  "params": [
    {
      "name": "x",
      "value": "heavy episodic drinking(30 days)",
      "bind": {
        "input": "select",
        "name": "X Axis : ", 
        "options": [
          "alcohol consumption",
          "alcohol consumption(drinkers only)",
          "consumer(12 month)",
          "heavy episodic drinking(30 days)",
          "consumer gender ratio(male/female)",
          "alcohol attributable death",
          "capital city latitude",
          "GDP per capita",
          "gini index",
          "median age",
          "life expectancy",
          "COVID cases/100k",
          "HDI index",
          "happiness score",
          "corruption index(cpi)",
          "gender gap index",
          "work hours (unpaid+paid+study)",
        ]
      }
    },
    {
      "name": "y",
      "value": "alcohol attributable death",
      "bind": {
        "input": "select",
        "name": "Y Axis : ", 
        "options": [
          "alcohol consumption",
          "alcohol consumption(drinkers only)",
          "consumer(12 month)",
          "heavy episodic drinking(30 days)",
          "consumer gender ratio(male/female)",
          "alcohol attributable death",
        ]
      }
    }
  ],
  "transform": [
    {"calculate": "datum[x]", "as": "xcalc"},
    {"calculate": "datum[y]", "as": "ycalc"}
  ],
  "hconcat": [
    {
      "vconcat": [
        {
          "mark": "point",
          "params": [{"name": "brush", "select": "interval"}],
          "encoding": {
            "color": {
              "field": "continent",
              "type": "nominal",
            },
            "tooltip": [
              {"field": "country", "type": "nominal"},
              {"field": "continent", "type": "nominal"},
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
      ]
    }
  ]
}

function Scatter() {
    return (
      <div className="Scatter">
        <VegaLite spec={spec} actions={false} style={{marginTop: 20}}/>
      </div>
    );
  }
  
  export default Scatter;
  