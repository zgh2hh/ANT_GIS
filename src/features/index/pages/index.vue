<template>
  <div>
    <common-header v-on:modeChange='changeMode'></common-header>
    <div id="viewDiv" class="balt-theme"></div>
    <Edit :show='showEdit' :field='field'></Edit>
    <Claim :show='showClaim'></Claim>
    <topic-map ref='topicMap'></topic-map>
    <tool ref='tool'></tool>
    <chart ref='chart'></chart>
    <custom-legend ref='legend'></custom-legend>
    <Crops :topicMap='$store.state.common.topicMap' :baseMap='$store.state.common.baseMap'></Crops>
  </div>
</template>

// <nav class="nav hero is-default has-shadow">
//       <div class='container'>
//         <div class="nav-left">
//           <router-link to="/" class="nav-item">
//             <img src='../../../assets/CITY-LOGO.png' alt="Vue">
//           </router-link>
//           <div class="field">
//             <p class="control has-icons-left">
//               <span class="select">
//                 <select @change="_change($event.target.value)">
//                   <option v-for="option in options" :value="option.value" :key="option.value">
//                     {{option.text}}
//                   </option>
//                 </select>
//               </span>
//               <span class="icon is-small is-left">
//                 <i class="fa fa-globe"></i>
//               </span>
//             </p>
//           </div>
//           <div class="field">
//             <div class="control">
//               <label class="checkbox">
//                 <input type="checkbox" id='showImage' v-model="checked">
//                 同时关联专题遥感影像
//               </label>
//             </div>
//           </div>
//           <div class="field">
//             <p class="control">
//               <button class="button is-success" @click="_toggleClaim" :disabled='showClaim'>
//                 认领田块
//               </button>
//             </p>
//           </div>
//         </div>
//         <div class='outer-quit'>
//           <button class="button quit" @click='quit'>退出登录</button>
//         </div>
//       </div>
//     </nav>

<script>
import * as esriLoader from 'esri-loader'
import { createMap } from '../components/esrimapPingPu'
import { mapActions, mapGetters } from 'vuex'
import CommonHeader from '@/components/common/header'
import Edit from './edit'
import Claim from './claim'
import TopicMap from '@/components/common/topicMap'
import tool from '@/components/common/tool'
import chart from '@/components/common/charts'
import Crops from '../../crop/pages/crops'
import CustomLegend from '@/components/common/legend'
export default {
  components: {
    Edit, Claim, TopicMap, Crops, CommonHeader, tool, chart, CustomLegend
  },
  data () {
    return {
      selected: 'N',
      checked: false,
      options: [
        { text: '氮(N)分布', value: 'N' },
        { text: '磷(P)分布', value: 'P' },
        { text: '钾(K)分布', value: 'K' }
      ]
    }
  },
  computed: {
    ...mapGetters([
      'showEdit', 'showClaim', 'field', 'climedFieldsIds', 'User'
    ])
  },
  methods: {
    ...mapActions(['saveEsri', 'quitLogin', 'queryClaimedFields', 'displayMode', 'addUserAction', 'queryUserByUsername']),
    _change (value) {
      this.$store.commit('GET_CURRENT_DIST', {current: value})
      this.selected = value
      this._toggleLayer(value)
      this.classify({
        tp: value
      })
    },
    _toggleLayer (type) {
      const {map} = this.$store.state.index
      let image = map.findLayerById('image')
      if (this.checked) {
        image.allSublayers.forEach((lyr, i) => {
          if (lyr.title.indexOf(type) !== -1) {
            lyr.visible = true
          } else {
            lyr.visible = false
          }
        })
      } else {
        image.allSublayers.forEach((lyr, i) => {
          if (lyr.visible) {
            lyr.visible = false
          }
        })
      }
    },
    _toggleClaim () {
      this.$store.commit('TOGGLE_CLAIM')
    },
    quit (evt) {
      evt.stopPropagation()
      this.quitLogin().then(() => {
        window.localStorage.removeItem('user')
        this.$router.push({name: 'login'})
      })
    },
    async changeMode (mode) {
      const {map} = this.$store.state.index
      let draw = map.findLayerById('draw')
      if (mode === '大户模式') {
        let id2username = map.findLayerById('id2username')
        await this.queryClaimedFields({
          featureLyr: id2username
        })
        await this.displayMode({
          fieldIds: this.climedFieldsIds,
          layer: draw,
          type: '大户模式'
        })
      } else {
        await this.displayMode({
          layer: draw,
          type: '地区模式'
        })
      }
    },
    addUser () {
      let userObj = JSON.parse(window.localStorage.getItem('user'))
      const { map } = this.$store.state.index
      // user表
      let user = map.findLayerById('user')
      if (userObj && userObj.user_name) {
        this.queryUserByUsername({
          featureLyr: user,
          userName: userObj.user_name
        }).then((result) => {
          // 如果user表中没有此用户
          if (result.features.length === 0) {
            let featureParam = this._addFeatureParam()
            if (featureParam !== null) {
              this.addUserAction({
                user,
                addFeatures: [featureParam]
              })
            }
          }
        })
      }
    },
    _addFeatureParam () {
      if (!window.localStorage.getItem('user')) {
        return null
      }
      const { ESRI } = this.$store.state.index
      const {
        user_id: userId,
        user_name: userName,
        user_phone: phone,
        cn_name: cnName,
        farm_id: farmId,
        farm_name: farmName,
        is_expert: isExpert,
        latitude,
        longitude,
        province_code: provinceCode,
        province_name: provinceName,
        city_code: cityCode,
        city_name: cityName,
        area_code: countyCode,
        area_name: countyName,
        remain_address: remain,
        address_detail: addressDetail
        } = JSON.parse(window.localStorage.getItem('user'))
      let attributes = {}
      attributes['user_id'] = userId
      attributes['user_name'] = userName
      attributes['user_phone'] = phone
      attributes['cn_name'] = cnName
      attributes['farm_id'] = farmId
      attributes['farm_name'] = farmName
      attributes['is_expert'] = isExpert
      attributes['latitude'] = latitude
      attributes['longitude'] = longitude
      attributes['province_code_'] = provinceCode
      attributes['province_name_'] = provinceName
      attributes['city_code_'] = cityCode
      attributes['city_name_'] = cityName
      attributes['county_code_'] = countyCode
      attributes['county_name_'] = countyName
      attributes['remain_address_'] = remain
      attributes['full_address_'] = addressDetail
      // 存储几何信息
      return new ESRI.Graphic({
        attributes: attributes
      })
    }
  },
  created () {
    let that = this

    if (!esriLoader.isLoaded()) {
      esriLoader.bootstrap((err) => {
        if (err) {
          console.error(err)
        }
        createMap(esriLoader, (map, view, query) => {
          that.$store.commit('SAVE_ESRI_MAP', {
            map: map,
            view: view,
            query: query
          })
        })
        that.saveEsri().then((ESRI) => {
          let view = that.$store.state.index.view
          // 遥感专题图
          const topicMapExpand = new ESRI.Expand({
            view: view,
            content: that.$refs['topicMap'].$el,
            expandIconClass: 'esri-icon-basemap',
            expandTooltip: '专题图'
          })
          view.ui.add(topicMapExpand, 'top-right')
          view.ui.add(this.$refs['chart'].$el, 'top-right')
          view.ui.add(this.$refs['tool'].$el, 'top-left')
        })
      }, {
        url: 'https://gisjs.ahqianmo.com:8092/arcgis_js_api/library/4.5/init.js'
      })
    } else {
      createMap(esriLoader, (map, view, query) => {
        that.$store.commit('SAVE_ESRI_MAP', {
          map: map,
          view: view,
          query
        })
        that.saveEsri().then((ESRI) => {
          let view = that.$store.state.index.view
          // 遥感专题图
          const topicMapExpand = new ESRI.Expand({
            view: view,
            content: that.$refs['topicMap'].$el,
            expandIconClass: 'esri-icon-collection',
            expandTooltip: '专题图'
          })
          view.ui.add(topicMapExpand, 'top-right')
          view.ui.add(this.$refs['chart'].$el, 'top-right')
          view.ui.add(this.$refs['tool'].$el, 'top-left')
        })
      })
    }
  },
  mounted () {
    let that = this
    window.setTimeout(function () {
      that.addUser()
    }, 5000)
  }
}
</script>
<style scoped>
/*@import url('http://localhost:8080/arcgis_js_api44/library/4.4/esri/themes/light/main.css');*/
.nav.is-default {
  background-color: #f5f5f5;
  margin-bottom: 2rem;
}

.nav-left {
  align-items: center;
}

.nav-item img {
  max-height: 2.2rem;
}

input {
  margin-left: 1rem;
  border: 0;
  background: transparent;
  font-weight: normal;
}

.field:not(:last-child) {
  margin-bottom: 0;
}

#home {
  position: fixed;
  top: 30px;
  z-index: 10;
}

#viewDiv {
  position: absolute;
  top: 3.5rem;
  /* top: 0; */
  bottom: 0;
  left: 0;
  right: 0;
}

/* #viewDiv .esri-ui-corner-container{
  top: 68px !important;
} */

.card{
  width: 25%;
  float: right;
  margin-right: 3rem;
  /* opacity: 0.7; */
  border-radius: 6px;
}

.outer-quit{
  position: relative;
}

.quit{
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
}

</style>
