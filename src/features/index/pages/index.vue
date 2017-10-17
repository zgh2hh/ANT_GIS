<template>
  <div>
    <nav class="nav hero is-default has-shadow">
      <div class='container'>
        <div class="nav-left">
          <router-link to="/" class="nav-item">
            <img src='../../../assets/CITY-LOGO.png' alt="Vue">
          </router-link>
          <div class="field">
            <p class="control has-icons-left">
              <span class="select">
                <select @change="_change($event.target.value)">
                  <option v-for="option in options" :value="option.value" :key="option.value">
                    {{option.text}}
                  </option>
                </select>
              </span>
              <span class="icon is-small is-left">
                <i class="fa fa-globe"></i>
              </span>
            </p>
          </div>
          <div class="field">
            <div class="control">
              <label class="checkbox">
                <input type="checkbox" id='showImage' v-model="checked">
                同时关联专题遥感影像
              </label>
            </div>
          </div>
          <div class="field">
            <p class="control">
              <button class="button is-success" @click="_toggleClaim" :disabled='showClaim'>
                认领田块
              </button>
            </p>
          </div>
        </div>
        <div class='outer-quit'>
          <button class="button quit" @click='quit'>退出登录</button>
        </div>
      </div>
    </nav>
    <common-header v-on:modeChange='changeMode'></common-header>
    <div id="viewDiv" class="balt-theme"></div>
    <Edit :show='showEdit' :field='field'></Edit>
    <Claim :show='showClaim'></Claim>
    <switch-map ref='switchMap'></switch-map>
    <Crops :topicMap='$store.state.crops.gradeTopicMap'></Crops>
  </div>
</template>

<script>
import * as esriLoader from 'esri-loader'
import { createMap } from '../components/esrimapPingPu'
import { mapActions, mapGetters } from 'vuex'
import CommonHeader from '@/components/common/header'
import Edit from './edit'
import Claim from './claim'
import SwitchMap from '@/components/common/switchMap'
import Crops from '../../crop/pages/crops'
export default {
  components: {
    Edit, Claim, SwitchMap, Crops, CommonHeader
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
      'showEdit', 'showClaim', 'field', 'climedFieldsIds'
    ])
  },
  methods: {
    ...mapActions(['saveEsri', 'quitLogin', 'queryClaimedFields']),
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
      if (mode === '大户模式') {
        const {map} = this.$store.state.index
        let draw = map.findLayerById('id2username')
        await this.queryClaimedFields({
          featureLyr: draw
        })
        console.log(this.climedFieldsIds)
        debugger
      }
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
          const topicMapExpand = new ESRI.Expand({
            view: view,
            content: that.$refs['switchMap'].$el,
            expandIconClass: 'esri-icon-basemap',
            expandTooltip: '专题图'
          })
          view.ui.add(topicMapExpand, 'top-right')
        })
      }, {
        url: 'https://js.arcgis.com/4.5/'
        // url: 'http://localhost:8080/arcgis_js_api44/library/4.4/'
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
          const topicMapExpand = new ESRI.Expand({
            view: view,
            content: that.$refs['switchMap'].$el,
            expandIconClass: 'esri-icon-collection',
            expandTooltip: '专题图'
          })
          view.ui.add(topicMapExpand, 'top-right')
        })
      })
    }
  }
}
</script>
<style scoped>
@import url('https://js.arcgis.com/4.5/esri/themes/light/main.css');
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
  bottom: 0;
  left: 0;
  right: 0;
}

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
