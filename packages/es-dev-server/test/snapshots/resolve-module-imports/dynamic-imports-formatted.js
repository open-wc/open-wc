
      import '../node_modules/my-module/index.js';

      function lazyLoad() {
        return import(
          '../node_modules/my-module-2/my-module-2.js'
          );
      }

      () => import(
        `../node_modules/my-module`
      );

      function lazyLoad2() {
        return import(      "../node_modules/my-module-2/my-module-2.js");
      }

      import('../node_modules/my-module/index.js');

      import('./local-module.js');
    