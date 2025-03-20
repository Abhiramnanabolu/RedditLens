"use client"

import { useParams } from "next/navigation"
import { useState, useEffect } from "react"
import { ExternalLink } from "lucide-react"
import { format } from "date-fns"
import { BackButton } from "@/components/ui/backButton"

interface UserData {
  title: string
  display_name: string
  comment_karma: number
  link_karma: number
  description: string
  created: number
  avatar: string
  premium: boolean
  icon_img: string
  name: string
  banner_img: string
}

interface UserInsights {
  age?: string
  sex?: string
  hobby?: string
  location?: string
  occupation?: string
  relationship?: string
  income_level?: string
  interests?: string[]
  brand_mentions?: string[]
  life_stage?: string
  personality?: string
  [key: string]: any
}

export default function UserDetails() {
  const params = useParams()
  const username = params.username as string
  const [userData, setUserData] = useState<UserData | null>(null)
  const [insights, setInsights] = useState<UserInsights | null>(null)
  const [loading2, setLoading2] = useState(true)
  const [error2, setError2] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchSimpleUserData() {
      try {
        const response = await fetch(`https://www.reddit.com/user/${username}/about.json`)
        if (!response.ok) {
          throw new Error("Failed to fetch user data")
        }
        const data = await response.json()
        const simplifiedData = {
          title: data.data.subreddit.title,
          display_name: data.data.subreddit.display_name_prefixed,
          comment_karma: data.data.comment_karma,
          link_karma: data.data.link_karma,
          description: data.data.subreddit.public_description,
          created: data.data.created_utc,
          banner_img: data.data.subreddit.banner_img,
          avatar:
            data.data.snoovatar_img ||
            `https://www.redditstatic.com/avatars/defaults/v2/avatar_default_${Math.floor(Math.random() * 8)}.png`,
          premium: data.data.is_gold,
          icon_img: data.data.icon_img,
          name: data.data.name,
        }
        setUserData(simplifiedData)
      } catch (err) {
        setError((err as Error).message)
      } finally {
        setLoading(false)
      }
    }

    fetchSimpleUserData()
  }, [username])

  useEffect(() => {
    async function fetchAnalytics() {
      try {
        const response = await fetch(`/api/username/${username}`)
        if (!response.ok) {
          throw new Error("Failed to fetch analytics")
        }
        const data = await response.json()
        
        const parsedInsights = parseInsights(data.insights)
        setInsights(parsedInsights)
      } catch (err) {
        setError2((err as Error).message)
      } finally {
        setLoading2(false)
      }
    }

    fetchAnalytics()
  }, [username])

  function parseInsights(insights: any): UserInsights | null {
    if (typeof insights === "string") {
      try {
        const jsonMatch = insights.match(/```json\n([\s\S]*?)\n```/)
        if (jsonMatch && jsonMatch[1]) {
          return JSON.parse(jsonMatch[1])
        }
        return JSON.parse(insights)
      } catch (e) {
        console.error("Could not parse insights data:", e)
        return null
      }
    }
    return insights
  }

  function formatKarma(karma: number): string {
    if (karma >= 1000000) {
      return (karma / 1000000).toFixed(1) + "M"
    } else if (karma >= 1000) {
      return (karma / 1000).toFixed(1) + "K"
    }
    return karma.toString()
  }

  function formatDate(timestamp: number): string {
    return format(new Date(timestamp * 1000), "MMMM d, yyyy")
  }

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#1A1A1B]">
        <div className="animate-pulse flex space-x-4">
          <div className="rounded-full bg-[#343536] h-12 w-12"></div>
          <div className="flex-1 space-y-4 py-1">
            <div className="h-4 bg-[#343536] rounded w-3/4"></div>
            <div className="space-y-2">
              <div className="h-4 bg-[#343536] rounded"></div>
              <div className="h-4 bg-[#343536] rounded w-5/6"></div>
            </div>
          </div>
        </div>
      </div>
    )

  if (error)
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#1A1A1B]">
        <div className="bg-[#272729] border border-[#343536] rounded-lg p-6 max-w-md w-full">
          <div className="text-red-500 flex items-center justify-center">
            <p>Error: {error}</p>
          </div>
        </div>
      </div>
    )

  if (!userData)
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#1A1A1B]">
        <div className="bg-[#272729] border border-[#343536] rounded-lg p-6 max-w-md w-full">
          <div className="text-[#D7DADC] flex items-center justify-center">
            <p>No user data found</p>
          </div>
        </div>
      </div>
    )

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 bg-[#1A1A1B] text-[#D7DADC]">
      <div className="max-w-3xl mx-auto">
        <BackButton />
        <div className="bg-[#1E1F20] border border-[#343536] rounded-lg overflow-hidden shadow-lg">
          <div className="px-6 pt-0 pb-6 relative ">
            <div className="flex flex-col sm:flex-row sm:justify-between mt-4">
              <div className="flex items-center space-x-4 mb-4 sm:mb-0">
                <div className="">
                  <div className="border-2 border-[#1E1F20] rounded-full  overflow-hidden">
                    <img
                      src={userData.avatar || "/placeholder.svg"}
                      alt={`${userData.display_name}'s avatar`}
                      className="w-24 h-24 bg-[#1A1A1B]"
                      onError={(e) => {
                        ;(e.target as HTMLImageElement).src = `${userData.icon_img}`
                      }}
                    />
                  </div>
                </div>

                <div className="">
                  {userData.title ? (
                    <p className="text-xl">{userData.title}</p>
                  ) : (
                    <p className="text-xl">{userData.name}</p>
                  )}
                  <p className="text-[#818384] text-sm">{userData.display_name}</p>
                </div>
              </div>
              {userData.premium && (
                <div className="ml-2 mb-2">
                  <span className="bg-[#FF4500] text-white text-xs px-2 py-1 rounded-full font-medium">Premium</span>
                </div>
              )}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-8 mt-4 mb-6">
              <div className="flex flex-col items-center">
                <span className="text-xl sm:text-2xl font-bold text-[#D7DADC]">{formatKarma(userData.link_karma)}</span>
                <span className="text-xs sm:text-sm mt-1 text-[#818384]">Post karma</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-xl sm:text-2xl font-bold text-[#D7DADC]">
                  {formatKarma(userData.comment_karma)}
                </span>
                <span className="text-xs sm:text-sm mt-1 text-[#818384]">Comment karma</span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-lg sm:text-xl font-bold text-[#D7DADC]">{formatDate(userData.created)}</span>
                <span className="text-xs sm:text-sm mt-1 text-[#818384]">Cake Day</span>
              </div>
            </div>

            {userData.description && (
              <div className="mb-6 p-3 bg-[#1A1A1B] rounded-md">
                <p className="text-sm">{userData.description}</p>
              </div>
            )}

            
            <div className="flex justify-center sm:justify-start">
              <a
                href={`https://www.reddit.com/user/${username}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-[#272729] text-[#D7DADC] rounded-full text-sm font-medium hover:bg-[#343536] transition-colors border border-[#343536]"
              >
                <ExternalLink className="w-4 h-4" />
                View on Reddit
              </a>
            </div>
          </div>
        </div>

        <div className="mt-6 bg-[#1E1F20] border border-[#343536] rounded-lg p-6">
          <h2 className="text-lg font-medium mb-4">User Insights</h2>

          {loading2 ? (
            <div className="space-y-2">
              <div className="p-3 bg-[#1A1A1B] rounded-md animate-pulse">
                <div className="h-4 bg-[#343536] rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-[#343536] rounded w-1/2"></div>
              </div>
            </div>
          ) : error2 ? (
            <div className="p-3 bg-[#1A1A1B] rounded-md">
              <p className="text-red-500">Error loading insights: {error2}</p>
            </div>
          ) : insights ? (
            <div className="bg-[#1A1A1B] rounded-md p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(insights).map(([key, value]) => {
                  if ((Array.isArray(value) && value.length === 0) || value === "Unknown") {
                    return null;
                  }
                  
                  return (
                    <div key={key} className="p-3 bg-[#272729] rounded-md">
                      <h3 className="text-sm font-medium text-[#818384] mb-2">
                        {key.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                      </h3>
                      
                      {Array.isArray(value) ? (
                        <div className="flex flex-wrap gap-2">
                          {value.map((item, i) => (
                            <span 
                              key={i} 
                              className="bg-[#343536] text-[#D7DADC] text-xs px-2 py-1 rounded-full"
                            >
                              {item}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-[#D7DADC]">{value}</p>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="p-3 bg-[#1A1A1B] rounded-md">
              <p className="text-[#818384]">No insights available</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}