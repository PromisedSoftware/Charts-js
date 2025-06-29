/**
 * Base class of Charts with logics of manipulating data
 * Values are stored in map where key is string name of element
 * and value is a number that is assigned to the key
 */
class Chart {
    #all_value;
    #nameValuesMap;
    #canvasWidth
    #canvasHeight
    #framePadding
    #setOther_isChanged
    #keysCount
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d");
        this.max_elements_to_show=4;
        this.#nameValuesMap = new Map();
        this.#all_value=0;

        this.chartValueHue = 90;
        this.chartValueSaturation = 0.5;
        this.chartValueLightness = 0.5;
        this.hue_jump = 20;
        this.displayMode = "relative";
        this.isAscending = false;
        this.showOther = false;
        this.textColor = "black";
        this.fontFamily = "Arial";
        this.fontSize =0;
        this.framePaddingPercentage = 0.06;
        this.isFrameRequired = true;
        this.frameColor="black";
        this.frameWidth =2;
    }

    /**
     * Add element to current data, and data will be increased.
     * if element is:
     *      String : value will be increased by 1 for that element.
     *      String and optionalValue is passed : value for that
     *          element will be increased by given value
     *      Array of Strings : for every element occurrence increases value by 1.
     *      Map : for each key will increase value by given as value
     *      Object : the same as map if has fields {name:String, value:Number}
     * Although this values are valid it's more efficient to use a Map 
     * @param {String, Array, Map<String,Number>, Object{name:String, value:Number} } element 
     * @param {Number} optionalValue
     */
    add(element,optionalValue){
        if(!element) return;
        const elementType = element.constructor.name;
        if(elementType ==="Map") this.#addMap(element);
        else if(elementType ==="Array") this.#addArray(element);
        else if(elementType ==="Object"){
            this.#addMapped(element.name,element.value);
        }
        else if(elementType === "String"){
            if(!optionalValue) this.#addElement(element);
            else if(optionalValue.constructor.name =="Number")
                this.#addMapped(element, optionalValue);
        }
    }
    /**
     * Arg is array of strings
     * This will clear current data and value elements of each repeated value.
     * it will store name and value of repetition in a map
     * where Key is string value from array and value is amount of this string in array
     * @param {string[]} array 
     */
    #addArray(array) {
        array.forEach(element => {
            this.#addElement(element);
        });
    }
    /**
     * add string and increase value of currently stored strings of the same value
     * @param {string} name 
     */
    #addElement(element) {
        if(element.constructor.name !== "String") throw Error("Element must be string");
        if (this.#nameValuesMap.has(element)) {
            let value = this.#nameValuesMap.get(element);
            value++;
            this.#nameValuesMap.set(element, value);
        }
        else {
            this.#nameValuesMap.set(element, 1);
        }
        this.#all_value++;
    }
    /**
     * Add map with element name and value to data
     * @param {Map<String,Number>} map that will be added to data
     */
    #addMap(map){
        map.forEach((v,k)=>{
            this.#addMapped(k,v);
        });
    }
    /**
     * Add to current data new elements with values.
     * if passed data as arg already exist, then value will be added to the current value.
     * @param {String} k name of element
     * @param {Number} v number that will be added.
     */
    #addMapped(k,v){
        if(!v) return;
        if( v < 0) {
            this.#removeMapped(k,v);
            return;
        }
        if(v.constructor.name !== "Number"){
            console.info("Value passed is not a Number type, skipped element. Passed arg: " + v);
            return;
        }
        if(k.constructor.name !== 'String'){
            console.info("Value passed is not a String type, skipped element. Passed arg: "+ v);
            return;
        }
        if(this.#nameValuesMap.has(k)){
            let value = this.#nameValuesMap.get(k);
            value += v;
            this.#nameValuesMap.set(k,value);
        }else{
            this.#nameValuesMap.set(k,v);
        }
        this.#all_value +=v;
    }

    /**
     * Remove given element by value depends on object type passed.
     * If element is:
     *      String : decrease value by 1 for that element.
     *      String and optionalNumber is passed : decrease value by given
     *          number for that element.
     *      Array : decrease value by 1 for every occurrence in array.
     *      Map : decrease value of given element passed as Key
     *              by given number given as value
     * @param {String, Array, Map<String,Number>, Object{name:String, value:Number}} element 
     * @param {Number} optionalValue
     */
    remove(element, optionalValue){
        if(!element) return;
        const elementType = element.constructor.name;
        if(elementType ==="Map") this.#removeMap(element);
        else if(elementType ==="Array") this.#removeArray(element);
        else if(elementType === "Object"){
            this.#removeMapped(element.name,element.value);
        }
        else if(elementType === "String"){
            if(!optionalValue) this.#removeElement(element);
            else if(optionalValue.constructor.name =="Number")
                this.#removeMapped(element,optionalValue);
        } 
    }
    /**
     * Decrease value of given element by all occurrences in array
     * if value drops to 0, element is removed from map.
     * @param {Array<String>} array 
     */
    #removeArray(array){
        array.forEach(e=>{
            this.#removeElement(e);
        });
    }
    /**
     * Decrease value of element by 1 or remove from map
     * if value reaches 0
     * @param {String} element 
     */
    #removeElement(element) {
        if (this.#nameValuesMap.has(element)) {
            let value = this.#nameValuesMap.get(element);
            if(value <= 0){
                this.#nameValuesMap.remove(element);
                return;
            }
            value--;
            this.#nameValuesMap.set(element, value);
            this.#all_value--;
        }
    }
    #removeMap(map){
        map.forEach((v,k)=>{
            this.#removeMapped(k,v);
        });
    }
    #removeMapped(k,v){
        if(!v) return;
        if(v < 0){
            this.#addMapped(k,v);
            return;
        }
        if(v.constructor.name !== "Number"){
            console.info("value passed as argument is not a Number, element skipped. Passed arg: "+ v);
            return;
        }
        if(k.constructor.name !== "String"){
            console.info("value passed as argument is not a String, element skipped. Passed arg: "+ k); 
            return;
        }
        if(this.#nameValuesMap.has(k)){
            let value = this.#nameValuesMap.get(k);
            if(value - v >0){
                value -= v;
                this.#nameValuesMap.set(k,value);
                this.#all_value -=v;
            }
            else{
                this.#all_value -= value; 
                this.#nameValuesMap.delete(k);
            }
        }
    }

    /**
     * It will remove or clear map based on given argument
     * If argument is:
     *      String : data of given element will be removed if present.
     *      Boolean : true will remove all data || false will do nothing.
     * @param {String, Boolean} arg true removes all data, string clear only specified
     */
    clear(arg){
        if(arg === true){
            this.#nameValuesMap.clear();
            this.#all_value =0;
        }
        else {
            let value = this.#nameValuesMap.get(arg);
            this.#removeMapped(arg,value);
        }
    }
    /**
     * Shows only requested amount of columns on the graph
     * @param {int} value 
     */
    showOnly(value){
        if(!value) throw new Error("value must be positive integer");
        else if(parseInt(value) <=0) throw new Error("value must be positive integer");
        this.max_elements_to_show = value;
        this.#setOther_isChanged =true;
    }
    /**
     * Returns value of stored object name.
     * @param {string} element 
     * @returns int which is value of given element
     */
    getValue(element) {
        if(this.#nameValuesMap.has(element)){
            return this.#nameValuesMap.get(element);
        }
        else return 0;
    }
    /**
     * Gets all data from current map that stores names and values.
     * then sorts it descending. After sorting it returns value and object name separated with given
     * string. Example 123#bananas
     * @param {string} separator 
     * @returns array of sorted tags by vale per object name
     */
    #getSortedByValueAsTag(separator = "#") {
        return Array.from(this.#nameValuesMap.entries())
            .sort((a, b) => {
                if (b[1] !== a[1]) return b[1] - a[1];
                return a[0].localeCompare(b[0]);
            })
            .map(([name, value]) => `${value}${separator}${name}`);
    }
    /**
     * Parses tag to object, so first part separated with character will be value
     * second part is object name
     * Example 123#banana will return {name:"banana",value:123}
     * @param {*} objTag tag like 123#banmana
     * @param {*} separator character #
     * @returns 
     */
    #parseTagToObject(objTag,separator){
        if(!separator || typeof separator =='boolean') throw new Error("Separator must be passed as an argument");
        const indexOfSeparator = objTag.indexOf(separator);
        let c = objTag.substring(0,indexOfSeparator);
        c = parseInt(objTag);
        let n = objTag.substring(indexOfSeparator+1,objTag.length);
        return{name:n,value:c}
    }
     /**
     * Returns amount of objects based on specified before max_elements_to_show
     * but when optional value is specified then it will return that amount of values
     * but not more than is stored in the map
     * @param {int} forcedValue optional int
     * @returns array of objects with name and value property
     */
    getMostCommonElements(forcedValue){
        const sortedItemsByValue = this.#getSortedByValueAsTag("#");
        const result =[];
        let amount = forcedValue? forcedValue: this.max_elements_to_show;
        for(let i =0; i<amount; i++){
            if(i>=sortedItemsByValue.length) break;
            if(i >= sortedItemsByValue.length) break;
            const element= this.#parseTagToObject(sortedItemsByValue[i],"#");
            result.push(element);
        }
        return result;
    }
    /**
     * Returns array that contains element with name "other" and total sum of
     * all values that are not part of main chart values, but
     * if other element is last object it will return it as main element
     * @returns {Array} array of single object
     */
    getOtherElementsObject(){
        const sortedItemsByValue = this.#getSortedByValueAsTag("#");
        let amount =0;
        let element;
        for(let i = this.max_elements_to_show; i < sortedItemsByValue.length; i++){
            element = this.#parseTagToObject(sortedItemsByValue[i],"#");
            amount += element.value;
        }
        if(this.max_elements_to_show - sortedItemsByValue.length == -1) return [element];
        const tag = amount + "#other";
        const elementOther = this.#parseTagToObject(tag,"#");
        elementOther.isOther =true;
        return [elementOther];
    }
    /**
     * Return array with other and main elements
     * or without "other" if there is no other in returned;
     */
    getMainAndOtherObjectSorted(){
        const mainElements = this.getMostCommonElements();
        if(!this.showOther) return mainElements;
        let otherElement = this.getOtherElementsObject();
        if(otherElement[0].value == 0) otherElement.pop(); 
        const result=[];
        
        for(let i =0; i < mainElements.length; i++){
            if(otherElement.length ===0){
                result.push(mainElements[i]);
            }
            else if(mainElements[i].value >= otherElement[0].value){
                result.push(mainElements[i]);
            }
            else{
                result.push(otherElement.pop());
                i--;
            }
        }
        if(otherElement.length !==0) result.push(otherElement.pop());
        return result; 
    }
    /**
     * return float from 0.0 up to 1.0 which is percentage element of all elements
     * @param {float} elementName name of the element to check percentage amount
     * @returns 0.0 up to 1.0
     */
    getPercentageByName(elementName) {
        if(!this.#nameValuesMap.has(elementName)) return 0;
        return this.#nameValuesMap.get(elementName) / this.#all_value;
    }
    getPercentageByObject(object){
        if(!object.isOther) return this.getPercentageByName(object.name);
        else{
            let mainValue =0;
            this.getMostCommonElements().forEach(e=>{
                mainValue += e.value;
            });
            return (this.#all_value - mainValue)/this.#all_value;
        }
    }
    /**
    * Set color of columns
    * @param {int} columnHue starting hue 
    * @param {float} columnSaturation column color saturation between 0.0 and 1.0
    * @param {float} columnLightness  column color lightness between 0.0 and 1.0
    * @param {int} hue_jump hue jump per column
    */
    setHslColor(columnHue,columnSaturation,columnLightness, hue_jump){
        this.chartValueHue = columnHue;
        this.chartValueSaturation = columnSaturation *100+"%";
        this.chartValueLightness = columnLightness * 100+"%";
        this.hue_jump = hue_jump;
    }

    setFrameColor(color){
        this.frameColor = color;
    }
    /**
    * Display mode where:
    * absolute: total size of char value is equal of canvas size
    * relative: highest column matches to canvas height
    * difference: highest column size is reduced by lowest column height
    * @param {string} mode relative,absolute or difference
    */
    setDisplayMode(mode){
        mode = ["relative","absolute","difference"].includes(mode)? mode:"relative";
        this.displayMode =mode;
    }
    /**
     * Direction of columns.
     * When set to ascending lowest to highest columns will be displayed
     * otherwise it will be descending.
     */
    setAscending(isAscending){
        this.isAscending = isAscending? true:false;
    }
    /**
     * if true this will not display "Other" column
     * @param {*} showOther 
     */
    appendOther(showOther){
        this.showOther = showOther? true:false;
        this.#setOther_isChanged=true;
    }
    /**
     * Set font for text on chart
     * if given fontSize parameter is valid css variable, then it will have font size passed as arg
     * if given fontSize is 0, null, NaN, empty string etc. font will be set to automatic value
     * @param {string} fontSize valid css unit, or null / int 0 / empty string to set auto size
     * @param {string} color text color 
     * @param {string} family font family
     */
    setFont(fontSize,color,family){
        this.textColor = color;
        this.fontFamily = family;
        if(fontSize) this.fontSize = fontSize;
        else this.fontSize =0;
    }
    /**
     * this will set percentage of padding canvas frame based on canvas height;
     * @param {float} percentage percentage from 0.0 up to 1.0 
     */
    setFramePadding(percentage){
        if(percentage >= 1.0) percentage =1.0;
        else if(percentage <= 0.0) percentage = 0.0;
        else if(!percentage) percentage =0;
        this.framePaddingPercentage =percentage;
    }

    setDrawingFrame(isDrew){
        this.isFrameRequired = isDrew? true: false;
    }

    getMapSize(){
        return this.#nameValuesMap.size;
    }

    getCanvasSize(){
        return {width:this.#canvasWidth, height:this.#canvasHeight};
    }
    getFramePadding(){ return this.#framePadding}

    isUpdateRequired(){
        if(this.#setOther_isChanged) return true;
        if(this.#keysCount !== this.getMapSize()) return true;
        const rect  = this.canvas.getBoundingClientRect();
        if(this.#canvasHeight !== rect.height) return true;
        if(this.#canvasWidth !== rect.width) return true;
        return false;
    }

    drawText(text,x,y){
        let drawAreaLeftOffset = this.#framePadding;
        if(this.isFrameRequired) drawAreaLeftOffset +=this.frameWidth;

        const font_size = typeof this.fontSize =='number'? this.fontSize+"px" : this.fontSize;
        this.ctx.font =`${font_size} ${this.fontFamily}`;
        
        this.ctx.textAlign = "center";
        this.ctx.textBaseline = "bottom";
        this.ctx.fillStyle = this.textColor;
        this.ctx.fillText(text, x+drawAreaLeftOffset, y);
        
    }

    /**
     * update size only fundamental elements,
     * not elements that are only in extended classes
     */
    updateSize(){
        this.#setOther_isChanged = false;
        const rect = this.canvas.getBoundingClientRect();
        this.canvas.width = rect.width;
        this.canvas.height = rect.height;

        this.#canvasWidth = rect.width;
        this.#canvasHeight = rect.height;
        this.#framePadding = this.framePaddingPercentage * this.#canvasHeight;
        this.#keysCount = this.#nameValuesMap.size;
    }

    drawFrame(){
        this.ctx.strokeStyle = this.frameColor;
        this.ctx.lineWidth = this.frameWidth;
        this.ctx.beginPath();
        this.ctx.moveTo(this.#framePadding, this.#framePadding);
        this.ctx.lineTo(this.#framePadding, this.#canvasHeight - this.#framePadding);
        this.ctx.lineTo(this.#canvasWidth - this.#framePadding ,this.#canvasHeight - this.#framePadding);
        this.ctx.stroke();
        this.ctx.closePath();
    }
}