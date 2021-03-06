import "./ol-Identify-FeatureLayerTree.css";
import IdentifyBaseComponent from "../ol-Identify-BaseComponent";
// /**
//  * OpenLayers Feature Identify Control. LayerTree Component
//  * @constructor
//  * @param {Object} element, the component renderby:
//  */
export default  class IdentifyFeatureLayerTree extends IdentifyBaseComponent{
    constructor(element, dataNode){
        super(element);
        /**
         * _DataTreeNode Array{Object}
         * Object{
         *      layerGroup: string,
         *      layerGroupSource: ol_layer_Layer,
         *      groupIndex:number,
         *      layerData: Array{layerObject}
         * }
         * layerObject{
         *      layerName：string，
         *      layerSource： ol_feature,
         *      groupIndex: number,
         *      layerIndex: number
         * }
         */
        this._DataTreeNode = dataNode;   // feature treeNode data
        this._selectTreeNode = null;

        //Evented Listener set Varience
        let noop = ()=>{} // empty operation
        this._TreeNodeOnClick = noop;
        this._TreeNodeOnHover = noop;
        this._TreeGroupOnClick = noop;
        this._TreeGroupOnHover = noop;
    }
    /**
     * @public
     * @desc build the featureTree in the specific element
     */
    initComponent(){
        //before create tree, need to empty the container
        this.element.innerHTML = "";

        let feateaTree = document.createElement("div");
        this.element.appendChild(feateaTree);
        //create Tree Node
        let treeNode = this._renderTreeNodes(this._DataTreeNode);
        feateaTree.appendChild(treeNode);

        return this;
    }
    /**
     * @desc bind the event on element operation
     * @param eventName
     * @param callback
     * @returns {identify}
     */
    bindEvent(eventName, callback){
        if(!callback){
            console.warn("callback is underfind on bindEvent!");
            return;
        }
        /**
         * no bind this;
         */
        switch(eventName){
            case "treeclick":
                this._TreeNodeOnClick = callback;
                break;
            case "treemove":
                this._TreeNodeOnHover = callback;
                break;
            default:
                console.warn("Don's have this event on BindEvent");
                break;
        }
        return this;
    }

    /**
     * @desc select the treeNode，include affect
     * @param treeNodeData
     */
    selectTreeNodeByData(treeNodeData){
        let groupIndex = treeNodeData.groupIndex, layerIndex = treeNodeData.layerIndex;
        let _element = this.element.childNodes[0].childNodes[0];
        let groupNode = _element.childNodes[groupIndex];
        let layerNode = groupNode.childNodes[1].childNodes[layerIndex];

        this._selectFeatureTreeNode(layerNode, treeNodeData);
    }
    /**
     *
     * @param element
     * @private
     * @desc render all the Tree Node for featureTree
     */
    _renderTreeNodes(dataNode){
        let ul = document.createElement('ul');
        for (let i = 0, length = dataNode.length; i < length; i++){
            let layerGroupNode = dataNode[i];
            let li = document.createElement("li"), label = document.createElement('label');
            let ul_ChildNode = this._renderTreeNode_(layerGroupNode.layerData);

            li.className = 'group';
            label.innerHTML = layerGroupNode.layerGroup + "(" + layerGroupNode.layerData.length + ")";
            label.onclick = (e)=>this._treeGroupClickHandle(e, ul_ChildNode);

            li.appendChild(label);
            li.appendChild(ul_ChildNode);
            ul.appendChild(li);
        }
        return ul;
    }
    /**
     * 树的组节点被点击处理事件
     * @param evt
     * @private
     */
    _treeGroupClickHandle(evt, ul){
        if(ul.classList.contains("hidden")){
            ul.classList.remove("hidden");
            ul.parentNode.classList.remove("folding");
        }else{
            ul.classList.add("hidden");
            ul.parentNode.classList.add("folding");
        }
    }
    /**
     *
     * @param element
     * @private
     * @desc render one of Tree Node for featureTree
     */
    _renderTreeNode_(layerNode){
        let ul = document.createElement('ul');
        for (let i = 0, length = layerNode.length; i < length; i++){
            let featureNode = layerNode[i];
            let lyrTitle = featureNode.layerName, lyrId = lyrTitle;
            let li = document.createElement('li'), label = document.createElement('label');
            li.className = 'layer';
            // let icon = document.createElement("i");
            // icon.className = "treeicon";

            label.htmlFor = lyrId;
            label.innerText = lyrTitle;
            // li.appendChild(icon);
            li.appendChild(label);
            //bind click、hover Event, !!! no bind this on Event !!!
            li.onclick = (evt)=> this._FeatureTreeNodeOnClick.call(Object.assign(this, {_layer_: featureNode}), evt);
            li.ontouchstart = (evt)=> this._FeatureTreeNodeOnClick.call(Object.assign(this, {_layer_: featureNode}), evt);
            li.onmousemove = (evt)=> this._TreeGroupOnHover.call(Object.assign(this, {_layer_: featureNode}), evt);
            li.ontouchmove = (evt)=> this._TreeGroupOnHover.call(Object.assign(this, {_layer_: featureNode}), evt);

            ul.appendChild(li);
        }
        return ul;
    }
    /**
     * @desc when the feature TreeNode li was clicked， will trigger
     * @param evt MouseClick Event
     * @private
     */
    _FeatureTreeNodeOnClick(evt){
        let targetliElement = null;
        for(let i = 0, length = evt.path.length; i < length; i++){
            let tmpElement = evt.path[i];
            let nodeName = tmpElement["nodeName"] ? tmpElement["nodeName"]
                : (tmpElement["tagName"] ? tmpElement["tagName"] : null);

            if( nodeName && nodeName.toLocaleUpperCase() === "LI"
                && tmpElement.classList.contains("layer")){
                targetliElement = tmpElement;
                break;
            }
        }
        if(targetliElement == null){
            throw new Error("click the Error Place，check your code, Html file and Js file");
        }
        this._selectFeatureTreeNode(targetliElement, this._layer_);
        this._TreeNodeOnClick(evt, this._layer_);
    }
    /**
     * @desc select a feature Tree node , this will be trigger
     * @param element {HtmlElement} the Tree Node element , ** li node **
     * @param item {layerNode} the Layer Node
     * @private
     */
    _selectFeatureTreeNode(element, item){
        //change the select item's css style
        let selectedNode = this.selectTreeNode;
        if(selectedNode && selectedNode.classList.contains("select")){
            selectedNode.classList.remove("select");
        }
        let treeNode = this.selectTreeNode = element;
        if(treeNode && !treeNode.classList.contains("select")){
            treeNode.classList.add("select");
        }
    }
    /**
     *
     * @param flCollection simple
     * @private
     * @return {Array} DataTreeNode
     * TODO 想方法获取图层的名字，这里不知道怎么获取
     *
     */
    static createTreeNodeData(flCollection){
        let result = [];
        if(!flCollection instanceof Array){
            console.error("调用_createTreeNodeData的参数错误！");
        }else{
            for (let i = 0, length = flCollection.length; i < length; i++){
                let featureAndLayer = flCollection[i];
                let layer = featureAndLayer[0], feature = featureAndLayer[1];
                if(!layer){
                   continue;
                }
                let layerGroupTitle = layer.get("title")
                    ? layer.get("title")
                    : "无标题" + i;

                let hasResult = result.findIndex((value, index, arr) => {
                    return value.layerGroup == layerGroupTitle && value.layerGroupSource === layer;
                });
                if(hasResult === -1){
                    let featureData = { layerName: feature. id_, layerSource: feature, groupIndex: result.length, layerIndex: 0 };
                    result.push({
                        layerGroup: layerGroupTitle,
                        layerGroupSource: layer,
                        groupIndex: result.length,
                        layerData: [featureData]
                    });
                }else{
                    let featureData = { layerName: feature. id_, layerSource: feature, groupIndex: hasResult, layerIndex: result[hasResult]["layerData"].length };
                    result[hasResult]["layerData"].push(featureData);
                }
            }
        }
        return result;
    }

    /**
     * 获取树节点的第一个要素
     * @param flCollection
     */
    static getTreeNodeFirstData(dataTreeNode){
        let result = null;
        if(dataTreeNode && dataTreeNode.length > 0){
            let layersData = dataTreeNode[0]["layerData"];
            if(layersData && layersData.length > 0){
                result = layersData[0];
            }
        }
        return result;
    }
}