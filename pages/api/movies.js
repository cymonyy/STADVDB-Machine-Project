import {query} from "../../lib/db"

export default async function handler(req, res){

    if(req.method === "GET"){

        

        try{
            const movies = await query({
                query:"SELECT * FROM movie_details limit 10",
                values:[]
            });

    
            res.status(200).json({movies: movies});
        }
        catch(err){
            res.status(200).json({movies: err});
        }
    }

    if(req.method === "POST"){
        try{
            //get highest id and add 1
            const highestID = await query({
                query: "select movie_details.id from movie_details order by id desc limit 1",
                values:[]
            });
            
            const AddMovie = await query({
                query: "insert "
            })
        }
        catch(err){
            console.log(err)
        }
    }
}