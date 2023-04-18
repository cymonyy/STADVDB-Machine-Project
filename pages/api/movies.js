import {query} from "../../lib/db"
import mysql from "mysql2/promise";




export default async function handler(req, res){
    try{
        
        const node = req.body.node;
        const id = req.body.id;
        const name = req.body.name;
        const year = parseInt(req.body.year);
        const rank = parseFloat(parseFloat(req.body.rank).toFixed(2));

        let target, recoverFrom;
        var message;
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

        console.log(recoverFrom);

        //Step 1: Execute logs to node #
        for(let i = 0; i < recoverFrom.length; i++){
            try{
                let num = recoverFrom[i];
                console.log(num);
                //get backlog from recovery logs 
                let backlog = await query({
                    query: "SELECT * from logs where target = (?)",
                    values: [node],
                    node: num.toString()
                });
                await new Promise(res=> setTimeout(res,200));
                
                console.log("inner backlog ", num, backlog);

                if(backlog.length > 0){
                    for(let j = 0; j < backlog.length; j++){
                        let item = backlog[j];
                         //delete each backlogs in recovery 
                         await query({
                            query: "delete from logs where target = ? and statement = ?",
                            values: [node, item.statement],
                            node: num.toString()
                        });
                        await new Promise(res=> setTimeout(res,100));
                        console.log("confirm delete " + (j+1));
                    }   
                    backlogs.push(...backlog);
                } else console.log("No backlogs inside node " + num + " at the moment.");
            } catch (err){console.log(err)}
        }
        await new Promise(res=> setTimeout(res,200));
     

        console.log("backlogs",backlogs);
        for (let i = 0; i < backlogs.length; i++){
            let item = backlogs[i];
            try{
                //run backlog to source node
                await query({
                    query: item.statement,
                    values: [],
                    node: node
                });
                await new Promise(res=> setTimeout(res,200));
                console.log("confirm execute " + (i+1));

            } catch(err){
                console.log(err);
                //add back to backlogs if error on add
                await query({
                    query: "insert into logs values (?,?)",
                    values: [node, item.statement],
                    node: parseInt(item.target).toString()
                });
                await new Promise(res=> setTimeout(res,200));
                console.log("add to logs " + (i+1));
            }
        }
        
        let isolationLevel = await query({
            query: `set transaction isolation level ${"READ COMMITTED"}`,
            values: [],
            node: node
        });
        await new Promise(res=> setTimeout(res,200))

        if(req.body.method === "READ"){
            //Step 2: Execute Query
            console.log(node);
            const movies = await query({
                query: req.body.statement,
                values: [],
                node: node
            });
            await new Promise(res=> setTimeout(res,500))

            //sleep for concurrency
            isolationLevel = await query({
                query: `do sleep(10)`,
                values: [],
                node: node
            });
            await new Promise(res=> setTimeout(res,200))

            //sleep for concurrency
            isolationLevel = await query({
                query: `commit`,
                values: [],
                node: node
            });
            await new Promise(res=> setTimeout(res,200))

            console.log(movies);
            res.status(200).json({movies: movies});
        }

        else if (req.body.method === "ADD"){
            console.log("in add");
            //Step 2: Execute Query
            //Add The Item
            let addMovie = await query({
                query: "insert into movie_details values (?,?,?)",
                values: [name, year, rank],
                node: node
            });
            await new Promise(res=> setTimeout(res,500))
            console.log("confirm add");

            let message;
            if (addMovie.affectedRows>0) {
                message = "success";

                //sleep for concurrency
                isolationLevel = await query({
                    query: `do sleep(10)`,
                    values: [],
                    node: node
                });
                await new Promise(res=> setTimeout(res,200))

                console.log("confirm sleep");

                //commit concurrency
                isolationLevel = await query({
                    query: `commit`,
                    values: [],
                    node: node
                });
                await new Promise(res=> setTimeout(res,200))
                
                console.log("confirm commit");

                //Step 3: Check if target is active and try execution. If false, add to logs of node
                let sqlLog = `insert into movie_details values ('${name}',${year},${rank})`;
                let addLog = await query({
                    query: "insert into logs values (?,?,?)",
                    values: [node, target, sqlLog],
                    node: node
                });
                await new Promise(res=> setTimeout(res,500))
                console.log("confirm add log");
            } else {
                message = "error";
                //rollback concurrency
                isolationLevel = await query({
                    query: `rollback`,
                    values: [],
                    node: node
                });
                await new Promise(res=> setTimeout(res,200))
                console.log("rollback");
            }

            let movie = {
                movie_name: name,
                movie_year: year,
                movie_rank: rank
            }
            res.status(200).json({ response: { message: message, movie: movie } });
        }

        else if(req.body.method === "DELETE"){
            console.log("in del");
            //Step 2: Execute Query
            let sql = `delete from movie_details where movie_name = "${name}" and movie_year = ${year}`;
            let delMovie = await query({
                query: sql,
                values: [],
                node: node
            });
            await new Promise(res=> setTimeout(res,500))
            console.log("confirm del");
            console.log(delMovie.affectedRows)
            
            if (delMovie.affectedRows>0) {
                message = "success";

                //sleep for concurrency
                isolationLevel = await query({
                    query: `do sleep(10)`,
                    values: [],
                    node: node
                });
                await new Promise(res=> setTimeout(res,200))
                console.log("confirm sleep");

                //commit concurrency
                isolationLevel = await query({
                    query: `commit`,
                    values: [],
                    node: node
                });
                await new Promise(res=> setTimeout(res,200))
                console.log("confirm commit");

                //Step 3: Check if target is active and try execution. If false, add to logs of node
                let sqlLog = `delete from movie_details where movie_name = "${name}" and movie_year = ${year}`;
                let addLog = await query({
                    query: "insert into logs values (?,?,?)",
                    values: [node, target, sqlLog],
                    node: node
                });
                await new Promise(res=> setTimeout(res,500))
                console.log("confirm add log");

              } else {
                message = "error";

                //rollback concurrency
                isolationLevel = await query({
                    query: `rollback`,
                    values: [],
                    node: node
                });
                await new Promise(res=> setTimeout(res,200))
                console.log("rollback");
              }

                let movie = {
                    movie_name: name,
                    movie_year: year,
                    movie_rank: rank
                }

            res.status(200).json({ response: { message: message, movie: movie } });
        }

        else if(req.body.method === "UPDATE"){
            console.log("in upd");
            //Step 2: Execute Query
            let sql = `update movie_details set movie_year = ${year}, movie_rank = ${rank} where movie_name = "${name}" `
            let updMovie = await query({
                query: sql,
                values: [year, rank, name],
                node: node
            });
            await new Promise(res=> setTimeout(res,500))
            console.log("confirm upd");
            console.log(updMovie.affectedRows)

            if (updMovie.affectedRows>0) {
                message = "success";

                //sleep for concurrency
                isolationLevel = await query({
                    query: `do sleep(10)`,
                    values: [],
                    node: node
                });
                await new Promise(res=> setTimeout(res,200))
                console.log("confirm sleep");

                //commit concurrency
                isolationLevel = await query({
                    query: `commit`,
                    values: [],
                    node: node
                });
                await new Promise(res=> setTimeout(res,200))
                console.log("confirm commit");

                //Step 3: Check if target is active and try execution. If false, add to logs of node
                let sqlLog = `update movie_details set movie_year = ${year}, movie_rank = ${rank} where movie_name = "${name}"`;
                let addLog = await query({
                    query: "insert into logs values (?,?,?)",
                    values: [node, target, sqlLog],
                    node: node
                });
                await new Promise(res=> setTimeout(res,500))
                console.log("confirm add log");
              } else {
                message = "error";
                //rollback concurrency
                isolationLevel = await query({
                    query: `rollback`,
                    values: [],
                    node: node
                });
                await new Promise(res=> setTimeout(res,200))
                console.log("confirm rollback");
              }

                let movie = {
                    movie_name: name,
                    movie_year: year,
                    movie_rank: rank
                }

            
            res.status(200).json({ response: { message: message, movie: movie } });
        }
    }catch(err){
        console.log(err);
    }
}