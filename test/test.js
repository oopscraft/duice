/**
 * execute
 */
function execute() {
    let textarea = document.getElementById('code');
    let code = textarea.value;
    let iframe = document.getElementById('html');
    iframe.src="about:blank";
    let iframedoc;
    if (iframe.contentDocument) {
        iframedoc = iframe.contentDocument;
    } else if (iframe.contentWindow) {
        iframedoc = iframe.contentWindow.document;
    }
    if (iframedoc) {
        console.log("==== load ====");
        // Put the content in the iframe
        iframedoc.open();
        iframedoc.writeln(code);
        iframedoc.close();
    }
}




/**
 * DOMContentLoaded
 */
document.addEventListener("DOMContentLoaded", function(event) {
    var textareas = document.querySelectorAll('textarea');
    for(var i = 0; i < textareas.length; i ++ ) {
        //resize(textareas[i]);
        textareas[i].onkeydown = function(event) {
            //resize(event.srcElement);
            if (event.keyCode === 9) { // tab was pressed
                // get caret position/selection
                var val = event.srcElement.value,
                    start = event.srcElement.selectionStart,
                    end = event.srcElement.selectionEnd;
                // set textarea value to: text before caret + tab + text after caret
                event.srcElement.value = val.substring(0, start) + '\t' + val.substring(end);
                // put caret at right position again
                event.srcElement.selectionStart = this.selectionEnd = start + 1;
                // prevent the focus lose
                return false;
            }
        };
    }
});

/**
 * doTest
 */
function doTest() {
    var iframe = document.querySelector('iframe[name=result]');
    var resultDoc = iframe.contentDocument;
    resultDoc.open();
    var codeHtml = document.querySelector('textarea[name=codeHtml]').value;
    resultDoc.write('<p></p>' + codeHtml);

    var juiceCss = document.createElement("link");
    juiceCss.href = "../../juice.css";
    juiceCss.rel = "stylesheet";
    juiceCss.type = "text/css";
    resultDoc.head.appendChild(juiceCss);

    var juiceScript = document.createElement('script');
    juiceScript.src = '../../duice.js';
    resultDoc.head.appendChild(juiceScript);
    juiceScript.addEventListener('load', function(){
        var codeScript = sectionObj.querySelector('textarea[name=codeScript]').value;
        var scriptObj = document.createElement('script');
        scriptObj.type="text/javascript";
        scriptObj.appendChild(document.createTextNode(codeScript));
        resultDoc.head.appendChild(scriptObj);
        resultDoc.close();
    });

    // resize iframe height
    iframe.contentDocument.addEventListener('DOMSubtreeModified', function(){
        console.log('DOMSubtreeModified');
        console.log(iframe.offsetHeight);
        var height = iframe.contentDocument.body.offsetHeight + 20;
        iframe.style.height = height + 'px';
    });
}