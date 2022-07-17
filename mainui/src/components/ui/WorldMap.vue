<template>
  <svg v-if="layout" :viewBox="viewBox">
    <g :transform="`translate(${layout.width / 2} ${layout.height / 2})`">
      <world-map-location v-for="location in layout.locations" :key="location.id"
        :class="location.className || 'location'"
        :location="location" />
    </g>
  </svg>
</template>

<script>
import { generateSeedFrom } from '../../utils/seeds.js'
import { Hex } from '../../utils/hex.js'
import { calculateHexagonSpiral, createScreenLayout } from '../../utils/hexLayout.js'

const tileSize = 120
const screenLayout = createScreenLayout(tileSize)

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
    },
    viewBox () {
      const { layout } = this
      return [0, 0, layout.width, layout.height].join(' ')
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
      const { createNewLocation } = this
      const radius = this.world.size || 4
      const center = new Hex(0, 0, 0)
      const locations = this.world.locations || calculateHexagonSpiral(center, radius).map((hex, index) => createNewLocation({ hex, index }))

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
