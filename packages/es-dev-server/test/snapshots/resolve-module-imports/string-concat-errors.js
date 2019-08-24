const file = 'a';
       import(`@namespace/non-existing/dynamic-files/${file}.js`);
       import(`non-existing/dynamic-files/${file}.js`);
       import(totallyDynamic);
       import(`${file}.js`);
    