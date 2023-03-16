# DUICE (Data oriented UI Component Element)


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



