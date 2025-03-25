export interface Post {
    _id: string;
    author: string;
    authorName?: string;
    title: string;
    content: string;
    excerpt: string;
    createdAt: string;
    updatedAt: string;
    status: "published" | "draft";
  }

  export interface User {
    id: string;
    username: string;
    email: string;
    token: string;
  }
