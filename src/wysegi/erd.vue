//Display an interactive Entity Relation Diagram
//Copyright WyattERP.org: See LICENSE in the root of this package
// -----------------------------------------------------------------------------
//TODO:
//- 

<template>
  <div style="width: 100%; height: 100%; resize: both; overflow: auto; padding: 0 4px 4px 0;">
    <wylib-svgraph :state="state" ref="svg" curve=true :edge="edge" :menu="menu" :env="env"
      @drag="dragHand" @drop="dropHand" @modify="restart" @refresh="refresh" @reset="reset"/>
  </div>
</template>

<script>
import Wylib from 'wylib'
const d3 = require('d3')
const WmDefs = {                //English defaults, as we may not yet be connected
  erdDecay:   {title:'Decay',       help:'Simulation decay controls how long the simulation runs'},
  erdFrict:   {title:'Friction',    help:'Defines the resistance to motion in the simulation'},
  erdLength:  {title:'Link Length', help:'Ideal distance between tables that are linked together'},
  erdPull:    {title:'Link Force',  help:'How hard a link will push/pull toward its ideal length'},
  erdCenter:  {title:'Centering',   help:'How hard a node will seek the graph center'},
  erdCollide: {title:'Collision',   help:'How hard a node will avoid colliding with another'},
}

export default {
  components: {'wylib-svgraph': Wylib.SvGraph},
  props: {
    state:	{type: Object, default: ()=>({})},
    env:	{type: Object, default: {}}
  },
  data() { return {
    tabGap:	40,
    fontSize:	16,
//    viewMeta:   null,
    stateTpt:	{nodes: {}, edges: {}},
  }},
  computed: {
    id() {return 'erd_' + this.$.uid},
    menu() {return [
      {tag: 'edgeLen',  min:10,  max:500,  step:1,     default:100,   lang: WmDefs.erdLength},
      {tag: 'edgePull', min:0,   max:0.5,  step:0.001, default:0.005, lang: WmDefs.erdPull},
      {tag: 'decay',    min:0.001,max:0.5, step:0.001, default:0.05,  lang: WmDefs.erdDecay},
      {tag: 'frict',    min:0,   max:1,    step:0.05,  default:0.3,   lang: WmDefs.erdFrict},
      {tag: 'center',   min:0,   max:1,    step:0.05,  default:0.4,   lang: WmDefs.erdCenter},
      {tag: 'collide',  min:0,   max:1,    step:0.05,  default:0.75,  lang: WmDefs.erdCollide},
    ]},
  },
  methods: {
    table(name, columns) {		//Generate SVG code for a table
      let text = `<text x="2" y="${this.fontSize}" style="font:normal ${this.fontSize}px sans-serif;">${name}`
      let max = name.length
      columns.forEach((col,idx) => {
        text += `<tspan x="6" y="${this.fontSize * (idx+2) + 4}">${col}</tspan>`
        if (col.length > max) max = col.length
      })
      text += '</text>'
      let width = max * this.fontSize * 3/4
        , height = (columns.length + 1) * this.fontSize + 10
        , body = `
        <g stroke="black" stroke-width="1" transform="translate(${-width/2},${-height/2})">
          <rect rx="4" ry="4" width="${width}" height="${height}" fill="#e0e0e0"/>
          <path d="M0,${this.fontSize+4} L${width},${this.fontSize+4}" stroke="black"/>
          ${text}
        </g>`
        , ends = [{x:0, y:-height/2}, {x:width/2, y:-height*0.25}, {x:width/2, y:0}, {x:width/2, y:height*0.25}, {x:0, y:height/2}, {x:-width/2, y:height*0.25}, {x:-width/2, y:0}, {x:-width/2, y:-height*0.25}]
//        , ends = [{x:width/2, y:0}, {x:width, y:height*0.25}, {x:width, y:height*0.5}, {x:width, y:height*0.75}, {x:width/2, y:height}, {x:0, y:height*0.75}, {x:0, y:height*0.5}, {x:0, y:height*0.25}]
//console.log("Table:", body, "Ends:", ends)
      return {body, ends, width, height}
    },

    randPoint() {return {
      x: (Math.random() - 0.5) * (this.state.maxX - this.state.minX) * 0.9,
      y: (Math.random() - 0.5) * (this.state.maxY - this.state.minY) * 0.9
    }},

    edge(thisSide, otherSide, edgeState) {		//console.log("Edge T:", thisSide, "O:", otherSide, "S:", edgeState)
      let { id } = edgeState
        , node = this.state.nodes[thisSide.tag]		//;console.log("id:", id, " node:", node)
      if (node) {
        return node.ends
      }
    },

    dragHand(ev, state) {		//console.log("Drag")
      state.fx = state.x		//Sticky when dragged
      state.fy = state.y
    },

    dropHand(ev, state) {		//console.log("Drop")
      if (!ev.shiftKey) {               //Shift key sticks the node in place
        state.fx = null                 //Otherwise they get moved again
        state.fy = null
      }
    },

    updateNodes() {			//console.log("Update Nodes")
      let where = [['tab_kind', '=', 'r'], ['system', '=', 'false'], ['sch', '!=', 'wm']]
        , fields = ['obj', 'columns', 'fkeys']
        , spec = {view: 'wm.table_meta', fields, where, order: 1}

      Wylib.Wyseman.request(this.id, 'select', spec, (tabs, err) => {
        if (err) {console.err('Error:', err.message); return}
        let { nodes, edges } = this.state
          , nodeStray = Object.assign({}, nodes)
          , edgeStray = Object.assign({}, edges)
        
        for (let tab of tabs) {			//console.log("Tab:", tab.obj, tab)
          let tag = tab.obj
            , bodyObj = this.table(tag, tab.columns.map(el=>el.col))
            , radius = bodyObj.height / 4
          if (tag in nodes) {
            Object.assign(nodes[tag], bodyObj, {radius})
          } else {
            nodes[tag] = Object.assign(bodyObj, {tag, radius}, this.randPoint())
          }
          delete nodeStray[tag]
              
//console.log("  fkeys:", tab.fkeys)
          let node = nodes[tag]
          if (tab.fkeys) tab.fkeys.forEach(fkey => {
            let eTag = fkey.table
              , id = tag + '~' + eTag			//console.log("    fkey:", id)
            delete edgeStray[id]
            if (eTag in nodes && !(id in edges) && eTag != tag) {
              edges[id] = {source:{tag}, target:{tag:eTag}, id}		//;console.log("adding edge:", id)
            }
          })
        }
        Object.keys(nodeStray).forEach(t => {         //Delete anything on the SVG, not now in no
          delete nodes[t]
        })
        Object.keys(edgeStray).forEach(t => {         //Same for edges
          delete edges[t]
        })
//console.log("Nodes:", nodes)
//console.log("Edges:", edges)
//console.log("Edges:", Object.values(edges).filter(e => e.target.tag == 'base.ent').map(e => e.source.tag))
        this.simInit()
      })
    },

    simInit(alpha = 1) {
      let { nodes, edges } = this.state
        , nodeList = Object.values(nodes)
        , edgeList = Object.values(edges).map(edge => ({
          source: nodes[edge.source.tag],
          target: nodes[edge.target.tag],
        }))
        , sets = this.state.setting
//console.log("simInit nodeList:", nodeList, "edgeList:", edgeList)

      this.simulation = d3.forceSimulation(nodeList)
        .alpha(alpha).alphaDecay(sets.decay || 0.05)
        .velocityDecay(sets.frict || 0.03)

      .force('link', d3.forceLink(edgeList).distance(d => {//console.log("LD:", d, sets.edgeLen)
        return sets.edgeLen
      }).strength(d => {				//console.log("LS:", sets.edgePull)
        return sets.edgePull
      }))

      .force('center', d3.forceCenter()		//Nodes like the graph center
          .strength(sets.center))
      
      .force('collision', d3.forceCollide().strength(0.75).radius(d => {
        let diag = Math.sqrt(d.width * d.width + d.height * d.height)
        return diag / 2
      }))

//      .force('charge', d3.forceManyBody()	//Nodes repel each other
//          .strength(-(sets.repel || 10)))

//      .on('tick', () => {console.log('ticked')})
    },		//simInit

    restart() {				//console.log("Restart")
      this.simInit()
    },

    refresh() {				//console.log("Refresh")
      this.updateNodes()
      this.simInit()
    },

    reset() {
      this.state.nodes = {}
      this.state.edges = {}
      this.refresh()
    },
  },

  beforeMount: function() {
    Wylib.Common.stateCheck(this)
//console.log("Erd before:", this.state)

//    Wylib.Wyseman.register(this.id+'wd', 'wylib.data', (data, err) => {
//      if (err) {console.log(err.msg); return}
//      this.viewMeta = data
//    })
  },

  mounted: function() {
    this.refresh()
  },
}

</script>
