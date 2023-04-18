import mysql from "mysql2/promise";

export async function query({ query, values = [], node}) {

  var dbconnection;
  switch (node) {
      case "1": //Center Node
        dbconnection = mysql.createPool({
          host: "localhost",
          database: "mc02_dump",
          user:"root",
          password: "Simoun_8411",
        });
        break;
      case "2": //>= 1980
        dbconnection = mysql.createPool({
          host: "localhost",
          database: "mc02_dump_above",
          user:"root",
          password: "Simoun_8411",
        });
        break;
      case "3": //< 1980
        dbconnection = mysql.createPool({
          host: "localhost",
          database: "mc02_dump_below",
          user:"root",
          password: "Simoun_8411",
        });
      break;
  }

  try {
    const [results] = await dbconnection.execute(query, values);
    dbconnection.end();
    return results;
  } catch (error) {
    throw Error(error.message);
    return { error };
  }
}
