<template>
  <table v-if="rows.length" class="tabulation">
    <thead>
      <tr>
        <th
          v-for="(columnHeading, i) in columnHeadings"
          :key="`colHeading-${columnHeading}-${i}`"
          :class="columnHeadingClass(columnHeading, i)"
          @click="sortByColumnEvent(columnHeading, i)"
        >
          <div>
            <label>{{ columnHeading }}</label>
            <icon :icon="columnIcon(columnHeading)" />
          </div>
        </th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(rowItem, j) in sortedRows" :key="`row-${j}`">
        <td v-for="(cell, column) in rowItem" :key="`cell-${column}`">
          <slot
            :cell="cell"
            :column="column"
            :column-key="columnKey(column)"
          >
            <smart-type :name="columnKey(column)" :value="contentsOf(cell, column)" />
          </slot>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script>
import flattenObject from '../../utils/flattenObject.js'
import SmartType from './SmartType.vue'

function removeArrayListeners(data) {
  return JSON.parse(JSON.stringify(data))
}

export default {
  components: { SmartType },
  props: {
    items: {
      type: Array,
      default: () => []
    },
    columns: {
      type: Array,
      default: () => []
    },
    groupItems: {
      type: Boolean,
      default: false
    },
    sortedColumn: {
      type: String,
      default: ''
    },
    sortAscending: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      internalSortedColumn: '',
      internalSortAscending: true
    }
  },
  computed: {
    firstHeading() {
      return this.items[0]
    },
    columnHeadings() {
      return this.columnKeys.map(n => n.label || n)
    },
    columnKeys() {
      const columns = (this.columns && this.columns.length) ? this.columns : false
      return (columns || this.listAllProperties).map(n => n.key || n)
    },
    groupedRows() {
      const index = this.items.reduce((acc, item) => {
        const lookup = item[this.row]
        const entry = acc[lookup] ?? []
        entry.push(item)
        acc[lookup] = entry
        return acc
      }, {})
      const result = Object.entries(index).map(([key, values]) => {
        const nonEmpty = values.map(n => n)
        return [].concat([key], ...nonEmpty)
      })
      return result
    },
    listAllProperties() {
      const index = this.items.reduce((acc, item) => {        
        if (typeof item === 'object') {
          acc = Object.assign(acc, Object.keys(item))
        } else {
          acc = Object.assign(acc, { type: typeof item })
        }
        return acc
      }, {})
      return Object.values(index)
    },
    plainRows() {
      return this.items.map(item => {
        return this.columnKeys.map(() => item)
      })
    },
    row() {
      return (this.columnKeys)[0]
    },
    rows() {
      return (this.groupItems) ? this.groupedRows : this.plainRows
    },
    computedSortedColumn() {
      return this.sortedColumn ?? this.internalSortedColumn
    },
    computedSortAscending() {
      return this.sortedColumn ? this.sortAscending : this.internalSortAscending
    },
    sortedRows() {
      const { rows, sortedColumn, internalSortedColumn, internalSortAscending } = this
      const dataPreSorted = sortedColumn ? true : false
      if (dataPreSorted) {
        return rows
      }
      if (!Array.isArray(rows)) {
        return []
      }
      const col = internalSortedColumn
      const asc = internalSortAscending
      const clonedRows = removeArrayListeners(rows)
      if (col) {
        clonedRows.sort((a, b) => {          
          const sa = JSON.stringify(a[0][col] || a[0]) || ''
          const sb = JSON.stringify(b[0][col] || b[0]) || ''
          return asc ? sa.localeCompare(sb) : sb.localeCompare(sa)
        })
      }
      return clonedRows
    }
  },
  methods: {
    cellEntries(cell, column) {
      const value = this.contentsOf(cell, column)
      const flattened = flattenObject(value)
      return Object.entries(flattened)
    },
    columnHeadingClass(columnHeading) {
      return columnHeading === this.computedSortedColumn ? 'sorted' : 'unsorted'
    },
    columnIcon(columnHeading) {
      const direction = this.computedSortAscending ? 'sort-amount-up' : 'sort-amount-down'
      return this.computedSortedColumn === columnHeading ? direction : 'sort'
    },
    contentsOf(cell, column, showCellIfEmpty = true) {
      const columnKey = this.columnKeys[column] || column
      const columnContents = cell[columnKey]
      return columnContents === undefined && showCellIfEmpty ? cell : columnContents
    },
    columnKey(column) {
      return this.columnKeys[column] ?? column
    },
    sortByColumnEvent(columnHeading) {
      const same = columnHeading === this.computedSortedColumn
      this.internalSortedColumn = columnHeading
      this.internalSortAscending = same ? !this.internalSortAscending : true
      const reset = same && this.internalSortAscending
      if (reset) {
        this.internalSortedColumn = ''
      }
      this.$emit('sortByColumn', {
        columnHeading,
        sortAscending: same ? !this.computedSortAscending : true
      })
    }
  }
}
</script>

<style scoped>
table.tabulation {
  margin: 1em auto;
  border: 2px solid #DDD;
}
th {
  outline: 2px solid #FFF;
  background: #EEE;
  padding: 5px;
  user-select: none;
}
th > div {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
th > div > .icon.wrapper {
  width: 1em;
  height: 1em;
  color: #CCC;
  margin-left: 0.5em;
}
th:hover {
  background: #DDD;
}
th.sorted > div > .icon.wrapper {
  color: #333;
}
td {
  outline: 2px solid #FFF;
  background: #FAFAFA;
  padding: 5px;
}
.cell.property {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}
.cell.property > b {
  margin: 0 0.5em 0 0;
}
</style>
