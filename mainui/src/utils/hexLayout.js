import { Layout, Point } from './hex.js'

export function calculateHexagonRing (center, radius) {
  const hexes = []
  let hex = center.add(center.neighbor(4).scale(radius))
  for (let i = 0; i < 6; i++) {
    for (let j = 0; j < radius; j++) {
      hexes.push(hex)
      hex = hex.neighbor(i)
    }
  }

  return hexes
}

export function calculateHexagonSpiral (center, radius) {
  const rings = [center]
  for (let k = 1; k < radius; k++) {
    const ring = calculateHexagonRing(center, k)
    rings.push(ring)
  }
  const hexes = rings.flat(1)
  return hexes
}

export function createScreenLayout (tileSize) {
  const size = new Point(tileSize / 2, tileSize / 2)
  const offset = new Point(0, 0)
  const screenLayout = new Layout(Layout.pointy, size, offset)
  return screenLayout
}
