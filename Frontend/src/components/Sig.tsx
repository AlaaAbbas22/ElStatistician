import React from 'react'
import axios from 'axios'
import { useState } from 'react'
import SIGCSV from './SIGCSV'
import log from "../../public/El statistician (3).png"


const SIG = ({ baseURL }) => {
      // setting vars
  const [p, setp] = useState(0)
  const [g, setg] = useState(0)
  const [tails, settails] = useState("2")
  const [res, setres] = useState("The test is not done yet")
  const [Siglevel, setSiglevel] = useState(5)
  const [numbers, setnumbers] = useState("")
  const [numbers2, setnumbers2] = useState("")


  //handling submitting confidence intervals
  async function A() {
    await axios.post(`${baseURL}/sig`, {
      numbers1: numbers,
      numbers2: numbers2,
      Siglevel: Siglevel,
      tails: tails,
    })
    .then(function (response) {
      setp(response.data.result[0]);
      setg(response.data.result[1]);
      setres(response.data.result[2]);
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
  const handleChange2 = (e: React.ChangeEvent<HTMLInputElement>) => {
    setnumbers2(e.target.value)
  }
  const handleChangeSiglevel = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSiglevel(e.target.value)
  }
  const [csvor, setcsvor] = useState("")
  return (
    <>
      <div className="md:mx-40 mb-20" >
      <div>
            <img src={log} className='mx-auto object-contain rounded-full w-80' alt="Logo" />
        </div>

        <h1>Difference of Two Means</h1>

        <select value={csvor} onChange={(e)=>{setcsvor(e.target.value)}} className='text-black m-2'>
          <option value=""></option>
          <option value="Numbers">Enter the numbers manually</option>
          <option value="CSV">Import datasets from CSV files</option>
        </select> 

        {csvor=="Numbers"&&<form onSubmit={handleSubmit} id= "frm1" className="p-2">
            <div className='grid md:grid-cols-9 grid-cols-4  gap-4'>
                <div className='col-span-4'>
                    <h2 className='text-4xl p-2'>Sample 1</h2>
                    <input name= "numbers" id = "large-input" value = {numbers} placeholder='Type numbers separated by commas' className='mycenter block w-full  md:p-5 p-2 text-sm md:text-2xl text-gray-900 border border-gray-300 rounded-lg bg-gray-50 sm:text-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500' onChange={handleChange}>
                    </input>
                </div>
                <h2 className='text-6xl text-center py-5 md:col-span-1 col-span-4'>VS</h2>
                <div className='col-span-4'>
                    <h2 className='text-4xl p-2'>Sample 2</h2>
                    <input name= "numbers2" id = "large-input2" value = {numbers2} placeholder='Type numbers separated by commas' className='mycenter block w-full  md:p-5 p-2 text-sm md:text-2xl text-gray-900 border border-gray-300 rounded-lg bg-gray-50 sm:text-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500' onChange={handleChange2}>
                    </input>
                </div>
          </div>
          <div className='p-2'>
            <label for="Sig-leve"> Significance level (α) = </label> 
            <input className='w-[30px] text-black mycenter' value={Siglevel} max="100" min="0" onChange={handleChangeSiglevel} type='number' id="confidence-level"/> %<br/><br/>
            <select id="tails" value={tails} onChange={(e)=>{settails(e.target.value)}} className='text-black p-2'>
                <option value=">">1-tailed test (H1: Sample1 &#62; Sample2)</option>
                <option value="<">1-tailed test (H1: Sample1 &#60; Sample2)</option>
                <option value="2">2-tailed test (H1: Sample1 &#8800; Sample2)</option>
            </select>
          </div>
            
        <div className="card">
          <button onClick= {handleSubmit} className="text-black text-xl">
            p-value = {p} <br/>
            Hedge's g = {g}
          </button>
          <h2>{res}</h2>
        </div>
        </form>}
        {csvor=="CSV"&&<SIGCSV  baseURL={baseURL} URL="sig"/>}
      </div>

    </>
  )
}

export default SIG