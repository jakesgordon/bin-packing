Packer = function(width, height) { this.init(width, height); };
Packer.prototype = {

  init: function(width, height) {
    this.root = {
      x: 0,
      y: 0,
      w: width,
      h: height
    }
  },

  place: function(width, height) {
    var node = this.findNode(this.root, width, height);
    if (node) {
      this.splitNode(node, width, height);
      return { x: node.x, y: node.y };
    }
    return false;
  },

  findNode: function(root, width, height) {
    if (root.right && (result = this.findNode(root.right, width, height)))
      return result;
    else if (root.left && (result = this.findNode(root.left, width, height)))
      return result;
    else if (!root.done && (width <= root.w) && (height <= root.h))
      return root;
    else
      return null;
  },

  splitNode: function(node, width, height) {
    node.done = true;
    node.left  = { x: node.x,         y: node.y + height, w: node.w,         h: node.h - height };
    node.right = { x: node.x + width, y: node.y,          w: node.w - width, h: height          };
  }

}

Packing = {

  //---------------------------------------------------------------------------

  colors: [ "#10F090", "#1090F0", "#90F010", "#9010F0", "#F01090", "#F09010" ],
  color:  function(n) { return Packing.colors[n % Packing.colors.length]; },

  blocks: [
    {width: 100, height: 100, num:   3},
    {width:  60, height: 60,  num:  10},
    {width:  50, height: 20,  num:  20},
    {width:  20, height: 50,  num:  20},
    {width:  10, height: 10,  num: 100},
    {width:   5, height:  5,  num: 100}
  ],

  //---------------------------------------------------------------------------

  init: function() {

    Packing.el = {
      blocks: $('#blocks'),
      canvas: $('#canvas')[0]
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
    none   : function (a,b) { return 0; },
    width  : function (a,b) { return b.width - a.width },
    height : function (a,b) { return b.height - a.height },
    area   : function (a,b) { return b.width*b.height - a.width*a.height },
    random : function (a,b) { return Math.random(); }
  },

  run: function() {

    var i, n, len, pos, all, block, blocks = Packing.loadBlocks(), packer = new Packer(Packing.el.canvas.width, Packing.el.canvas.height);
    Packing.saveBlocks(blocks);
    Packing.canvas.clear();
 
    all = []
    for (n = 0; n < blocks.length; n++) {
      block = blocks[n];
      for (i = 0; i < block.num; i++) {
        all.push({width: block.width, height: block.height});
      }
    }

    all.sort(Packing.sort.height);

    for (n = 0; n < all.length; n++) {
      block = all[n];
      pos = packer.place(block.width, block.height); 
      if (pos)
        Packing.canvas.rect(pos.x, pos.y, block.width, block.height, Packing.color(n));
    }

    Packing.canvas.boundary(packer.root);
  },

  //---------------------------------------------------------------------------

  canvas: {

    clear: function() {
      Packing.el.draw.clearRect(0, 0, Packing.el.canvas.width, Packing.el.canvas.height);
    },

    rect:  function(x, y, width, height, color) {
      Packing.el.draw.fillStyle = color;
      Packing.el.draw.fillRect(x, y, width, height);
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
        result.push({width: parseInt(block[0]), height: parseInt(block[1]), num: (block.length == 2 ? 1 : parseInt(block[2])) });
      } 
    }
    return result;
  },

  saveBlocks: function(blocks) {
    var n, len, block, str = "";
    for(n = 0, len = blocks.length ; n < len ; n++) {
      block = blocks[n];
      str = str + block.width + "x" + block.height + (block.num > 1 ? "x" + block.num : "") + "\n";
    }
    Packing.el.blocks.val(str);
  }

  //---------------------------------------------------------------------------

}

$(Packing.init);

