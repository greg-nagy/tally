import { fetchWithTimeout } from "@tallyho/tally-background/utils/fetching"
import { useEffect, useState } from "react"

enum CampaignStatus {
  Draft = "Draft",
  Active = "Active",
  NotStarted = "NotStarted",
  Expired = "Expired",
  CapReached = "CapReached",
  Deleted = "Deleted",
}

type Campaign = {
  id: string
  name: string
  status: CampaignStatus
  description: string
  thumbnail: string
  startTime: number
  endTime: number
}

async function getActiveCampaign(): Promise<Campaign | null> {
  try {
    const {
      data: {
        space: {
          campaigns: { list: achievements = [] },
        },
      },
    } = (await (
      await fetchWithTimeout("https://graphigo.prd.galaxy.eco/query", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          variables: {},
          operationName: "ArbitrumCampaigns",
          query: `
            query ArbitrumCampaigns {
              space(alias: "arbitrum") {
                campaigns(input: {
                  chains: [ARBITRUM]
                  statuses: [Active]
                  permissions: [PUBLIC]
                  listType: Newest
                }) {
                  list {
                    id
                    name
                    status
                    thumbnail
                    startTime
                    endTime
                  }
                }
              }
            }
          `,
        }),
      })
    ).json()) as { data: { space: { campaigns: { list: Campaign[] } } } }

    return achievements[0] ?? null
  } catch (error) {
    return null
  }
}

export default (): Campaign | null | undefined => {
  const [campaign, setCampaign] = useState<Campaign | null | undefined>(
    undefined
  )

  useEffect(() => {
    const fetchCampaign = async () => {
      const active = await getActiveCampaign()
      setCampaign(active)
    }

    fetchCampaign()
  }, [])

  return campaign
}