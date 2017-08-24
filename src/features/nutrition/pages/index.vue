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
        </div>
      </div>
    </nav>
    <div id="viewDiv" class="balt-theme"></div>
    <Edit :show='showEdit' :field='field'></Edit>
  </div>
</template>

<script>
import * as esriLoader from 'esri-loader'
import { createMap } from '../components/esrimapPingPu'
import { mapActions, mapGetters } from 'vuex'
import Edit from './edit'
export default {
  components: {
    Edit
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
      'showEdit', 'field'
    ])
  },
  methods: {
    ...mapActions(['classify', 'saveEsri']),
    _change (value) {
      this.$store.commit('GET_CURRENT_DIST', {current: value})
      this.selected = value
      this._toggleLayer(value)
      this.classify({
        tp: value
      })
    },
    _toggleLayer (type) {
      const {map} = this.$store.state.nutrition
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
    }
  },
  mounted () {
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
          that.classify({
            tp: that.selected
          })
        })

        that.saveEsri()
      }, {
        url: 'https://js.arcgis.com/4.4/'
        // url: 'http://localhost:8080/arcgis_js_api44/library/4.4/'
      })
    } else {
      createMap(esriLoader, (map, view, query) => {
        that.$store.commit('SAVE_ESRI_MAP', {
          map: map,
          view: view,
          query
        })
        that.classify({
          tp: that.selected
        })

        that.saveEsri()
      })
    }
  }
}
</script>
<style scoped>
@import url('https://js.arcgis.com/4.4/esri/themes/light/main.css');
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
</style>
