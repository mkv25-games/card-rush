import { generateSeedFrom } from './seeds.js'
import { calculateHexagonSpiral } from './hexLayout.js'
import { Hex } from './hex.js'

export function createWorldLocations ({ world, locationTypes }) {
  const radius = world ? world.size : 4 || 4
  const worldSeed = generateSeedFrom(world.name || 'unknown')
  const center = new Hex(0, 0, 0)
  const locations = calculateHexagonSpiral(center, radius).map((hex, index) => createNewLocation({ worldSeed, locationTypes, hex, index }))
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
