import { MAP_OPTIONS } from "@/config";
// @ts-ignore
import * as turf from "@turf/turf";
import _ from "lodash";
import "mapbox-gl/dist/mapbox-gl.css";
import mapboxgl from "mapbox-gl";

import { useEffect, useRef, useState } from "react";

const customMapStyle = {
  version: 8,
  sources: {},
  glyphs: "mapbox://fonts/mapbox/{fontstack}/{range}.pbf",
  layers: [],
};
const zoomLevel = {
  province: 3,
  city: 6,
  district: 7.5,
};
type TLevelKey = 'province' | 'city' | 'district'
// label需要点集合，不然文字会多，我们的properties有center字段用它
const createdPointFeatureCollectionByCityGeojson = (
  c: turf.FeatureCollection
) => {
  let features: turf.Feature[] = [];
  // 使用map加filter类型推断出错需要使用as断言
  c.features.forEach((feature: { properties: { center: string; }; }) => {
    if (feature.properties?.center) {
      let center = feature.properties?.center;
      if (typeof center === "string")
        center = JSON.parse(feature.properties?.center);
      const point = turf.point(center, feature.properties);
      features.push(point);
    }
  });
  return turf.featureCollection(features);
};
const mapOptions = MAP_OPTIONS; // 默认底图列表配置
export default function useMapbox(container: string = "" /* 容器id */) {
  const mapContainer = useRef(null); // 当container不传时 ** 必须使用给地图容器节点添加属性 => (ref="mapContainer")
  const [map, setMap] = useState<any>(null);
  // 天地图配置底图
  const defaultCode = "tdt_vec"; // 默认底图变量
  const addLayerConfig = (map: any) => {
    for (let layerConfig of mapOptions) {
      const { code, source } = layerConfig;

      // 添加数据源
      if (!map.getSource(code)) {
        map.addSource(code, source);
      }

      //添加layer
      if (!map.getLayer(code)) {
        const visibility = (code === defaultCode) || (code === 'tdt_cva') ? "visible" : "none";
        const layerParams = {
          type: "raster",
          id: code,
          source: code,
          layout: { visibility },
        };
        // 添加图层
        map.addLayer(layerParams);
      }
    }
  };
  // 初始化地图
  useEffect(() => {
    const mapInstance = new mapboxgl.Map({
      container: container || mapContainer!,
      center: [116.39747, 39.908823], // 天安门
      zoom: 4, // starting zoom 地图初始的拉伸比例
      pitch: 0, // 地图的角度，不写默认是0，取值是0-85度，一般在3D中使用
      bearing: 0, // 地图的初始方向，值是北的逆时针度数，默认是0，即是正北
      antialias: true, // 抗锯齿，通过false关闭提升性能
      minZoom: 3,
      maxZoom: 17.36,
      style: customMapStyle,
    });
    try {
      setMap(mapInstance)
      mapInstance.on("style.load", () => {
        // 天地图底图加载
        addLayerConfig(mapInstance);
        (window as any)["mapInstance"] = map;
      });
      mapInstance.setPadding({top: 90, bottom: 50, left: 250, right: 530})
      // map.on('zoom', () => {
      //     const zoom = map.getZoom();
      //     console.log('zoom:___', zoom);
      // });
    } catch (error) {
      console.error(
        '当container不传时 ** 必须使用给地图容器节点添加属性 => (ref="mapContainer")'
      );
    }
    return () => {
      if (mapInstance) {
        mapInstance.remove();
      }
    }
  }, []);

  const addSource = (json: any /* 接收的JSON数据 */) => {
    try {
      const sourceId = "sourceId";
      const areaId = "area-id";
      const hasSource = map.getSource(sourceId);
      if (hasSource) {
        map.removeLayer(areaId);
        map.removeLayer(sourceId);
        map.removeSource(sourceId);
      }
      const len = Math.floor((json.features.length - 1) / 2);
      const centerCoordinates = _.get(
        json,
        `features[${len}].properties[center]`
      );
      const levelKey: TLevelKey = _.get(json, "features[0].properties[level]");
      const zoom = zoomLevel[levelKey];
      map.addSource(sourceId, {
        type: "geojson",
        data: json,
      });
      map.addLayer({
        id: areaId,
        type: "fill",
        source: sourceId,
        layout: {},
        paint: {
          "fill-color": [
            "case",
            ["!", ["has", "color"]], // 检查 "color" 是否为空
            "#a9c6ba", // 如果 "color" 为空，返回空字符串
            ["get", "color"],
          ],
          "fill-opacity": 0.66,
        },
      });
      map.addLayer({
        id: sourceId,
        type: "line",
        source: sourceId,
        layout: {},
        paint: {
          "line-color": "#f6f6f5",
          "line-width": 2,
        },
      });
      map.flyTo({
        center: centerCoordinates,
        essential: true,
      });
      map.setCenter(centerCoordinates);
      map.setZoom(zoom);
    } catch (error) {
      console.error('addSource error')
    } finally {
      addLabelSource(json)
    }
  };
  const addLineSource = (json: any /* 接收的JSON数据 */) => {
    try {
      const sourceId = "sourceId";
      const areaId = "area-id";
      const hasSource = map.getSource(sourceId);
      if (hasSource) {
        map.removeLayer(areaId);
        map.removeLayer(sourceId);
        map.removeSource(sourceId);
      }
      const len = Math.floor((json.features.length - 1) / 2);
      const centerCoordinates = _.get(
        json,
        `features[${len}].properties[center]`
      );
      const levelKey: TLevelKey = _.get(json, "features[0].properties[level]");
      const zoom = zoomLevel[levelKey];
      map.addSource(sourceId, {
        type: "geojson",
        data: json,
      });
      map.addLayer({
        id: sourceId,
        type: "line",
        source: sourceId,
        layout: {},
        paint: {
          "line-color": "#f6f6f5",
          "line-width": 2,
        },
      });
      map.flyTo({
        center: centerCoordinates,
        essential: true,
      });
      map.setCenter(centerCoordinates);
      map.setZoom(zoom);
    } catch (error) {
      console.error('addSource error')
    } finally {
      addLabelSource(json)
    }
  };

  const addLabelSource = (json: any /* 接收的JSON数据 */) => {
    const geoJson = createdPointFeatureCollectionByCityGeojson(json)
    const sourceId = "label_id";
    const hasSource = map.getSource(sourceId);
    const hasLayer = map.getLayer(sourceId);
    if (hasLayer) map.removeLayer(sourceId);
    if (hasSource) map.removeSource(sourceId);
    map.addSource(sourceId, {
      type: "geojson",
      data: geoJson,
    });
    map.addLayer({
      id: sourceId,
      type: "symbol",
      source: sourceId,
      layout: {
        "text-field": [
          "case",
          ["!", ["has", "name"]], // 检查 "name" 是否为空
          "", // 如果 "name" 为空，返回空字符串
          ["get", "name"],
        ],
        "text-size": 20,
      },
      paint: {
        "text-color": "#334",
        "text-halo-blur": 1,
        "text-halo-color": "rgb(255,255,255)",
        "text-halo-width": 1
    },
    });
  };

  const flyToCenter = (
    coordinates: number[] /* 点位坐标 [lon, lat] */,
    zoom = 18
  ) => {
    map.flyTo({
      center: coordinates,
      essential: true,
    });
    map.setCenter(coordinates);
    map.setZoom(zoom);
  };
  return {
    map,
    mapContainer,
    addSource,
    addLineSource,
    addLabelSource,
    flyToCenter,
  };
}