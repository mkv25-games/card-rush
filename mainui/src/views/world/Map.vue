<template>
  <multi-page-section-view class="multi-page-section world-map scroll">
    <h1><icon icon="map-marked-alt" /> World Map</h1>
    <p>Map of {{ saveFile.name }}</p>
    <tabulation :items="[saveFile.world || {}]" />
    <world-map :world="world"></world-map>
  </multi-page-section-view>
</template>

<script>
export default {
  computed: {
    saveFile () {
      return this.$store.state.saveFile || {}
    },
    world () {
      return this.saveFile.world || { name: 'Unknown World' }
    }
  }
}
</script>
