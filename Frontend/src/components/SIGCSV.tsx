import React from 'react'
import axios from 'axios'
import { useState, useEffect } from 'react'



    const SIGCSV = ({baseURL, URL}: {baseURL: String, URL: String}) => {
        const [filter, setFilter] = useState(false)
        const [filter2, setFilter2] = useState(false)
        const [filterBy, setfilterBy] = useState("")
        const [filterBy2, setfilterBy2] = useState("")
        const [HowFilter, setHowFilter] = useState(">")
        const [HowFilter2, setHowFilter2] = useState(">")
        const [tails, settails] = useState("2")
        const [comparison2, setcomparison2] = useState("")
        const [comparison, setcomparison] = useState("")
        const [columnsOrg, setcolumnsOrg] = useState([<option value={"Enter a valid URL for CSV file"}> {"Enter a valid URL for CSV file"} </option>])
        const [columnsOrg2, setcolumnsOrg2] = useState([<option value={"Enter a valid URL for CSV file"}> {"Enter a valid URL for CSV file"} </option>])
        const [csv, setcsv] = useState("")
        const [csv2, setcsv2] = useState("")
        const [column, setcolumn] = useState("")
        const [column2, setcolumn2] = useState("")
        const [siglevel2, setsiglevel2] = useState("5")
        const [pcsv, setpcsv] = useState(0)
        const [gcsv, setgcsv] = useState(0)
        const [rescsv, setrescsv] = useState("The test is not done yet.")
        
          //submitting csv
          async function submitcsv() {

              await axios.post(`${baseURL}/${URL}`, {
                csv: csv,
                csv2: csv2,
                column: column,
                column2: column2,
                filter: filter,
                filter2:filter2,
                filterBy: filterBy,
                filterBy2: filterBy2,
                HowFilter: HowFilter,
                HowFilter2: HowFilter2,
                comparison: comparison,
                comparison2: comparison2,
                siglevel2: siglevel2,
                tails: tails,
              })
            .then(function (response) {
              setpcsv(response.data.result[0]);
              setgcsv(response.data.result[1]);
              setrescsv(response.data.result[2]);
            })
            .catch(function (error) {
              console.log(error);
            })
            ;
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
          await axios.post(`${baseURL}/getcolumns`, {
            csv: csv2,
          })
          .then(function (response) {
            
        let newcols: Array<JSX.Element> = []
            response.data.columns.map((item: any)=>{
              newcols.push(<option value={item}> {item} </option>)
            })            
            setcolumnsOrg2(newcols)
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
        }, [csv, csv2])
      
        const handleSubmitcsv = (e: React.FormEvent) =>{
          e.preventDefault();
          submitcsv()
        }
      return (
        <>
        <br></br>
        <div className='grid md:grid-cols-9 grid-cols-4 gap-4'>
        <form onSubmit={handleSubmitcsv} id= "frm2" className="p-2 col-span-4">
            <h2 className='text-3xl'>Sample 1</h2>
          <input name= "csv" id = "csv" value = {csv} placeholder='URL for csv file for the dataset' className='mycenter block w-full md:p-5 p-2 text-sm md:text-2xl text-gray-900 border border-gray-300 rounded-lg bg-gray-50 sm:text-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500' onChange={handleChangecsv}>
          </input>
            <div className='p-5'><label htmlFor="column"> Mean of&nbsp; </label>
                <select id="column" name='column' className='text-gray-900' onChange={handleChangeColumn}>
                    {columnsOrg}
                </select>
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
          <input type='text' id="compare" name='compare' className='text-gray-900 text-center w-20' value={comparison} onChange={handleChangeComprison}/></>}

        </form>
            <h2 className='text-5xl  md:p-5 md:col-span-1 col-span-4'>VS</h2>
        <form onSubmit={handleSubmitcsv} id= "frm2" className="p-2 col-span-4">
        <h2 className='text-3xl'>Sample 2</h2>
          <input name= "csv" id = "csv" value = {csv2} placeholder='URL for csv file for the dataset' className='mycenter block w-full md:p-5 p-2 text-sm md:text-2xl text-gray-900 border border-gray-300 rounded-lg bg-gray-50 sm:text-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500' onChange={(e)=> setcsv2(e.target.value)}>
          </input>
            <div className='p-5'><label htmlFor="column"> Mean of&nbsp; </label>
                <select id="column" name='column' className='text-gray-900' onChange={(e)=>{setcolumn2(e.target.value)}}>
                    {columnsOrg2}
                </select>
            </div>

            <label htmlFor="filter-needed2">Filter the data?</label> &nbsp;
          <input type='checkbox' id='filter-needed2' onChange={(e)=>{setFilter2(e.target.checked)}}></input> <br></br>
          {filter2  &&
        
            <>
          <label htmlFor="filter-by"> Filter by&nbsp; </label>
            <select id="filter-by" name='filter-by' className='text-gray-900' onChange={(e)=>{setfilterBy2(e.target.value)}} value={filterBy2}>
              {columnsOrg2}
            </select>&nbsp;
          <select id= "howfilter" className='text-gray-900' onChange={(e)=>{setHowFilter2(e.target.value)}} value={HowFilter2}>
            <option value=">"> &#62; </option>
            <option value="="> &#61; </option>
            <option value="<"> &#60; </option>
            <option value="⋜"> &#8924; </option>
            <option value="⋝"> &#8925; </option>
            <option value="≠"> ≠ </option>
          </select>
          &nbsp;
          <input type='text' id="compare" name='compare' className='text-gray-900 text-center w-20' value={comparison2} onChange={(e)=> setcomparison2(e.target.value)}/></>}

        </form>
        </div>
            <div className='p-2'>
                <label htmlFor="confidence-level2"> Significance level (α) = </label> 
                <input className='w-[30px] text-black mycenter' value={siglevel2} max="100" min="0" onChange={(e)=>{setsiglevel2(e.target.value)}} type='number' id="siglevel2"/> %
            </div>
                <select id="tails" value={tails} onChange={(e)=>{settails(e.target.value)}} className='text-black p-2'>
                    <option value=">">1-tailed test (H1: Sample1 &#62; Sample2)</option>
                    <option value="<">1-tailed test (H1: Sample1 &#60; Sample2)</option>
                    <option value="2">2-tailed test (H1: Sample1 &#8800; Sample2)</option>
                </select>
            
                    <div className="card">
          <button onClick= {handleSubmitcsv} className="text-black text-xl">
            p-value = {pcsv} <br/>
            Hedge's g = {gcsv}
          </button>
          <h2>{rescsv}</h2>
        </div></>
        )
    }
    
    export default SIGCSV