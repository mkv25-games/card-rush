<template>
  <multi-page-section-view class="multi-page-section world-map">
    <div class="page-content">
      <world-map
        :world="world"
        :center="selectedLocation"
        :show-icons="false"
        :show-labels="false"
        :show-images="true"
        :show-fog-of-war="true"
        v-on:starting-location="handleStartingLocation"
        v-on:highlight-location="handleHighlightedLocation"
        v-on:select-location="handleSelectedLocation"
        ></world-map>
      <lightbox v-if="showMapInfo">
        <h1><icon icon="map-marked-alt" /> World Map</h1>
        <p>Map of {{ saveFile.name }}</p>
        <tabulation :items="[saveFile.world || {}]" />
        <world-map
          :world="world"
          :show-icons="false"
          :show-labels="false"
          :show-images="false"
          :show-fog-of-war="false"></world-map>
        <form-button v-on:click="showMapInfo = false" icon="window-close" label="Hide Map Info" />
      </lightbox>
      <div v-else>
        <div class="actions show-dialog-button">
          <form-button v-on:click="showMapInfo = true" icon="map-marked-alt" label="Show Map Info" />
        </div>
        <div class="location-info">
          <form-button v-if="selectedLocation || startingLocation"
            :icon="(selectedLocation || startingLocation).data.icon"
            :label="(selectedLocation || startingLocation).data.name" />
          <form-button v-if="highlightedLocation" :icon="highlightedLocation.data.icon" :label="highlightedLocation.data.name" />
        </div>
      </div>
    </div>
  </multi-page-section-view>
</template>

<script>
export default {
  data () {
    return {
      showMapInfo: false,
      startingLocation: null,
      highlightedLocation: null,
      selectedLocation: null
    }
  },
  computed: {
    saveFile () {
      return this.$store.state.saveFile || {}
    },
    world () {
      return this.saveFile.world || { name: 'Unknown World' }
    }
  },
  methods: {
    handleStartingLocation (location) {
      this.startingLocation = location
    },
    handleHighlightedLocation (location) {
      this.highlightedLocation = location
    },
    handleSelectedLocation (location) {
      if (location.data.type === 'hidden' || location.fogged) {
        return
      }
      console.log('Select location:', location)
      this.selectedLocation = location
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
  background: black;
}
.page-content > svg {
  height: 100%;
}
.show-dialog-button {
  position: absolute;
  top: 1em;
  right: 1em;
}
.location-info {
  position: absolute;
  top: 1em;
  left: 1em;
}
.location-info > * {
  width: 120px;
}
</style>
