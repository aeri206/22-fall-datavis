import { Vega } from 'react-vega';

const spec = {
  "$schema": "https://vega.github.io/schema/vega/v5.json",
  "description": "A basic scatter plot example depicting automobile statistics.",
  "width": 400,
  "height": 400,
  "padding": 5,
  "data": [
    {
      "name": "source", 
      "url": "http://localhost:8080/scatter/data_final.tsv",
      "format": {"type": "tsv", "parse": "auto"},
    }
  ],
  "scales": [
    {
      "name": "x",
      "type": "linear",
      "round": true,
      "nice": true,
      "zero": true,
      "domain": {"data": "source", "field": "happiness"},
      "range": "width"
    },
    {
      "name": "y",
      "type": "linear",
      "round": true,
      "nice": true,
      "zero": true,
      "domain": {"data": "source", "field": "consumption"},
      "range": "height"
    },
  ],
  "axes": [
    {
      "scale": "x",
      "grid": true,
      "domain": false,
      "orient": "bottom",
      "tickCount": 5,
      "title": "happiness score"
    },
    {
      "scale": "y",
      "grid": true,
      "domain": false,
      "orient": "left",
      "titlePadding": 5,
      "title": "alcohol consumption"
    }
  ],
  "marks": [
    {
      "name": "marks",
      "type": "symbol",
      "from": {"data": "source"},
      "encode": {
        "update": {
          "x": {"scale": "x", "field": "happiness score"},
          "y": {"scale": "y", "field": "alcohol consumption"},
          "shape": {"value": "circle"},
          "strokeWidth": {"value": 2},
          "opacity": {"value": 0.5},
          "stroke": {"value": "#4682b4"},
          "fill": {"scale": "color", "field":"continent"}
        }
      }
    }
  ]}

function Scatter() {
    return (
      <div className="Scatter">
        <h1>Scatter</h1>
        <Vega spec={spec}/>
      </div>
    );
  }
  
  export default Scatter;
  