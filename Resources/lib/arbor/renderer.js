var Renderer = function(canvas) {
  var Line = require('lib/Line');
  var particleSystem;
  var containerLines = Ti.UI.createView();
  var containerNodes = Ti.UI.createView();
  canvas.add(containerLines);
  canvas.add(containerNodes);

  var that = {
    init : function(system) {
      particleSystem = system
      that.initDragHandling();
    },
    redraw : function() {
      particleSystem.eachEdge(function(edge, pt1, pt2) {
        if (edge.line) {
          edge.line.update({
            x1 : pt1.x,
            y1 : pt1.y,
            x2 : pt2.x,
            y2 : pt2.y,
          });
        } else {
          edge.line = Line.createLine({
            x1 : pt1.x,
            y1 : pt1.y,
            x2 : pt2.x,
            y2 : pt2.y,
          })
          containerLines.add(edge.line);
        }
      })

      particleSystem.eachNode(function(node, pt) {
        if (node.attached) {
          node.data.view.updateLayout({
            left : pt.x - node.data.view.width / 2,
            top : pt.y - node.data.view.height / 2
          });
        } else {
          node.data.view.left = pt.x - node.data.view.width / 2;
          node.data.view.top = pt.y - node.data.view.height / 2;
          containerNodes.add(node.data.view);
          node.attached = true;
        }
      })
    },
    initDragHandling : function() {
      var dragged = null;
      var _touchP = null;
      var handler = {
        touchstart : function(e) {
          Ti.API.info('touchstart')
          Ti.API.info(JSON.stringify(e))
          Ti.API.info(canvas.left + "," + canvas.top)
          _touchP = new Point(e.x+e.source.left, e.y+e.source.top)
          dragged = particleSystem.nearest(_touchP);
          if (dragged && dragged.node !== null) {
            dragged.node.fixed = true
          }
          canvas.addEventListener('touchmove', handler.touchmove);
          canvas.addEventListener('touchend', handler.touchend);
          return false;
        },
        touchmove : function(e) {
          var s = new Point(e.x+e.source.left, e.y+e.source.top)
          
          if (dragged && dragged.node !== null) {
            var p = particleSystem.fromScreen(s)
            dragged.node.p = p
          }
          return false;
        },
        touchend : function(e) {
          if (dragged === null || dragged.node === undefined)
            return
          if (dragged.node !== null)
            dragged.node.fixed = false
          dragged.node.tempMass = 1000
          dragged = null
          canvas.removeEventListener('touchmove', handler.touchmove);
          canvas.removeEventListener('touchend', handler.touchend);
          _touchP = null
          return false
        }
      }
      canvas.addEventListener('touchstart', handler.touchstart);
    }
  }
  return that
}  
