<template>
  <multi-page-section-view class="multi-page-section character-stats scroll">
    <h1><icon icon="chart-area" /> Character Stats</h1>
    <div v-if="character.name">
      <h2>Current character statistics</h2>
      <tabulation :items="[character]" />
    </div>
    <div v-else>
      <h2>Choose a character class</h2>
      <div v-for="cc in characters" :key="cc.id">
        <h3>{{ cc.name }}</h3>
        <tabulation :items=[cc] />
        <div class="cards">
          <div v-for="(card, idx) in characterCardList(cc)" :key="`c_${card.id}_${idx}`" class="card" :style="{ outlineColor: cc.color }">
            <label>{{ card.name || card.id }}</label>
          </div>
        </div>
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
      return list.map(c => {
        return { id: c }
      })
    }
  }
}
</script>

<style scoped>
.cards {
  display: flex;
  align-items: center;
  justify-content: center;
}
.card {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 5em;
  height: 8em;
  background: white;
  margin: 1em;
  outline-width: 0.5em;
  outline-style: solid;
}
</style>
