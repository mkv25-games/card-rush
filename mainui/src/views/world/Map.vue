<template>
  <multi-page-section-view class="multi-page-section world-map">
    <div class="page-content">
      <world-map :world="world"></world-map>
      <lightbox v-if="showMapInfo">
        <h1><icon icon="map-marked-alt" /> World Map</h1>
        <p>Map of {{ saveFile.name }}</p>
        <tabulation :items="[saveFile.world || {}]" />
        <form-button v-on:click="showMapInfo = false" icon="window-close" label="Hide Map Info" />
      </lightbox>
      <div v-else class="actions show-dialog-button">
        <form-button v-on:click="showMapInfo = true" icon="map-marked-alt" label="Show Map Info" />
      </div>
    </div>
  </multi-page-section-view>
</template>

<script>
export default {
  data () {
    return {
      showMapInfo: false
    }
  },
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

<style scoped>
.page-content {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
}
.page-content > svg {
  height: 100%;
}
.show-dialog-button {
  position: absolute;
  top: 1em;
  right: 1em;
}
</style>
