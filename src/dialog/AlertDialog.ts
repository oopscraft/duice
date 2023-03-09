///<reference path="Dialog.ts"/>
namespace duice {

    /**
     * AlertDialog
     */
    export class AlertDialog extends Dialog {

        /**
         * constructor
         * @param message
         */
        constructor(message: string) {
            super(document.createElement('dialog'));
            this.getDialogElement().style.padding = '1rem';
            this.getDialogElement().style.minWidth = '15rem';
            this.getDialogElement().style.textAlign = 'center';

            // message pre
            let messagePre = document.createElement('pre');
            messagePre.innerHTML = message;
            this.getDialogElement().appendChild(messagePre);

            // confirm button
            let confirmButton = document.createElement('button');
            confirmButton.appendChild(document.createTextNode('Yes'));
            confirmButton.style.width = '3rem';
            confirmButton.addEventListener('click', event => {
                this.close().then();
            });
            this.getDialogElement().appendChild(confirmButton);
        }

    }

}