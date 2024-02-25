<script lang="jsx">
  import Sortable from "sortablejs"
  import {  nextTick } from "vue"
  export default {
    name: "CommonTable",
    props: {
      // el-table每列的配置项
      columns: {
        type: Array,
        default() {
          return []
        },
        validator: (value) => {
          return Array.isArray(value)
        },
        required: true,
      },
      // el-table的配置项
      config: {
        type: Object,
        default() {
          return {}
        },
      },
      // el-table展示的数据
      modelValue: {
        type: Array,
        default() {
          return []
        },
        validator: (value) => {
          return Array.isArray(value)
        },
      },
      // 配置table是否开启拖拽
      drag:{
          type:Boolean,
          default:false,
      },
      // 对拖拽table的详细配置；具体查看sortablejs的options
      options: {
        type: Object,
        default() {
          return {}
        },
        validator: (value) => {
          return typeof value === "object"
        },
      },
      
    },
    emits: [
      "update:modelValue",
      'drag-change',
      "select",
      "select-all",
      "selection-change",
      "cell-mouse-enter",
      "cell-mouse-leave",
      "cell-click",
      "cell-dblclick",
      "row-click",
      "row-contextmenu",
      "row-dblclick",
      "header-click",
      "header-contextmenu",
      "sort-change",
      "filter-change",
      "current-change",
      "header-dragend",
      "expand-change",
    ],
    data() {
      return {
        tableKey: 1, //解决sortablejs拖拽table后数据变化了;页面没有变化
        id:'sortTable' + new Date().getTime() ,
      }
    },
    methods: {
      // 初始化拖拽组价
      init() {
        let _this = this
        let options = Object.assign(
          {
            group: {
              name: "group",
              pull: true,
              put: false,
            }, // or { name: "...", pull: [true, false, 'clone', array], put: [true, false, array] }
            sort: this.drag, // sorting inside list
            delay: 0, // time in milliseconds to define when the sorting should start
            delayOnTouchOnly: false, // only delay if user is using touch
            touchStartThreshold: 0, // px, how many pixels the point should move before cancelling a delayed drag event
            disabled: !this.drag, // Disables the sortable if set to true.
            store: null, // @see Store
            animation: 150, // ms, animation speed moving items when sorting, `0` — without animation
            easing: "cubic-bezier(1, 0, 0, 1)", // Easing for animation. Defaults to null. See https://easings.net/ for examples.
            handle: ".el-table__row", // Drag handle selector within list items
            //filter: ".ignore-elements", // Selectors that do not lead to dragging (String or Function)
            preventOnFilter: true, // Call `event.preventDefault()` when triggered `filter`
            draggable: ".el-table__row", // Specifies which items inside the element should be draggable
  
            //dataIdAttr: "data-id", // HTML attribute that is used by the `toArray()` method
  
            //ghostClass: "el-table__row", // Class name for the drop placeholder
            // chosenClass: "el-table__row", // Class name for the chosen item
            dragClass: "el-table__row", // Class name for the dragging item
  
            swapThreshold: 1, // Threshold of the swap zone
            invertSwap: false, // Will always use inverted swap zone if set to true
            invertedSwapThreshold: 1, // Threshold of the inverted swap zone (will be set to swapThreshold value by default)
            direction: "horizontal", // Direction of Sortable (will be detected automatically if not given)
  
            forceFallback: false, // ignore the HTML5 DnD behaviour and force the fallback to kick in
  
            fallbackClass: "sortable-fallback", // Class name for the cloned DOM Element when using forceFallback
            fallbackOnBody: false, // Appends the cloned DOM Element into the Document's Body
            fallbackTolerance: 0, // Specify in pixels how far the mouse should move before it's considered as a drag.
  
            dragoverBubble: false,
            removeCloneOnHide: true, // Remove the clone element when it is not showing, rather than just hiding it
            emptyInsertThreshold: 5, // px, distance mouse must be from empty sortable to insert drag element into it
            onEnd: ({ newIndex, oldIndex }) => {
              const data = [..._this.modelValue]
              data.splice(newIndex, 0, data.splice(oldIndex, 1)[0])
              if (newIndex !== oldIndex) {
                _this.tableKey++
                _this.$emit("update:modelValue", data)
                _this.$emit('drag-change',data)
              }
            },
          },
          this.depCopy(this.options, ["onEnd", "onClone", "onChange"])
        )
        const el = document.querySelector(
          `#${this.id} .el-table__body-wrapper tbody`
        )
        Sortable.create(el, options)
      },
      renderElement() {
        let data = this.modelValue
        let { columns, config , id,tableKey} = this
        let baseAttrs = {
          stripe: false,
          border: false,
          fit: true,
          "show-header": true,
          "highlight-current-row": false,
          "empty-text": "暂无数据",
          "default-expand-all": false,
          "default-sort": {
            order: "ascending",
          },
          "show-summary": false,
          "sum-text": "合计",
          "select-on-indeterminate": true,
          indent: 16,
          "tree-props": {
            hasChildren: "hasChildren",
            children: "children",
          },
          ref: "baseTableJsx",
        }
        let slots = config.slots
        let inhertAttrs = this.depCopy(config, ["slots", "ref"])
        let fatherAttrs = Object.assign(baseAttrs, inhertAttrs)
        let endAttrs = {
          ...fatherAttrs,
        }
        /* 
          这个写法vOn:selection-change={(selection) => {
              this.selectionChange(selection)
          }}传出组件事件与render中通过on传出组件事件不能同时存在;同时存在会报‘无限循环更新’错误提示
          为避免这种情况;加入判断
        */
        /* 
      具名插槽和作用域插槽新写法 v-slots={slots}
      slots为对象且属性为方法
       */
          return (
            <div id={id} class={id}>
              <el-table
                v-slots={slots}
                data={data}
                onSelectAll={() => {
                  this.selectAll()
                }}
                onSelect={(selection, row) => {
                  this.select(selection, row)
                }}
                onCellMouseEnter={(row, column, cell, event) => {
                  this.cellMouseEnter(row, column, cell, event)
                }}
                onSelectionChange={(selection) => {
                  this.selectionChange(selection)
                }}
                onCellMouseLeave={(row, column, cell, event) => {
                  this.cellMouseLeave(row, column, cell, event)
                }}
                onCellClick={(row, column, cell, event) => {
                  this.cellClick(row, column, cell, event)
                }}
                onCellDblclick={(ow, column, cell, event) => {
                  this.cellDblclick(ow, column, cell, event)
                }}
                onRowClick={(row, column, event) => {
                  this.rowClick(row, column, event)
                }}
                onRowContextmenu={(row, column, event) => {
                  this.rowContextmenu(row, column, event)
                }}
                onRowDblclick={(row, column, event) => {
                  this.rowDblclick(row, column, event)
                }}
                onHeaderClick={(column, event) => {
                  this.headerClick(column, event)
                }}
                onHeaderContextmenu={(column, event) => {
                  this.headerContextmenu(column, event)
                }}
                onSortChange={({ column, prop, order }) => {
                  this.sortChange({ column, prop, order })
                }}
                onFilterChange={(filters) => {
                  this.filterChange(filters)
                }}
                onCurrentChange={(currentRow, oldCurrentRow) => {
                  this.currentChange(currentRow, oldCurrentRow)
                }}
                obHeaderDragend={(newWidth, oldWidth, column, event) => {
                  this.headerDragend(newWidth, oldWidth, column, event)
                }}
                onExpandChange={(row, expandedRows) => {
                  this.expandChange(row, expandedRows)
                }}
                {...endAttrs}
                key={tableKey}
              >
                {columns.map((item, index) => {
                  // let obj = this.depCopy(item, ["scopedSlots"])
                  // let scopedSlots = item.scopedSlots
                  // let attrs = {
                  //   ...obj,
                  // }
                  // return (
                  //   <el-table-column
                  //     {...attrs}
                  //     key={index}
                  //     v-slots={scopedSlots}
                  //   ></el-table-column>
                  // )
                  return this.recursion(item,index)
                })}
              </el-table>
            </div>
          )
      },
         // 递归处理多级表头
    recursion(item,index){
      let obj = this.depCopy(item, ['scopedSlots','children'])
      let scopedSlots = item.scopedSlots
      let attrs = {
        ...obj,
      }
      if(!this.isArray(item.children)){
        return (
          <el-table-column
            {...attrs}
            key={index}
            v-slots={scopedSlots}
          ></el-table-column>
        )
      }
      return (
        <el-table-column
          {...attrs}
          key={index}
          v-slots={scopedSlots}
        >{item.children.map((child,i)=>{
            return this.recursion(child,i)
          })}</el-table-column>
      )
    },
    // 判断是否是数组且长度大于0
    isArray(key){
      return key&&Array.isArray(key)&&key.length>0
    },
      // 深拷贝指定属性
      depCopy(obj, arr = []) {
        if (!Array.isArray(arr)) {
          arr = []
        }
        let attrs = {}
        for (let key in obj) {
          if (!arr.includes(key)) {
            attrs[key] = obj[key]
          }
        }
        return attrs
      },
      // 当用户手动勾选数据行的 Checkbox 时触发的事件
      select(selection, row) {
        // 当用户手动勾选数据行的 Checkbox 时触发的事件
        // @arg selection, row
        this.$emit("select", selection, row)
      },
      // 当用户手动勾选全选 Checkbox 时触发的事件
      selectAll() {
        // 当用户手动勾选全选 Checkbox 时触发的事件
        this.$emit("select-all")
      },
      // 当选择项发生变化时会触发该事件
      selectionChange(selection) {
        // 当选择项发生变化时会触发该事件
        // @arg selection
        this.$emit("selection-change", selection)
      },
      // cell-mouse-enter  当单元格 hover 进入时会触发该事件
      cellMouseEnter(row, column, cell, event) {
        // cell-mouse-enter  当单元格 hover 进入时会触发该事件
        // @arg row, column, cell, event
        this.$emit("cell-mouse-enter", row, column, cell, event)
      },
      // 当单元格 hover 退出时会触发该事件
      cellMouseLeave(row, column, cell, event) {
        // 当单元格 hover 退出时会触发该事件
        // @arg row, column, cell, event
        this.$emit("cell-mouse-leave", row, column, cell, event)
      },
      // cell-click	当某个单元格被点击时会触发该事件 row, column, cell, event
      cellClick(row, column, cell, event) {
        // 当某个单元格被点击时会触发该事件
        // @arg row, column, cell, event
        this.$emit("cell-click", row, column, cell, event)
      },
      // cell-dblclick	当某个单元格被双击击时会触发该事件 row, column, cell, event
      cellDblclick(row, column, cell, event) {
        //当某个单元格被双击击时会触发该事件
        //@arg row, column, cell, event
        this.$emit("cell-dblclick", row, column, cell, event)
      },
      // row-click	当某一行被点击时会触发该事件 row, column, event
      rowClick(row, column, event) {
        // 当某一行被点击时会触发该事件
        // @arg row, column, event
        this.$emit("row-click", row, column, event)
      },
      // row-contextmenu	当某一行被鼠标右键点击时会触发该事件 row, column, event
      rowContextmenu(row, column, event) {
        // 当某一行被鼠标右键点击时会触发该事件
        // @arg row, column, event
        this.$emit("row-contextmenu", row, column, event)
      },
      // row-dblclick	当某一行被双击时会触发该事件 row, column, event
      rowDblclick(row, column, event) {
        // 当某一行被双击时会触发该事件
        // @arg row, column, event
        this.$emit("row-dblclick", row, column, event)
      },
      // header-click	当某一列的表头被点击时会触发该事件 column, event
      headerClick(column, event) {
        // 当某一列的表头被点击时会触发该事件
        //  @arg column, event
        this.$emit("header-click", column, event)
      },
      // header-contextmenu	当某一列的表头被鼠标右键点击时触发该事件 column, event
      headerContextmenu(column, event) {
        // 当某一列的表头被鼠标右键点击时触发该事件
        // @arg column, event
        this.$emit("header-contextmenu", column, event)
      },
      // sort-change	当表格的排序条件发生变化的时候会触发该事件	{ column, prop, order }
      sortChange({ column, prop, order }) {
        // 当表格的排序条件发生变化的时候会触发该事件
        // @arg { column, prop, order }
        this.$emit("sort-change", { column, prop, order })
      },
      /* 
      filter-change	当表格的筛选条件发生变化的时候会触发该事件，
      参数的值是一个对象，对象的 key 是 column 的 columnKey，对应的 value 为用户选择的筛选条件的数组。
      filters
      */
      filterChange(filters) {
        // 当表格的筛选条件发生变化的时候会触发该事件，参数的值是一个对象，对象的 key 是 column 的 columnKey，对应的 value 为用户选择的筛选条件的数组
        // @arg filters
        this.$emit("filter-change", filters)
      },
      /* 
    current-change	当表格的当前行发生变化的时候会触发该事件，
    如果要高亮当前行，请打开表格的 highlight-current-row 属性	
    currentRow,oldCurrentRow
    */
      currentChange(currentRow, oldCurrentRow) {
        // 当表格的当前行发生变化的时候会触发该事件，如果要高亮当前行，请打开表格的 highlight-current-row 属性
        //  @arg currentRow,oldCurrentRow
        this.$emit("current-change", currentRow, oldCurrentRow)
      },
      //  header-dragend	当拖动表头改变了列的宽度的时候会触发该事件	newWidth, oldWidth, column, event
      headerDragend(newWidth, oldWidth, column, event) {
        // 当拖动表头改变了列的宽度的时候会触发该事件
        // @arg newWidth, oldWidth, column, event
        this.$emit("header-dragend", newWidth, oldWidth, column, event)
      },
      /* 
    expand-change	当用户对某一行展开或者关闭的时候会触发该事件
    （展开行时，回调的第二个参数为 expandedRows；树形表格时第二参数为 expanded）
    row, (expandedRows | expanded)
    */
      expandChange(row, expand) {
        // 当用户对某一行展开或者关闭的时候会触发该事件（展开行时，回调的第二个参数为 expandedRows；树形表格时第二参数为 expanded）
        // @arg  row, (expandedRows | expanded)
        this.$emit("expand-change", row, expand)
      },
      // 用于多选表格，清空用户的选择
      clearSelection() {
        this.$refs.baseTableJsx.clearSelection()
      },
      // 用于多选表格，切换某一行的选中状态，
      toggleRowSelection(row, selected) {
        this.$refs.baseTableJsx.toggleRowSelection(row, selected)
      },
      // 用于多选表格，切换所有行的选中状态
      toggleAllSelection() {
        this.$refs.baseTableJsx.toggleAllSelection()
      },
      // 用于可展开表格与树形表格，切换某一行的展开状态
      toggleRowExpansion(row, expanded) {
        this.$refs.baseTableJsx.toggleRowExpansion(row, expanded)
      },
      // 用于单选表格，设定某一行为选中行
      setCurrentRow(row) {
        this.$refs.baseTableJsx.setCurrentRow(row)
      },
      // 用于清空排序条件，数据会恢复成未排序的状态
      clearSort() {
        this.$refs.baseTableJsx.clearSort()
      },
      /* 
    不传入参数时用于清空所有过滤条件，数据会恢复成未过滤的状态，
    也可传入由columnKey组成的数组以清除指定列的过滤条件
    */
      clearFilter(columnKey) {
        this.$refs.baseTableJsx.clearFilter(columnKey)
      },
      //  对 Table 进行重新布局。
      doLayout() {
        this.$refs.baseTableJsx.doLayout()
      },
      // 手动对 Table 进行排序。参数prop属性指定排序列，order指定排序顺序
      sort(prop, order) {
        this.$refs.baseTableJsx.sort(prop, order)
      },
    },
    render() {
      nextTick(() => {
        this.init()
      })
      return this.renderElement()
    },
  }
  </script>
  