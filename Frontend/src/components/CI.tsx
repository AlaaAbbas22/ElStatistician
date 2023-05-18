import React from 'react'
import axios from 'axios'
import { useState } from 'react'
import CICSV from './CICSV'
import log from "../../public/El statistician (3).png"



const CI = ({ baseURL }:{ baseURL: String}) => {
      // setting vars
  const [ci, setci] = useState("[0,0]")
  const [conlevel, setConlevel] = useState(95)
  const [numbers, setnumbers] = useState("")
  const [csvor, setcsvor] = useState("")

  //handling submitting confidence intervals
  async function A() {
    await axios.post(`${baseURL}/ci`, {
      numbers: numbers,
      conlevel: conlevel,
    })
    .then(function (response) {
      setci(response.data.result);
      console.log(response.data.result)
    })
    .catch(function (error) {
      console.log(error);
    });
  }
  const handleSubmit = (e: React.FormEvent) =>{
    A()
    e.preventDefault();
  }
  //writing more numbers
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setnumbers(e.target.value)
  }
  const handleChangeConlevel = (e: any) => {
    setConlevel(e.target.value)
  }
  const [cicsv, setcicsv] = useState("[0,0]")
  return (
    <>
      <div className="md:mx-40 mb-20" >
      <div>
            <img src={log} className='mx-auto object-contain rounded-full w-80' alt="Logo" />
        </div>

        <h1>Confidence Intervals</h1>

        <select value={csvor} onChange={(e)=>{setcsvor(e.target.value)}} className='text-black m-2'>
          <option value=""></option>
          <option value="Numbers">Enter the numbers manually</option>
          <option value="CSV">Import a dataset from CSV file</option>
        </select>
        {csvor=="Numbers"&&<form onSubmit={handleSubmit} id= "frm1" className="p-2">
          <input name= "numbers" id = "large-input" value = {numbers} placeholder='Type numbers separated by commas' className='mycenter block w-full md:p-5 p-2 text-sm md:text-2xl text-gray-900 border border-gray-300 rounded-lg bg-gray-50 sm:text-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500' onChange={handleChange}>
          </input>
          <div className='p-2'>
            <label htmlFor="confidence-leve"> Confidence level = </label> 
            <input className='w-[30px] text-black mycenter' value={conlevel} max="100" min="0" onChange={handleChangeConlevel} type='number' id="confidence-level"/> %
          </div>
        
        <div className="card">
          <button onClick= {handleSubmit} className="text-black text-xl">
            CI = {ci != "[-inf, inf]"&&ci || `[-∞,∞]`}
          </button>
        </div>
        </form>}
        {csvor=="CSV"&&<CICSV  baseURL={baseURL} result={cicsv} funcset={setcicsv} URL="ci" name="Confidence interval"/>}
      </div>

    </>
  )
}

export default CI