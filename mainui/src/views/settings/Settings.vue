<template>
  <div class="settings-view">
    <settings-nav />
    <div class="frame">
      <slot>
        <h1>Application Info</h1>
        <tabulation :items="[{
          'App Path': $store.state?.appInfo?.appPath
        }]" />
        <tabulation :items="[{
          'User Path': $store.state?.appInfo?.userPath
        }]" />

        <h1>Interface Settings</h1>
        <tabulation :items="[{
          'Build Information': $store.state.version,
          'Stored count': $store.state?.userPreferences?.count
        }]" />
        <h2>Interactions</h2>
        <column>
          <grow-button v-on:click="$store.dispatch('increment')">
            <a>Increment</a>
          </grow-button>
          <grow-button v-on:click="$store.dispatch('resetUserPreferences')">
            <a>Reset User Preferences</a>
          </grow-button>
        </column>
        <h2>Stored Preferences</h2>
        <tabulation :items="[$store.state.userPreferences]" />
      </slot>
    </div>
  </div>
</template>

<script>
export default {
  async mounted() {
    await this.$store.dispatch('refreshAppInfo')
  }
}
</script>

<style scoped>
.settings-view {
  display: flex;
  align-items: stretch;
}
.frame {
  flex: auto;
  overflow: hidden;
}
.scroll > .frame {
  overflow-y: scroll;
}
</style>
