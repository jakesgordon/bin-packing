Packer = function(w, h) { this.init(w, h); };
Packer.prototype = {

  init: function(w, h) {
    this.root = { x: 0, y: 0, w: w, h: h }
  },

  place: function(w, h) {
    var node = this.findNode(this.root, w, h);
    if (node) {
      this.splitNode(node, w, h);
      return { x: node.x, y: node.y };
    }
    return false;
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
  }

}

Packing = {

  //---------------------------------------------------------------------------

  colors: [ "#10F090", "#1090F0", "#90F010", "#9010F0", "#F01090", "#F09010" ],
  color:  function(n) { return Packing.colors[n % Packing.colors.length]; },

  blocks: [
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

  //---------------------------------------------------------------------------

  init: function() {

    Packing.el = {
      blocks: $('#blocks'),
      canvas: $('#canvas')[0],
      sort:   $('#sort'),
      unfit:  $('#unfit')
    };

    if (!Packing.el.canvas.getContext) // no support for canvas
      return false;

    Packing.el.draw = Packing.el.canvas.getContext("2d");
    Packing.saveBlocks(Packing.blocks);
    $('#go').click(Packing.run);
    Packing.run();
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

  run: function() {

    var i, n, len, pos, all, block, blocks = Packing.loadBlocks(), packer = new Packer(Packing.el.canvas.width, Packing.el.canvas.height);
    Packing.saveBlocks(blocks);
    Packing.canvas.clear();
 
    all = []
    for (n = 0; n < blocks.length; n++) {
      block = blocks[n];
      for (i = 0; i < block.num; i++) {
        all.push({w: block.w, h: block.h});
      }
    }

    var sort = Packing.el.sort.val();
    if (sort != 'none')
      all.sort(Packing.sort[sort]);

    var unfit = [];
    for (n = 0; n < all.length; n++) {
      block = all[n];
      pos = packer.place(block.w, block.h); 
      if (pos) {
        Packing.canvas.rect(pos.x, pos.y, block.w, block.h, Packing.color(n));
      }
      else {
        unfit.push(block);
      }
    }

    Packing.canvas.boundary(packer.root);

    if (unfit.length > 0) {
      for(n = 0 ; n < unfit.length ; n++)
        unfit[n] = "" + unfit[n].w + "x" + unfit[n].h;
      Packing.el.unfit.html("Did not fit (" + unfit.length + ") :<br>" + unfit.join(", ")).show();
    }
    else {
      Packing.el.unfit.hide();
    }

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
        Packing.el.draw.lineWidth = 1;
        Packing.el.draw.strokeStyle = '#EEEEE';
        Packing.el.draw.strokeRect(node.x - 0.5, node.y - 0.5, node.w, node.h);
        Packing.canvas.boundary(node.left);
        Packing.canvas.boundary(node.right);
      }
    }
  },

  //---------------------------------------------------------------------------

  loadBlocks: function() {
    var n, len, block, blocks = Packing.el.blocks.val().split("\n"), result = [];
    for(n = 0, len = blocks.length ; n < len ; n++) {
      block = blocks[n].split("x");
      if (block.length >= 2) {
        result.push({w: parseInt(block[0]), h: parseInt(block[1]), num: (block.length == 2 ? 1 : parseInt(block[2])) });
      } 
    }
    return result;
  },

  saveBlocks: function(blocks) {
    var n, len, block, str = "";
    for(n = 0, len = blocks.length ; n < len ; n++) {
      block = blocks[n];
      str = str + block.w + "x" + block.h + (block.num > 1 ? "x" + block.num : "") + "\n";
    }
    Packing.el.blocks.val(str);
  }

  //---------------------------------------------------------------------------

}

$(Packing.init);

