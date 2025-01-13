'use client'

import { useState, useEffect } from 'react'
import { fetchSponsoredTrees, Tree } from '@/utils/mockData'
import { TreeList } from './TreeList'
import { TreeMap } from './TreeMap'
import { ProductionTimeline } from './ProductionTimeline'

export function ClientDashboard({ clientId }: { clientId: number }) {
  const [trees, setTrees] = useState<Tree[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadTrees() {
      try {
        const sponsoredTrees = await fetchSponsoredTrees(clientId)
        setTrees(sponsoredTrees)
      } catch (err) {
        setError('Failed to load sponsored trees')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    loadTrees()
  }, [clientId])

  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error}</div>

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Your Sponsored Trees</h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <h2 className="text-2xl font-semibold mb-4">Tree List</h2>
          <TreeList trees={trees} />
        </div>
        <div>
          <h2 className="text-2xl font-semibold mb-4">Tree Locations</h2>
          <TreeMap trees={trees} />
        </div>
      </div>
      <div className="mt-8">
        <h2 className="text-2xl font-semibold mb-4">Production Timeline</h2>
        <ProductionTimeline trees={trees} />
      </div>
    </div>
  )
}

