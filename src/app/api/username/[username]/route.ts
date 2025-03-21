import { NextRequest, NextResponse } from "next/server"
const { GoogleGenerativeAI } = require("@google/generative-ai");

const keysList = JSON.parse(process.env.GEMINI_API_KEY_LIST || "[]");
const key = keysList[Math.floor(Math.random() * keysList.length)];
const genAI = new GoogleGenerativeAI(key);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
console.log("Using AI key:", key);

interface Post {
  title: string;
  subreddit: string;
}

interface Comment {
  subreddit: string;
  comment: string;
  postTitle: string;
}

interface UserData {
  posts: Post[];
  comments?: Comment[];
}

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const  username  = searchParams.get("username");

  if (!username) {
    return NextResponse.json({ error: "Username is required" }, { status: 400 });
  }

  const userData: UserData = { posts: [], comments: [] };

  try {
    const postRes = await fetch(`https://www.reddit.com/user/${username}/submitted.json`);
    if (postRes.ok) {
      const postData = await postRes.json();
      userData.posts = postData.data.children.map((post: any) => ({
        title: post.data.title,
        subreddit: post.data.subreddit,
      }));
    }

    const commentRes = await fetch(`https://www.reddit.com/user/${username}/comments.json`);
    if (commentRes.ok) {
      const commentData = await commentRes.json();
      userData.comments = commentData.data.children.map((comment: any) => ({
        subreddit: comment.data.subreddit,
        comment: comment.data.body,
        postTitle: comment.data.link_title,
      }));
    }
  } catch (err) {
    console.error("Error fetching Reddit data:", err);
    return NextResponse.json({ error: "Failed to fetch Reddit user data" }, { status: 500 });
  }

  const prompt = `
    Analyze the following Reddit user's activity and provide insights into their interests, topics they engage with, and overall posting/commenting behavior return a string of a JSON with corresponding keys and values for example like this {  "age": "50+",
    "sex": "M",
    "hobby": "3D Printing, Gaming, Firearms",
    "location": "X",
    "occupation": "X",
    "relationship": "X",
    "income_level": "X",
    "interests": [
        "Cars", "Destiny", "Fixing Things"
    ],
    "brand_mentions": [
        "Porsche", "Ender", "Xbox"
    ],
    "life_stage": "X",
    "personality": "Positive"} do not add explainations in brackets , just the words:
    ${JSON.stringify(userData)}
  `;

  try {
    const result = await model.generateContent(prompt);
    const aiResponse = await result.response;
    const insights = aiResponse.text();

    return NextResponse.json({ username, insights });
  } catch (err) {
    console.error("Error generating AI insights:", err);
    return NextResponse.json({ error: "AI analysis failed" }, { status: 500 });
  }
}
