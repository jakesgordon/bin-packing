Packing = {

  defaultBlocks: [
    {width: 40, height: 20, num: 5},
    {width: 20, height: 40, num: 5},
    {width: 16, height: 16, num: 5}
  ],

  colors: [
    "red",
    "yellow",
    "black",
    "blue",
    "pink",
    "orange",
    "green"
  ],

  fields: {
  },

  init: function() {
    if (Packing.supported()) {
      Packing.fields.go = $('#go');
      Packing.fields.blocks = $('#blocks');
      Packing.fields.canvas = $('#canvas')[0];
      Packing.fields.draw   = Packing.fields.canvas.getContext("2d");
      Packing.fields.go.click(Packing.run);

      Packing.saveBlocks(Packing.defaultBlocks);
    }
  },

  supported: function() {
    if (!Modernizr.canvas)
      return Packing.showUnsupported("the <canvas> element")
    return true;
  },

  showUnsupported: function(feature) {
    var label = $('#unsupported');
    label.find('.reason').text(feature);
    label.show();
    return false;
  },

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

  clearCanvas: function() {
    Packing.fields.draw.clearRect(0, 0, Packing.fields.canvas.width, Packing.fields.canvas.height);
  },

  drawBlock: function(block, x, y, color) {
    Packing.fields.draw.fillStyle = color;
    Packing.fields.draw.strokeStyle = "none";
    Packing.fields.draw.fillRect(x, y, block.width, block.height);
  },

  color: function(n) {
    return Packing.colors[n % Packing.colors.length];
  },

  loadBlocks: function() {
    var n, len, block, blocks = Packing.fields.blocks.val().split("\n"), result = [];
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
    Packing.fields.blocks.val(str);
  }

}

$(Packing.init);

