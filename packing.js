/*************************************************

  TODO
  ====
   * grow to fit
   * display whitespace ratio
   * animation render 1 by 1


**************************************************/

Packer = function(w, h) {
  this.init(w, h);
};

Packer.prototype = {

  init: function(w, h) {
    this.root = { x: 0, y: 0, w: w, h: h }
  },

  fit: function(blocks) {
    var n, node, block;
    for (n = 0; n < blocks.length; n++) {
      block = blocks[n];
      if (node = this.findNode(this.root, block.w, block.h))
        block.fit = this.splitNode(node, block.w, block.h);
    }
  },

  findNode: function(root, w, h) {
    if (root.used)
      return this.findNode(root.right, w, h) || this.findNode(root.left, w, h);
    else if ((w <= root.w) && (h <= root.h))
      return root;
    else
      return null;
  },

  splitNode: function(node, w, h) {
    node.used = true;
    node.left  = { x: node.x,     y: node.y + h, w: node.w,     h: node.h - h };
    node.right = { x: node.x + w, y: node.y,     w: node.w - w, h: h          };
    return node;
  }

}

Packing = {

  //---------------------------------------------------------------------------

  colors: [ "#10F090", "#1090F0", "#90F010", "#9010F0", "#F01090", "#F09010" ],
  color:  function(n) { return Packing.colors[n % Packing.colors.length]; },

  //---------------------------------------------------------------------------

  init: function() {

    Packing.el = {
      blocks: $('#blocks'),
      canvas: $('#canvas')[0],
      sort:   $('#sort'),
      fill:   $('#fill'),
      go:     $('#go'),
      nofit:  $('#nofit')
    };

    if (!Packing.el.canvas.getContext) // no support for canvas
      return false;

    Packing.el.draw = Packing.el.canvas.getContext("2d");
    Packing.el.blocks.val(Packing.blocks.save(Packing.blocks.default));
    Packing.el.blocks.change(Packing.run);
    Packing.el.sort.change(Packing.run);
    Packing.el.fill.change(Packing.run);
    Packing.el.go.click(Packing.run);
    Packing.run();
  },

  //---------------------------------------------------------------------------

  run: function() {

    var i, n, len, pos, all, block, nofit = [];
    var packer = new Packer(Packing.el.canvas.width-1, Packing.el.canvas.height-1);
    var blocks = Packing.blocks.load(Packing.el.blocks.val());
    var all    = blocks.expanded;

    // sort
    var sort = Packing.el.sort.val();
    if (sort != 'none')
      all.sort(Packing.sort[sort]);

    // fit
    packer.fit(all);

    // draw
    Packing.canvas.clear();
    for (n = 0 ; n < all.length ; n++) {
      block = all[n];
      if (block.fit) {
        if (Packing.el.fill.is(':checked')) {
          Packing.canvas.rect(block.fit.x, block.fit.y, block.w, block.h, Packing.color(n));
        }
      }
      else {
        nofit.push(block)
      }
    }
    Packing.canvas.boundary(packer.root);
    Packing.showNoFit(nofit);
  },

  showNoFit: function(nofit) {
    if (nofit.length > 0) {
      for(n = 0 ; n < nofit.length ; n++)
        nofit[n] = "" + nofit[n].w + "x" + nofit[n].h;
      Packing.el.nofit.html("Did not fit (" + nofit.length + ") :<br>" + nofit.join(", ")).show();
    }
    else {
      Packing.el.nofit.hide();
    }
  },

  //---------------------------------------------------------------------------

  sort: {
    none    : function (a,b) { return 0; },
    random  : function (a,b) { return Math.random() - 0.5; },
    w       : function (a,b) { return b.w - a.w; },
    h       : function (a,b) { return b.h - a.h; },
    area    : function (a,b) { return (b.w * b.h) - (a.w * a.h) },
    max     : function (a,b) { return Math.max(b.w, b.h) - Math.max(a.w, a.h); },
    min     : function (a,b) { return Math.min(b.w, b.h) - Math.min(a.w, a.h); },
    width   : function (a,b) { var primary = Packing.sort.w(a,b);   return (primary != 0) ? primary : Packing.sort.h(a,b);   },
    height  : function (a,b) { var primary = Packing.sort.h(a,b);   return (primary != 0) ? primary : Packing.sort.w(a,b);   },
    maxside : function (a,b) { var primary = Packing.sort.max(a,b); return (primary != 0) ? primary : Packing.sort.min(a,b); }
  },

  //---------------------------------------------------------------------------

  canvas: {

    clear: function() {
      Packing.el.draw.clearRect(0, 0, Packing.el.canvas.width, Packing.el.canvas.height);
    },

    rect:  function(x, y, w, h, color) {
      Packing.el.draw.fillStyle = color;
      Packing.el.draw.fillRect(x, y, w, h);
    },
    
    boundary: function(node) {
      if (node) {
        Packing.el.draw.strokeRect(node.x + 0.5, node.y + 0.5, node.w, node.h);
        Packing.canvas.boundary(node.left);
        Packing.canvas.boundary(node.right);
      }
    }
  },

  //---------------------------------------------------------------------------

  blocks: {

    default: [
      {w: 100, h: 100, num:   3},
      {w:  60, h:  60, num:  10},
      {w:  50, h:  20, num:  20},
      {w:  20, h:  50, num:  20},
      {w: 250, h: 250, num:   1},
      {w: 250, h: 100, num:   1},
      {w: 100, h: 250, num:   1},
      {w:  10, h:  10, num: 100},
      {w:   5, h:   5, num: 500}
    ],

    load: function(val) {
      var i, j, block, blocks = val.split("\n"), result = [];
      for(i = 0 ; i < blocks.length ; i++) {
        block = blocks[i].split("x");
        if (block.length >= 2)
          result.push({w: parseInt(block[0]), h: parseInt(block[1]), num: (block.length == 2 ? 1 : parseInt(block[2])) });
      }
      result.expanded = [];
      for(i = 0 ; i < result.length ; i++) {
        for(j = 0 ; j < result[i].num ; j++)
          result.expanded.push({w: result[i].w, h: result[i].h});
      }
      return result;
    },

    save: function(blocks) {
      var i, block, str = "";
      for(i = 0; i < blocks.length ; i++) {
        block = blocks[i];
        str = str + block.w + "x" + block.h + (block.num > 1 ? "x" + block.num : "") + "\n";
      }
      return str;
    }

  }

  //---------------------------------------------------------------------------

}

$(Packing.init);

