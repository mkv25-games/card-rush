<template>
  <settings class="debug">
    <h1>Debug Tools</h1>
    <column>
      <grow-button v-on:click="$store.dispatch('hideDeveloperTools')" v-if="$store.state.userPreferences.developerTools.visible">
        <a>Hide Developer Tools</a>
      </grow-button>
      <grow-button v-on:click="$store.dispatch('showDeveloperTools')" v-else>
        <a>Show Developer Tools</a>
      </grow-button>
      <grow-button v-on:click="$store.dispatch('loadUserPreferences')">
        <a>Reload User Preferences</a>
      </grow-button>
    </column>
  </settings>
</template>
