

// connection.connect();

import { TCompnay } from "@/interface/post";
import { IPost } from "@/scraping/scraping";
import { convertDateToMysqlDate } from "@/service/util";

async function getConnection() {
  let mysql = require('mysql2/promise');
  const connection = await mysql.createConnection({
    host: 'mysql',
    user: 'jun',
    password: '2134jkl!@#$1234jkl',
    database: 'tech-blog-mysql'
  });
  return connection;
}

export async function getPosts(companies?: TCompnay[]): Promise<IPost[]> {
  const connection = await getConnection();
  let query = 'SELECT * FROM `post`';
  if (companies) {
    query += ' WHERE company IN (';
    companies.forEach((company, index) => {
      if (index !== 0) query += ', ';
      query += `'${company}'`;
    }
    );
    query += ')';
  }
  query += ' ORDER BY date DESC';
  const [rows, fields] = await connection.execute(query);
  connection.end();
  return rows;
}

// export async function getLatestPost(comp: TCompnaies[number]): Promise<IPost> {
//   const connection = await getConnection();
//   const [rows, fields] = await connection.execute(
//     'SELECT * FROM post ORDER BY date DESC LIMIT 1;'
//   );
//   connection.end();
//   return rows;
// }

export async function postPosts(posts: IPost[]) {
  const connection = await getConnection();
  let query = 'INSERT INTO post (url, title, description, date, company) VALUES';
  posts.forEach((post, index) => {
    if (index !== 0) query += ',';
    query += `('${post.url}', '${post.title}', '${post.description}', '${convertDateToMysqlDate(post.date)}', '${post.company}')`;
  });
  const res = await connection.execute(query);
  connection.end();
  return res;
}