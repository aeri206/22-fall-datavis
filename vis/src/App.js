import './App.css';
import { Vega } from 'react-vega';


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
    { "name": "scale", "value": 150,
   },
    { "name": "rotate0", "value": 0},
    { "name": "rotate1", "value": 0},
    { "name": "rotate2", "value": 0},
    { "name": "center0", "value": 0},
    { "name": "center1", "value": 0},
    { "name": "translate0", "update": "width / 2" },
    { "name": "translate1", "update": "height / 2" },

    { "name": "graticuleDash", "value": 0},
    { "name": "borderWidth", "value": 1 },
    { "name": "background", "value": "#ffffff"},
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

  "scales": [{
    "name": "color",
    "type": "linear",
    "domain": [0, 400],
    "range": {"scheme": "blues", "count": 7}
  }

  ],

  "data": [
    {
      "name": "drink",
      "url": "http://147.46.240.50:4999/typepercountry.tsv",
      "format": {"type": "tsv", "parse": "auto"}

    },
    {
      "name": "world",
      "url": "http://147.46.240.50:4999/world-110m.json",
      // "url": "https://vega.github.io/editor/data/world-110m.json",
      "format": {
        "type": "topojson",
        "feature": "countries"
      },
      "transform": [
        { "type": "lookup", "from": "drink", "key": "id", "fields": ["id"], "values": ["wine"] },
        { "type": "filter", "expr": "datum.wine != null" }

      ]
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
        "enter": {
          "tooltip": {
            "signal": "format(datum.wine, '.2f')"
          }
        },
        "update": {
          "strokeWidth": {"signal": "+borderWidth"},
          "stroke": {"signal": "'#bbb'"},
          // "fill": {"signal": "'#000'"},
          "fill": {"scale": "color", "field": "wine"},
          "zindex": {"value": 0}
        },
        "hover": {
          "strokeWidth": {"signal": "+borderWidth + 1"},
          "stroke": {"value": "firebrick"},
          "fill": {"value": "red"},

          "zindex": {"value": 1}
        }
      },
      "transform": [
        { "type": "geoshape", "projection": "projection" }
      ]
    }
  ]
}



function App() {
  return (
    <div className="App">
      <Vega spec={spec}/>
    </div>
  );
}

export default App;
