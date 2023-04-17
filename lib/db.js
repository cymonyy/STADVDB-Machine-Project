import mysql from "mysql2/promise";

export async function query({ query, values = [], node}) {

  let base;
  switch (node) {
      case "1": base = "imdb_mc02"; break;
      case "2": base = "imdb_mc02_below"; break;
      case "3": base = "mc02_dump"; break;
      default: base = "mc02_transaction_logs"; break;
  }

  //Digital ocean ubuntu
 const dbconnection = mysql.createPool({
   host: "localhost",
   database: base,
   user:"root",
   password: "Simoun_8411",
  });

  try {
    const [results] = await dbconnection.execute(query, values);
    dbconnection.end();
    return results;
  } catch (error) {
    throw Error(error.message);
    return { error };
  }
}
