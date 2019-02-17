# **DUICE** (Data-oriented UI Component Engine)
----------------------------------------------------------------------
## Concept
Laziness and Chronic Stress from Complexity of UI Development have been developed to the following purpose.
<img style="width:50%;" src="http://www.plantuml.com/plantuml/png/VLDBJnin4BxxLupW0jia1N6f445G7YrLK948dBWuzh0PyDfRUyoZlxvhBpMRz769rlCzPloDSnHOUewD4U6HR2kzR60fhNxsn8mMs4SSG5STcHIrqlALr9fi3Nix0rmP6SAvitnDFn4-3P20Fo9QXSVUk-VvajIZnH1Wzo-KomwGDHuRgYqej8n-mF8kMgsSj-XXRr1lv4lJ2qFglRkp8vQa4UwTuuLx4OA93OA0qvkBaxEjKybox3nrzeGQ7kIJ3CfJot1p0IUkQPtj83YpDLdS5cWrP0CXf6BdOUCceDy06I1s7w9z3mOs3XQ7N-UNC_W0tuhjmSV5uPtTqgcjZgHmNC4niwT5P0pRlHE9RbBOH4G1AuvLbQUkggsidLJRTxR_UWXPcWy0cpEgb_pPH8G_76x9SvHcvNx5C5BsdECBZzBFEQ7HeybaClhYIO_c7l6MyBahb7P9zD-6AMAuPXyLHu-bLOeWDxkKxMX6WKU9M9mBP-YTyyzRd4x1MT1EnIRjnpYPN-5qAYB1U7muDDW7vL4oGZwvnGCgJkkZfrmin1LffxedZm6-srbddg92mmZuX7PTBNf5qaRQ1uzI1tXVSGMoRFYTMi8hyuMq4vLtCknHYA8eaZmBPTkQLs07-Q6XmIOfkn1_9vHU9QYbj3N2aXi3hQmnnPI1Vk0tF6H2COaq7BB4qT-_bDUZBbxfE1mamnJUy6wBhz3_8z8msU4VLhtJ05WRAxPT5TUpsL-vz32O8xGwDkON"/>
### MVC Auto-Binding (between Data Structure and HTML DOM Element)
By using the installed DataMap and DataList Data Structure, bidirectional binding processing is performed with Element in charge of presentation of the screen. (Internally it is Observer Pattern)
When changing the data of DataMap and DataList, the value of the UI DOM element binding was also automatically changed.
Conversely, if the user changes the value of the UI DOM Element, the binding data is automatically changed.
### Reducing Learning Curve (via Just Simple HTML5 data-* Attribute)
If you know only basic HTML format and Javascript, configure it to be able to operate.
# **DUICE** (Data-oriented UI Component Engine)
----------------------------------------------------------------------
## Concept
Laziness and Chronic Stress from Complexity of UI Development have been developed to the following purpose.
<img src="http://www.plantuml.com/plantuml/png/VLDBJnin4BxxLupW0jia1N6f445G7YrLK948dBWuzh0PyDfRUyoZlxvhBpMRz769rlCzPloDSnHOUewD4U6HR2kzR60fhNxsn8mMs4SSG5STcHIrqlALr9fi3Nix0rmP6SAvitnDFn4-3P20Fo9QXSVUk-VvajIZnH1Wzo-KomwGDHuRgYqej8n-mF8kMgsSj-XXRr1lv4lJ2qFglRkp8vQa4UwTuuLx4OA93OA0qvkBaxEjKybox3nrzeGQ7kIJ3CfJot1p0IUkQPtj83YpDLdS5cWrP0CXf6BdOUCceDy06I1s7w9z3mOs3XQ7N-UNC_W0tuhjmSV5uPtTqgcjZgHmNC4niwT5P0pRlHE9RbBOH4G1AuvLbQUkggsidLJRTxR_UWXPcWy0cpEgb_pPH8G_76x9SvHcvNx5C5BsdECBZzBFEQ7HeybaClhYIO_c7l6MyBahb7P9zD-6AMAuPXyLHu-bLOeWDxkKxMX6WKU9M9mBP-YTyyzRd4x1MT1EnIRjnpYPN-5qAYB1U7muDDW7vL4oGZwvnGCgJkkZfrmin1LffxedZm6-srbddg92mmZuX7PTBNf5qaRQ1uzI1tXVSGMoRFYTMi8hyuMq4vLtCknHYA8eaZmBPTkQLs07-Q6XmIOfkn1_9vHU9QYbj3N2aXi3hQmnnPI1Vk0tF6H2COaq7BB4qT-_bDUZBbxfE1mamnJUy6wBhz3_8z8msU4VLhtJ05WRAxPT5TUpsL-vz32O8xGwDkON"/>
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

## Examples
### Grid Example
<iframe width="100%" height="300" src="//jsfiddle.net/chomookun/kv1yaz7p/embedded/result,js,html,css,resources/dark/" allowfullscreen="allowfullscreen" allowpaymentrequest frameborder="0" style="border:solid 1px #ccc;"></iframe>

### TreeView Example
<iframe width="100%" height="300" src="//jsfiddle.net/chomookun/zb9vLt6s/embedded/result,js,html,css,resources/dark/" allowfullscreen="allowfullscreen" allowpaymentrequest frameborder="0" style="border:solid 1px #ccc;"></iframe>

### Flow Example
<iframe width="100%" height="300" src="//jsfiddle.net/chomookun/0L8ubpwm/embedded/result,js,html,css,resources/dark/" allowfullscreen="allowfullscreen" allowpaymentrequest frameborder="0" style="border:solid 1px #ccc;"></iframe>


## References 
### application.oopscraft.net (Standalone Application Platform)
<a href ="http://application.oopscraft.net/admin" target="_blank">
	http://application.oopscraft.net/admin
</a>


## More Information
### Official Website
<a href="http://duice.oopscraft.net" target="_blank">
	http://duice.oopscraft.net
</a>
### Source Repository
<a href="https://github.com/oopscraft/duice" target="_blank">
	https://github.com/oopscraft/duice
</a>
### Distribution Download
<a href="http://duice.oopscraft.net/dist/duice.zip" target="_blank">
	http://duice.oopscraft.net/dist/duice.zip
</a>
### Licence
Anyone can use it freely.
Modify the source or allow re-creation. However, you must state that you have the original creator.
However, we can not grant patents or licenses for reproductives. (Modifications or reproductions must be shared with the public.)

Licence: LGPL(GNU Lesser General Public License version 3)
Copyright (C) 2017 duice.oopscraft.net
Contact <chomookun@gmail.com>



JQuery, AgularJS, ReactJS .. It is really a spring and autumn season. Something is just about new.
The running curve is too large.
I just want simple things to work. It is possible to set only HTML5 custom attribute data- *.
### Pure Javascript Prototype (No Dependency, No Conflict)
This library is developted by just pure javascript prototype. It is oriented towards minimal code, no-dependency and no-conflict.
Therefore you can use it with another javascript library together.
You can use it with JQuery, AngularJS and so on, also Responsive UI framework like Bootstrap.

## Examples
### Grid Example
<iframe width="100%" height="300" src="//jsfiddle.net/chomookun/kv1yaz7p/embedded/result,js,html,css,resources/dark/" allowfullscreen="allowfullscreen" allowpaymentrequest frameborder="0" style="border:solid 1px #ccc;"></iframe>

### TreeView Example
<iframe width="100%" height="300" src="//jsfiddle.net/chomookun/zb9vLt6s/embedded/result,js,html,css,resources/dark/" allowfullscreen="allowfullscreen" allowpaymentrequest frameborder="0" style="border:solid 1px #ccc;"></iframe>

### Flow Example
<iframe width="100%" height="300" src="//jsfiddle.net/chomookun/0L8ubpwm/embedded/result,js,html,css,resources/dark/" allowfullscreen="allowfullscreen" allowpaymentrequest frameborder="0" style="border:solid 1px #ccc;"></iframe>


## References 
### application.oopscraft.net (Standalone Application Platform)
<a href ="http://application.oopscraft.net/admin" target="_blank">
	http://application.oopscraft.net/admin
</a>


## More Information
### Official Website
<a href="http://duice.oopscraft.net" target="_blank">
	http://duice.oopscraft.net
</a>
### Source Repository
<a href="https://github.com/oopscraft/duice" target="_blank">
	https://github.com/oopscraft/duice
</a>
### Distribution Download
<a href="http://duice.oopscraft.net/dist/duice.zip" target="_blank">
	http://duice.oopscraft.net/dist/duice.zip
</a>
### Licence
Anyone can use it freely.
Modify the source or allow re-creation. However, you must state that you have the original creator.
However, we can not grant patents or licenses for reproductives. (Modifications or reproductions must be shared with the public.)

Licence: LGPL(GNU Lesser General Public License version 3)
Copyright (C) 2017 duice.oopscraft.net
Contact <chomookun@gmail.com>



