///<reference path="Dialog.ts"/>
namespace duice {

    /**
     * Confirm
     */
    export class ConfirmDialog extends Dialog {

        protected beforeConfirmListener: Function;

        protected afterConfirmListener: Function;

        /**
         * constructor
         * @param message
         */
        constructor(message: string) {
            super(document.createElement('dialog'));
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
                this.confirm().then();
            });
            this.getDialogElement().appendChild(confirmButton);

            // cancel button
            let cancelButton = document.createElement('button');
            cancelButton.appendChild(document.createTextNode('No'));
            cancelButton.style.width = '3rem';
            cancelButton.addEventListener('click', event => {
                this.close().then();
            });
            this.getDialogElement().appendChild(cancelButton);
        }

        /**
         * confirm
         * @param args
         */
        async confirm(...args: any[]): Promise<any> {

            // call before confirm listener
            if(this.beforeConfirmListener){
                if(await this.beforeConfirmListener.call(this, ...args) === false){
                    return;
                }
            }

            // hide
            await this.hide();

            // call after confirm listener
            if(this.afterConfirmListener){
                await this.afterConfirmListener.call(this, ...args);
            }

            // resolves promise
            this.promiseResolve(...args);
        }

        /**
         * Adds beforeConfirm listener
         * @param listener
         */
        onBeforeConfirm(listener:Function): this {
            this.beforeConfirmListener = listener;
            return this;
        }

        /**
         * Adds afterConfirm listener
         * @param listener
         */
        onAfterConfirm(listener:Function):any {
            this.afterConfirmListener = listener;
            return this;
        }

    }

}