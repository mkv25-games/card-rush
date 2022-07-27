<template>
  <svg v-if="layout" :viewBox="viewBox">
    <g :transform="viewCenter">
      <world-map-location v-for="location in layout.locations" :key="[location.id, location.data.id].join(':')"
        :show-icon="showIcons"
        :show-label="showLabels"
        :class="location.className || 'location'"
        v-on:mousedown="selectLocation(location)"
        v-on:mouseover="highlightLocation(location)"
        :location="location" />
    </g>
  </svg>
</template>

<script>
import { createWorldLocations, computeFogOfWar } from '@/utils/world.js'
import { createScreenLayout, calculateBoundingBox } from '@/utils/hexLayout.js'

const tileSize = 120
const screenLayout = createScreenLayout(tileSize)

function mapLocationToScreen (location, screenLayout, tileSize) {
  const { hex } = location
  const { x, y } = screenLayout.hexToPixel(hex)
  const id = ['l', hex.s, hex.r, hex.q].join('_')

  return Object.assign({}, { id, x, y, width: tileSize, height: tileSize }, location)
}

function graduallyShowLocationsInOrder ({ locations, totalAnimationTimeInMs = 2000 }) {
  const delayInMs = Math.round(totalAnimationTimeInMs / locations.length)
  locations.forEach((location, index) => {
    location.animationState = 'hidden'
    setTimeout(() => {
      location.animationState = 'showing'
      setTimeout(() => {
        location.animationState = 'visible'
      }, 500)
    }, delayInMs * index)
  })
}

export default {
  data () {
    return {
      layout: null
    }
  },
  props: {
    world: {
      type: Object,
      default () {}
    },
    center: {
      type: Object,
      default: null
    },
    showIcons: {
      type: Boolean,
      default: false
    },
    showLabels: {
      type: Boolean,
      default: true
    },
    showFogOfWar: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    locationTypes () {
      return this.$store.state.gamedata.Location || []
    },
    viewBox () {
      const { layout } = this
      return [layout.minx, layout.miny, layout.width, layout.height].join(' ')
    },
    viewCenter () {
      const { layout } = this
      const { displayCenter, spiralCenter } = layout
      console.log({ displayCenter, spiralCenter })
      const x = -(displayCenter.x - spiralCenter.x) + (layout.tileSize / 2)
      const y = -(displayCenter.y - spiralCenter.y) + (layout.tileSize / 2)
      return `translate(${x} ${y})`
    }
  },
  async mounted () {
    await Promise.all([
      this.$store.dispatch('loadModpacks')
    ])
    this.updateLayout()
  },
  methods: {
    updateLayout () {
      const { world, center, locationTypes, showFogOfWar } = this
      const defaultWorldLocations = createWorldLocations({ world, locationTypes })
      const centerHex = center ? center.hex : null
      const defaultVisibleLocations = { displayLocations: defaultWorldLocations, borderLocations: defaultWorldLocations }
      const { displayLocations, borderLocations } = showFogOfWar ? computeFogOfWar({ locations: defaultWorldLocations, locationTypes, centerHex }) : defaultVisibleLocations
      const layout = this.createDisplayLayout({ displayLocations, borderLocations, center })
      this.layout = layout
      graduallyShowLocationsInOrder({ locations: this.layout.locations })
    },
    createDisplayLayout ({ displayLocations, borderLocations, center }) {
      const spiralCenter = displayLocations[0]
      center = center || spiralCenter
      const displayCenter = mapLocationToScreen(center, screenLayout, tileSize)
      const displayLocationsRef = displayLocations.map(location => mapLocationToScreen(location, screenLayout, tileSize))
      const borderLocationsRef = borderLocations.map(location => mapLocationToScreen(location, screenLayout, tileSize))

      const { top, left, right, bottom } = calculateBoundingBox(displayLocationsRef)
      const minx = left
      const miny = top
      return {
        locations: borderLocationsRef,
        minx,
        miny,
        width: Math.abs(right - left) + (tileSize),
        height: Math.abs(bottom - top) + (tileSize),
        tileSize,
        displayCenter,
        spiralCenter: mapLocationToScreen(spiralCenter, screenLayout, tileSize)
      }
    },
    selectLocation (location) {
      this.$emit('selectLocation', location)
    },
    highlightLocation (location) {
      this.$emit('highlightLocation', location)
    }
  },
  watch: {
    world () {
      this.updateLayout()
    },
    center () {
      this.updateLayout()
    }
  }
}
</script>

<style scoped>
svg {
  zoom: 1.0;
}
</style>
