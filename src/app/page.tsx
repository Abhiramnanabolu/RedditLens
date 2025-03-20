"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";

export default function Home() {
  const [username, setUsername] = useState<string>("")
  const router = useRouter()
  const handleSearch = () => {
    if (username.trim()) {
      router.push(`/user/${username}`)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch()
    }
  }

  const exampleResponse = {
    "age": "40-50",
    "sex": "M",
    "hobby": "Space Exploration, Rocket Science, Gaming",
    "location": "X",
    "occupation": "CEO/CTO of a Rocket Company",
    "relationship": "X",
    "income_level": "High",
    "interests": [
      "Space Travel",
      "Rocket Engineering",
      "Mars Colonization",
      "Video Games",
      "Aviation"
    ],
    "brand_mentions": [
      "Falcon 9",
      "Raptor",
      "Dragon",
      "SR-71",
      "Xbox",
    ],
    "life_stage": "Career Focused",
    "personality": "Driven, Knowledgeable"
  }
  
  const jsonString = JSON.stringify(exampleResponse, null, 2)

  return (
    <main className="min-h-screen flex flex-col items-center">
      <div className="w-full max-w-6xl px-4 sm:px-6 lg:px-8">
        <header className="flex justify-between items-center py-6">
          <h2 className="text-2xl font-bold">RedditLens</h2>
        </header>

        <section className="flex flex-col items-center justify-center py-12 md:py-24 text-center">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight mb-4">
            Discover Reddit Users in Seconds
          </h1>
          <p className="text-md md:text-lg text-muted-foreground max-w-2xl mb-8">
            Gain valuable insights into any Reddit user with our powerful analytics tool. Understand posting patterns,
            community engagement, and content preferences.
          </p>

          <div className="flex w-full max-w-md items-center mb-8 relative group">
            <Input
              type="text"
              placeholder="Enter a Reddit username"
              className="rounded-r-none transition-all focus-visible:ring-[#FF4500]/50"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <Button
              type="button"
              className="rounded-l-none bg-[#FF4500] hover:bg-[#FF4500]/90 text-white transition-all"
              onClick={handleSearch}
            >
              Get Insights
            </Button>
          </div>
        </section>

        <section className="py-12 md:py-16">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">See What You'll Discover</h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-6xl mx-auto">
            <Card className="shadow-lg border-t-4 border-t-[#FF4500] h-full flex flex-col">
              <CardContent className="p-6 flex-1 flex flex-col">
                <div className="mb-4">
                  <span className="text-sm font-medium text-muted-foreground">Visual Insights</span>
                </div>

                <div className="bg-muted rounded-lg p-4 overflow-hidden flex-1 flex items-center justify-center">
                  <img
                    src="/image.png"
                    alt="Placeholder"
                    className="w-full h-full object-contain"
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-lg border-t-4 border-t-[#FF4500] h-full flex flex-col">
              <CardContent className="p-6 flex-1 flex flex-col">
                <div className="mb-4">
                  <span className="text-sm font-medium text-muted-foreground">Example user:</span>
                  <span className="ml-2 font-bold text-[#FF4500]">u/ElonMuskOfficial</span>
                </div>

                                
                <div
                  className="bg-muted rounded-lg p-4 overflow-hidden flex-1"
                  style={{ fontFamily: "monospace" }}
                >
                  <SyntaxHighlighter
                    language="json"
                    style={vscDarkPlus}
                    customStyle={{
                      margin: 0,
                      padding: "1rem",
                      borderRadius: "0.5rem",
                      fontSize: "0.9rem",
                      backgroundColor: "#1E1E1E", 
                      lineHeight: "1.5", 
                      whiteSpace: "pre-wrap", 
                    }}
                  >
                    {jsonString}
                  </SyntaxHighlighter>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        <section className="py-12 md:py-16 border-t">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">API Access</h2>

          <div className="grid grid-cols-1 lg:grid-cols-[40%_60%] gap-4 max-w-6xl mx-auto">
            <div className="flex flex-col">
              <p className="text-muted-foreground mb-4 text-sm">
                RedditLens provides a simple REST API that allows you to programmatically access user insights. Simply make a
                GET request to our endpoint with the username parameter.
              </p>
            </div>

            <div className="flex flex-col">
              <div className="bg-black text-white rounded-lg p-3 font-mono text-sm overflow-x-auto flex-1 flex items-center">
                <pre className="whitespace-pre-wrap">
                  <code>
                    curl -X GET{" "}
                    <span className="text-[#FF4500]">
                      "https://redditlens.abhiramreddy.in/api/analyze/USERNAME"
                    </span>
                  </code>
                </pre>
              </div>
            </div>
          </div>
        </section>

        <section className="py-12 md:py-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center text-center p-4">
              <div className="w-12 h-12 rounded-full bg-[#FF4500]/10 flex items-center justify-center mb-4">
                <span className="text-[#FF4500] text-xl font-bold">1</span>
              </div>
              <h3 className="text-xl font-bold mb-2">Comprehensive Analysis</h3>
              <p className="text-muted-foreground">
                Get detailed insights into posting patterns, community engagement, and content preferences.
              </p>
            </div>

            <div className="flex flex-col items-center text-center p-4">
              <div className="w-12 h-12 rounded-full bg-[#FF4500]/10 flex items-center justify-center mb-4">
                <span className="text-[#FF4500] text-xl font-bold">2</span>
              </div>
              <h3 className="text-xl font-bold mb-2">AI-Powered Sentiment</h3>
              <p className="text-muted-foreground">
                Understand the emotional tone of users' content with our advanced sentiment analysis.
              </p>
            </div>

            <div className="flex flex-col items-center text-center p-4">
              <div className="w-12 h-12 rounded-full bg-[#FF4500]/10 flex items-center justify-center mb-4">
                <span className="text-[#FF4500] text-xl font-bold">3</span>
              </div>
              <h3 className="text-xl font-bold mb-2">Community Mapping</h3>
              <p className="text-muted-foreground">
                Discover which subreddits users frequent and how they interact within different communities.
              </p>
            </div>
          </div>
        </section>

        <footer className="py-8 border-t text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} RedditLens. </p>
        </footer>
      </div>
    </main>
  )
}

