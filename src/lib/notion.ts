import { Client } from "@notionhq/client";

// Notion クライアントの初期化
export const notion = new Client({
  auth: process.env.NOTION_API_KEY,
});

// 1件のページをIDで取得する
export async function fetchPageById(pageId: string) {
  return await notion.pages.retrieve({ page_id: pageId });
}

// データベースの全アイテムを取得する
export async function fetchDatabaseItems() {
  const databaseId = process.env.NOTION_DATABASE_ID;

  if (!databaseId) {
    throw new Error("NOTION_DATABASE_ID が設定されていません");
  }
  if (!process.env.NOTION_API_KEY) {
    throw new Error("NOTION_API_KEY が設定されていません");
  }

  const response = await notion.databases.query({
    database_id: databaseId,
  });

  return response;
}
