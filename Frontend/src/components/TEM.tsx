import React from 'react'
import axios from 'axios';
import { useState } from 'react';
import Getter from './Getter';


const TEM = ({baseURL, URL, result, funcset, symbol}) => {
    const [numbers, setnumbers] = useState("")
    axios.defaults.withCredentials = true


    //handling submitting mean
    async function A(numbers: String) {
      await axios.post(`${baseURL}/${URL}`, {
        numbers: numbers,
      }, {
        withCredentials: true,
        headers: {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'
    }})
      .then(function (response) {
        funcset(response.data.result);
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
    return (
    <>


      <form onSubmit={handleSubmit} id= "frm1" className="p-2">
        <input name= "numbers" id = "large-input" value = {numbers} placeholder='Type numbers separated by commas' className='mycenter block w-full md:p-5 p-2 text-sm md:text-2xl text-gray-900 border border-gray-300 rounded-lg bg-gray-50 sm:text-md focus:ring-blue-500 focus:border-blue-500' onChange={handleChange}>
        </input>
      
      <div className="card">
        <button onClick= {handleSubmit} className="text-black text-xl">
          {symbol} = {result}
        </button>
      </div>
      </form>
    </>
  )
}

export default TEM