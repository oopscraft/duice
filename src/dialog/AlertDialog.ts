///<reference path="Dialog.ts"/>
namespace duice {

    /**
     * AlertDialog
     */
    export class AlertDialog extends Dialog {

        messagePre: HTMLPreElement;

        confirmButton: HTMLButtonElement;

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
            this.messagePre = document.createElement('pre');
            this.messagePre.innerHTML = message;
            this.getDialogElement().appendChild(this.messagePre);

            // confirm button
            this.confirmButton = document.createElement('button');
            this.confirmButton.appendChild(document.createTextNode('Yes'));
            this.confirmButton.style.width = '3rem';
            this.confirmButton.addEventListener('click', event => {
                this.confirm();
            });
            this.getDialogElement().appendChild(this.confirmButton);
        }

        /**
         * open
         */
        override open() {
            let promise = super.open();
            this.confirmButton.focus();
            return promise;
        }

        /**
         * confirm
         */
        confirm() {
            this.resolve();
        }

        /**
         * close
         */
        override close() {
            this.resolve();
        }
    }

}