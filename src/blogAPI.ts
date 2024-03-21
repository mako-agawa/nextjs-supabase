import { notFound } from "next/navigation";
import { Article } from "./types";

export const getAllArticles = async (): Promise<Article[]> => {
  const res = await fetch(`http://localhost:3001/posts`, { cache: "no-store" }); //SSR force-storeの場合はSSG

  if (!res.ok) {
    throw new Error("エラーが発生しました。");
  }

  await new Promise((resolve) => setTimeout(resolve, 1000));

  const articles = await res.json(); //データ文字列化
  return articles;
};

export const getDetailArticles = async (id: string): Promise<Article> => {
  const res = await fetch(`http://localhost:3001/posts/${id}`, {
    next: { revalidate: 60 },
  }); //ISR

  if (res.status === 404) {
    notFound();
  }

  if (!res.ok) {
    throw new Error("エラーが発生しました。");
  }

  await new Promise((resolve) => setTimeout(resolve, 1000));

  const article = await res.json(); //データ文字列化
  return article;
};

export const createArticle = async (
  id: string,
  title: string,
  content: string
): Promise<Article> => {
  const currentDatatime = new Date().toISOString(); //現自在の日時を取得

  const res = await fetch(`http://localhost:3001/posts`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ id, title, content, createdAt: currentDatatime }),
  });

  if (!res.ok) {
    throw new Error("エラーが発生しました。");
  }

  await new Promise((resolve) => setTimeout(resolve, 1000));

  const newArticle = await res.json(); //データ文字列化
  return newArticle;
};

export const deleteArticle = async (id: string): Promise<Article> => {
  const res = await fetch(`http://localhost:3001/posts${id}`, {
    method: "DELETE",
  });

  // if (!res.ok) {
  //   throw new Error("エラーが発生しました。");
  // }

  await new Promise((resolve) => setTimeout(resolve, 1000));

  const deleteArticle = await res.json(); //データ文字列化
  return deleteArticle;
};
