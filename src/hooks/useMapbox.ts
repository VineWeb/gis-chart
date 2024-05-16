import { MAP_OPTIONS } from "@/config";
// @ts-ignore
import * as turf from "@turf/turf";
import _ from "lodash";
import "mapbox-gl/dist/mapbox-gl.css";
import mapboxgl from "mapbox-gl";
import { useEffect, useRef, useState } from "react";
import './index.scss'

const customMapStyle = {
  version: 8,
  sources: {},
  glyphs: "mapbox://fonts/mapbox/{fontstack}/{range}.pbf",
  layers: [],
};
const zoomLevel = {
  province: 3.5,
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
      zoom: 3, // starting zoom 地图初始的拉伸比例
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
      mapInstance.setPadding({top: 200, bottom: 0, left: 250, right: 30})
      // mapInstance.on('zoom', () => {
      //     const zoom = mapInstance.getZoom();
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
      if (!map) return
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
      const handleJson = _.cloneDeep(json)
      const features = handleJson.features.map((item: any) => {
        return {
          ...item,
          id: item.properties.adcode
        }
      })
      handleJson.features = features
      map.addSource(sourceId, {
        type: "geojson",
        data: handleJson,
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
            "#fae0bf", // 如果 "color" 为空，返回空字符串
            ["get", "color"],
          ],
          "fill-opacity": [
            'case',
            ['boolean', ['feature-state', 'hover'], false],
            0.67,
            0.49,
          ]
        },
      });
      map.addLayer({
        id: sourceId,
        type: "line",
        source: sourceId,
        layout: {},
        paint: {
          "line-color": "#d3c1b0",
          "line-width": 2,
        },
      });
      mapMouseEvent(map)
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
    if (!map) return
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


  function mapMouseEvent(map: any) {
    const sourceId = "sourceId";
    const areaId = "area-id";
    let hoveredPolygonId: null = null
    // const popup = new mapboxgl.Popup({
    //   closeButton: false,
    //   closeOnClick: false
    // });
    map.on('mousemove', areaId, (e: any ) => {
      // map.getCanvas().style.cursor = 'pointer';
      // const coordinates = e.features[0].properties.center
      // const html = `
      // <div class="popup">
      //   <p>adcode: ${e.features[0].properties.adcode}</p>
      //   <p>name: ${e.features[0].properties.name}</p>
      //   <p>level: ${e.features[0].properties.level}</p>
      // </div>`
      // popup.setLngLat(JSON.parse(coordinates)).setHTML(html).addTo(map);
        if (e.features.length > 0) {
            if (hoveredPolygonId !== null) {
                map.setFeatureState(
                    { source: sourceId, id: hoveredPolygonId },
                    { hover: false }
                );
            }
            hoveredPolygonId = e.features[0].id;
            map.setFeatureState(
                { source: sourceId, id: hoveredPolygonId },
                { hover: true }
            );
        }
    });

    map.on('mouseleave', areaId, () => {  
      // map.getCanvas().style.cursor = '';
      // popup.remove();
      if (hoveredPolygonId !== null) {
          map.setFeatureState(
              { source: sourceId, id: hoveredPolygonId },
              { hover: false }
          );
      }
      hoveredPolygonId = null;
    })
  }


  function addMarkers (list: any[]) {
    list.forEach(function(location) {
      if (location.lng && location.lat) {
          const el = document.createElement('div');
          el.className = 'outer-circle';
          const children = document.createElement('div');
          children.className = 'inner-circle';
          el.appendChild(children)
          const marker = new mapboxgl.Marker(el)
              .setLngLat([location.lng, location.lat])
              .addTo(map);
          el.addEventListener('mouseenter', () => {
            const popup = new mapboxgl.Popup({ offset: 25, closeButton: false, closeOnClick: false })
                .setLngLat([location.lng, location.lat])
                .setHTML(`${location.provinceName}<br><strong>${location.name}</strong>`)
                .addTo(map);
            el.addEventListener('mouseleave', () => {
                popup.remove();
            });
          });
      }
  });
  }

  function addMarkersPopup (list: any[]) {
    list.forEach(function(location, index) {
      if (location.lng && location.lat) {
          const el = document.createElement('div');
          el.className = 'outer-circle';
          const children = document.createElement('div');
          children.className = 'inner-circle';
          el.appendChild(children)
          const textEl = document.createElement('div');
          textEl.className = 'text-el';
          textEl.innerHTML = `<div>${location.name}</div>`
          el.appendChild(textEl)
          try {
            new mapboxgl.Marker(el)
            .setLngLat([location.lng, location.lat])
            .addTo(map);
          } catch (error) {
            console.log(error)
          }
         
      }
  });
  }

  return {
    map,
    mapContainer,
    addSource,
    addLineSource,
    addLabelSource,
    flyToCenter,
    addMarkers,
    addMarkersPopup
  };
}