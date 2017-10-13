<template>
  <div :class='classObject'>
    <header class="card-header">
      <p class="card-header-title">
        编辑田块
      </p>
      <a class="card-header-icon">
        <span class="icon">
          <i class="fa fa-angle-down"></i>
        </span>
      </a>
    </header>
    <div class="card-content">
      <div class="content">
        <div class="field is-horizontal">
          <div class="field-label is-normal">
            <label class="label">田块名称</label>
          </div>
          <div class="field-body">
            <div class="field">
              <div class="control">
                <input class="input" type="text" placeholder="请输入田块名称" ref="fieldName" :value="field.attributes.field_name">
              </div>
            </div>
          </div>
        </div>
        <div class="field is-horizontal">
          <div class="field-label is-normal">
            <label class="label">用户名</label>
          </div>
          <div class="field-body">
            <div class="field">
              <div class="control">
                <input class="input" type="text" placeholder="请输入用户名" ref="userName" :value="field.attributes.user_name">
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <Draw :active="startDraw"  v-on:finish="finishDraw"></Draw>
    <footer class="card-footer">
      <a :class="[startDraw ? disabled : '', cardFooterItem]" @click="modifyShape">{{this.startDraw ? '绘制中...' : '修改形状'}}</a>
      <a class="card-footer-item" @click="save">保存</a>
      <a class="card-footer-item" href='javascipt:void(0)' @click="cancel">取消</a>
    </footer>
  </div>
</template>

<script>
import * as types from '../modules/mutationTypes'
import Draw from '@/components/common/draw'
export default {
  components: {
    Draw
  },
  name: 'edit',
  props: {
    show: {
      type: Boolean,
      default: false
    },
    field: {
      type: Object,
      required: true,
      default: {
        attributes: {},
        geometry: {}
      }
    }
  },
  data () {
    return {
      startDraw: false,
      geometry: null,
      cardFooterItem: 'card-footer-item',
      disabled: 'disabled'
    }
  },
  computed: {
    classObject: function () {
      return {
        card: true,
        hide: !this.show
      }
    }
  },
  methods: {
    cancel () {
      this.$children[0].clearPolygon()
      this.startDraw = false
      this.$store.commit('TOGGLE_EDIT')
    },
    save (evt) {
      evt.stopPropagation()
      const { map, current, ESRI } = this.$store.state.nutrition
      let that = this
      // let featureLyr = map.findLayerById('n') || map.findLayerById('p') || map.findLayerById('k')
      let featureLyr = map.findLayerById(current.toLocaleLowerCase())
      if (featureLyr) {
        let query = new ESRI.Query()
        let objectId = this.field.attributes.objectid
        query.where = 'objectid = ' + objectId
        query.returnGeometry = true
        featureLyr.queryFeatures(query).then(function (results) {
          let editFeature = results.features[0]
          console.log(editFeature)
          editFeature.attributes.objectId = objectId
          editFeature.attributes.field_name = that.$refs.fieldName.value.trim()
          editFeature.attributes.user_name = that.$refs.userName.value.trim()
          // 修改几何信息
          if (that.geometry) {
            editFeature.geometry = that.geometry
          }
          featureLyr.applyEdits({
            updateFeatures: [editFeature]
          }).then((result) => {
            console.log(result)
            if (!result.updateFeatureResults[0].error) {
              that.$children[0].clearPolygon()
              that.$store.commit(types.TOGGLE_EDIT)
            }
          }, (err) => {
            console.log(err)
          })
        })
      }
    },
    modifyShape () {
      this.startDraw = !this.startDraw
    },
    finishDraw (geometry) {
      this.geometry = geometry
      this.startDraw = false
    }
  },
  mounted () {
  }
}
</script>
<style scoped>
  .hide{
    display: none;
  }
  .disabled {
    pointer-events: none;
    cursor: default;
    color: #ccc;
  }
</style>
