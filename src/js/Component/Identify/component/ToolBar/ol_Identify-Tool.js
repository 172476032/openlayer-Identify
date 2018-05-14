import IdentifyBaseComponent from "../ol-Identify-BaseComponent";
const defaultImagePath = require("./img/box-select.png");

export default  class IdentifyTool extends IdentifyBaseComponent{
    constructor(element, options){
        super(element);
        let _options = options || {};
        this.toolContaniner = null;

        this.toolClassName =  _options.className ? _options.className : "toolContanier";
        this.iconImage = _options.iconImage ? _options.iconImage : defaultImagePath;
        this.handle = _options.handle ? _options.handle : function(){};
    }
    initComponent(){
        ;

        let toolContanier = this.toolContaniner = document.createElement("a");
        toolContanier.className = this.toolClassName;
        toolContanier.style.backgroundImage = "url(" + this.iconImage + ")";
        toolContanier.onclick = this.handle;

        this.element.appendChild(toolContanier);
    }

    /**
     * 设置tool为激活状态，增加select颜色
     * @param active
     */
    setActive(active){
        if(!active){
            if(this.toolContaniner.classList.contains("select")){
                this.toolContaniner.classList.remove("select")
            }
        }else{
            if(!this.toolContaniner.classList.contains("select")){
                this.toolContaniner.classList.add("select")
            }
        }
    }
}