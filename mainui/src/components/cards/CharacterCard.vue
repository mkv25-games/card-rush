<template>
    <div class="card" :style="{ outlineColor: baseColor }">
      <div class="border column">
        <label class="card-title">{{ card.name || card.error || card.id }}</label>
        <div class="feature-image" :style="featureImageStyle"></div>
        <label v-if="effects.defense">Defense: {{ effects.defense }}</label>
        <label v-if="effects.attack">Attack: {{ effects.attack }}</label>
        <label v-if="effects.guard">Guard: {{ effects.guard }}</label>
        <label v-if="effects.parry">Parry: {{ effects.parry }}</label>
        <label v-if="effects.next">Next Turn: {{ effects.next }}</label>
        <div class="baseIcon" :style="{ background: baseColor }">
          <icon :icon="baseIcon || 'seedling'" />
        </div>
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
    },
    featureImage () {
      const { $store, card } = this
      return $store.findImageURL(card.image)
    },
    featureImageStyle () {
      const { baseColor, featureImage } = this
      return { backgroundColor: baseColor, backgroundImage: `url(${featureImage})` }
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
  display: inline-flex;
  position: relative;
  justify-content: stretch;
  background: #555;
  margin: 1em;
  outline-width: 1.5mm;
  outline-style: solid;
  border-radius: 3mm;
  width: 59mm;
  height: 92mm;
  font-size: 0.8em;
}

.border {
  display: flex;
  background: black;
  color: white;
  border-radius: 2mm;
  padding: 1mm;
}

.column {
  align-items: center;
  justify-content: flex-start;
  flex-direction: column;
}

.card-title {
  display: flex;
  position: absolute;
  top: 1mm;
  height: 2em;
  width: 100%;
  font-weight: bold;
  background: rgba(0,0,0,0.8);
  justify-content: center;
  align-items: center;
  border-radius: 2mm 2mm 0 0;
}

.feature-image {
  width: 57mm;
  height: 57mm;
  border-radius: 2mm;
  overflow: hidden;
  font-size: 0;
  background-size: cover;
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
