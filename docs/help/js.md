# General JavaScript

### Modifying an array does not trigger rerender

> Actually it's not about JS, every objective language can have a collection structure, but modifying the collection does not modify the object.  
> Comparing in JS means comparing references (it would be impossible to make a universal and fast content comparison), so pushing things to an array keeps the reference the same (as it is still the same instance of an Array class) -  just the contents change.  
> Similarly in `class Person { constructor() { this.isBanned = false; } }`, if you create a new instance (`const p = new Person();`) and then modify the property (`p.isBanned = true;`), it is still the same instance it was before, just the property differs.  

-- <cite>dracco</cite>
