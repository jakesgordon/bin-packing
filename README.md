Binary Tree Algorithm for 2D Bin Packing
========================================

This project is a javascript experiment to write a binary tree based
bin packing algorithm that is suitable for generating
[CSS sprites](https://github.com/jakesgordon/sprite-factory).

Demo
====

Clone this repository

    git clone https://github.com/jakesgordon/bin-packing

View the index.html file in your favorite browser for

Usage
=====

If you want to use GrowingPacker in your own javascript projects, you need something like this:

    <script src='packer.growing.js'></script>
    <script>
      var packer = new GrowingPacker();
      var blocks = [
        { w: 100, h: 100 },
        { w: 100, h: 100 },
        { w:  80, h:  80 },
        { w:  80, h:  80 },
        etc
        etc
      ];

      blocks.sort(function(a,b) { return (b.h < a.h); }); // sort inputs for best results (see demo.js for comprehensive sort options)
      packer.fit(blocks);
  
      for(var n = 0 ; n < blocks.length ; n++) {
        var block = blocks[n];
        if (block.fit) {
          DrawRectangle(block.fit.x, block.fit.y, block.w, block.h);
        }
      }
    </script>

See source code comments for more details.

License
=======

See [LICENSE](https://github.com/jakesgordon/bin-packing/blob/master/LICENSE) file.

Contact
=======

If you have any ideas, feedback, requests or bug reports, you can reach me at
[jake@codeincomplete.com](mailto:jake@codeincomplete.com), or via
my website: [Code inComplete](http://codeincomplete.com/).



