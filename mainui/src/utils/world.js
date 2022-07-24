import { generateSeedFrom } from './seeds.js'
import { calculateBoundingBox, calculateHexagonSpiral, mapHexesToSet } from './hexLayout.js'
import { Hex } from './hex.js'

export function createWorldLocations ({ world, locationTypes }) {
  const radius = world ? world.size : 4 || 4
  const worldSeed = generateSeedFrom(world.name || 'unknown')
  const center = new Hex(0, 0, 0)
  const locations = world.locations || calculateHexagonSpiral(center, radius).map((hex, index) => createNewLocation({ worldSeed, locationTypes, hex, index }))
  return locations
}

export function createNewLocation ({ worldSeed, locationTypes, hex, index }) {
  const typeSeed = worldSeed + index
  const type = locationTypes[typeSeed % locationTypes.length] || { id: 'unknown', name: 'Unknown', icon: 'mountain', color: '#999' }
  const location = {
    hex,
    label: type.name,
    color: type.color,
    data: type
  }
  return location
}

export function computeFogOfWar ({ locations, center, tileSize }) {
  center = center || new Hex(0, 0, 0)
  const fogRadius = 3
  const fogSpiral = calculateHexagonSpiral(center, fogRadius)
  const fogMap = mapHexesToSet(fogSpiral)

  const fogLocations = locations.filter(loc => fogMap[loc.hex.id()])

  const { top, left, right, bottom } = calculateBoundingBox(fogLocations)
  return {
    locations: fogLocations,
    width: Math.abs(right - left) + (tileSize),
    height: Math.abs(bottom - top) + (tileSize)
  }
}
