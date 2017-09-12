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
                <input class="input" type="text" placeholder="请输入用户名" ref="userName" :value="18130321306">
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <Draw :active="startDraw"  v-on:finish="finishDraw"></Draw>
    <footer class="card-footer">
      <a :class="[startDraw ? disabled : '', cardFooterItem]" @click="modifyShape">{{this.startDraw ? '绘制中...' : '框选范围'}}</a>
      <a :class="[startDraw ? disabled : '', cardFooterItem]" @click="save">确认认领</a>
      <a class="card-footer-item" href='javascipt:void(0)' @click="cancel">取消</a>
    </footer>
  </div>
</template>

<script>
import * as types from '../modules/mutationTypes'
import { mapActions, mapGetters } from 'vuex'
import Draw from './draw'
export default {
  components: {
    Draw
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
      startDraw: false,
      geometry: null,
      cardFooterItem: 'card-footer-item',
      disabled: 'disabled'
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
      this.$children[0].clearPolygon()
      this.startDraw = false
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
            await that.queryFieldsByGeometry({
              featureLyr: featureLyr,
              geometry: that.geometry
            })
            for (let i in that.selectedFieldsFeatures) {
              await that.queryUsernameByFieldId({
                featureLyr: fieldId2Username,
                fieldId: that.selectedFieldsFeatures[i].attributes.field_id
              })
            }
            let addFeatures = []
            let editFeatures = []
            for (let user of that.selectedUserFeatures) {
              if (user.features.length === 0) { // 新增
                let param = that.addFeatureParam(user.fieldId, formUserName)
                addFeatures.push(param)
              } else { // 编辑
                let param = that.editFeatureParam(user.features[0], formUserName)
                editFeatures.push(param)
              }
            }
            if (addFeatures.length > 0) {
              await that.addFeatures({
                fieldId2Username,
                addFeatures
              })
            }
            if (editFeatures.length > 0) {
              await that.editFeatures({
                fieldId2Username,
                editFeatures
              })
            }
            that.$children[0].clearPolygon()
            that.$store.commit(types.TOGGLE_CLAIM)
          } catch (err) {
            console.error(err)
          }
        })()
      }
    },
    addFeatureParam (fieldId, formUserName) {
      const { ESRI } = this.$store.state.nutrition
      let attributes = {}
      attributes['field_id'] = fieldId
      attributes['user_name'] = formUserName

      // 几何信息没有必要存储
      return new ESRI.Graphic({
        // geometry: item.geometry,
        attributes: attributes
      })
    },
    editFeatureParam (editFeature, formUserName) {
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
      return editFeature
    },
    modifyShape () {
      this.startDraw = !this.startDraw
    },
    finishDraw (geometry) {
      this.geometry = geometry
      this.startDraw = false
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
