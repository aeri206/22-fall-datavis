import './App.css';
import { WorldMap } from './components/WorldMap';



function App() {
  return (
    <div className="App" style={{'position': 'absoulte', 'top': 0, 'backgroundColor':'rgb(203 213 225)'}}>
      <WorldMap />
    </div>
  );
}

export default App;
