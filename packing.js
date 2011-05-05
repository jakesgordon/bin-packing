Packing = {

  //---------------------------------------------------------------------------

  colors: [ "red", "yellow", "black", "blue", "pink", "orange", "green" ],

  blocks: [
    {width: 35, height: 30, num: 5},
    {width: 20, height: 40, num: 5},
    {width: 16, height: 16, num: 5}
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
    var i, n, len, block, blocks = Packing.loadBlocks();
    Packing.saveBlocks(blocks);
    Packing.clearCanvas();
    for (n = 0, len = blocks.length; n < len; n++) {
      block = blocks[n];
      for (i = 0 ; i < block.num ; i++) {
        Packing.drawBlock(block, i*50, n*50, Packing.color(i));  
      }
    }
  },

  //---------------------------------------------------------------------------

  clearCanvas: function() {
    Packing.el.draw.clearRect(0, 0, Packing.el.canvas.width, Packing.el.canvas.height);
  },

  drawBlock: function(block, x, y, color) {
    Packing.el.draw.fillStyle = color;
    Packing.el.draw.strokeStyle = "none";
    Packing.el.draw.fillRect(x, y, block.width, block.height);
  },

  color: function(n) {
    return Packing.colors[n % Packing.colors.length];
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

