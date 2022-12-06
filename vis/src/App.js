import './App.css';
import { WorldMap } from './components/WorldMap';
import { Nav, Anchor, Heading} from 'grommet';
import { Map, User } from 'grommet-icons';



function App() {
  return (
    <div className="App" style={{'position': 'absoulte', 'top': 0, 'backgroundColor':'rgb(203 213 225)'}}>
      <Nav direction="row" background="brand" height="55px" pad="xxsmall" style={{paddingLeft: 30}} >
        <Heading level={4} margin="small">Drink Expedition</Heading>
        {/* <Anchor href="./" icon={<Map />} style={{marginLeft: 'auto'}}/> */}
        <Anchor href="http://gpu.hcil.snu.ac.kr:8890/" icon={<User />} style={{marginLeft: 'auto', marginRight: '25px'}}/>
    </Nav>  
      <WorldMap />
    </div>
  );
}

export default App;
