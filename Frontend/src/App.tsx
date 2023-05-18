import {
  createBrowserRouter,
  RouterProvider,
  Link,
  Outlet,
  } from "react-router-dom";
import './App.css'
import Mean from './components/Mean'
import Median from './components/Median'
import Mode from './components/Mode'
import STD from './components/STD'
import Range from './components/Range'
import Nav2 from './components/Nav2'
import Nav3 from './components/Nav3'
import CI from './components/CI'
import SIG from "./components/Sig";
import History from "./components/History";
import logo from "../public/El statistician (2).png"
import img from "../public/El statistician (1).png"


const baseURL = "https://el-statistician-api.onrender.com"




const router = createBrowserRouter([
  
  {
    path: "/",
    element: <><div className="bg-white py-0 px-0 md:px-20 ring"><div  className=" relative bottom-4 md:bottom-0">    <div className="flex items-center  relative md:top-3 top-[110px] w-[20%]">
    <Link to="/"><img src={logo} className="h-16" alt="Logo" /></Link>
</div><div className="relative bottom-4 md:bottom-8"><Link className="p-5 text-black" to="/d">Descriptive</Link><Link className="p-5 bg-white text-blue-950 rounded-lg ring-2 shadow-lg ring-black " to="/history">History</Link><Link className="p-5 text-black" to="/i">Inferential</Link></div></div></div><Outlet/></>,
    children:[
      {
        path:"",
        element: <div className="md:p-20 py-40">          <Link to="#" >
        <img src={img} className='mx-auto w-[50%] object-contain rounded-xl hover:scale-110 ' alt="Logo" />
      </Link></div>
      },      
      {
        path:"/d",
        element: <><Nav2/><Outlet/></>,
        children:[
          {
            path:"/d",
            element: <><h1 className='py-[20%] px-[15%] md:px-[20%] text-4xl md:text-6xl'>Choose one statistic from the navigation bar above!</h1></>
          },
          {
            path: "/d/mean",
            element: <Mean baseURL={baseURL}/>
          },
          {
            path: "/d/median",
            element: <Median baseURL={baseURL}/>,
          },
          {
            path: "/d/mode",
            element: <Mode baseURL={baseURL}/>,
          },
          {
            path: "/d/std",
            element: <STD baseURL={baseURL}/>,
          },
          {
            path: "/d/range",
            element: <Range baseURL={baseURL}/>
          }
        ]
      },      
      {
        path:"/i",
        element: <><Nav3/><Outlet/></>,
        children:[
          {
            path:"/i",
            element: <><h1 className='py-[20%] px-[15%] md:px-[20%] text-4xl md:text-6xl'>Choose one statistic from the navigation bar above!</h1></>
          },
          {
            path: "/i/ci",
            element: <CI baseURL={baseURL}/>
          },
          {
            path: "/i/significance",
            element: <SIG baseURL={baseURL}/>,
          },
        ]
      },
      {
        path: "/history",
        element: <><History baseURL={baseURL}/></>
      }


    ]
  },

    ]
  

);


function App() {
  return (
    <>
    <RouterProvider router={router} />
    </>
  )
}

export default App
