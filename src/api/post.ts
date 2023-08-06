

// connection.connect();

import { TCompnaies } from "@/interface/post";
import { IPost } from "./scraping";

export async function getPosts(): Promise<IPost[]> {
  var mysql = require('mysql2/promise');
  var connection = await mysql.createConnection({
    host: 'mysql',
    user: 'jun',
    password: '2134jkl!@#$1234jkl',
    database: 'tech-blog-mysql'
  });

  const [rows, fields] = await connection.execute(
    'SELECT * FROM `post` ORDER BY `date` DESC'
  );
  console.log(rows);
  return rows;
}

export async function getLatestPost(comp: TCompnaies[number]): Promise<IPost[]> {
  var mysql = require('mysql2/promise');
  var connection = await mysql.createConnection({
    host: 'mysql',
    user: 'jun',
    password: '2134jkl!@#$1234jkl',
    database: 'tech-blog-mysql'
  });

  const [rows, fields] = await connection.execute(
    'SELECT * FROM post ORDER BY date DESC LIMIT 1;'
  );
  console.log(rows);
  return rows;
}

