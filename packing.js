Packer = function(width, height) {
  this.width  = width;
  this.height = height;
  this.x = 0;
  this.y = 0;
};

Packer.prototype = {
  place: function(width, height) {
    result = {x: this.x, y: this.y };
    this.x = this.x + 50;
    if (this.x >= this.width/2) {
      this.y = this.y + 50;
      this.x = 0;
    }
    return result;
  }
}

Packing = {

  //---------------------------------------------------------------------------

  colors: [ "#10F090", "#1090F0", "#90F010", "#9010F0", "#F01090", "#F09010" ],
  color:  function(n) { return Packing.colors[n % Packing.colors.length]; },

  blocks: [
    {width: 35, height: 30, num: 10},
    {width: 20, height: 40, num: 10},
    {width: 16, height: 16, num: 10}
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
  },

  //---------------------------------------------------------------------------

  run: function() {
    var i, n, len, pos, block, blocks = Packing.loadBlocks(), packer = new Packer(Packing.el.canvas.width, Packing.el.canvas.height);
    Packing.saveBlocks(blocks);
    Packing.canvas.clear();
    for (n = 0, len = blocks.length; n < len; n++) {
      block = blocks[n];
      for (i = 0 ; i < block.num ; i++) {
        pos = packer.place(block.width, block.height); 
        Packing.canvas.rect(pos.x, pos.y, block.width, block.height, Packing.color(i));  
      }
    }
  },

  //---------------------------------------------------------------------------

  canvas: {

    clear: function() {
      Packing.el.draw.clearRect(0, 0, Packing.el.canvas.width, Packing.el.canvas.height);
    },

    rect:  function(x, y, width, height, color) {
      Packing.el.draw.fillStyle = color;
      Packing.el.draw.strokeRect(x, y, width, height);
      Packing.el.draw.fillRect(x, y, width, height);
    },
    
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

