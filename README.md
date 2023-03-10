# DUICE (Data oriented UI Component Element)

## Concept

### MVC Auto-Binding (between Data Structure and HTML DOM Element)
By using the installed DataMap and DataList Data Structure, bidirectional binding processing is performed with Element in charge of presentation of the screen. (Internally it is Observer Pattern) When changing the data of DataMap and DataList, the value of the UI DOM element binding was also automatically changed. Conversely, if the user changes the value of the UI DOM Element, the binding data is automatically changed.

### Reducing Learning Curve (via Just Simple Element Attribute)
If you know only basic HTML format and Javascript, configure it to be able to operate. JQuery, AgularJS, ReactJS .. It is really a spring and autumn season. Something is just about new. The running curve is too large. I just want simple things to work. It is possible to set only HTML5 custom attribute data- *.

### Pure Javascript Prototype (No Dependency)
This library is developted by just pure javascript prototype. It is oriented towards minimal code, no-dependency and no-conflict. Therefore you can use it with another javascript library together. You can use it with JQuery, AngularJS and so on, also Responsive UI framework like Bootstrap.


## Test Case

[Data to Element Test](test/ElementTest.html)

[DataSet to ElementSet Test](test/ElementSetTest.html)

[Dialog/Alert/Confirm/Prompt Test](test/dialog/Dialog.html)


## Reference
- git repository: [https://github.com/oopscraft/duice](https://github.com/oopscraft/duice)
- official site: [https://duice.oopscraft.org](https://duice.oopscraft.org)

