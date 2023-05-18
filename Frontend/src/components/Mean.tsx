
import { useState } from 'react'
import CSV from './CSV'
import TEM from './TEM'
import log from "../../public/El statistician (3).png"

const Mean = ({ baseURL }: {baseURL: String}) => {
      // setting vars
  const [mean, setmean] = useState(0)
  const [meancsv, setmeancsv] = useState(0)
  const [csvor, setcsvor] = useState("")

  
  return (
    <>
      <div className="md:mx-40 mb-20" >
      <div>
            <img src={log} className='mx-auto object-contain rounded-full w-80' alt="Logo" />
        </div>
      <h1>Mean</h1>

        <select value={csvor} onChange={(e)=>{setcsvor(e.target.value)}} className='text-black m-2'>
          <option value=""></option>
          <option value="Numbers">Enter the numbers manually</option>
          <option value="CSV">Import a dataset from CSV file</option>
        </select>

        {csvor == "Numbers"&&<TEM baseURL={baseURL} result={mean} funcset={setmean} URL="mean" symbol="x̄"/>}
        {csvor == "CSV"&&<CSV  baseURL={baseURL} result={meancsv} funcset={setmeancsv} URL="mean" name="Mean" symbol="x̄"/>}
      </div>
    </>
  )
}

export default Mean