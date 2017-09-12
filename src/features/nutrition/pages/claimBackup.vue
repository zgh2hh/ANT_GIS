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
    classObject: function () {
      return {
        card: true,
        hide: !this.show
      }
    }
  },
  methods: {
    cancel (evt) {
      evt.stopPropagation()
      this.$children[0].clearPolygon()
      this.startDraw = false
      this.$store.commit('TOGGLE_CLAIM')
    },
    save (evt) {
      evt.stopPropagation()
      const { map, ESRI } = this.$store.state.nutrition
      let that = this
      let featureLyr = map.findLayerById('draw')
      let fieldId2Username = map.findLayerById('id2username')
      if (featureLyr && fieldId2Username) {
        that.querySelectedFields(featureLyr, that.geometry).then(function (results) {
          if (results.features && results.features.length > 0) {
            let addFeatures = []
            results.features.forEach((item) => {
              let attributes = {}
              attributes['field_id'] = item.attributes.field_id
              attributes['user_name'] = that.$refs.userName.value.trim()

              // 几何信息没有必要存储
              var addFeature = new ESRI.Graphic({
                // geometry: item.geometry,
                attributes: attributes
              })
              addFeatures.push(addFeature)
            })

            fieldId2Username.applyEdits({
              addFeatures: addFeatures
            }).then((result) => {
              that.$children[0].clearPolygon()
              that.$store.commit(types.TOGGLE_CLAIM)
            }, (err) => {
              console.log(err)
            })
          }
        }, (err) => {
          console.log(err)
        })
      }
    },
    querySelectedFields (featureLyr, geometry) {
      let query = featureLyr.createQuery()
      query.where = '1 = 1'
      query.geometry = geometry
      query.spatialRelationship = 'intersects'

      return featureLyr.queryFeatures(query)
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
