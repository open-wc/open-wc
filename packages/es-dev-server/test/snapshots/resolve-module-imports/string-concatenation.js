const file = 'a';
       import(`../node_modules/@namespace/my-module-3/dynamic-files/${file}.js`);
       import(`../node_modules/my-module/dynamic-files/${file}.js`);
       import('../node_modules/my-module/dynamic-files' + '/' + file + '.js');
       import("../node_modules/my-module/dynamic-files/" + file + ".js");
       import('../node_modules/my-module/dynamic-files'.concat(file).concat('.js'));
    