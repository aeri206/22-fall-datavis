import './App.css';
import { Vega } from 'react-vega';
import mapData from "./data/world-110m.json";


const spec = {
  "$schema": "https://vega.github.io/schema/vega/v5.json",
  "description": "A configurable map of countries of the world.",
  "width": 900,
  "height": 500,
  "autosize": "none",

  "signals": [
    {
      "name": "type",
      "value": "equirectangular",
    },
    { "name": "scale", "value": 120,
   },
    { "name": "rotate0", "value": 0},
    { "name": "rotate1", "value": 0},
    { "name": "rotate2", "value": 0},
    { "name": "center0", "value": 0},
    { "name": "center1", "value": 0},
    { "name": "translate0", "update": "width / 2" },
    { "name": "translate1", "update": "height / 2" },

    { "name": "graticuleDash", "value": 0,
      "bind": {"input": "radio", "options": [0, 3, 5, 10]} },
    { "name": "borderWidth", "value": 1,
      "bind": {"input": "text"} },
    { "name": "background", "value": "#ffffff",
      "bind": {"input": "color"} },
  ],

  "projections": [
    {
      "name": "projection",
      "type": {"signal": "type"},
      "scale": {"signal": "scale"},
      "rotate": [
        {"signal": "rotate0"},
        {"signal": "rotate1"},
        {"signal": "rotate2"}
      ],
      "center": [
        {"signal": "center0"},
        {"signal": "center1"}
      ],
      "translate": [
        {"signal": "translate0"},
        {"signal": "translate1"}
      ]
    }
  ],

  "data": [
    {
      "name": "world",
      "url": "https://vega.github.io/editor/data/world-110m.json",
      "format": {
        "type": "topojson",
        "feature": "countries"
      }
    },
    {
      "name": "graticule",
      "transform": [
        { "type": "graticule" }
      ]
    }
  ],

  "marks": [
    {
      "type": "shape",
      "from": {"data": "graticule"},
      "encode": {
        "update": {
          "strokeWidth": {"value": 1},
          "strokeDash": {"signal": "[+graticuleDash, +graticuleDash]"},
          "stroke": {"signal": "'#ddd'"},
          "fill": {"value": null}
        }
      },
      "transform": [
        { "type": "geoshape", "projection": "projection" }
      ]
    },
    {
      "type": "shape",
      "from": {"data": "world"},
      "encode": {
        "update": {
          "strokeWidth": {"signal": "+borderWidth"},
          "stroke": {"signal": "'#bbb'"},
          "fill": {"signal": "'#000'"},
          "zindex": {"value": 0}
        },
        "hover": {
          "strokeWidth": {"signal": "+borderWidth + 1"},
          "stroke": {"value": "firebrick"},
          "zindex": {"value": 1}
        }
      },
      "transform": [
        { "type": "geoshape", "projection": "projection" }
      ]
    }
  ]
}

const data = {
  world: mapData,
  graticule:  {
    "name": "graticule",
    "transform": [
      { "type": "graticule" }
    ]
  }
};
console.log(data)


function App() {
  return (
    <div className="App">
      <Vega spec={spec}/>
    </div>
  );
}

export default App;
