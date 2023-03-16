# DUICE (Data oriented UI Component Element)

## Conception

### MVC Auto-Binding (between Data Structure and HTML DOM Element)

By using the Object and Array, bidirectional binding processing is performed with HTML DOM Element in charge of presentation of the screen.

(It's implemented by Internally it is Proxy and Observer Pattern)

When changing the data of Object and Array, the value of the UI DOM element binding was also automatically changed.

Conversely, if the user changes the value of the UI DOM Element, the binding Object and Array is automatically changed.


### Reducing Learning Curve (Only simple HTML and javascript)

If you know only basic HTML format and Javascript,

configure it to be able to operate.



### Pure Javascript Prototype (No Dependency, No Conflict)

This library is developted by just pure javascript.

It is oriented towards minimal code, no-dependency and no-conflict.

Therefore you can use it with another javascript library together.


--------------------------------------------------


## Object(Proxy) to Element

### Javascript

```javascript
const user = new duice.ObjectProxy({
    id: 'apple',
    name: 'Apple'
});
```

### HTML

```html
<span duice:object="user" duice:property="id"></span>
<input type="text" duice:object="user" duice:property="name"/>
```

### Example
[ObjectProxy to Element Test](test/ElementTest.html)


-----------------------------------------------------------


## Array(Proxy) to ElementSet

### Javascript

```javascript
const users = new duice.ArrayProxy([
    { id: 'apple', name: 'Apple' },
    { id: 'monkey', name: 'Monkey' }
]);
```

### HTML

```html
<table>
    <tr>
        <th>no</th>
        <th>id</th>
        <th>name</th>
    </tr>
    <tr duice:array="users" duice:loop="user,status">
        <td duice:object="status" duice:property="count"></td>
        <td duice:object="user" duice:property="id"></td>
        <td duice:object="user" duice:property="name"></td>
    </tr>
</table>
```

### Example

[ArrayProxy to ElementSet Test](test/ElementSetTest.html)


-----------------------------------------------------------


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

### Example

[Dialog/Alert/Confirm/Prompt Test](test/dialog/Dialog.html)


------------------------------------------------------------


## Reference

### git repository
[https://github.com/oopscraft/duice](https://github.com/oopscraft/duice)

### official site
[https://duice.oopscraft.org](https://duice.oopscraft.org)



