class PieChart extends Chart{

    constructor(canvas){
        super(canvas)
    }

    #isUpdateRequired(){
        return super.isUpdateRequired();
    }
    #drawFrame(){
        super.drawFrame();
    }
    #drawText(text,x,y){
        super.drawText(text,x,y);
    }
    
    updateSize(){
        console.log(this.fontSize);
        super.updateSize();
        const canvasSize = super.getCanvasSize();
        if(!this.fontSize){
            let decreaseFactor = Math.min(canvasSize.width * 0.03);
            this.fontSize = parseInt(decreaseFactor);
        }
    }
    draw(){
        if(this.#isUpdateRequired()) this.updateSize();    
        this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height);
        if(this.isFrameRequired) this.#drawFrame();
        const allElements = this.getMainAndOtherObjectSorted();
        if(!allElements.length) return;
        if(this.isAscending) allElements.reverse();

        const canvasSize = super.getCanvasSize();
        const padding = super.getFramePadding();
        const center_X = canvasSize.width/2 + padding;
        const center_Y = canvasSize.height/2;

        let radius = Math.min(canvasSize.width/2 - 2 * padding ,canvasSize.height/2 - padding);
        if(this.isFrameRequired) radius -= this.frameWidth;
        
        let totalDisplayValue = allElements.reduce((sum,el)=>sum + el.value);
        let startAngle = 0;
        let methodQueue =[];
        for(let i=0; i<allElements.length; i++){ 
            this.ctx.fillStyle = `hsl(${this.chartValueHue + this.hue_jump * i} ${this.chartValueSaturation} ${this.chartValueLightness})`;
            let percentage;
            
            if(this.showOther) percentage = this.getPercentageByObject(allElements[i]);
            else percentage = allElements[i].value / totalDisplayValue;
            this.ctx.beginPath();
            this.ctx.moveTo(center_X,center_Y);

            const endAngle = startAngle + Math.PI *2 * percentage;
            this.ctx.arc( center_X, center_Y, radius ,startAngle, endAngle );
            this.ctx.closePath();
            this.ctx.fill();

            const middle = (endAngle + startAngle)/2;
            const textX = center_X + Math.cos(middle) * radius * 0.7;
            const textY = center_Y + Math.sin(middle) * radius * 0.7;
            let text = this.getPercentageByObject(allElements[i]);
            text =allElements[i].name+" "+ Math.round(text *10000)/100 + "%";
            startAngle = endAngle;

            methodQueue.push(()=>{
                this.ctx.beginPath();
                this.ctx.fillStyle = this.textColor;
                this.ctx.fillRect(textX,textY,radius/20,radius/20);
                super.drawText(text,textX,textY);
            });
        }
        methodQueue.forEach(e=>e());
    }
}