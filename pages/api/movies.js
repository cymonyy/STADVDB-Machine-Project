import {query} from "../../lib/db"
import mysql from "mysql2/promise";


async function tryTarget(sql, source, target){
    try{
        let execute = await query({
            query: sql,
            values: [],
            node: target
        });

    } catch(err){
        let addLog = await query({
            query: "insert into logs values (?,?)",
            values: [target, sqlLog],
            node: source
        });
    }
}

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
        const id = req.body.id;
        const name = req.body.name;
        const year = req.body.year;
        const rank = req.body.rank;

        let target, recoverFrom;
        var backlogs = [];
        switch(node){
            case "1": 
                target = (parseInt(year) >= 1980) ? 2:3; 
                recoverFrom = [2, 3];
                break;
            default: 
                recoverFrom = [1];
                target = 1; 
                break;
        }
        
        //Step 1: Execute logs to node #
        recoverFrom.forEach(async (num) => {
            try{
                var backlog = await query({
                    query: "SELECT * from logs where node = (?)",
                    values: [node],
                    node: num
                });

                if(backlog.length > 0) backlogs.push(...backlog);
            } catch (err){}
        })
        
        console.log("backlogs", backlogs);

        if(backlogs.length > 0){
            console.log("IN backlog execution");
            backlogs.forEach(async (item)=>{
                try{
                    await query({
                        query: item.statement,
                        values: [],
                        node: node
                    });
                } catch(err){
                }
            });

            console.log("pass backlog execution");
        }
        else console.log("no backlogs at the moment");

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

            //Step 3: Check if target is active and try execution. If false, add to logs of node
            let sqlLog = `insert into movie_details values (${addMovie.insertId},${name},${year},${rank})`;
            tryTarget(sqlLog, node, target);

            res.status(200).json({ response: { message: message, movie: movie } });
        }

        else if(req.body.method === "DELETE"){
            //Step 2: Execute Query
            let delMovie = await query({
                query: "delete from movie_details where id = ?",
                values: [id],
                node: node
            });

            console.log(delMovie.affectedRows)

            if (delMovie.affectedRows) {
                message = "success";
              } else {
                message = "error";
              }

            let movie = {
                id: id
            }

            //Step 3: Check if target is active and try execution. If false, add to logs of node
            let sqlLog = `delete from movie_details where id = ${id}`;
            tryTarget(sqlLog, node, target);

            res.status(200).json({ response: { message: message, movie: movie } });
        }

        else if(req.body.method === "UPDATE"){
            //Step 2: Execute Query
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

            //Step 3: Check if target is active and try execution. If false, add to logs of node
            let sqlLog = `update movie_details set movie_name = ${name}, movie_year = ${year}, movie_rank = ${rank} where id = ${id}`;
            tryTarget(sqlLog, node, target);

            res.status(200).json({ response: { message: message, movie: movie } });
        }

        
    }catch(err){
        console.log(err);
    }
}