///<reference path="Dialog.ts"/>
namespace duice.dialog {

    /**
     * Confirm
     */
    export class ConfirmDialog extends Dialog {

        messagePre: HTMLPreElement;

        confirmButton: HTMLButtonElement;

        cancelButton: HTMLButtonElement;

        /**
         * constructor
         * @param message
         */
        constructor(message: string) {
            super(document.createElement('dialog'));
            this.getDialogElement().style.padding = '1rem';
            this.getDialogElement().style.minWidth = '20rem';
            this.getDialogElement().style.textAlign = 'center';

            // message pre
            this.messagePre = document.createElement('pre');
            this.messagePre.style.marginTop = '1rem';
            this.messagePre.style.marginBottom = '1rem';
            this.messagePre.innerHTML = message;
            this.getDialogElement().appendChild(this.messagePre);

            // cancel button
            this.cancelButton = document.createElement('button');
            this.cancelButton.appendChild(document.createTextNode('No'));
            this.cancelButton.style.width = '4rem';
            this.cancelButton.style.cursor = 'pointer';
            this.cancelButton.addEventListener('click', event => {
                this.cancel();
            });
            this.getDialogElement().appendChild(this.cancelButton);

            // divider
            this.getDialogElement().appendChild(document.createTextNode(' '));

            // confirm button
            this.confirmButton = document.createElement('button');
            this.confirmButton.appendChild(document.createTextNode('Yes'));
            this.confirmButton.style.width = '4rem';
            this.confirmButton.style.cursor = 'pointer';
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
         * close
         */
        override close(...args: any[]) {
            this.resolve(false);
            this.getDialogElement().parentNode.removeChild(this.getDialogElement());
        }

        /**
         * confirm
         */
        confirm() {
            this.resolve(true);
            this.getDialogElement().parentNode.removeChild(this.getDialogElement());
        }

        /**
         * cancel
         */
        cancel() {
           this.resolve(false);
           this.getDialogElement().parentNode.removeChild(this.getDialogElement());
        }

    }

}