# openlayer-Identify
基于Openlayer 的Control方式，仿照Arcgis desktop的Identify，包含所有动画和界面都非第三方插件

## 效果展示图 one
![image](https://raw.githubusercontent.com/wiki/DerekMar/openlayer-Identify/GIF/identify_ui.gif)
### 仿照Arcgis的功能特性
  1. 图层类型选择器，包括（所有图层、可见图层、最上面的图层以及图层树列表）
  2. 工具栏（框选、隐藏树列表、隐藏表格、缩放至、清除）
  3. 选择结果树状展示列表
  4. 属性展示表格


## 效果展示图 two
![image](https://raw.githubusercontent.com/wiki/DerekMar/openlayer-Identify/GIF/identify_animate.gif)
### 地图图层的点动画
  1.采用css动画，避免数据加载太多，导致卡顿
  2.仿照抛物线

## 效果展示图
![image](https://raw.githubusercontent.com/wiki/DerekMar/openlayer-Identify/GIF/identify_select.gif)
### 支持点选和框选
  1.支持框选，框选下能查找最上面的图层
  2.支持点选，点选下查找最上面图层，只能得到一个
  
# 额外
  包含了select组件、树状列表组件、表格组件、工具栏组件，均为没有引入第三方插件
  
# 使用方法
 1. 引入ol-Identify.js （暂时没有上传到npm上）
 2. 在地图初始化后，初始化我们的control组件，并展示，如下：
 `````````
 import Identify from './js/Component/Identify/ol-Identify';
 let identify = new Identify({
    // position: "bottom" //这里可以设置一下位置 top 或者bottom，默认是top
 });
 map.addControl(identify);
 identify.showIdenditfy();
 `````````
