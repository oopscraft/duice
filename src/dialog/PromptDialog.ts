///<reference path="Dialog.ts"/>
namespace duice.dialog {

    /**
     * PromptDialog
     */
    export class PromptDialog extends Dialog {

        messagePre: HTMLPreElement;

        promptInput: HTMLInputElement;

        confirmButton: HTMLButtonElement;

        cancelButton: HTMLButtonElement;

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

            // prompt input
            this.promptInput = document.createElement('input');
            this.promptInput.style.display = 'block';
            this.promptInput.style.textAlign = 'center';
            this.promptInput.style.margin = '0.75rem 0';
            this.promptInput.style.width = '100%';
            this.getDialogElement().appendChild(this.promptInput);

            // confirm button
            this.confirmButton = document.createElement('button');
            this.confirmButton.appendChild(document.createTextNode('Yes'));
            this.confirmButton.style.width = '3rem';
            this.confirmButton.addEventListener('click', event => {
                this.confirm(this.promptInput.value);
            });
            this.getDialogElement().appendChild(this.confirmButton);

            // cancel button
            this.cancelButton = document.createElement('button');
            this.cancelButton.appendChild(document.createTextNode('No'));
            this.cancelButton.style.width = '3rem';
            this.cancelButton.addEventListener('click', event => {
                this.cancel();
            });
            this.getDialogElement().appendChild(this.cancelButton);
        }

        /**
         * open
         */
        override open() {
            let promise = super.open();
            this.promptInput.focus();
            return promise;
        }

        /**
         * confirm
         */
        confirm(value: string) {
            this.resolve(value);
            this.getDialogElement().parentNode.removeChild(this.getDialogElement());
        }

        /**
         * cancel
         */
        cancel() {
            this.resolve();
            this.getDialogElement().parentNode.removeChild(this.getDialogElement());
        }

        /**
         * close
         */
        override close() {
            this.resolve();
            this.getDialogElement().parentNode.removeChild(this.getDialogElement());
        }

    }

}