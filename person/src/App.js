import './App.css';
import { AboutMe } from './subcomponent/AboutMe';
import { LineChart } from './subcomponent/LineChart';
import { ScatterPlot } from './subcomponent/ScatterPlot';
import { Provider  } from 'react-redux';
import { applyMiddleware, compose, createStore } from "redux";
import { configureStore } from '@reduxjs/toolkit'
import reducers from './reducers';
import { Paper } from '@mui/material';


const store = createStore(reducers)

function App() {
  return (
    <Provider store={store}>
      <div className="App">
        <div className="grid grid-rows-2 grid-cols-2 h-screen w-screen py-6 px-6 gap-5 bg-slate-300">
        <Paper elevation={3}>
          <AboutMe/>
        </Paper>
        <Paper elevation={3}>
          <LineChart/>
        </Paper>
        <Paper elevation={3}>
          <div className="">
            c
          </div>
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
