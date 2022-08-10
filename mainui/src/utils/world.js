import { generateSeedFrom } from './seeds.js'
import { calculateHexagonSpiral } from './hexLayout.js'
import { Hex } from './hex.js'

export function createWorldLocations ({ world, locationTypes }) {
  const radius = world ? world.size : 4 || 4
  const worldSeed = generateSeedFrom(world.name || 'unknown')
  const center = new Hex(0, 0, 0)
  const validTypes = locationTypes.filter(lt => lt.type !== 'hidden')
  const locations = world.locations || calculateHexagonSpiral(center, radius).map((hex, index) => createSeededLocation({ worldSeed, locationTypes: validTypes, hex, index }))
  return locations
}

export function createOutOfBoundsLocation ({ locationTypes, hex }) {
  const type = locationTypes.filter(n => n.type === 'hidden')[0] || { id: 'out-of-bounds', type: 'hidden', name: 'Unknown?', icon: 'question', color: 'brown' }
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

function unfogVisibleLocation (location) {
  location.fogged = false
  return location
}

function fogBorderLocation (location) {
  location.fogged = true
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

  const visibleRadius = 3
  const visibleSpiral = calculateHexagonSpiral(centerHex, visibleRadius)
  const fogRadius = visibleRadius + 2
  const fogSpiral = calculateHexagonSpiral(centerHex, fogRadius)

  const locationsMap = mapLocationsToSet(locations)
  const visibleLocations = visibleSpiral.map(hex => {
    const visibleLocation = locationsMap[hex.id()] || createOutOfBoundsLocation({ locationTypes, hex })
    return unfogVisibleLocation(visibleLocation)
  })
  const visibleLocationsMap = mapLocationsToSet(visibleLocations)

  const borderLocations = fogSpiral.filter(hex => !visibleLocationsMap[hex.id()]).map(hex => {
    const borderLocation = locationsMap[hex.id()] || createOutOfBoundsLocation({ locationTypes, hex })
    return fogBorderLocation(borderLocation)
  })

  const allLocations = [...visibleLocations, ...borderLocations]

  return { allLocations, borderLocations, visibleLocations }
}
