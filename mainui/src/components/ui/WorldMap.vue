<template>
  <svg v-if="layout" :width="layout.width" :height="layout.height">
    <g :transform="`translate(${layout.width / 2} ${layout.height / 2})`">
      <world-map-location v-for="location in layout.locations" :key="location.id"
        :class="location.className || 'location'"
        :location="location" />
    </g>
  </svg>
</template>

<script>
import { Hex, Layout, Point } from '../../utils/hex.js'
import { generateSeedFrom } from '../../utils/seeds.js'
const tileSize = 120

const screenLayout = new Layout(Layout.pointy, new Point(tileSize / 2, tileSize / 2), new Point(0, 0))

function createHexagonRing (center, radius) {
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

function createHexagonLayout ({ radius, generatorFn }) {
  const center = new Hex(0, 0, 0)
  const rings = [center]
  for (let k = 1; k < radius; k++) {
    const ring = createHexagonRing(center, k)
    rings.push(ring)
  }

  const hexes = rings.flat(1)
  console.log('Spiral Hexes:', hexes)

  return hexes.map((hex, index) => generatorFn({ hex, index }))
}

export default {
  data () {
    return {
      layout: {
        locations: [],
        width: 0,
        height: 0
      }
    }
  },
  computed: {
    locationTypes () {
      return this.$store.state.gamedata.Location || []
    },
    saveFile () {
      return this.$store.state.saveFile || {}
    },
    world () {
      return this.saveFile.world || {}
    }
  },
  async mounted () {
    await Promise.all([
      this.$store.dispatch('refreshSaveFileList'),
      this.$store.dispatch('loadModpacks')
    ])
    const layout = await this.createLayout()
    console.log('World Map mounted:', layout)
    this.layout = layout
  },
  methods: {
    createLayout () {
      const radius = this.world.size || 4
      const locations = this.world.locations || createHexagonLayout({ radius, generatorFn: this.createNewLocation })

      const top = Math.min(...locations.map(loc => loc.y))
      const left = Math.min(...locations.map(loc => loc.x))
      const right = Math.max(...locations.map(loc => loc.x))
      const bottom = Math.max(...locations.map(loc => loc.y))

      console.log('Locations!', locations, { top, left, right, bottom })

      this.layout.locations = locations
      return {
        locations,
        width: Math.abs(right - left) + (tileSize * 2),
        height: Math.abs(bottom - top) + (tileSize * 2)
      }
    },
    createNewLocation ({ hex, index }) {
      const world = this.world
      const types = this.locationTypes
      const { x, y } = screenLayout.hexToPixel(hex)
      const worldSeed = generateSeedFrom(world.name || 'unknown')
      const typeSeed = worldSeed + index
      const type = types[typeSeed % types.length] || { id: 'unknown', name: 'Unknown', icon: 'mountain', color: '#999' }
      const location = {
        hex,
        x,
        y,
        width: tileSize,
        height: tileSize,
        label: type.name,
        color: type.color,
        data: type,
        id: ['l', x, y].join('_')
      }
      return location
    }
  }
}
</script>

<style scoped>
svg {
  zoom: 1.0;
}
</style>
