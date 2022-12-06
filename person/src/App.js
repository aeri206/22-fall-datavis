import './App.css';
import { AboutMe } from './subcomponent/AboutMe';
import { LineChart } from './subcomponent/LineChart';
import { ScatterPlot } from './subcomponent/ScatterPlot';
import { Scatter } from './subcomponent/Scatter';
import { Provider  } from 'react-redux';
import { applyMiddleware, compose, createStore } from "redux";
import { configureStore } from '@reduxjs/toolkit'
import reducers from './reducers';
import { Paper } from '@mui/material';
import {Nav, Anchor, Heading} from 'grommet';
import { Map } from 'grommet-icons';


const store = createStore(reducers)

function App() {
  return (
    <Provider store={store}>
      <Nav direction="row" background="brand" height="55px" pad="xxsmall" style={{paddingLeft: 30}} >
        <Heading level={4} margin="small">Drink Expedition</Heading>
        <Anchor href="http://gpu.hcil.snu.ac.kr:8888/" icon={<Map />} style={{marginLeft: 'auto', marginRight: '15px'}}/>
        {/* <Anchor href="http://gpu.hcil.snu.ac.kr:8890/" icon={<User />} style={{marginLeft: 'auto', marginRight: '25px'}}/> */}
    </Nav>  
      <div className="App">
        <div className="grid grid-rows-2 grid-cols-2 h-screen w-screen py-3 px-6 gap-5 bg-slate-300">
        <Paper elevation={3}>
          <AboutMe/>
        </Paper>
        <Paper elevation={3}>
          <LineChart/>
        </Paper>
        <Paper elevation={3}>
          <Scatter />
        </Paper>
        <Paper elevation={3}>
          <ScatterPlot/>
        </Paper>
        </div>
      </div>
    </Provider>
  );
}

export default App;
