/* Generated file: node data-scripts/find-all-routes.js */

import FullPageSection from '../views/FullPageSection.vue'
import Home from '../views/Home.vue'
import SaveFileManagement from '../views/SaveFileManagement.vue'
import ComponentTests from '../views/settings/debug/ComponentTests.vue'
import Debug from '../views/settings/debug/Debug.vue'
import Icons from '../views/settings/debug/Icons.vue'
import Gamedata from '../views/settings/Gamedata.vue'
import Mods from '../views/settings/Mods.vue'
import Settings from '../views/settings/Settings.vue'
import StartNewGame from '../views/StartNewGame.vue'
import Template from '../views/Template.vue'
import CharacterStats from '../views/world/CharacterStats.vue'
import EventHistory from '../views/world/EventHistory.vue'
import MultiPageSectionView from '../views/world/MultiPageSectionView.vue'
import SkillsTree from '../views/world/SkillsTree.vue'

const routes = [
  {
    path: '/full-page-section',
    name: 'Full Page Section',
    component: FullPageSection
  },
  {
    path: '/home',
    name: 'Home',
    component: Home
  },
  {
    path: '/save-file-management',
    name: 'Save File Management',
    component: SaveFileManagement
  },
  {
    path: '/settings/debug/component-tests',
    name: 'Component Tests',
    component: ComponentTests
  },
  {
    path: '/settings/debug/debug',
    name: 'Debug',
    component: Debug
  },
  {
    path: '/settings/debug/icons',
    name: 'Icons',
    component: Icons
  },
  {
    path: '/settings/gamedata',
    name: 'Gamedata',
    component: Gamedata
  },
  {
    path: '/settings/mods',
    name: 'Mods',
    component: Mods
  },
  {
    path: '/settings/settings',
    name: 'Settings',
    component: Settings
  },
  {
    path: '/start-new-game',
    name: 'Start New Game',
    component: StartNewGame
  },
  {
    path: '/template',
    name: 'Template',
    component: Template
  },
  {
    path: '/world/character-stats',
    name: 'Character Stats',
    component: CharacterStats
  },
  {
    path: '/world/event-history',
    name: 'Event History',
    component: EventHistory
  },
  {
    path: '/world/multi-page-section-view',
    name: 'Multi Page Section View',
    component: MultiPageSectionView
  },
  {
    path: '/world/skills-tree',
    name: 'Skills Tree',
    component: SkillsTree
  }
]

export default routes
