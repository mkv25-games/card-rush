<template>
  <multi-page-section-view class="multi-page-section character-stats scroll">
    <h1><icon icon="chart-area" /> Character Stats</h1>
    <FlipCard />
    <div v-if="character.name">
      <h2>Current character statistics</h2>
      <tabulation :items="[character]" />
    </div>
    <div v-else>
      <h2>Choose a character class</h2>
      <div v-for="cc in characters" :key="cc.id">
        <h3>{{ cc.name }}</h3>
        <tabulation :items=[cc] />
        <card-row :cards="characterCardList(cc)" :baseColor="cc.color" :baseIcon="cc.icon" />
      </div>
    </div>
  </multi-page-section-view>
</template>

<script>
export default {
  computed: {
    saveFile () {
      return this.$store.state.saveFile || {}
    },
    character () {
      return this.saveFile.character || {}
    },
    characters () {
      return this.$store.state.gamedata.Character || []
    }
  },
  methods: {
    characterCardList (characterClass) {
      let list = []
      try {
        list = characterClass.starting.cards.split(', ').map(n => n.trim()) || []
      } catch (ex) {
        // No starting cards found?
      }
      return list
    }
  }
}
</script>
