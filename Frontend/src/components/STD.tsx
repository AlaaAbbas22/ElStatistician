import React from 'react'
import axios from 'axios'
import { useState } from 'react'
import CSVSTD from './CSVSTD'
import log from "../../public/El statistician (3).png"


const STD = ({ baseURL }: {baseURL: any}) => {
      // setting vars
  const [std, setstd] = useState(0)
  const [sample, setSample] = useState("Sample")
  const [numbers, setnumbers] = useState("")

  //handling submitting mode
  async function A(numbers: String) {
    await axios.post(`${baseURL}/std`, {
      numbers: numbers,
      sample: (sample == "Sample" && 1 || 0),
    })
    .then(function (response) {
      setstd(response.data.result);
    })
    .catch(function (error) {
      console.log(error);
    });
  }
  const handleSubmit = (e: React.FormEvent) =>{
    A(numbers)
    e.preventDefault();
  }
  

  
  //writing more numbers
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setnumbers(e.target.value)
  }

  const [stdcsv, setstdcsv] = useState(0)
  const [csvor, setcsvor] = useState("")
  return (
    <>
    <div className="md:mx-40 mb-20" >
      

    <div>
            <img src={log} className='mx-auto object-contain rounded-full w-80' alt="Logo" />
        </div>

        <h1>Standard Deviation</h1>

        <select value={csvor} onChange={(e)=>{setcsvor(e.target.value)}} className='text-black m-2'>
          <option value=""></option>
          <option value="Numbers">Enter the numbers manually</option>
          <option value="CSV">Import a dataset from CSV file</option>
        </select> 
        
        {csvor=="Numbers"&&<form onSubmit={handleSubmit} id= "frm1" className="p-2">
          <input name= "numbers" id = "large-input" value = {numbers} placeholder='Type numbers separated by commas' className='mycenter block w-full md:p-5 p-2 text-sm md:text-2xl text-gray-900 border border-gray-300 rounded-lg bg-gray-50 sm:text-md focus:ring-blue-500 focus:border-blue-500' onChange={handleChange}>
          </input><br></br> 
          <select id='Sample?' value={sample} className='text-gray-900' onChange={(e)=>{setSample(e.target.value)}}>
            <option value="Sample">Sample</option>
            <option value="Population">Population</option>
          </select>
          <div className="card">
            <button onClick= {handleSubmit} className="text-black text-xl">
              {sample=="Sample"&&"s" || "σ"} = {std}
            </button>
          </div>
        </form>}
        {csvor=="CSV"&&<CSVSTD  baseURL={baseURL} result={stdcsv} funcset={setstdcsv} URL="std" name="Standard Deviation"/>}
      </div>
    </>
  )
}

export default STD