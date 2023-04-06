namespace duice.dialog {

    /**
     * Dialog
     */
    export class Dialog {

        protected dialogElement: HTMLDialogElement;

        protected header: HTMLSpanElement;

        protected closeButton: HTMLSpanElement;

        protected promise: Promise<any>;

        protected promiseResolve: Function;

        protected promiseReject: Function;

        /**
         * constructor
         * @param dialogElement
         */
        constructor(dialogElement: HTMLDialogElement) {
            this.dialogElement = dialogElement;
            let _this = this;

            // dialog fixed style
            this.dialogElement.style.position = 'absolute';
            this.dialogElement.style.left = '0';
            this.dialogElement.style.right = '0';
            this.dialogElement.style.height = 'fit-content';
            this.dialogElement.style.borderStyle = 'solid';
            this.dialogElement.style.borderWidth = '1px';

            // header
            this.header = document.createElement('span');
            this.dialogElement.appendChild(this.header);
            this.header.style.display = 'block';
            this.header.style.position = 'absolute';
            this.header.style.left = '0';
            this.header.style.top = '0';
            this.header.style.width = '100%';
            this.header.style.height = '1rem';
            this.header.style.cursor = 'pointer';

            // drag
            this.dialogElement.style.margin = '0px';
            this.header.onmousedown = function (event) {
                let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
                pos3 = event.clientX;
                pos4 = event.clientY;
                window.document.onmouseup = function (event) {
                    window.document.onmousemove = null;
                    window.document.onmouseup = null;

                };
                window.document.onmousemove = function (event) {
                    pos1 = pos3 - event.clientX;
                    pos2 = pos4 - event.clientY;
                    pos3 = event.clientX;
                    pos4 = event.clientY;
                    _this.dialogElement.style.left = (_this.dialogElement.offsetLeft - pos1) + 'px';
                    _this.dialogElement.style.top = (_this.dialogElement.offsetTop - pos2) + 'px';
                };
            };

            // creates close button
            this.closeButton = document.createElement('span');
            this.closeButton.style.position = 'absolute';
            this.closeButton.style.top = '1px';
            this.closeButton.style.right = '1px';
            this.closeButton.style.cursor = 'pointer';
            this.closeButton.style.width = '1rem';
            this.closeButton.style.height = '1rem';
            this.closeButton.style.lineHeight = '1rem';
            this.closeButton.style.margin = '1px';
            this.closeButton.style.textAlign = 'center';
            this.closeButton.style.fontFamily = 'sans-serif';
            this.closeButton.style.fontSize = '1rem';
            this.closeButton.appendChild(document.createTextNode('X'));
            this.closeButton.addEventListener('click', event => {
                _this.close();
            });
            this.dialogElement.appendChild(this.closeButton);

            // on resize event
            window.addEventListener('resize', function (event) {
                _this.moveToCenterPosition();
            });
        }

        /**
         * moveToCenterPosition
         */
        moveToCenterPosition() {
            let computedStyle = window.getComputedStyle(this.dialogElement);
            let computedWidth = parseInt(computedStyle.getPropertyValue('width').replace(/px/gi, ''));
            let computedHeight = parseInt(computedStyle.getPropertyValue('height').replace(/px/gi, ''));
            let scrollX = window.scrollX;
            let scrollY = window.scrollY;
            this.dialogElement.style.left = Math.max(0, window.innerWidth / 2 - computedWidth / 2) + scrollX + 'px';
            this.dialogElement.style.top = Math.max(0, window.innerHeight / 3 - computedHeight / 3) + scrollY + 'px';
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
        protected show(): void {

            // saves current scroll position
            let scrollX = window.scrollX;
            let scrollY = window.scrollY;

            // show dialog modal
            this.dialogElement.style.opacity = '0';
            window.document.body.appendChild(this.dialogElement);
            this.dialogElement.showModal();

            // restore previous scroll position
            window.scrollTo(scrollX, scrollY);

            // adjusting position
            this.moveToCenterPosition();

            // fade in
            let _this = this;
            (function fade() {
                let val = parseFloat(_this.dialogElement.style.opacity);
                if (!((val += .1) > 1)) {
                    _this.dialogElement.style.opacity = String(val);
                    requestAnimationFrame(fade);
                }
            })();
        }

        /**
         * Hides modal
         */
        protected hide(): void {

            // closes modal
            this.dialogElement.close();
        }

        /**
         * open
         */
        async open() {

            // show modal
            this.show();

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
         */
        close() {
            this.reject();
        }

        /**
         * confirm
         * @param args
         */
        resolve(...args: any[]) {
            this.hide();
            this.promiseResolve(...args);
        }

        /**
         * close
         * @param args
         */
        reject(...args: any[]) {
            this.hide();
            this.promiseReject(...args);
        }

    }

}