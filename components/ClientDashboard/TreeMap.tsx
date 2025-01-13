'use client'

import { useEffect } from 'react'
import { Tree } from '@/app/utils/mockData'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'

// Fix for default marker icon
delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: '/leaflet/marker-icon-2x.png',
  iconUrl: '/leaflet/marker-icon.png',
  shadowUrl: '/leaflet/marker-shadow.png',
})

export function TreeMap({ trees }: { trees: Tree[] }) {
  useEffect(() => {
    // This is needed to re-render the map when the component mounts on the client side
  }, [])

  if (typeof window === 'undefined') {
    return null // Return null on the server side
  }

  const center = trees.length > 0
    ? [trees[0].latitude, trees[0].longitude]
    : [0, 0]

  return (
    <MapContainer center={center as [number, number]} zoom={3} style={{ height: '400px', width: '100%' }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      {trees.map((tree) => (
        <Marker key={tree.id} position={[tree.latitude, tree.longitude]}>
          <Popup>
            <strong>{tree.name}</strong><br />
            Type: {tree.type}<br />
            Age: {tree.age} years
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  )
}

