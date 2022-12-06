
import { Vega } from 'react-vega';
import { useEffect, useState } from 'react';
import { Select, Grid, Box, Grommet, DataTable, Heading } from 'grommet';

import { data2015, data2018, data2010, code } from '../data/data';
import Scatter from "./Scatter";
import './WorldMap.css';

import embed from 'vega-embed';







export function WorldMap(){
    const [year, setYear] = useState('2018');
    const [alcoholType, setAlcoholType] = useState('beer');
    const [countryId, setCountryID] = useState();

    const [data, setData] = useState(data2018)



    let spec = {
        "$schema": "https://vega.github.io/schema/vega/v5.json",
        "description": "A configurable map of countries of the world.",
        "width": 950,
        "height": 450,
        "padding": {"top": 20, "left": 0, "bottom": 0, "right": 0},
      
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
                { "type": "lookup", "from": "code", "key": "id", "fields": ["id"], "values": ["name"]},
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
          "range": {"scheme": "blues"}
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
                  "signal":`{country: datum.name, ${alcoholType}: format(datum[alcoholType], '.2f')}`

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
        "data": {
            "url": "http://147.46.240.50:4999/alcohol_share.csv",
        },
        "width": "container",
        "height": 180,
        
        "mark": {"type": "arc", "tooltip": true},
        
        "encoding": {
            "theta": {"field": "Drinks", "type": "quantitative"},
            "color": {"field": "Type", "type": "nominal"}
        }
      }

      let lineSpec = {
        "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
        "mark": {
          "type": "line",
          "point": true
        },
        "width": 'container',
        "height": 150,

        "encoding": {
          "x": {"field": "year", "type": "ordinal", "axis": {"labelAngle": 0}},
          "y": {"field": "alcohol consumption per capita", "type": "quantitative"},
          "color": {"field": "type", "type": "nominal"},
          "tooltip": [
            {"field": "type", "type": "nominal"},
            {"field": "alcohol consumption per capita", "type": "quantitative", "title": "consumption"}
          ]
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
                        embed('#pie-chart', pieSpec, {"mode": "vega-lite", "actions": false, "padding": {"top": 15, "right": 10, "bottom": 10}});
                        // TODO ; embed line chart
                        let lineData = []
                        if (data2010.find(x => x.id == item.datum.id)) {
                          let res = data2010.find(x => x.id == item.datum.id);
                          lineData.push(...[
                            {country: res.country, year: 2010, 'alcohol consumption per capita': res.beer, type: 'beer'},
                            {country: res.country, year: 2010, 'alcohol consumption per capita': res.wine, type: 'wine'},
                            {country: res.country, year: 2010, 'alcohol consumption per capita': res.sprites, type: 'sprites'}
                          ]);
                        }
                        if (data2015.find(x => x.id == item.datum.id)) {
                          let res = data2015.find(x => x.id == item.datum.id);
                          lineData.push(...[
                            {country: res.country, year: 2015, 'alcohol consumption per capita': res.beer, type: 'beer'},
                            {country: res.country, year: 2015, 'alcohol consumption per capita': res.wine, type: 'wine'},
                            {country: res.country, year: 2015, 'alcohol consumption per capita': res.sprites, type: 'sprites'}
                          ]);

                        }
                        if (data2018.find(x => x.id == item.datum.id)) {
                          let res = data2018.find(x => x.id == item.datum.id);
                          lineData.push(...[
                            {country: res.country, year: 2018, 'alcohol consumption per capita': res.beer, type: 'beer'},
                            {country: res.country, year: 2018, 'alcohol consumption per capita': res.wine, type: 'wine'},
                            {country: res.country, year: 2018, 'alcohol consumption per capita': res.sprites, type: 'sprites'}
                          ]);
                        };
                        lineSpec["data"] = {"values": lineData};
                        embed('#line-chart', lineSpec, {"mode": "vega-lite", "actions": false, "width": 300} );
                        
                    }
                    
                }
    
          })
          
        });    
      }, [year, alcoholType]);

    return(
            <Grid
            gap="1.25rem"
            // margin={{top: 0, bottom: 0, left: 'medium', right: 'medium'}}
            style={{paddingTop: '24px', paddingBottom: '24px', 'margin': '0 24px 0 24px'}}
            rows={['40px', '450px', '700px' ]}
            columns={['630px','320px', '']}
            areas={[
              { name: 'main', start: [0, 0], end: [1, 1]},
              { name: 'nav', start: [2, 0], end: [2, 0] },
              { name: 'pie', start: [2, 1], end: [2, 1] },
              { name: 'list', start: [0, 2], end: [0, 2]},
              { name: 'scatter', start: [1, 2], end: [2, 2]},

            ]}
          >
    
    <Box gridArea='main' round="xsmall" id='world-map' elevation='medium' background="white"></Box>
    <Box background="white" round="xsmall" gridArea="nav" elevation='small' style={{'display':'inline'}}>
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
            <Box background="white" round="xsmall" gridArea='pie' elevation='medium'>
            <Heading style={{paddingTop: 10}}margin="none" level={4}>{
                countryId ? code.find(x => x.id == countryId).name : ''
            }</Heading>
              <Box id='pie-chart' />
              <Box id='line-chart' />
            </Box>
            <Box gridArea='list' elevation='medium' background="white" round="xsmall">
                <Grommet theme={{
                    dataTable: {
                        body: {
                            container: {extend: () => `height: 300px; font-size: 15px;`},
                        },
                        header: {font: {size: '15px'}},
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
                    {property: 'country', header: 'Country', size:'300px'},
                    
                    {property: 'beer', header: 'Beer'},
                    {property: 'wine', header: 'Wine'},
                    {property: 'sprites', header: 'Sprites'},
                    {property: 'total', header: 'Total', render: datum => {return (datum.total? datum.total.toFixed(2) : '')}}
                ]} data={data} />
                </Grommet>
            </Box>
            <Box background="white" round="xsmall" gridArea='scatter' elevation='medium'>
            <Scatter  />
            </Box>
            </Grid>
        
    )

}