import mysql from "mysql2/promise";

export async function queryAbove({ query, values = [] }) {

  //Digital ocean ubuntu
   const dbconnection = await mysql.createConnection({
     host: process.env.MYSQL_HOST,
     database: "imdb_mc02_above",
     user: process.env.MYSQL_USER,
     password: process.env.MYSQL_PASSWORD,
   });

  try {
    const [results] = await dbconnection.execute(query, values);
    dbconnection.end();
    return results;
  } catch (error) {
    throw Error(error.message);
    return { error };
  }
};