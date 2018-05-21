import LayerGroup from "ol/layer/group";
import VectorLayer from 'ol/layer/vector';
import VectorSource from 'ol/source/vector';
import GeoJsonFormat from 'ol/format/geojson';
import loadingstrategy  from 'ol/loadingstrategy';

import SymbolCreator from './symbolCreator';

function layerCreator(){
    this.format = 'image/png';//定义图层的瓦片为png格式
    //地理实体的类型，枚举对象
    this.geometryType = {
        Point: "Point",
        Polygon: "Polygon",
        Polyline: "Polyline"
    };

}
/*
根据名称获取地图的专题图层组
 */
layerCreator.prototype.getLayerGourp = function(){
    var basicfacility = this._getLayerByName('basicfacility');
    var roadline =      this._getLayerByName('roadline');
    var trafficsign =   this._getLayerByName('trafficsign');

    let layerGroup1 = new LayerGroup({
        layers: [
            trafficsign
        ],
        title: "GIST2_group1"
    });
    let layergroup2 = new LayerGroup({
        layers: [
            basicfacility,
            roadline,
            layerGroup1
        ],
        title: "GIST2_group2"
    });
    return new LayerGroup({
        layers: [
            layergroup2
        ],
        title: "GIST2_group_total"
    })
}
/*
  根据名称获取图层信息
 */
layerCreator.prototype._getLayerByName = function(Name){
    if(!Name){
        console.warn("调用getLayerByName方法的参数无效");
    }
    var result = null;

    switch (Name){
        case "basicfacility":
            result = this._getVectorLayerByUrl("https://raw.githubusercontent.com/wiki/DerekMar/openlayer-Identify/data/GIST2_basicfacility.json?bbox=", this.geometryType.Polygon, {title: "GIST2_basicfacility"});
            break;
        case "roadline":
            result = this._getVectorLayerByUrl("https://raw.githubusercontent.com/wiki/DerekMar/openlayer-Identify/data/GIST2_roadline.json?bbox=", this.geometryType.Polyline, {title: "GIST2_roadline"});
            break;
        case "trafficsign":
            result = this._getVectorLayerByUrl("https://raw.githubusercontent.com/wiki/DerekMar/openlayer-Identify/data/GIST2_trafficsign.json?bbox=", this.geometryType.Point, {title: "GIST2_trafficsign"});
            break;
        default:
            alert("调用getLayerByName方法没有对应图层名字");
            break;
    }
    return result
}
layerCreator.prototype._getVectorLayerByUrl = function(LayerUrl, GeomtryType, options){
    if(!LayerUrl || !GeomtryType){
        console.warn("调用_getVectorLayerByUrl方法的参数无效");
    }

    let GeometrySymbol = new SymbolCreator();

    return new VectorLayer({
        source: new VectorSource({
            url: function(extent, resolution, projection){
                return LayerUrl + extent.join(',');
            },
            format: new GeoJsonFormat(),
            strategy: loadingstrategy.bbox
        }),
        style: GeometrySymbol.getSymbolByGeoType(GeomtryType, options),
        title: options.title ? options.title : "无标题"
    })
}

export default layerCreator;