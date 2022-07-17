<template>
  <svg v-if="layout" :width="layout.width" :height="layout.height">
    <g>
      <world-map-location v-for="location in layout.locations" :key="location.id"
        :class="location.className || 'location'"
        :location="location" />
    </g>
  </svg>
</template>

<script>
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
    await this.updateMap()
    const layout = await this.createLayout()
    console.log('World Map mounted:', layout)
    this.layout = layout
  },
  methods: {
    createLayout () {
      const types = this.locationTypes
      const type = types[0] || { id: 'unknown', name: 'Unknown', icon: 'mountain', color: '#999' }
      const locations = this.world.locations || [{
        x: 0,
        y: 0,
        label: type.name,
        type,
        className: type.id,
        data: type
      }]

      locations.forEach(loc => {
        loc.id = ['l', loc.x, loc.y].join('_')
      })

      this.layout.locations = locations
      return {
        locations,
        width: 100,
        height: 100
      }
    },
    updateMap () {

    }
  }
}
</script>

<style scoped>
svg {
  zoom: 1.0;
}
</style>
