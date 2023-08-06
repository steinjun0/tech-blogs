// connection.connect();

import { TCompnay } from "@/interface/post";
import { IPost } from "@/scraping/scraping";
import { convertDateToMysqlDate } from "@/service/util";
import { NextResponse } from "next/server";


export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  let companies = searchParams.getAll('company') as unknown;

  const page = searchParams.get('page');
  const res = await getPosts(page ? Number(page) : undefined, companies as TCompnay[] ?? undefined);

  return NextResponse.json(res);
}

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

export async function getPosts(page?: number, companies?: TCompnay[],): Promise<{ posts: IPost[], isFinish: boolean; }> {
  const connection = await getConnection();
  let query = 'SELECT * FROM `post`';
  if (companies && companies.length > 0) {
    query += ' WHERE company IN (';
    companies.forEach((company, index) => {
      if (index !== 0) query += ', ';
      query += `'${company}'`;
    }
    );
    query += ')';
  }
  query += ' ORDER BY date DESC';
  if (page) {
    query += ` LIMIT ${page * 10}, 10`;
  }
  const [rows, fields] = await connection.execute(query);
  connection.end();
  return { posts: rows, isFinish: rows.length < 10 };
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