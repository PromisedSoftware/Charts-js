/**
 * Class is responsible for drawing column chart
 */
class ColumnChart extends Chart{
    #columnWidth
    #canvasWidth
    #canvasHeight
    #framePadding
    #keysCount;
    constructor(canvas){
        super(canvas);
        this.columnWidthPercentage = 0.8;
        this.sectionWidth; // canvas size divided by column amount
        this.#keysCount =0;
    }

    /**
     * sets column width percentage based on section width.
     * Section is canvas width divided by amount of columns.
     * percentage should be float between 0.0 and 1.0
     */
    setColumnWidth(percentage){
        if(percentage >= 1.0) percentage =1.0;
        else if(percentage <=0.0) percentage =0.0;
        else if(!percentage) percentage=0.5;
        this.columnWidthPercentage = percentage;
    }

    #isUpdateRequired(){
        if(this.#keysCount !== this.mapNameValues.size) return true;
        const rect  = this.canvas.getBoundingClientRect();
        if(this.#canvasHeight !== rect.height) return true;
        if(this.#canvasWidth !== rect.width) return true;
        return false;
    }
    /**
     * if size of canvas is modified in css or in any other way it will
     * update size of canvas and elements of canvas. If auto size update
     * is disabled, run this method once before drawing and everytime after
     * dimensions of canvas are modified by css or external methods.
     * Also Should be called after adding elements.
     */
    updateSize(){
        const rect = this.canvas.getBoundingClientRect();
        this.canvas.width = rect.width;
        this.canvas.height = rect.height;

        this.#canvasWidth = rect.width;
        this.#canvasHeight = rect.height;
        this.#framePadding = this.framePaddingPercentage * this.#canvasHeight;
        const additionalColumn = this.showOther && 
                this.mapNameValues.size  - this.max_elements_to_show >0 ? 1:0;
        let elementsToShow = Math.min(this.max_elements_to_show, this.mapNameValues.size);
        this.sectionWidth = (this.#canvasWidth - 2*this.#framePadding)/ (elementsToShow + additionalColumn);
        this.#columnWidth = this.sectionWidth * this.columnWidthPercentage;

        if(!this.fontSize){
            let decreaseFactor = Math.min(this.sectionWidth/5, this.#canvasWidth * 0.03)
             this.fontSize = parseInt(decreaseFactor);
        }

        this.#keysCount = this.mapNameValues.size
    }

    #drawFrame(){
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();
        this.ctx.moveTo(this.#framePadding, this.#framePadding);
        this.ctx.lineTo(this.#framePadding, this.#canvasHeight - this.#framePadding);
        this.ctx.lineTo(this.#canvasWidth - this.#framePadding ,this.#canvasHeight - this.#framePadding);
        this.ctx.stroke();
    }
    #drawText(text,i,height){
        if(height - this.fontSize <= 0) height = this.fontSize;
        let drawAreaLeftOffset = this.#framePadding;
        if(this.isFrameRequired) drawAreaLeftOffset +=1;

        let text_x = i * this.sectionWidth + drawAreaLeftOffset + this.#columnWidth/2;

        this.ctx.fillStyle = this.textColor;
        if(typeof this.fontSize =='number') this.fontSize +="px"
        const font_size = this.fontSize =='number'? this.fontSize+"px" : this.fontSize;
        this.ctx.font =`${font_size} ${this.fontFamily}`;
        this.ctx.textAlign = "center";
        this.ctx.textBaseline = "bottom";
        this.ctx.fillText(text, text_x, height);
    }

    draw(){
        if(this.#isUpdateRequired()){
            this.updateSize();
        }
        this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height);
        if(this.isFrameRequired) this.#drawFrame();
        const allElements = this.getMainAndOtherObjectSorted();
        if(!allElements.length) return;
        const highestColumn = allElements[0].count;
        const smallestColumn = allElements[allElements.length-1].count;

        if(this.isAscending) allElements.reverse();
        let drawAreaHeight = this.#canvasHeight - this.#framePadding;
        let drawAreaLeftOffset = this.#framePadding;
        if(this.isFrameRequired) drawAreaLeftOffset +=1;
        if(this.isFrameRequired) drawAreaHeight -=1;
        for(let i =0; i< allElements.length; i++){
            let percentage;
            if(this.displayMode ==="absolute") percentage = this.getPercentageByObject(allElements[i]);
            else if(this.displayMode ==="relative") percentage = allElements[i].count /highestColumn;
            else if(this.displayMode ==="difference") percentage = ( allElements[i].count - smallestColumn +0.3 ) / highestColumn;

            this.ctx.fillStyle = `hsl(${this.chartValueHue + this.hue_jump*i} ${this.chartValueSaturation} ${this.chartValueLightness})`;
            let columnHeight = parseInt(percentage * (drawAreaHeight - this.#framePadding));
            this.ctx.fillRect(i * this.sectionWidth + drawAreaLeftOffset, drawAreaHeight, this.#columnWidth, - columnHeight);

            let text = Math.round( this.getPercentageByObject(allElements[i]) *10000)/100 + "%";
            let text_height = this.#canvasHeight - columnHeight -5 - this.#framePadding;
            this.#drawText(text,i,text_height);
            text = allElements[i].name;
            this.#drawText(text,i,this.#canvasHeight);
        }
    }
}