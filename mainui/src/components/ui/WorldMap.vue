<template>
  <svg v-if="layout" :viewBox="viewBox">
    <g :transform="`translate(${layout.width / 2} ${layout.height / 2})`">
      <world-map-location v-for="location in layout.locations" :key="location.id"
        :show-icon="showIcons"
        :show-label="showLabels"
        :class="location.className || 'location'"
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
      return [0, 0, layout.width, layout.height].join(' ')
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
      const { world, locationTypes, showFogOfWar } = this
      const defaultLayout = this.createWorldLayout({ world, locationTypes })
      const layout = showFogOfWar ? computeFogOfWar(defaultLayout) : defaultLayout
      this.layout = layout
      graduallyShowLocationsInOrder({ locations: this.layout.locations })
    },
    createWorldLayout ({ world, locationTypes }) {
      const locations = createWorldLocations({ world, locationTypes }).map(location => mapLocationToScreen(location, screenLayout, tileSize))

      const { top, left, right, bottom } = calculateBoundingBox(locations)
      return {
        locations,
        width: Math.abs(right - left) + (tileSize),
        height: Math.abs(bottom - top) + (tileSize),
        tileSize
      }
    }
  },
  watch: {
    world () {
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
