Packing = {

  init: function() {
    if (Packing.supported()) {
      // do something useful
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
  }

}

$(Packing.init);
