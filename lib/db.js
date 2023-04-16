import mysql from "mysql2/promise";

export async function query({ query, values = [] }) {

   const dbconnection = await mysql.createConnection({
     host: process.env.MYSQL_HOST,
     database: "imdb",
     user: process.env.MYSQL_USER,
     password: process.env.MYSQL_PASSWORD,
   });

   dbconnection.connect(async (err)=> {
    if(err) throw Error(err);
    else {
      try {
        const [results] = await dbconnection.execute(query, values);
        dbconnection.end();
        return results;
      } catch (error) {
        throw Error(error.message);
        return { error };
      }
    }
   })

  
};