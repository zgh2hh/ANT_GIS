<template>
</template>

<script>
export default {
  name: 'draw',
  props: {
    active: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      drawConfig: {},
      pointerDownListener: null,
      pointerMoveListener: null,
      doubleClickListener: null,
      clickListener: null
    }
  },
  watch: {
    active: function (val, oldVal) {
      const { ESRI } = this.$store.state.nutrition
      if (ESRI === null) {
        return
      }
      if (val) {
        this.drawConfig = {
          drawingSymbol: new ESRI.SimpleFillSymbol({
            color: [102, 0, 255, 0.15],
            outline: {
              color: '#6600FF',
              width: 2
            }
          }),
          finishedSymbol: new ESRI.SimpleFillSymbol({
            color: [102, 0, 255, 0.45],
            outline: {
              color: '#6600FF',
              width: 2
            }
          }),
          activePolygon: null,
          isDrawActive: false
        }

        if (!this.drawConfig.isDrawActive) {
          this.activateDraw()
        } else {
          this.deactivateDraw()
          this.clearPolygon()
        }
      } else {
        this.deactivateDraw()
      }
    }
  },
  methods: {
    /**
     * Clears polygon(s) from the view and adds the
     * given polygon to the view.
     */
    redrawPolygon (polygon, finished) {
      const { view, ESRI } = this.$store.state.nutrition
      // simplify the geometry so it can be drawn accross
      // the dateline and accepted as input to other services
      var geometry = finished ? ESRI.geometryEngine.simplify(polygon) : polygon

      if (!geometry && finished) {
        console.log(
          'Cannot finish polygon. It must be a triangle at minimum. Resume drawing...'
        )
        return null
      }

      this.clearPolygon()

      var polygonGraphic = new ESRI.Graphic({
        geometry: geometry,
        symbol: finished ? this.drawConfig.finishedSymbol : this.drawConfig.drawingSymbol
      })

      view.graphics.add(polygonGraphic)
      return geometry
    },
    /**
     * Cleares the drawn polygon in the view. Only one
     * polygon may be drawn at a time.
     */
    clearPolygon () {
      const { view } = this.$store.state.nutrition
      var polygonGraphic = view.graphics.find(function (graphic) {
        return graphic.geometry.type === 'polygon'
      })

      if (polygonGraphic) {
        view.graphics.remove(polygonGraphic)
      }
    },
    /**
     * Activates the drawing tool. When draw tool is active, the
     * pointer-down, pointer-move, and double-click events on the
     * view listen for user interaction so drawing can commence.
     */
    activateDraw () {
      const { view } = this.$store.state.nutrition
      let that = this
      this.drawConfig.isDrawActive = true
      // drawButton.classList.toggle("esri-draw-button-selected");

      // remove the previous popup and polygon if they already exist
      this.clearPolygon()
      // view.popup.close()

      // prevents the popup from unecessarily closing
      // after drawing has completed
      this.clickListener = view.on('click', function (evt) {
        evt.stopPropagation()
      })
      this.pointerDownListener = view.on('pointer-down', function (event) {
        event.stopPropagation()
        var point = that.createPoint(event)
        that.addVertex(point)
      })
      this.pointerMoveListener = view.on('pointer-move', function (event) {
        if (that.drawConfig.activePolygon) {
          event.stopPropagation()

          var point = that.createPoint(event)
          that.updateFinalVertex(point)
        }
      })
      this.doubleClickListener = view.on('double-click', function (event) {
        event.stopPropagation()

        var searchArea = that.addVertex(event.mapPoint, true)

        // If an invalid search area is entered, then drawing
        // continues and the query is not executed
        if (!searchArea) {
          return null
        }

        // that.deactivateDraw()
        that.$emit('finish', searchArea.clone())
      })
    },
    /**
     * Deactivates drawing on the view. Removes event listeners
     * and clears the polygon from memory
     */
    deactivateDraw () {
      this.drawConfig.isDrawActive = false
      this.pointerDownListener.remove()
      this.pointerMoveListener.remove()
      this.doubleClickListener.remove()
      this.clickListener.remove()
      this.drawConfig.activePolygon = null
    },
    // Converts screen coordinates returned
    // from an event to an instance of esri/geometry/Point
    createPoint (event) {
      const { view } = this.$store.state.nutrition
      return view.toMap(event)
    },
    /**
     * Adds a vertex to the activePolygon. Fires each time
     * the view is clicked.
     * @param {esri/geometry/Point} point - Adds the given poing to the active
     *   polygon then resets the active polygon.
     * @return {esri/geometry/Polygon}
     */
    addVertex (point, isFinal) {
      const { ESRI } = this.$store.state.nutrition
      var polygon = this.drawConfig.activePolygon
      var ringLength

      if (!polygon) {
        polygon = new ESRI.Polygon({
          spatialReference: {
            // wkid: 3857
            latestWkid: 3857,
            wkid: 102100
          }
        })
        polygon.addRing([point, point])
      } else {
        ringLength = polygon.rings[0].length
        polygon.insertPoint(0, ringLength - 1, point)
      }

      this.drawConfig.activePolygon = polygon
      return this.redrawPolygon(polygon, isFinal)
    },
    /**
     * Executes on each pointer-move event. Updates the
     * final vertex of the activePolygon to the given
     * point.
     */
    updateFinalVertex (point) {
      var polygon = this.drawConfig.activePolygon.clone()

      var ringLength = polygon.rings[0].length
      polygon.insertPoint(0, ringLength - 1, point)
      this.redrawPolygon(polygon)
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
</style>
