<template>
  <svg v-if="layout" :viewBox="viewBox">
    <g :transform="`translate(${layout.width / 2} ${layout.height / 2})`">
      <world-map-location v-for="location in layout.locations" :key="location.id"
        :show-icon="showIcons"
        :class="location.className || 'location'"
        :location="location" />
    </g>
  </svg>
</template>

<script>
import { createWorldLocations } from '../../utils/world.js'
import { createScreenLayout } from '../../utils/hexLayout.js'

const tileSize = 120
const screenLayout = createScreenLayout(tileSize)

function mapLocationToScreen (location, screenLayout, tileSize) {
  const { hex } = location
  const { x, y } = screenLayout.hexToPixel(hex)
  const id = ['l', hex.s, hex.r, hex.q].join('_')

  return Object.assign({}, { id, x, y, width: tileSize, height: tileSize }, location)
}

function calculateBoundingBox (locations) {
  return {
    top: Math.min(...locations.map(loc => loc.y)),
    left: Math.min(...locations.map(loc => loc.x)),
    right: Math.max(...locations.map(loc => loc.x)),
    bottom: Math.max(...locations.map(loc => loc.y))
  }
}

export default {
  data () {
    return {}
  },
  props: {
    world: {
      type: Object,
      default () {
        return {}
      }
    },
    showIcons: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    layout () {
      return this.createWorldLayout()
    },
    locationTypes () {
      return this.$store.state.gamedata.Location || []
    },
    viewBox () {
      const { layout } = this
      return [0, 0, layout.width, layout.height].join(' ')
    }
  },
  async mounted () {
    await Promise.all([
      this.$store.dispatch('loadModpacks')
    ])
  },
  methods: {
    createWorldLayout () {
      const { world, locationTypes } = this
      const locations = createWorldLocations({ world, locationTypes }).map(location => mapLocationToScreen(location, screenLayout, tileSize))

      const { top, left, right, bottom } = calculateBoundingBox(locations)
      return {
        locations,
        width: Math.abs(right - left) + (tileSize),
        height: Math.abs(bottom - top) + (tileSize)
      }
    }
  }
}
</script>

<style scoped>
svg {
  zoom: 1.0;
}
</style>
