# **DUICE** (Data-oriented UI Component Engine)
------------------------------------------------------------------------------------------

## Concept

### MVC Auto-Binding (between Data Structure and HTML DOM Element)
By using the installed DataMap and DataList Data Structure, bidirectional binding processing is performed with Element in charge of presentation of the screen. (Internally it is Observer Pattern)
When changing the data of DataMap and DataList, the value of the UI DOM element binding was also automatically changed.
Conversely, if the user changes the value of the UI DOM Element, the binding data is automatically changed.

### Reducing Learning Curve (via Just Simple HTML5 data-* Attribute)
If you know only basic HTML format and Javascript, configure it to be able to operate.
JQuery, AgularJS, ReactJS .. It is really a spring and autumn season. Something is just about new.
The running curve is too large.
I just want simple things to work. It is possible to set only HTML5 custom attribute data- *.

### Pure Javascript Prototype (No Dependency, No Conflict)
This library is developted by just pure javascript prototype. It is oriented towards minimal code, no-dependency and no-conflict.
Therefore you can use it with another javascript library together.
You can use it with JQuery, AngularJS and so on, also Responsive UI framework like Bootstrap.

------------------------------------------------------------------------------------------

## References 

### Demo page
<a href ="https://oopscraft.github.io/duice/src/duice.html" target="_blank">
	duice.html
</a>

### application.oopscraft.net (Standalone Application Platform)
<a href ="http://application.oopscraft.net/admin" target="_blank">
	http://application.oopscraft.net/admin
</a>

user/pass : test/test11!!


------------------------------------------------------------------------------------------

## More Information

### Official Website
<a href="https://oopscraft.github.io/duice" target="_blank">
	https://oopscraft.github.io/duice/
</a>

### Source Repository
<a href="https://github.com/oopscraft/duice" target="_blank">
	https://github.com/oopscraft/duice
</a>

### Distribution Download
<a href="https://oopscraft.github.io/duice/dist/duice-0.1.2.zip" target="_blank">
	duice-0.1.2.zip
</a>

### Licence
Anyone can use it freely.
Modify the source or allow re-creation. However, you must state that you have the original creator.
However, we can not grant patents or licenses for reproductives. (Modifications or reproductions must be shared with the public.)
Licence: LGPL(GNU Lesser General Public License version 3)
Copyright (C) 2017 duice.oopscraft.net
Contact <chomookun@gmail.com>

------------------------------------------------------------------------------------------

## duice.Map
The Map object holds key-value pairs and remembers the original insertion order of the keys. Any value (both objects and primitive values) may be used as either a key or a value.

| Method                                   | Description                                                                 |
| ---------------------------------------- |:---------------------------------------------------------------------------:|
| set(name:string, value:any):void         | Associates the specified value with the specified key in this map           |
| get(name:string):any                     | Returns the value to which the specified key is mapped                      |

<iframe height="400" style="width: 100%;" scrolling="no" title="duice.Map" src="https://codepen.io/chomookun/embed/rNxyaGQ?height=400&theme-id=dark&default-tab=js" frameborder="no" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href='https://codepen.io/chomookun/pen/rNxyaGQ'>duice.Map</a> by chomookun
  (<a href='https://codepen.io/chomookun'>@chomookun</a>) on <a href='https://codepen.io'>CodePen</a>.
</iframe>

## duice.List
The duice.List class is a resizable array.

| Tables        | Are           | Cool  |
| ------------- |:-------------:| -----:|
| col 3 is      | right-aligned | $1600 |
| col 2 is      | centered      |   $12 |
| zebra stripes | are neat      |    $1 |

<iframe height="395" style="width: 100%;" scrolling="no" title="duice.List" src="https://codepen.io/chomookun/embed/ZEQeGzZ?height=395&theme-id=dark&default-tab=js" frameborder="no" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href='https://codepen.io/chomookun/pen/ZEQeGzZ'>duice.List</a> by chomookun
  (<a href='https://codepen.io/chomookun'>@chomookun</a>) on <a href='https://codepen.io'>CodePen</a>.
</iframe>


<p class="codepen" data-height="265" data-theme-id="dark" data-default-tab="js,result" data-user="chomookun" data-slug-hash="ZEQeGzZ" style="height: 265px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;" data-pen-title="duice.List">
  <span>See the Pen <a href="https://codepen.io/chomookun/pen/ZEQeGzZ">
  duice.List</a> by chomookun (<a href="https://codepen.io/chomookun">@chomookun</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>
<script async src="https://static.codepen.io/assets/embed/ei.js"></script>

