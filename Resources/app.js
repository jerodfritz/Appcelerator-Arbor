Ti.include("lib/arbor/hermetic.js");
Ti.include("lib/arbor/etc.js");
Ti.include("lib/arbor/kernel.js");
Ti.include("lib/arbor/tween/easing.js");
Ti.include("lib/arbor/tween/tween.js");
Ti.include("lib/arbor/physics/atoms.js");
Ti.include("lib/arbor/physics/barnes-hut.js");
Ti.include("lib/arbor/physics/physics.js");
Ti.include("lib/arbor/physics/system.js");
Ti.include("lib/arbor/renderer.js");

var createNode = function(label,image) {
    var image = image || 'avatar.png';
    var nodeWidth = 50;
    var nodeHeight = 80;  
    var view = Ti.UI.createView({
      width : nodeWidth,
      height : nodeHeight
    });
    var img = Ti.UI.createImageView({
      width : nodeWidth,
      height : nodeWidth,
      image : image,
      borderRadius : nodeWidth/2,
      borderColor : '#1a0033',
      borderWidth : Math.round(nodeWidth/20),
      backgroundColor : '#296EC1',
      touchEnabled : false
    });
    view.add(img);
    var l = Ti.UI.createLabel({
      text : label,
      bottom : 0,
      font : {
        fontSize : '10dp',
      },
      touchEnabled : false
    })
    view.add(l);
    view.id = label;
    return view;
}

var win = Titanium.UI.createWindow({
  backgroundColor : 'white'
});
win.open();

var container = Ti.UI.createView({
  backgroundColor : 'grey',
  width : Ti.Platform.displayCaps.platformWidth,
  height : Ti.Platform.displayCaps.platformHeight,
  top: 0,
  left:0,
});
win.add(container);

var sys = ParticleSystem(2000, 1600, 0.5) // create the system with sensible repulsion/stiffness/friction
sys.screenSize(Ti.Platform.displayCaps.platformWidth,Ti.Platform.displayCaps.platformHeight)
sys.screenPadding(80);
sys.parameters({gravity:false});
sys.renderer = Renderer(container);
/*

var jerod = sys.addNode('jerod',{view:createNode('jerod')});
var stephanie = sys.addNode('stephanie',{view:createNode('stephanie')});
sys.addEdge(jerod,stephanie);
//Ti.API.info(JSON.stringify(jerod));

jerod.data.view.addEventListener('click',function(){
  Ti.API.info("click");
  var cricket = sys.addNode('cricket',{view:createNode('cricket')});
  var cricket2 = sys.addNode('cricket2',{view:createNode('cricket2')});
  sys.addEdge(jerod,cricket);
  sys.addEdge(jerod,cricket2);
})
*/


function getNodes() {
  var nodes = [{
    node : createNode('jerod'),
    children : [{
      node : createNode('macy'),
      children : [{
        node : createNode('macy 1')
      }, {
        node : createNode('macy 2')
      }, {
        node : createNode('macy 3')
      }]
    }, {
      node : createNode('cricket'),
      children : [{
        node : createNode('cricket 1')
      }, {
        node : createNode('cricket 2')
      }]
    }]
  }];
  return nodes;
}


function buildGraph(nodes,parent,levels){
  Ti.API.info(levels);
  if (levels >= 0) {
    Ti.API.info("good" + levels);
    var previousGraphNode = false;
    for (var i in nodes) {
      var node = nodes[i];
      //Ti.API.info(JSON.stringify(node));
      var graphNode = sys.addNode(node.node.id,{view:node.node});
      //Ti.API.info(JSON.stringify(graphNode));
      if (node.children) {
        if(levels-1 < 0){
          graphNode.data.view.graphNode = graphNode;
          graphNode.data.view.addEventListener('click',function(e){
            buildGraph(getNodes(), graphNode, 1);
          })   
        } else {
          buildGraph(node.children, graphNode, levels - 1)  
        }
      }
      if (parent) {
        sys.addEdge(parent, graphNode);
      }
      previousGraphNode = graphNode;
    }
  } else {
    Ti.API.info("no good" + levels);
  }
}

buildGraph(getNodes(),false,5)
