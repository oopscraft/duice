namespace duice {

    /**
     * Dialog
     */
    export class Dialog {

        protected dialogElement: HTMLDialogElement;

        beforeOpenListener: Function;

        afterOpenListener: Function;

        protected beforeCloseListener: Function;

        protected afterCloseListener: Function;

        protected promise: Promise<any>;

        protected promiseResolve: Function;

        protected promiseReject: Function;

        /**
         * constructor
         * @param contentDiv
         */
        constructor(dialogElement: HTMLDialogElement) {
            this.dialogElement = dialogElement;

            // dialog fixed style
            this.dialogElement.style.position = 'absolute';
            this.dialogElement.style.left = '0';
            this.dialogElement.style.right = '0';
            this.dialogElement.style.margin = 'auto';
            this.dialogElement.style.height = 'fit-content';

            // header
            let header = document.createElement('span');
            this.dialogElement.appendChild(header);
            header.style.display = 'block';
            header.style.position = 'absolute';
            header.style.left = '0';
            header.style.top = '0';
            header.style.width = '100%';
            header.style.height = '1rem';
            header.style.cursor = 'pointer';
            let currentWindow = getCurrentWindow();
            let _this = this;
            header.onmousedown = function (event) {
                let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
                pos3 = event.clientX;
                pos4 = event.clientY;
                currentWindow.document.onmouseup = function (event) {
                    currentWindow.document.onmousemove = null;
                    currentWindow.document.onmouseup = null;
                };
                currentWindow.document.onmousemove = function (event) {
                    pos1 = pos3 - event.clientX;
                    pos2 = pos4 - event.clientY;
                    pos3 = event.clientX;
                    pos4 = event.clientY;
                    _this.getDialogElement().style.left = (_this.getDialogElement().offsetLeft - pos1) + 'px';
                    _this.getDialogElement().style.top = (_this.getDialogElement().offsetTop - pos2) + 'px';
                };
            };

            // creates close button
            let closeButton = document.createElement('span');
            closeButton.style.position = 'absolute';
            closeButton.style.top = '0';
            closeButton.style.right = '0';
            closeButton.style.cursor = 'pointer';
            closeButton.style.width = '1rem';
            closeButton.style.height = '1rem';
            closeButton.style.lineHeight = '1rem';
            closeButton.style.margin = '1px';
            closeButton.style.textAlign = 'center';
            closeButton.style.fontFamily = 'sans-serif';
            closeButton.style.fontSize = '0.75rem';
            closeButton.appendChild(document.createTextNode('X'));
            closeButton.addEventListener('click', event => {
                this.close().then();
            });
            this.dialogElement.appendChild(closeButton);
        }

        /**
         * getDialogElement
         */
        protected getDialogElement(): HTMLDialogElement {
            return this.dialogElement;
        }

        /**
         * Shows modal
         */
        protected show(): Promise<any> {

            // show dialog modal
            let currentWindow = globalThis.window['fragment'] ? globalThis.window.parent : globalThis.window;
            currentWindow.document.body.appendChild(this.dialogElement);
            this.dialogElement.showModal();

            //return promise to delay
            return new Promise(function (resolve, reject) {
                setTimeout(function () {
                    resolve(true);
                }, 100);
            });
        }

        /**
         * Hides modal
         */
        protected hide(): Promise<any> {
            // closes modal
            this.dialogElement.close();

            // return promise to delay
            return new Promise(function (resolve, reject) {
                setTimeout(function () {
                    resolve(true);
                }, 100);
            });
        }

        /**
         * open
         * @param args
         */
        async open(...args: any[]): Promise<any> {

            // call before open listener
            if (this.beforeOpenListener) {
                if (await this.beforeOpenListener.call(this, ...args) === false) {
                    return;
                }
            }

            // show
            await this.show();

            //  call after open listener
            if (this.afterOpenListener) {
                await this.afterOpenListener.call(this, ...args);
            }

            // creates promise
            let _this = this;
            this.promise = new Promise(function (resolve, reject) {
                _this.promiseResolve = resolve;
                _this.promiseReject = reject;
            });
            return this.promise;
        }

        /**
         * close
         * @param args
         */
        async close(...args: any[]): Promise<any> {

            // call before close listener
            if (this.beforeCloseListener) {
                if (await this.beforeCloseListener.call(this, ...args) === false) {
                    return;
                }
            }

            // hide
            await this.hide();

            // call after close listener
            if (this.afterCloseListener) {
                await this.afterCloseListener.call(this, ...args);
            }

            // resolves promise
            this.promiseResolve(...args);
        }

        /**
         * Adds beforeOpen listener
         * @param listener
         */
        onBeforeOpen(listener: Function): this {
            this.beforeOpenListener = listener;
            return this;
        }

        /**
         * Adds afterOpen listener
         * @param listener
         */
        onAfterOpen(listener: Function): this {
            this.afterOpenListener = listener;
            return this;
        }

        /**
         * Adds beforeClose listener
         * @param listener
         */
        public onBeforeClose(listener: Function): this {
            this.beforeCloseListener = listener;
            return this;
        }

        /**
         * Adds afterClose listener
         * @param listener
         */
        onAfterClose(listener: Function): this {
            this.afterCloseListener = listener;
            return this;
        }

    }

}