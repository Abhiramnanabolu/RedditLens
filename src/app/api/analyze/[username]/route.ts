import { NextResponse , NextRequest } from "next/server"
const { GoogleGenerativeAI } = require("@google/generative-ai");

function convertJsonStringToObject(jsonString: string ): any {
    const regex = /```json\n([\s\S]*?)\n```/;
    const match = jsonString.match(regex);
    
    if (!match || !match[1]) {
      throw new Error("No valid JSON found between code fences");
    }
    
    try {
      return JSON.parse(match[1]);
    } catch (error) {
      console.error("Error parsing JSON:", error);
    }
  }

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

export async function GET(req: NextRequest , {
  params,
}: {
  params: Promise<{ username: string }>
}) {

  const { username } = await params;


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
    "personality": "Positive"} do not add explainations in brackets , just the words return a single json like "{
    "key1": "value1", "key2": "value2"}" so that i can just parse what you give and i get a json object i can send in a response:
    ${JSON.stringify(userData)}
  `;

  try {
    const result = await model.generateContent(prompt);
    const aiResponse = await result.response;
    const insights = aiResponse.text();
    const res = convertJsonStringToObject(insights);
    const newRes = { username, ...res };

    return NextResponse.json(newRes);
  } catch (err) {
    console.error("Error generating AI insights:", err);
    return NextResponse.json({ error: "AI analysis failed" }, { status: 500 });
  }
}
