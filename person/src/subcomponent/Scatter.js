import { useEffect } from 'react';
import { VegaLite } from 'react-vega';
import './Scatter.css';

const spec = {
  "config": {"view": {"continuousWidth": 500, "continuousHeight": 260}},
  "data": {"url": "http://147.46.240.50:4999/aggregated.csv"},
  "usermeta": [
    'Name', 'continent', 'Cases - cumulative total',
  'Deaths - cumulative total', 'GDP - per capita',
  'Industrial production growth rate', 'Unemployment rate',
  'Distribution of family income - Gini index', 'Birth rate',
  'Death rate', 'Net migration rate', 'Maternal mortality rate',
  'Life expectancy at birth', 'life_exp', 'gdp', 'happiness_score',
  'health', 'freedom', 'government_trust', 'alcohol death both',
  'consumption drinkers Both sexes'],
  "height": 200,
  "params": [
    {
      "name": "x",
      "value": "happiness_score",
      "bind": {
        "input": "select",
        "name": "X Axis : ", 
        "options": ['Cases - cumulative total',
        'Deaths - cumulative total', 'GDP - per capita',
        'Industrial production growth rate', 'Unemployment rate',
        'Distribution of family income - Gini index', 'Birth rate',
        'Death rate', 'Net migration rate', 'Maternal mortality rate',
        'Life expectancy at birth', 'life_exp', 'gdp', 'happiness_score',
        'health', 'freedom', 'government_trust', 'alcohol death both',
        'consumption drinkers Both sexes']
      }
    },
    {
      "name": "y",
      // "value": "alcohol death both",
      "value": "GDP - per capita",
      "bind": {
        "input": "select",
        "name": "Y Axis : ", 
        "options": ['Cases - cumulative total',
        'Deaths - cumulative total', 'GDP - per capita',
        'Industrial production growth rate', 'Unemployment rate',
        'Distribution of family income - Gini index', 'Birth rate',
        'Death rate', 'Net migration rate', 'Maternal mortality rate',
        'Life expectancy at birth', 'life_exp', 'gdp', 'happiness_score',
        'health', 'freedom', 'government_trust', 'alcohol death both',
        'consumption drinkers Both sexes']
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
              {"field": "Name", "type": "nominal"},
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

export function Scatter() {

  useEffect(() => {
  }, [])
    return (
      <div className="Scatter">
        <VegaLite spec={spec} actions={false} style={{marginTop: 5, marginLeft: 10}}/>
      </div>
    );
  }
  
  