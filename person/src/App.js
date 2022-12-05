import './App.css';
import { AboutMe } from './subcomponent/AboutMe';
import { LineChart } from './subcomponent/LineChart';
import { ScatterPlot } from './subcomponent/ScatterPlot';
import { Provider  } from 'react-redux';
import { applyMiddleware, compose, createStore } from "redux";
import { configureStore } from '@reduxjs/toolkit'
import reducers from './reducers';


const store = createStore(reducers)

function App() {
  return (
    <Provider store={store}>
      <div className="App">
        <div className="grid grid-rows-2 grid-cols-2 h-screen w-screen divide-x-4 divide-y-4">
          <LineChart/>
          <AboutMe/>
          <div className="">
            c
          </div>
          <ScatterPlot/>
        </div>
      </div>
    </Provider>
  );
}

export default App;
