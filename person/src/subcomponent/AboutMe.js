import { useState, useEffect } from 'react';
import { Slider, Radio, RadioGroup, FormControlLabel, TextField } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { reducers } from '../reducers';

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
    <div className="pt-10 pl-10">
      <input type="number" id="ambiguous_id"></input>
      <div className='text-2xl mb-10'>About You {'\n'}</div>
      <div className='text-left'>
        <div>Age : {age} years old</div>
        <div className="mx-20">
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
          <FormControlLabel value="female" control={<Radio />} label="Female" />
          <FormControlLabel value="male" control={<Radio />} label="Male" />
          <FormControlLabel value="other" control={<Radio />} label="Other" />
        </RadioGroup>
        <div className='grid grid-rows-2 grid-cols-2 h-full w-full mt-10'>
          <div>
            <div>GDP</div>
            <TextField
              inputProps={{
                step: 1000,
              }}
              type="number"
              placeholder="your gdp"
              helperText="Value bigger than 0 "
              defaultValue={gdp}
              onChange={d => setMe('gdp', d.target.value)}
            />
          </div>
          <div>
            <div>Health</div>
            <TextField
              inputProps={{
                step: 0.05,
              }}
              type="number"
              placeholder="your health"
              helperText="Value bigger than 0 "
              defaultValue={health}
              onChange={d => setMe('health', d.target.value)}
            />
          </div>
          <div>
            <div>Happiness</div>
            <TextField
              type="number"
              inputProps={{
                step: 0.1,
              }}
              placeholder="your happiness"
              helperText="Value between 0 and 10"
              defaultValue={happy}
              onChange={d => setMe('happy', d.target.value)}
            />
          </div>
          <div>
            <div>Alcohol Consumption</div>
            <TextField
              inputProps={{
                step: 5,
              }}
              type="number"
              placeholder="your alcohol consumption"
              helperText="Value bigger than 0 "
              defaultValue={alcohol}
              onChange={d => setMe('alcohol', d.target.value)}
            />
          </div>
        </div>
      </div>
    </div>
  )
}