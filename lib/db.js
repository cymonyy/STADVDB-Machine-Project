import mysql from "mysql2/promise";

export async function query({ query, values = [], node}) {

  const dbconnection = null;
  switch (node) {
      case "1": 
        dbconnection = mysql.createPool({
          host: "localhost",
          database: "Node",
          user:"root",
          password: "",
        });
        break;
      case "2": 
        dbconnection = mysql.createPool({
          host: "localhost",
          database: "Node",
          user:"root",
          password: "",
        });
        break;
      case "3": 
        dbconnection = mysql.createPool({
          host: "localhost",
          database: "Node",
          user:"root",
          password: "",
        });
        break;
      case "4": 
        dbconnection = mysql.createPool({
          host: "localhost",
          database: "Node",
          user:"root",
          password: "",
        });
        break;
      default: 
        dbconnection = mysql.createPool({
          host: "localhost",
          database: "Node",
          user:"root",
          password: "",
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
