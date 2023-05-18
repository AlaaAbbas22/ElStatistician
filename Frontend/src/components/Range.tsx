import { useState } from 'react'
import CSV from './CSV'
import TEM from './TEM'
import log from "../../public/El statistician (3).png"

const Range = ({ baseURL }) => {
      // setting vars
  const [range, setrange] = useState(0)
  const [rangecsv, setrangecsv] = useState(0)
  const [csvor, setcsvor] = useState("")
  return (
    <>
    <div className="md:mx-40 mb-20" >
    <div>
            <img src={log} className='mx-auto object-contain rounded-full w-80' alt="Logo" />
        </div>

        <h1>Range</h1>

        <select value={csvor} onChange={(e)=>{setcsvor(e.target.value)}} className='text-black m-2'>
          <option value=""></option>
          <option value="Numbers">Enter the numbers manually</option>
          <option value="CSV">Import a dataset from CSV file</option>
        </select>  
      {csvor=="Numbers"&&<TEM baseURL={baseURL} result={range} funcset={setrange} URL="range" symbol="Range"/>}
      {csvor=="CSV"&&<CSV  baseURL={baseURL} result={rangecsv} funcset={setrangecsv} URL="range" symbol="Range" name="Range"/>}
    </div>
    </>
  )
}

export default Range