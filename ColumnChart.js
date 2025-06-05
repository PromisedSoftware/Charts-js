/**
 * Class is responsible for drawing column chart
 */
class ColumnChart extends Chart{
    #columnWidth
    constructor(canvas){
        super(canvas);
        this.columnWidthPercentage = 0.8;
        this.sectionWidth; // canvas size divided by column amount
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
        return super.isUpdateRequired();
    }
    /**
     * if size of canvas is modified in css or in any other way it will
     * update size of canvas and elements of canvas. If auto size update
     * is disabled, run this method once before drawing and everytime after
     * dimensions of canvas are modified by css or external methods.
     * Also Should be called after adding elements.
     */
    updateSize(){
        super.updateSize();
        const canvasSize = super.getCanvasSize();
        const additionalColumn = this.showOther && 
                super.getMapSize()  - this.max_elements_to_show >0 ? 1:0;
        let elementsToShow = Math.min(this.max_elements_to_show, super.getMapSize());
        this.sectionWidth = (canvasSize.width - 2 * super.getFramePadding())/ (elementsToShow + additionalColumn);
        this.#columnWidth = this.sectionWidth * this.columnWidthPercentage;
        if(!this.fontSize){
            let decreaseFactor = Math.min(this.sectionWidth/5, canvasSize.width * 0.03);
            this.fontSize = parseInt(decreaseFactor);
        }
    }

    #drawFrame(){
        super.drawFrame();
    }
    
    #drawText(text,i,height){
        if(height - this.fontSize <= 0) height = this.fontSize;
        let text_x = i * this.sectionWidth + this.#columnWidth/2;
        super.drawText(text,text_x,height);
    }

    draw(){
        if(this.#isUpdateRequired()){
            this.updateSize();
        }
        this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height);
        if(this.isFrameRequired) this.#drawFrame();
        const allElements = this.getMainAndOtherObjectSorted();
        if(!allElements.length) return;
        const highestColumn = allElements[0].value;
        const smallestColumn = allElements[allElements.length-1].value;

        const canvasSize = super.getCanvasSize();

        if(this.isAscending) allElements.reverse();
        let drawAreaHeight = canvasSize.height - super.getFramePadding();
        let drawAreaLeftOffset = super.getFramePadding();
        if(this.isFrameRequired) drawAreaLeftOffset +=1;
        if(this.isFrameRequired) drawAreaHeight -=1;
        for(let i =0; i< allElements.length; i++){
            let percentage;
            if(this.displayMode ==="absolute") percentage = this.getPercentageByObject(allElements[i]);
            else if(this.displayMode ==="relative") percentage = allElements[i].value /highestColumn;
            else if(this.displayMode ==="difference") percentage = ( allElements[i].value - smallestColumn +0.1 ) / highestColumn;

            this.ctx.fillStyle = `hsl(${this.chartValueHue + this.hue_jump*i} ${this.chartValueSaturation} ${this.chartValueLightness})`;
            let columnHeight = parseInt(percentage * (drawAreaHeight - super.getFramePadding()));
            this.ctx.fillRect(i * this.sectionWidth + drawAreaLeftOffset, drawAreaHeight, this.#columnWidth, - columnHeight);

            let text = Math.round( this.getPercentageByObject(allElements[i]) *10000)/100 + "%";
            let text_height = canvasSize.height - columnHeight -5 - super.getFramePadding();
            this.#drawText(text,i,text_height);
            text = allElements[i].name;
            this.#drawText(text,i,canvasSize.height);
        }
    }
}