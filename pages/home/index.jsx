import Image from 'next/image'
import { Inter } from 'next/font/google'
import Table from 'react-bootstrap/Table';
import Form from 'react-bootstrap/Form';
import axios from 'axios';
import { useForm, useFormState } from "react-hook-form";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';


const inter = Inter({ subsets: ['latin'] })

/*index.jsx consists of search for movies*/

export default function Home() {

  const router = useRouter();
  useEffect(()=>{
    router.query = {node: window.localStorage.getItem("node")};
    console.log("router", router);
  },[]);

  const {
		register:registerAdd,
    reset:resetAdd,
		handleSubmit:handleAdd,
    clearErrors:clearErrorsAdd,
	} = useForm({
    defaultValues: {
        name: "",
        year: "",
        rank: ""
    }
  });

  const {
		register:registerUpd,
    reset:resetUpd,
		handleSubmit:handleUpd,
    clearErrors:clearErrorsUpd,
	} = useForm({
    defaultValues: {
        id: "",
        name: "",
        year: "",
        rank: ""
    }
  });

  const {
		register:registerDel,
    reset:resetDel,
		handleSubmit:handleDel,
    clearErrors:clearErrorsDel,
	} = useForm({
    defaultValues: {
        id: "",
        name: "",
        year: "",
        rank: ""
    }
  });

  

  const [movies, setMovies] = useState([]);
  useEffect(()=>{
    getMovies()
  },[])

  const [search, setSearch] = useState("");

  async function getMovies(){
    const postData = {
      method:"POST",
      headers: {
        "Content-Type":"application/json"
      },
      body: JSON.stringify({
        node: router.query.node,
        statement: "SELECT * FROM movie_details",
        method: "READ"
      })
    };
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_URL}/api/movies`, 
      postData
    );
    const response = await res.json();
    console.log("test", response.movies);
    setMovies(response.movies);
  }

  async function addMovies(data){
    const postData = {
      method:"POST",
      headers: {
        "Content-Type":"application/json"
      },
      body: JSON.stringify({
        node: router.query.node,
        method: "ADD",
        name: data.name,
        year: data.year,
        rank: data.rank
      })
    };

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_URL}/api/movies`, 
      postData
    );

    const response = await res.json();

    if (response.response.message !== "success") return;
    const newMovie = response.response.movie;
    setMovies([
      ...products,
      {
        id: newMovie.id,
        movie_name: newMovie.movie_name,
        movie_year: newMovie.movie_year,
        movie_rank: newMovie.movie_rank
      },
    ]);
  }

  async function deleteMovies (data){
    const postData = {
      method:"POST",
      headers: {
        "Content-Type":"application/json"
      },
      body: JSON.stringify({
        node: router.query.node,
        method: "DELETE",
        id: data.id,
        name: data.name,
        year: data.year,
        rank: data.rank
      })
    };

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_URL}/api/movies`, 
      postData
    );

    const response = await res.json();

    if (response.response.message !== "success") return;
    const newMovie = response.response.movie;
    setMovies(movies.filter((item)=>item.id !== newMovie.id));
  }

  async function updateMovies (data){
    const postData = {
      method:"POST",
      headers: {
        "Content-Type":"application/json"
      },
      body: JSON.stringify({
        node: router.query.node,
        method: "UPDATE",
        id: data.id,
        name: data.name,
        year: data.year,
        rank: data.rank
      })
    };

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_URL}/api/movies`, 
      postData
    );

    const response = await res.json();

    if (response.response.message !== "success") return;
  }



  const addMovie = (data) => {
    console.log(data);
    addMovies(data);
    resetAdd();
    clearErrorsAdd();
    router.reload(window.location.pathname);
  }

  const deleteMovie = (data) => {
    console.log(data);
    deleteMovies(data);
    resetDel();
    clearErrorsDel();
    router.reload(window.location.pathname);
  }

  const updateMovie = (data) => {
    console.log(data);
    updateMovies(data);
    resetUpd();
    clearErrorsUpd();
    router.reload(window.location.pathname);
  }

  const errorOnAdd = (error) => {
    console.log(error);
  }

  const errorOnDel = (error) => {
    console.log(error);
  }

  const errorOnUpd = (error) => {
    console.log(error);
  }

  return (
    <main className='w-full min-h-screen p-20 flex flex-col font-rale'>
      <div className="grid grid-cols-1 md:grid-cols-2">
        <div className="flex flex-row items-center py-2">
            <p className="text-5xl">group<span className="font-bold">two</span></p>
            <div className="ml-2 grid grid-row-4 text-[11px] lg:text-xs">
                <p>Ang, Audric</p>
                <p>Nadela, Cymon Radjh</p>
                <p>Uy, Shane Owen</p>
            </div>
        </div>
        <div className="flex items-center justify-center md:justify-end">
          <p className="mt-5 text-xl text-center md:text-end md:text-3xl md:m-0 font-bold">IMDB Movies</p>
        </div>
      </div>

      <div className="w-full mt-10 flex flex-col h-full"> 
        
        <input type="text" name="search" id="search-bar" placeholder='Search' autoComplete="off" 
          className='py-5 pl-10 pr-5 w-1/2 focus:outline-none text-black text-lg font-semibold placeholder:font-normal placeholder:italic bg-gray-200 border rounded-full self-center' 
          onChange={(e)=>{setSearch(e.target.value)}}
        />

        <p className='mt-10 font-bold'>You can add a movie here: </p>
        <form onSubmit={handleAdd(addMovie, errorOnAdd)} className='mt-2 flex flex-col'>
          <div className='grid grid-cols-3 space-x-5'>
            <input type="text" className='py-2 px-5 text-black font-semibold placeholder:font-normal placeholder:italic focus:outline-none border rounded-lg' placeholder='Name' autoComplete="off" 
              {...registerAdd("name", {required: true})}
            />
            <input type="text" className='py-2 px-5 text-black font-semibold placeholder:font-normal placeholder:italic focus:outline-none border rounded-lg' placeholder='Year' autoComplete="off" 
              {...registerAdd("year", {required: true, pattern: new RegExp("^[0-9]*$")})}
            />
            <input type="text" className='py-2 px-5 text-black font-semibold placeholder:font-normal placeholder:italic focus:outline-none border rounded-lg' placeholder='Rank' autoComplete="off" 
              {...registerAdd("rank", {required: true, pattern: new RegExp("([0-9]*[.])?[0-9]+"),
                  validate:{
                    maximum: (value) =>  parseFloat(value).toFixed(2) <= 10.00
                  }
              })}
            />
          </div>
          {/**<div className='mt-1 grid grid-cols-3 space-x-5 text-rose-700'>
            <div>
              {errors.name?.type === "required" && <p>Error: Please add a Movie Name</p>}
            </div>
            <div>
              {errors.year?.type === "required" && <p>Error: Please add a Movie Year</p>}
              {errors.year?.type === "pattern" && <p>Error: Please enter a valid year</p>}
            </div>
            <div>
              {errors.rank?.type === "required" && <p>Error: Please add a Movie Rank</p>}
              {errors.rank?.type === "pattern" && <p>Error: Please enter a valid rank</p>}
              {errors.rank?.type === "maximum" && <p>Error: Your input exceeds the perfect 10.00 mark</p>}
            </div>
          </div> */}
          
          <div className='self-center flex flex-row space-x-10'>
            <button type="submit" className='mt-5 py-2 px-20 bg-emerald-700 hover:bg-emerald-600 text-white font-semibold border rounded-3xl text-xl'>Submit</button>
            <button type="button" className='mt-5 py-2 px-20 bg-gray-700 hover:bg-gray-600 text-white font-semibold border rounded-3xl text-xl'
              onClick={()=>{resetAdd(); clearErrorsAdd()}}
            >Clear</button>
          </div>
          
        </form>

        <div className='mt-10 grid grid-cols-4 text-center text-lg font-bold space-x-5'>
            <div className='p-5 bg-emerald-300'>Movie ID</div>
            <div className='p-5 bg-emerald-300'>Name</div>
            <div className='p-5 bg-emerald-300'>Year</div>
            <div className='p-5 bg-emerald-300'>Rank</div>
        </div>

        <div className='mt-2 space-y-2 w-full h-full max-h-screen overflow-y-scroll'>
          {
            movies.filter((item) => {
              return search.toLowerCase() === '' ? item : item.movie_name.toLowerCase().includes(search.toLowerCase());  
            }).map((item) => {
              return (<>
                <div key={item.id} className='grid grid-cols-4 text-center space-x-5 hover:bg-gray-100 hover:cursor-pointer'>
                  <p className='p-5'>{item.id}</p>
                  <p className='p-5'>{item.movie_name}</p>
                  <p className='p-5'>{item.movie_year}</p>
                  <p className='p-5'>{parseFloat(item.movie_rank).toFixed(2)}</p>
                </div>
              </>)
            })
          }
        </div>

        <hr className='mt-5' />
        <p className='mt-5 font-bold'>You can delete a movie here: </p>
        <form onSubmit={handleDel(deleteMovie, errorOnDel)} className='mt-2 flex flex-col'>
          <div className='grid grid-cols-4 space-x-5'>
            <input type="text" className='py-2 px-5 text-black font-semibold placeholder:font-normal placeholder:italic focus:outline-none border rounded-lg' placeholder='Movie ID' autoComplete="off" 
                {...registerDel("id", {required: true, pattern: new RegExp("^[0-9]*$")})}
            />
            <input type="text" className='py-2 px-5 text-black font-semibold placeholder:font-normal placeholder:italic focus:outline-none border rounded-lg' placeholder='Name' autoComplete="off" 
              {...registerDel("name", {required: true})}
            />
            <input type="text" className='py-2 px-5 text-black font-semibold placeholder:font-normal placeholder:italic focus:outline-none border rounded-lg' placeholder='Year' autoComplete="off" 
              {...registerDel("year", {required: true, pattern: new RegExp("^[0-9]*$")})}
            />
            <input type="text" className='py-2 px-5 text-black font-semibold placeholder:font-normal placeholder:italic focus:outline-none border rounded-lg' placeholder='Rank' autoComplete="off" 
              {...registerDel("rank", {required: true, pattern: new RegExp("([0-9]*[.])?[0-9]+"),
                  validate:{
                    maximum: (value) =>  parseFloat(value).toFixed(2) <= 10.00
                  }
              })}
            />
          </div>
          {/**<div className='mt-1 grid grid-cols-4 space-x-5 text-rose-700'>
            <div>
              {errors.id?.type === "required" && <p>Error: Please enter a Movie ID</p>}
              {errors.id?.type === "pattern" && <p>Error: Please enter a valid ID</p>}
            </div>
            <div>
              {errors.name?.type === "required" && <p>Error: Please enter a Movie Name</p>}
            </div>
            <div>
              {errors.year?.type === "required" && <p>Error: Please enter a Movie Year</p>}
              {errors.year?.type === "pattern" && <p>Error: Please enter a valid year</p>}
            </div>
            <div>
              {errors.rank?.type === "required" && <p>Error: Please enter a Movie Rank</p>}
              {errors.rank?.type === "pattern" && <p>Error: Please enter a valid rank</p>}
              {errors.rank?.type === "maximum" && <p>Error: Your input exceeds the perfect 10.00 mark</p>}
            </div>
          </div> */}
          
          <div className='self-center flex flex-row space-x-10'>
            <button type="submit" className='mt-5 py-2 px-20 bg-emerald-700 hover:bg-emerald-600 text-white font-semibold border rounded-3xl text-xl'>Submit</button>
            <button type="button" className='mt-5 py-2 px-20 bg-gray-700 hover:bg-gray-600 text-white font-semibold border rounded-3xl text-xl'
              onClick={()=>{resetDel(); clearErrorsDel()}}
            >Clear</button>
          </div>
        </form>

        <hr className='mt-10' />
        <p className='mt-5 font-bold'>You can update a movie here: </p>
        <form onSubmit={handleUpd(updateMovie, errorOnUpd)} className='mt-2 flex flex-col'>
          <div className='grid grid-cols-4 space-x-5'>
            <div>
              <p className='mb-1'>Movie ID <span className='font-bold'>to update</span></p>
              <input type="text" className='w-full py-2 px-5 text-black font-semibold placeholder:font-normal placeholder:italic focus:outline-none border rounded-lg' placeholder='Movie ID' autoComplete="off" 
                  {...registerUpd("id", {required: true, pattern: new RegExp("^[0-9]*$")})}
              />
            </div>
            
            <div>
              <p className='mb-1'><span className='font-bold'>New</span> movie name</p>
              <input type="text" className='w-full py-2 px-5 text-black font-semibold placeholder:font-normal placeholder:italic focus:outline-none border rounded-lg' placeholder='Name' autoComplete="off" 
                {...registerUpd("name", {required: true})}
              />
            </div>

            <div>
              <p className='mb-1'><span className='font-bold'>New</span> movie year</p>
              <input type="text" className='w-full py-2 px-5 text-black font-semibold placeholder:font-normal placeholder:italic focus:outline-none border rounded-lg' placeholder='Year' autoComplete="off" 
                {...registerUpd("year", {required: true, pattern: new RegExp("^[0-9]*$")})}
              />
            </div>
            
            <div>
              <p className='mb-1'><span className='font-bold'>New</span> movie rank</p>
              <input type="text" className='w-full py-2 px-5 text-black font-semibold placeholder:font-normal placeholder:italic focus:outline-none border rounded-lg' placeholder='Rank' autoComplete="off" 
                {...registerUpd("rank", {required: true, pattern: new RegExp("([0-9]*[.])?[0-9]+"),
                    validate:{
                      maximum: (value) =>  parseFloat(value).toFixed(2) <= 10.00
                    }
                })}
              />
            </div>
            
          </div>
          {/**<div className='mt-1 grid grid-cols-4 space-x-5 text-rose-700'>
            <div>
              {errors.id?.type === "required" && <p>Error: Please enter a Movie ID</p>}
              {errors.id?.type === "pattern" && <p>Error: Please enter a valid ID</p>}
            </div>
            <div>
              {errors.name?.type === "required" && <p>Error: Please enter a Movie Name</p>}
            </div>
            <div>
              {errors.year?.type === "required" && <p>Error: Please enter a Movie Year</p>}
              {errors.year?.type === "pattern" && <p>Error: Please enter a valid year</p>}
            </div>
            <div>
              {errors.rank?.type === "required" && <p>Error: Please enter a Movie Rank</p>}
              {errors.rank?.type === "pattern" && <p>Error: Please enter a valid rank</p>}
              {errors.rank?.type === "maximum" && <p>Error: Your input exceeds the perfect 10.00 mark</p>}
            </div>
          </div> */}
          
          <div className='self-center flex flex-row space-x-10'>
            <button type="submit" className='mt-5 py-2 px-20 bg-emerald-700 hover:bg-emerald-600 text-white font-semibold border rounded-3xl text-xl'>Submit</button>
            <button type="button" className='mt-5 py-2 px-20 bg-gray-700 hover:bg-gray-600 text-white font-semibold border rounded-3xl text-xl'
              onClick={()=>{resetUpd(); clearErrorsUpd()}}
            >Clear</button>
          </div>
        </form>
      </div>
    </main>
  )



  /*
  

  

  
  */
}
