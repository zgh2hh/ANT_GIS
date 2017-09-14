<template>
  <div :class='classObject'>
    <header class="card-header">
      <p class="card-header-title">
        认领田块
      </p>
    </header>
    <div class="card-content">
      <div class="content">
        <div class="field is-horizontal">
          <div class="field-label is-normal">
            <label class="label">用户名</label>
          </div>
          <div class="field-body">
            <div class="field">
              <div class="control">
                <input class="input" type="text" placeholder="请输入用户名" ref="userName" :value="getUsername()" disabled>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <Draw :active="startDraw"  v-on:finish="finishDraw" v-on:deactivated="deactivated"></Draw>
    <select-feature :active='startSelect' v-on:selected='selected'></select-feature>
    <high-light :resultFeatures='highLightFeatures'></high-light>
    <footer class="card-footer">
      <a :class="[startSelect ? disabled : '', cardFooterItem]" @click="selectFeature">{{this.startSelect ? '选择中...' : '点击选择'}}</a>
      <a :class="[startDraw ? disabled : '', cardFooterItem]" @click="modifyShape">{{this.startDraw ? '绘制中...' : '绘制范围'}}</a>
      <a :class="[startDraw ? disabled : '', cardFooterItem]" @click="save">确认认领</a>
      <a class="card-footer-item" href='javascipt:void(0)' @click="cancel">取消</a>
    </footer>
  </div>
</template>

<script>
import * as types from '../modules/mutationTypes'
import { mapActions, mapGetters } from 'vuex'
import Draw from './draw'
import highLight from '../../common/highLight/highLight'
import selectFeature from '../../common/selectFeature/selectFeature'
export default {
  components: {
    Draw,
    'high-light': highLight,
    'select-feature': selectFeature
  },
  name: 'claim',
  props: {
    show: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      startSelect: false,
      startDraw: false,
      geometry: null,
      geometries: [],
      cardFooterItem: 'card-footer-item',
      disabled: 'disabled',
      highLightFeatures: []
    }
  },
  computed: {
    ...mapGetters(['selectedFieldsFeatures', 'selectedUserFeatures']),
    classObject: function () {
      return {
        card: true,
        hide: !this.show
      }
    }
  },
  methods: {
    ...mapActions(['queryFieldsByGeometry', 'queryUsernameByFieldId', 'addFeatures', 'editFeatures']),
    cancel (evt) {
      evt.stopPropagation()
      this.$children[0].clearAllPolygons()
      this.startDraw = false
      this.geometries = []
      this.$store.commit('TOGGLE_CLAIM')
    },
    save (evt) {
      evt.stopPropagation()
      this.$store.commit(types.CLEAR_SELECTED_RECORDS)

      let formUserName = this.$refs.userName.value.trim() || ''
      const { map } = this.$store.state.nutrition
      let that = this
      let featureLyr = map.findLayerById('draw')
      let fieldId2Username = map.findLayerById('id2username')
      if (featureLyr && fieldId2Username) {
        return (async () => {
          try {
            // 根据所绘制田块，查询出对应的所有田块
            await that.queryFieldsByGeometry({
              featureLyr: featureLyr,
              geometry: that.geometry
            })
            // 遍历所查出的田块
            for (let i in that.selectedFieldsFeatures) {
              // 根据fieldId关联查询field_id_2_user表/featureLayer(此表用于记录田块id和username对应关系)
              await that.queryUsernameByFieldId({
                featureLyr: fieldId2Username,
                fieldId: that.selectedFieldsFeatures[i].attributes.field_id,
                geometry: that.selectedFieldsFeatures[i].geometry // 多边形的中心点作为新的geometry
              })
            }
            let addFeatures = []
            let editFeatures = []
            // 遍历field_id_2_user表/featureLayer中对应的记录
            for (let user of that.selectedUserFeatures) {
              if (user.features.length === 0) { // 如果此field_id没有对应的记录，则为新增
                let param = that.addFeatureParam(user.fieldId, user.geometry, formUserName)
                addFeatures.push(param)
              } else { // 否则为编辑
                let param = that.editFeatureParam(user.features[0], user.geometry, formUserName)
                editFeatures.push(param)
              }
            }
            if (addFeatures.length > 0) {
              // 批量向field_id_2_user表/featureLayer中添加新纪录， fieldid对应的username
              await that.addFeatures({
                fieldId2Username,
                addFeatures
              })
            }
            if (editFeatures.length > 0) {
              // 批量编辑field_id_2_user表/featureLayer中已经存在的记录
              await that.editFeatures({
                fieldId2Username,
                editFeatures
              })
            }
            that.$children[0].clearAllPolygons()
            that.$store.commit(types.TOGGLE_CLAIM)
            this.geometries = []
          } catch (err) {
            console.error(err)
          }
        })()
      }
    },
    addFeatureParam (fieldId, geometry, formUserName) {
      const { ESRI } = this.$store.state.nutrition
      let attributes = {}
      attributes['field_id'] = fieldId
      attributes['user_name'] = formUserName

      // 存储几何信息
      return new ESRI.Graphic({
        geometry: geometry,
        attributes: attributes
      })
    },
    editFeatureParam (editFeature, geometry, formUserName) {
      let oldUsername = editFeature.attributes.user_name
      let usernames = []
      if (oldUsername && oldUsername.length > 0) {
        usernames = oldUsername.split(',')
      }
      if (!usernames.includes(formUserName)) {
        usernames.push(formUserName)
      }
      editFeature.attributes.user_name = usernames.join()
      editFeature.attributes.objectId = editFeature.attributes.objectid
      editFeature.geometry = geometry
      return editFeature
    },
    selectFeature () {
      this.startSelect = !this.startSelect
    },
    modifyShape () {
      this.startDraw = !this.startDraw
    },
    finishDraw (geometry) {
      // this.geometry = geometry
      this.geometries.push(geometry)
      this.startDraw = false
      const { ESRI } = this.$store.state.nutrition
      this.geometry = ESRI.geometryEngine.union(this.geometries)
      this.hightLight()
    },
    hightLight () {
      let that = this
      const { map } = this.$store.state.nutrition
      let featureLyr = map.findLayerById('draw')
      // 根据所绘制田块，查询出对应的所有田块
      this.queryFieldsByGeometry({
        featureLyr: featureLyr,
        geometry: this.geometry
      }).then((result) => {
        // 高亮所选田块
        that.highLightFeatures = result.features
      })
    },
    deactivated () {
      if (window.confirm('继续绘制吗?')) {
        this.startDraw = true
      }
    },
    selected (point) {
      debugger
      console.log(point)
    },
    getUsername () {
      return window.localStorage.getItem('username')
    }
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
