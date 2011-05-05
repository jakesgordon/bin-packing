Packing = {

  defaultBlocks: [
    {width: 40, height: 20, num: 5},
    {width: 20, height: 40, num: 5},
    {width: 16, height: 16, num: 5}
  ],

  fields: {
  },

  init: function() {
    if (Packing.supported()) {
      Packing.fields.go = $('#go');
      Packing.fields.blocks = $('#blocks');
      Packing.fields.go.click(Packing.run);

      Packing.printBlocks(Packing.defaultBlocks);
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
    var blocks = Packing.parseBlocks();
    Packing.printBlocks(blocks);
  },

  parseBlocks: function() {
    var n, len, block, blocks = Packing.fields.blocks.val().split("\n"), result = [];
    for(n = 0, len = blocks.length ; n < len ; n++) {
      block = blocks[n].split("x");
      if (block.length >= 2) {
        result.push({width: parseInt(block[0]), height: parseInt(block[1]), num: (block.length == 2 ? 1 : parseInt(block[2])) });
      } 
    }
    return result;
  },

  printBlocks: function(blocks) {
    var n, len, block, str = "";
    for(n = 0, len = blocks.length ; n < len ; n++) {
      block = blocks[n];
      str = str + block.width + "x" + block.height + (block.num > 1 ? "x" + block.num : "") + "\n";
    }
    Packing.fields.blocks.val(str);
  }

}

$(Packing.init);
