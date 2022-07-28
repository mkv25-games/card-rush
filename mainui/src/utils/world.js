import { generateSeedFrom } from './seeds.js'
import { calculateHexagonSpiral } from './hexLayout.js'
import { Hex } from './hex.js'

export function createWorldLocations ({ world, locationTypes }) {
  const radius = world ? world.size : 4 || 4
  const worldSeed = generateSeedFrom(world.name || 'unknown')
  const center = new Hex(0, 0, 0)
  const validTypes = locationTypes.filter(lt => lt.id !== 'out-of-bounds')
  const locations = world.locations || calculateHexagonSpiral(center, radius).map((hex, index) => createSeededLocation({ worldSeed, locationTypes: validTypes, hex, index }))
  return locations
}

export function createOutOfBoundsLocation ({ locationTypes, hex }) {
  const type = locationTypes.filter(n => n.id === 'out-of-bounds')[0] || { id: 'out-of-bounds', name: 'Unknown?', icon: 'question', color: 'brown' }
  return createNewLocation({ type, hex })
}

export function createNewLocation ({ type, hex }) {
  type = type || { id: 'unknown', name: 'Unknown', icon: 'mountain', color: '#999' }
  const location = {
    hex,
    label: type.name,
    color: type.color,
    data: type
  }
  return location
}

export function createSeededLocation ({ worldSeed, locationTypes, hex, index }) {
  const typeSeed = worldSeed + index
  const type = locationTypes[typeSeed % locationTypes.length] || { id: 'unknown', name: 'Unknown', icon: 'mountain', color: '#999' }
  return createNewLocation({ type, hex })
}

export function mapLocationsToSet (list) {
  return list.reduce((acc, loc) => {
    const { hex } = loc
    acc[hex.id()] = loc
    return acc
  }, {})
}

export function computeFogOfWar ({ locations, locationTypes, centerHex }) {
  centerHex = centerHex || new Hex(0, 0, 0)

  const visibleRadius = 4
  const visibleSpiral = calculateHexagonSpiral(centerHex, visibleRadius)
  const fogRadius = visibleRadius + 2
  const fogSpiral = calculateHexagonSpiral(centerHex, fogRadius)

  const locationsMap = mapLocationsToSet(locations)
  const displayLocations = visibleSpiral.map(hex => locationsMap[hex.id()] || createOutOfBoundsLocation({ locationTypes, hex }))

  const displayLocationsMap = mapLocationsToSet(displayLocations)
  const borderLocations = fogSpiral.map(hex => displayLocationsMap[hex.id()] || createOutOfBoundsLocation({ locationTypes, hex }))

  return { displayLocations, borderLocations }
}
