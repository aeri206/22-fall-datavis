import { useState, useEffect } from 'react';
import { Slider, Radio, RadioGroup, FormControlLabel, TextField, Tooltip, IconButton } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { reducers } from '../reducers';
import HelpIcon from '@mui/icons-material/Help';

const selectList = ["alcohol-use", "alcohol-frequency", "marijuana-use", "marijuana-frequency"];


export function AboutMe() {
  const dispatch = useDispatch();
  const { age, gender, gdp, health, happy, alcohol } = useSelector(state => state)
  const setMe = (name, key) => {
    dispatch(reducers({type: name, payload: key}))
  }
  const [age_, setAge] = useState(20)
  useEffect(()=>{
    setMe('age', age_)
  }, [age_])
  return (
    <div className="text-sm">
      <div className='text-xl my-3'>About You</div>
      <div className='text-left ml-10'>
        <div>Age : {age} years old</div>
        <div className="ml-10 mr-20">
          <Slider
            aria-label="Restricted values"
            defaultValue={20}
            min={1}
            max={100}
            getAriaValueText={d => setAge(d)}
            step={1}
            valueLabelDisplay="auto"
            marks={[
              {
              value: 1,
              label: '1',
              },
              {
                value: 100,
                label: '100',
              }
            ]}
          />
        </div>
        <div>Gender</div>
        <RadioGroup row defaultValue={gender} onChange={d => setMe('gender', d.target.value)}>
          <FormControlLabel value="female" control={<Radio color="success" size="small"/>} label="Female" />
          <FormControlLabel value="male" control={<Radio color="success" size="small"/>} label="Male" />
          <FormControlLabel value="other" control={<Radio color="success" size="small"/>} label="Other" />
        </RadioGroup>
        <div className='grid grid-rows-2 grid-cols-2 h-full w-full gap-2'>
          <div>
            <div>GDP</div>
            <TextField
              size="small"
              inputProps={{
                step: 1000,
              }}
              type="number"
              placeholder="your gdp"
              defaultValue={gdp}
              onChange={d => setMe('gdp', d.target.value)}
            />
            <Tooltip title={<span className='whitespace-pre-line'>{"Gross domestic product (GDP),\n a monetary measure of the market value\nin a specific time period."}</span>}>
              <IconButton>
                <HelpIcon />
              </IconButton>
            </Tooltip>
          </div>
          <div>
            <div>Health</div>
            <TextField
              size="small"
              inputProps={{
                step: 0.05,
              }}
              type="number"
              placeholder="your health"
              defaultValue={health}
              onChange={d => setMe('health', d.target.value)}
            />
            <Tooltip title="A state of complete physical, mental and social well-being ">
              <IconButton>
                <HelpIcon />
              </IconButton>
            </Tooltip>
          </div>
          <div>
            <div>Happiness</div>
            <TextField
              size="small"
              type="number"
              inputProps={{
                step: 0.1,
              }}
              placeholder="your happiness"
              defaultValue={happy}
              onChange={d => setMe('happy', d.target.value)}
            />
            <Tooltip title={<span className='whitespace-pre-line'>{"Positive or pleasant emotions ranging\nfrom contentment to intense joy"}</span>}>
              <IconButton>
                <HelpIcon />
              </IconButton>
            </Tooltip>
          </div>
          <div>
            <div>Alcohol Consumption</div>
            <TextField
              size="small"
              inputProps={{
                step: 5,
              }}
              type="number"
              placeholder="your alcohol consumption"
              defaultValue={alcohol}
              onChange={d => setMe('alcohol', d.target.value)}
            />
            <Tooltip title={<span className='whitespace-pre-line'>{"One of the most widely used recreational drugs \n in the world"}</span>}>
              <IconButton>
                <HelpIcon />
              </IconButton>
            </Tooltip>
          </div>
        </div>
      </div>
    </div>
  )
}