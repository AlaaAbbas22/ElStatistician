import React from 'react'
import axios from 'axios'
import { useState, useEffect } from 'react'


const CICSV = ({baseURL, result, funcset, name, URL}: {baseURL: String, result: any, funcset: Function|any, name: String, URL: String}) => {
    const [filter, setFilter] = useState(false)
    const [filterBy, setfilterBy] = useState("")
    const [HowFilter, setHowFilter] = useState(">")
    const [comparison, setcomparison] = useState("")
    const [columnsOrg, setcolumnsOrg] = useState([<option value={"Enter a valid URL for CSV file"}> {"Enter a valid URL for CSV file"} </option>])
    const [csv, setcsv] = useState("")
    const [column, setcolumn] = useState("")
    const [conlevel2, setConlevel2] = useState("95")
    
      //submitting csv
      async function submitcsv() {
        if (filter){
          await axios.post(`${baseURL}/${URL}`, {
            csv: csv,
            column: column,
            filterBy: filterBy,
            HowFilter: HowFilter,
            comparison: comparison,
            conlevel2: conlevel2,
          })
        .then(function (response) {
          funcset(response.data.result);
        })
        .catch(function (error) {
          console.log(error);
        })
        }  else {
          await axios.post(`${baseURL}/${URL}`, {
            csv: csv,
            column: column,
            conlevel2: conlevel2,
          })
        .then(function (response) {
          funcset(response.data.result);
        })
        .catch(function (error) {
          console.log(error);
        })};
      }
  
    async function importColumns(csv: String) {
      await axios.post(`${baseURL}/getcolumns`, {
        csv: csv,
      })
      .then(function (response) {
        
        let newcols: Array<JSX.Element> = []
        response.data.columns.map((item: any)=>{
          newcols.push(<option value={item}> {item} </option>)
        })
        setcolumnsOrg(newcols)
        
      })
      .catch(function (error) {
        console.log(error);
      });
    }
  
    // filter needed change
    const handleChangeFilterNeeded = (e: React.ChangeEvent<HTMLInputElement>) =>{
      setFilter(e.target.checked)
    }
  
    // handle change of the column
    const handleChangeColumn = (e: React.ChangeEvent<HTMLSelectElement>) => {
      setcolumn(e.target.value)
    }
  
      // handle change of the filter
      const handleChangeFilter = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setfilterBy(e.target.value)
      }
  
    const handleChangeHowFilter = (e: React.ChangeEvent<HTMLSelectElement>) => {
      setHowFilter(e.target.value)
      console.log(e.target.value)
    }
    const handleChangeComprison = (e: React.ChangeEvent<HTMLInputElement>) => {
      setcomparison(e.target.value)
    }
    // writing the url
    const handleChangecsv = (e: React.ChangeEvent<HTMLInputElement>) => {
      setcsv(e.target.value)
    }
    useEffect(() =>{
      importColumns(csv)
    }, [csv])
  
    const handleSubmitcsv = (e: React.FormEvent) =>{
      e.preventDefault();
      submitcsv()
    }
  return (
    <>
    <br></br>
    <form onSubmit={handleSubmitcsv} id= "frm2" className="p-2">
      <input name= "csv" id = "csv" value = {csv} placeholder='URL for csv file for the dataset' className='mycenter block w-full md:p-5 p-2 text-sm md:text-2xl text-gray-900 border border-gray-300 rounded-lg bg-gray-50 sm:text-md focus:ring-blue-500 focus:border-blue-500' onChange={handleChangecsv}>
      </input>
        <div className='p-5'><label htmlFor="column"> {name} of&nbsp; </label>
            <select id="column" name='column' className='text-gray-900' onChange={handleChangeColumn}>
                {columnsOrg}
            </select>
        </div>
        <div className='p-2'>
            <label htmlFor="confidence-level2"> Confidence level = </label> 
            <input className='w-[30px] text-black mycenter' value={conlevel2} max="100" min="0" onChange={(e)=>{setConlevel2(e.target.value)}} type='number' id="confidence-level2"/> %
          </div>
        <label htmlFor="filter-needed">Filter the data?</label> &nbsp;
      <input type='checkbox' id='filter-needed' onChange={handleChangeFilterNeeded}></input> <br></br>
      {filter  &&
    
        <>
      <label htmlFor="filter-by"> Filter by&nbsp; </label>
        <select id="filter-by" name='filter-by' className='text-gray-900' onChange={handleChangeFilter} value={filterBy}>
          {columnsOrg}
        </select>&nbsp;
      <select id= "howfilter" className='text-gray-900' onChange={handleChangeHowFilter} value={HowFilter}>
        <option value=">"> &#62; </option>
        <option value="="> &#61; </option>
        <option value="<"> &#60; </option>
        <option value="⋜"> &#8924; </option>
        <option value="⋝"> &#8925; </option>
        <option value="≠"> ≠ </option>
      </select>
      &nbsp;
      <input type='text' id="compare" name='compare' className='text-gray-900 text-center' value={comparison} onChange={handleChangeComprison}/></>}
      <div className='p-3'><button onClick= {handleSubmitcsv} className="text-black text-xl">
        CI = {result}
      </button></div>
    </form></>
    )
}

export default CICSV