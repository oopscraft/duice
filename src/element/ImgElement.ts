namespace duice.component {

    import PropertyChangeEvent = duice.event.PropertyChangeEvent;

    /**
     * image element component
     */
    export class ImgElement extends ObjectElement<HTMLImageElement> {

        originSrc: string;

        editable: boolean = false;

        width: number;

        height: number;

        /**
         * constructor
         * @param element
         * @param context
         */
        constructor(element: HTMLImageElement, context: object) {
            super(element, context);
            this.originSrc = String(this.getHtmlElement().src);

            // editable
            let editable = getElementAttribute(this.getHtmlElement(), 'editable');
            if(editable) {
                this.editable = (editable === 'true');
            }

            if(this.editable) {
                this.getHtmlElement().style.cursor = 'pointer';
                this.getHtmlElement().addEventListener('click', event => {
                    this.changeImage();
                });
            }

            // size
            let size = getElementAttribute(this.getHtmlElement(), 'size');
            if(size) {
                let sizeArgs = size.split(',');
                this.width = parseInt(sizeArgs[0].trim());
                this.height = parseInt(sizeArgs[1].trim());
            }
        }

        /**
         * open image
         */
        changeImage(): void {
            let input = document.createElement('input');
            input.setAttribute("type", "file");
            input.setAttribute("accept", "image/gif, image/jpeg, image/png");
            let _this = this;
            input.addEventListener('change', function(e){
                let fileReader = new FileReader();
                if (this.files && this.files[0]) {
                    fileReader.addEventListener("load",async e => {
                        let image = e.target.result;
                        let value;
                        if(_this.width && _this.height) {
                            value = await _this.convertImage(image, _this.width, _this.height);
                        }else{
                            value = await _this.convertImage(image);
                        }
                        _this.setValue(value);

                        // notify observers
                        let event = new duice.event.PropertyChangeEvent(_this, _this.getProperty(), _this.getValue(), _this.getIndex());
                        _this.notifyObservers(event);
                    });
                    fileReader.readAsDataURL(this.files[0]);
                }
                e.preventDefault();
                e.stopPropagation();
            });
            input.click();
        }

        /**
         * convert image
         * @param dataUrl
         * @param width
         * @param height
         */
        convertImage(dataUrl:any, width?:number, height?:number) {
            return new Promise(function(resolve, reject){
                try {
                    let canvas = document.createElement("canvas");
                    let ctx = canvas.getContext("2d");
                    let image = new Image();
                    image.onload = function(){
                        if(width && height){
                            canvas.width = width;
                            canvas.height = height;
                            ctx.drawImage(image, 0, 0, width, height);
                        }else{
                            canvas.width = image.naturalWidth;
                            canvas.height = image.naturalHeight;
                            ctx.drawImage(image, 0, 0);
                        }
                        let dataUrl = canvas.toDataURL("image/png");
                        resolve(dataUrl);
                    };
                    image.src = dataUrl;
                }catch(e){
                    reject(e);
                }
            });
        }

        /**
         * set value
         * @param value
         */
        override setValue(value: any): void {
            if(value) {
                this.getHtmlElement().src = value;
            }else{
                this.getHtmlElement().src = this.originSrc;
            }
        }

        /**
         * return value
         */
        override getValue(): any {
            return this.getHtmlElement().src;
        }

    }

}