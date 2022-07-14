<template>
    <div class="card" :style="{ outlineColor: baseColor }">
      <label>{{ card.name || card.error || card.id }}</label>
      <label v-if="effects.defense">Defense: {{ effects.defense }}</label>
      <label v-if="effects.attack">Attack: {{ effects.attack }}</label>
      <label v-if="effects.guard">Guard: {{ effects.guard }}</label>
      <label v-if="effects.parry">Parry: {{ effects.parry }}</label>
      <label v-if="effects.next">Next Turn: {{ effects.next }}</label>
      <div class="baseIcon" :style="{ background: baseColor }">
        <icon :icon="baseIcon || 'seedling'" />
      </div>
    </div>
</template>

<script>
export default {
  props: {
    cardId: {
      type: String,
      default: ''
    },
    baseColor: {
      type: String,
      default: '#000'
    },
    baseIcon: {
      type: String,
      default: 'seedling'
    }
  },
  computed: {
    card () {
      return this.findCard(this.cardId)
    },
    cards () {
      return this.$store.getGamedataIndex('Card')
    },
    effects () {
      return this.card.effects || {}
    }
  },
  methods: {
    findCard (id) {
      return this.cards[id] || { id, error: `No card found for ${id};` }
    }
  }
}
</script>

<style scoped>

.card {
  display: flex;
  position: relative;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  width: 10em;
  height: 16em;
  background: white;
  margin: 1em;
  outline-width: 0.5em;
  outline-style: solid;
  font-size: 0.8em;
  border-radius: 0.3em;
}

.baseIcon {
  position: absolute;
  bottom: 0;
  right: 0;
  padding: 0.2em 0 0 0.2em;
  font-size: 2em;
  border-radius: 1.0em 0 0 0;
}
</style>
