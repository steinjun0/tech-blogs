// connection.connect();

import { TCompany } from "@/interface/post";
import { IPost } from "@/scraping/scraping";
import { convertDateToMysqlDate } from "@/service/util";
import { NextResponse } from "next/server";


export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  let companies = searchParams.getAll('company') as unknown;

  const page = searchParams.get('page');
  const res = await getPosts({ page: page ? Number(page) : undefined, companies: companies as TCompany[] ?? undefined });

  return NextResponse.json(res);
}

async function getConnection() {
  let mysql = require('mysql2/promise');
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
  });
  return connection;
}

export async function getPosts({ page = undefined, companies = [] }: { page?: number, companies?: TCompany[]; }): Promise<{ posts: IPost[], isFinish: boolean; }> {
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
  if (page !== undefined) {
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
  console.log('posts', posts);
  posts.forEach((post, index) => {
    if (index !== 0) query += ',';
    query += `('${post.url}', '${post.title.replaceAll("'", "\\'")}', '${post.description.replaceAll("'", "\\'")}', '${convertDateToMysqlDate(post.date)}', '${post.company}')`;
  });
  console.log('query', query);
  const res = await connection.execute(query);
  connection.end();
  return res;
}