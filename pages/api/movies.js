import {query} from "../../lib/db"
import mysql from "mysql2/promise";


export default async function handler(req, res){
    try{
         /*
            Add movies from to 2:
            source = node 2
            target = node center

            1) execute logs to source
            2) execute query to source
            3) check if target is active
                if yes, execute query to target
                if no, add log (targer node, statement)
            LOOP
        */

        const node = req.body.node;

        //Step 1: Execute logs to node #
        const backlog = await query({
            query: "SELECT * from logs where node = (?)",
            values: [node],
            node: 0
        });
        console.log("backlogs", backlog);

        if(backlog.length > 0){

            console.log("IN backlog execution");

            backlog.forEach(async (item)=>{
                await query({
                    query: item.statement,
                    values: [],
                    node: node
                });
            });

            console.log("pass backlog execution");
        }
        else console.log("no backlogs at the moment")

        if(req.body.method === "READ"){
             //Step 2: Execute Query
             console.log(node);
             const movies = await query({
                query: req.body.statement,
                values: [],
                node: node
             });

             console.log(movies);
             res.status(200).json({movies: movies});
        }

        else if (req.body.method === "ADD"){
            //Step 2: Execute Query
            //Get Highest ID and Increment
            console.log(node);
            let name = req.body.name;
            let year = req.body.year;
            let rank = req.body.rank;

            let highest = await query({
                query: "select id from movie_details order by id desc limit 1",
                values: [],
                node: node
            });
            let idNum = (highest.length > 0) ? (parseInt(highest[0].id) + 1) : 1;

            console.log(idNum);

            //Add The Item
            let addMovie = await query({
                query: "insert into movie_details values (?,?,?,?)",
                values: [idNum, name, year, rank],
                node: node
            });


            let message;
            if (addMovie.insertId) {
                message = "success";
              } else {
                message = "error";
              }

            let movie = {
                id: addMovie.insertId,
                movie_name: name,
                movie_year: year,
                movie_rank: rank
            }

            res.status(200).json({ response: { message: message, movie: movie } });
        }

        else if(req.body.method === "DELETE"){
            //Step 2: Execute Query
            let delMovie = await query({
                query: "delete from movie_details where id = ?",
                values: [req.body.id],
                node: node
            });

            console.log(delMovie.affectedRows)

            if (delMovie.affectedRows) {
                message = "success";
              } else {
                message = "error";
              }

            let movie = {
                id: req.body.id
            }

            res.status(200).json({ response: { message: message, movie: movie } });
        }

        else if(req.body.method === "UPDATE"){
            //Step 2: Execute Query
            let id = req.body.id;
            let name = req.body.name;
            let year = req.body.year;
            let rank = req.body.rank;

            let updMovie = await query({
                query: `update movie_details set movie_name = ?, movie_year = ?, movie_rank = ? where id = ?`,
                values: [name, year, rank, id],
                node: node
            });

            console.log(updMovie.affectedRows)

            if (updMovie.affectedRows) {
                message = "success";
              } else {
                message = "error";
              }

            let movie = {
                id: req.body.id
            }

            res.status(200).json({ response: { message: message, movie: movie } });
        }

    }catch(err){
        console.log(err);
    }
}

/**
 * 
 * export default async function handler(req, res){

    try{
        console.log("method", req.body);
        
        

       
       

        console.log("pass source pool")

        const logs = mysql.createPool({
            host: process.env.MYSQL_HOST,
            database: "mc02_transaction_logs",
            user: process.env.MYSQL_USER,
            password: process.env.MYSQL_PASSWORD,
        });

        console.log("pass logs pool")
        
        

        
        console.log("pass backlog execution");

        if(req.body.method === "READ"){
            let source = getPool(req.body.node);
            //Step 2: Execute Query
            const [movies] = await source.query(req.body.statement);
            res.status(200).json({movies: movies});

            source.releaseConnection(SourceBufferList);
        }

        if(req.body.method === "ADD"){
            let source = getPool(req.body.node);
            //Step 2: Execute Query
            const [addMovie] = await source.query({
                query: "INSERT INTO movie_details VALUES (?,?,?,?)",
                values: [2, "hello", "1999", "1"]
            });

            res.status(200).json({movies: movies});
        }

        
    }catch(err){
        console.log(err)
        res.status(200).json({movies: []});
    }
    
   
     * 
     * 
     * else if (req.body.method === "ADD"){

            const name = req.body.name;
            const year = req.body.year;
            const rank = req.body.rank;

            //Step 2: Execute Query
            const [highest] = await source.query("select id from movie_details order by id desc limit 1");
            console.log(highest);
            let idNum = (highest === []) ? 1: (parseInt(highest[0].id) + 1);

            const addedMovie = await source.execute({
                query: "insert into movie_details values (?,?,?,?)",
                values: [idNum, name, year, rank]
            });

            let message;
            if(addedMovie.insertId) {
                message = "Added Successfully"
            }
            else message = "Added Unsuccessfully"

            let movie = {
                id: addedMovie.insertId,
                name: name,
                year: year,
                rank: rank
            }

            res.status(200).json({response: {message: message, movie: movie}});

            //Step 3: Check if Target is Active
        }
        
        else {

            

        }
     *  if(req.method === "GET"){
        
        try{
            //get logs to execute
            const logs = await queryLogs({
                query: `SELECT * FROM logs where node = ${req.body.node}`,
                values: []
            });

            //execute logs to node #
            if(logs) logs.forEach(async (element) => {
                let garbage = await query({
                    query: element.statement,
                    values: [],
                    connection: source
                })
            });

            const results = await query({
                query: "SELECT * from movie_details limit 10",
                values: [],
                connection: source
            });
            source.release();

            res.status(200).json({movies: results});
        }catch(err){
            source.release();
            console.log(err)
        }

    }
     * if(req.method === "GET"){

        

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
 */