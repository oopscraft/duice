# DUICE (Data oriented UI Control Element)

## Conception

### 1. MVC Auto-Binding (between Data Structure and HTML DOM Element)

By using the Object and Array, bidirectional binding processing is performed with HTML DOM Element in charge of presentation of the screen.
(It's implemented by Internally it is Proxy and Observer Pattern)
When changing the data of Object and Array, the value of the UI DOM element binding was also automatically changed.
Conversely, if the user changes the value of the UI DOM Element, the binding Object and Array is automatically changed.

### 2. Reducing Learning Curve (Only simple HTML and javascript)

If you know only basic HTML format and Javascript,
configure it to be able to operate.

### 3. Pure Javascript Prototype (No Dependency, No Conflict)

This library is developted by just pure javascript.
It is oriented towards minimal code, no-dependency and no-conflict.
Therefore you can use it with another javascript library together.


--------------------------------------------------


## Object(Proxy) and Control


### Javascript

```javascript
const user = new duice.ObjectProxy({
    id: 'apple',
    name: 'Apple'
});
```

### HTML

| attribute                             | description                                          |
|:--------------------------------------|:-----------------------------------------------------|
| duice:object="[object]"               | Object name to bind                                  |
| duice:property="[property of object]" | Object Property name to bind                         |
| duice:script="[script code]"          | javascript code to execute when element is updated   |
| duice:mask="[data masking clause]"    | ex) string('###-###'), number(2), date('yyyy-MM-dd') |

```html
<span duice:object="user" duice:property="id"></span>
<input type="text" duice:object="user" duice:property="name"/>
```

### Test Case
[ObjectProxy to Element Test](test/ControlTest.html)


-----------------------------------------------------------


## Array(Proxy) and LoopControl 

### Javascript

```javascript
const users = new duice.ArrayProxy([
    { id: 'apple', name: 'Apple' },
    { id: 'monkey', name: 'Monkey' },
    { id: 'orange', name: 'Orange' }
]);
```

### HTML

| attribute                                 | description                              |
|:------------------------------------------|:-----------------------------------------|
| duice:array="[array]"                     | Object name to bind                      |
| duice:loop="[element name],[status name]" | element object and status variable name  |
| duice:script="[script code]"          | javascript code to execute when element is updated   |

```html
<table>
    <tr>
        <th>no</th>
        <th>name</th>
        <th>name</th>
    </tr>
    <tr duice:array="users" duice:loop="user,status">
        <td duice:object="status" duice:property="count"></td>
        <td duice:object="user" duice:property="id"></td>
        <td><input type="text" duice:object="user" duice:property="name"/></td>
    </tr>
</table>
```

### Test Case 

[ArrayProxy to LoopControl Test](test/LoopControlTest.html)


-----------------------------------------------------------

## Data and ComponentControl

### javascript

```javascript
/**
 * MyObjectComponent
 */
duice.defineComponent("my-object-component", class MyObjectComponent extends duice.Component {
    // template literal
    doTemplate(data) {
        return `
            <div>
                <span duice:object="data" duice:property="name"></span>
                <input type="text" duice:object="data" duice:property="name" class="bg-red"/>
            </div>
        `;
    }
    // style literal (optional)
    doStyle(data) {
        return `
            .bg-red {
                background-color: red;
            }
        `;
    }
});
```

### HTML

| attribute                                 | description                                        |
|:------------------------------------------|:---------------------------------------------------|
| duice:data="[object or array]"            | Object or Array name to bind                       |


```html
<script>
    let myObject = new duice.ObjectProxy({
        id: 'apple',
        name: 'Apple',
    });
</script>

<my-object-component duice:data="myObject"></my-object-component>

```

### Test Case

[Data to ComponentControl Test](test/ComponentControlTest.html)


------------------------------------------------------


## Dialog(alert,confirm,prompt,custom dialog)

### Javascript
```javascript
// await style
async function confirmAwait() {
    if(await duice.confirm('<b>Hello~</b>\nThis is confirm message!\nYes or No?')){
        alert(true);
    }else{
        alert(false);
    }
}

// then style
async function confirmThen() {
    duice.confirm('<b>Hello~</b>\nThis is confirm message!\nYes or No?').then((result) =>{
        if(result) {
            alert(true);
        }else{
            alert(false);
        }
    });
}

// custom dialog from HTML Dialog Element
async function openDialog() {
    duice.dialog(document.getElementById('myDialog')).then(()=>{
        alert('do next');
    });
}
```

### HTML 

```html
<dialog id="myDialog">
    <pre>
        Custom Dialog
    </pre>
</dialog>
```

### Test Case

[Dialog/Alert/Confirm/Prompt Test](test/dialog/DialogTest.html)


------------------------------------------------------------


## Reference

### git repository
[https://github.com/oopscraft/duice](https://github.com/oopscraft/duice)

### official site
[https://duice.oopscraft.org](https://duice.oopscraft.org)



