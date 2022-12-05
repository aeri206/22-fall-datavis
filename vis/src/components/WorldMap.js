
import { Vega } from 'react-vega';
import { useEffect, useState, useRef } from 'react';
import { Select, Grid, Box, Grommet } from 'grommet';
import { DataTable, Meter, Text } from 'grommet';

import { data2015, data2018, data2010 } from '../data/data';
import Scatter from "./Scatter";

import embed from 'vega-embed';

import Papa from "papaparse"







export function WorldMap(){
    const [year, setYear] = useState('2018');
    const [alcoholType, setAlcoholType] = useState('beer');
    const [countryId, setCountryID] = useState();

    const [data, setData] = useState(data2018)


    
    

    let spec = {
        "$schema": "https://vega.github.io/schema/vega/v5.json",
        "description": "A configurable map of countries of the world.",
        "width": 950,
        "height": 500,
        "autosize": "none",
      
        "signals": [
        //   { "name": "scale", "value": 150,},
         {"name": "alcoholType", "value": alcoholType},
          { "name": "graticuleDash", "value": 0},
          { "name": "borderWidth", "value": 1 },
          { "name": "background", "value": "#ffffff"},
          { "name": "tx", "update": "width / 2" },
    { "name": "ty", "update": "height / 2" },
    {
      "name": "scale",
      "value": 150,
      "on": [{
        "events": {"type": "wheel", "consume": true},
        "update": "clamp(scale * pow(1.0005, -event.deltaY * pow(16, event.deltaMode)), 150, 3000)"
      }]
    },
    {
      "name": "angles",
      "value": [0, 0],
      "on": [{
        "events": "mousedown",
        "update": "[rotateX, centerY]"
      }]
    },
    {
      "name": "cloned",
      "value": null,
      "on": [{
        "events": "mousedown",
        "update": "copy('projection')"
      }]
    },
    {
      "name": "start",
      "value": null,
      "on": [{
        "events": "mousedown",
        "update": "invert(cloned, xy())"
      }]
    },
    {
      "name": "drag", "value": null,
      "on": [{
        "events": "[mousedown, window:mouseup] > window:mousemove",
        "update": "invert(cloned, xy())"
      }]
    },
    {
      "name": "delta", "value": null,
      "on": [{
        "events": {"signal": "drag"},
        "update": "[drag[0] - start[0], start[1] - drag[1]]"
      }]
    },
    {
      "name": "rotateX", "value": 0,
      "on": [{
        "events": {"signal": "delta"},
        "update": "angles[0] + delta[0]"
      }]
    },
    {
      "name": "centerY", "value": 0,
      "on": [{
        "events": {"signal": "delta"},
        "update": "clamp(angles[1] + delta[1], -60, 60)"
      }]
    }
        ],
      
        "projections": [
          {
            "name": "projection",
            "type": "equirectangular",
            "scale": {"signal": "scale"},
            "rotate": [{"signal": "rotateX"}, 0, 0],
            "center": [0, {"signal": "centerY"}],
            "translate": [{"signal": "tx"}, {"signal": "ty"}]
          }
        ],
      
        "data": [
          {
            "name": "drink",
            "url": `http://147.46.240.50:4999/alcohol_${year}.tsv`,
            "format": {"type": "tsv", "parse": "auto"},
          },
          {"name": "code",
          "url": "http://147.46.240.50:4999/code.tsv",
          "format": {"type": "tsv", "parse": "auto"},

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
                { "type": "lookup", "from": "code", "key": "id", "fields": ["id"], "values": ["name"], "as": ["country"]},
              { "type": "lookup", "from": "drink", "key": "id", "fields": ["id"], "values": ["wine", "beer", "sprites", "total"] },
            //   { "type": "filter", "expr": "datum.wine != null" }
              
            ]
          },
          {
            "name": "graticule",
            "transform": [
              { "type": "graticule" }
            ]
          }
        ],
        "scales": [{
          "name": "color",
          "type": "linear",
          "domain": {"data": "world", "field": {"signal": "alcoholType"}},
          // "domain":  "[wine_min, wine_max]",
          "range": {"scheme": "blues", "count": 7}
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
                "tooltip": [{
                  "signal":`{country: datum.country, ${alcoholType}: format(datum[alcoholType], '.2f')}`

                //   , \"Country\": format(datum[Country], \"\")
                //    "format(datum[alcoholType], '.2f')"
                  
                },
                // {"signal": "datum.country"}
            ]
              },
              "update": {
                "strokeWidth": {"signal": "+borderWidth"},
                "stroke": {"signal": "'#bbb'"},
                // "fill": {"signal": "'#000'"},
                "fill": [
                  {
                    "test": `datum.${alcoholType} === null`,
                    "value": "#ebebeb"
                  },
                  {"scale": "color", "field": {"signal": "alcoholType"}}],
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

      let pieSpec = {
        "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
        "description": "A simple pie chart with embedded data.",
        "data": {
            "url": "http://147.46.240.50:4999/alcohol_share.csv",
        },
        
        "mark": {"type": "arc", "tooltip": true},
        
        "encoding": {
            "theta": {"field": "Drinks", "type": "quantitative"},
    "color": {"field": "Type", "type": "nominal"}
        }
      }
       
    const handleYearChange = (e) => {
    setYear(e.target.value);
    if (e.target.value === 2010) {
        setData(data2010);
    } else if (e.target.value === 2015) {
        setData(data2015);
    } else if (e.target.value === 2018) {
        setData(data2018);
    }
}
    const handleAlcoholTypeChange = (e) => {
        setAlcoholType(e.target.value);
}
      

      useEffect(() => {

        
        (function() {
          
          return embed('#world-map', spec, {"mode": "vega", "actions": false, "display": "inline"});
        })().then(result => {
            result.view.addEventListener('click', (_, item) => {
                if (item) {
                    if (item.datum.id){
                        setCountryID(item.datum.id);
                        pieSpec["transform"] = [
                            {"filter": {"field": "id", "equal": item.datum.id}}
                        ]   
                        embed('#pie-chart', pieSpec, {"mode": "vega-lite", "actions": false, "padding": {"top": 30, "right": 0}});
                    }
                    
                }
    
          })
          
        });    
      }, []);

    return(
            <Grid
            margin='medium'
            rows={['40px', '450px', '700px' ]}
            columns={['630px','320px', '']}
            gap="small"
            areas={[
              { name: 'main', start: [0, 0], end: [1, 1]},
              { name: 'nav', start: [2, 0], end: [2, 0] },
              { name: 'pie', start: [2, 1], end: [2, 1] },
              { name: 'list', start: [0, 2], end: [0, 2]},
              { name: 'scatter', start: [1, 2], end: [2, 2]},

            ]}
          >
            <Box gridArea="nav"  elevation='small' style={{'display':'inline'}}>
            <Box width="40%" style={{display: 'inline-block'}}>
                <Select
      options={['2010', '2015', '2018']}
      value={year}
      onChange={handleYearChange}
      plain={true}
      width='small'
    //   margin='xsmall'
    />
    </Box>
    <Box width="40%" style={{display: 'inline-block'}}>
    <Select
      options={['beer', 'wine', 'sprites', 'total']}
      value={alcoholType}
      onChange={handleAlcoholTypeChange}
      plain
      width='small'
    //   margin="xsmall"
    />
    </Box>
    </Box>
    <Box gridArea='main' id='world-map' elevation='medium'>
            {/* <Vega style={{'display': 'inline'}} spec={spec} actions={false}/> */}
            </Box>
            <Box gridArea='pie' id='pie-chart' elevation='medium'></Box>
            <Box gridArea='list' elevation='medium'>
                <Grommet theme={{
                    dataTable: {
                        body: {
                            container: {extend: () => `height: 300px`}
                        },
                        size: 'medium',
                        pinned: {
                            header: {
                              background: {color: 'light-2'},
                              extend: 'box-shadow: 0px 2px 2px rgba(0, 0, 0, 0.2); font-weight: 600',

                            },
                        }
                        
                    }
                }}>
                <DataTable sortable={true} pin={true} step={17}
                
                background={
                    {
                        body: ["white", "light-2"],
                        footer: { dark: "light-2", light: "dark-3" }
                      }
                }
                paginate={true} columns={[
                    {property: 'Country', header: 'Country'},
                    
                    {property: 'beer', header: 'Beer'},
                    {property: 'wine', header: 'Wine'},
                    {property: 'sprites', header: 'Sprites'}
                ]} data={data} />
                </Grommet>
            </Box>
            <Box gridArea='scatter' elevation='medium'>
            <Scatter  />
            </Box>
            </Grid>
        
    )

}