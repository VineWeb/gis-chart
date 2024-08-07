import * as httpAxios from './http'
export const {
    requestChinaData,
    getGuangdongJson,
    requestProvinceJson,
    requestCityJson,
    requestTownJson,
    getColumns,
    getDataSource,
    getGuangdongSource,
    getQingyuanSource,
    getGuangzhouYuea,
    getWuliScore2024,
    getLishiScore2024
} = httpAxios
import stamen from '@/assets/config/stamen.png';
import tdtLight from '@/assets/config/tdtLight.png';
import tdtSatellite from '@/assets/config/tdtSatellite.png';
import ter_c from '@/assets/config/ter_c.png';
const TIANDITU_URL = '//t0.tianditu.gov.cn'
const tdtKey = '4989e906aa138e5bb1b49a3eb83a6128';
export const MAP_OPTIONS  = [
    {
        visible: true,
        code: 'tdt_img_0.8',
        name: '0.8m遥感影像',
        tooltip: '0.8m遥感影像',
        source: {
            'type': 'raster',
            'tiles': [
                'https://fxpc.mem.gov.cn/data_preparation/a12eadf6-1a57-43fe-9054-2e22277bd553/4eb4b664-5633-4ab3-b0fd-345829dd3a87/wmts?service=wmts&request=gettile&version=1.0.0&layer=img&style=default&tilematrixset=c&format=tiles&tilematrix={z}&tilerow={y}&tilecol={x}&geokey=2CA54B6D242305ABF3822EC38D121CD9'
            ],
            'tileSize': 256,
            'minzoom': 0,
            'maxzoom': 20
        },
        layer: {
            'type': 'raster',
            'metadata': {
                'index': 0
            }
        },
        lineStyleConfig: {      // 该类型底图需替换的样式
            province: {
                paint: {
                    'line-color': '#dadada'
                }
            },
            city: {
                paint: {
                    'line-color': '#dadada'
                }
            }
        }
    },
    {
        code: 'tdt_img',
        name: '天地图影像',
        toolName: '天地图影像底图',
        icon: tdtSatellite,
        source: {
            type: 'raster',
            tiles: [
                `${TIANDITU_URL}/DataServer?T=img_w&x={x}&y={y}&l={z}&tk=${tdtKey}`
            ],
            tileSize: 256,
            minzoom: 0,
            maxzoom: 22
        },
        layer: {
            id: 'tdt-img-tiles',
            type: 'raster',
            minzoom: 0,
            maxzoom: 22,
            layout: { visibility: 'none' }
        }
    },
    {
        code: 'tdt_vec',
        name: '天地图矢量',
        toolName: '天地图矢量底图',
        icon: tdtLight,
        source: {
            type: 'raster',
            tiles: [
                `${TIANDITU_URL}/DataServer?T=vec_w&x={x}&y={y}&l={z}&tk=${tdtKey}`
            ],
            tileSize: 256,
            minzoom: 0,
            maxzoom: 22
        },
        layer: {
            id: 'tdt-vec',
            type: 'raster',
            minzoom: 0,
            maxzoom: 22,
            layout: { visibility: 'none' }
        }
    },
    {
        code: 'tdt_cva',
        name: '天地图矢量注记',
        toolName: '天地图矢量注记',
        icon: tdtLight,
        source: {
            type: 'raster',
            tiles: [
                `${TIANDITU_URL}/DataServer?T=cva_w&x={x}&y={y}&l={z}&tk=${tdtKey}`
            ],
            tileSize: 256,
            minzoom: 0,
            maxzoom: 22
        },
        layer: {
            id: 'tdt-cva',
            type: 'raster',
            minzoom: 0,
            maxzoom: 22,
            layout: { visibility: 'none' }
        }
    },
    {
        code: 'tdt_ter',
        name: '天地图地形晕渲',
        toolName: '天地图地形晕渲底图',
        icon: ter_c,
        source: {
            type: 'raster',
            tiles: [
                `${TIANDITU_URL}/DataServer?T=ter_w&x={x}&y={y}&l={z}&tk=${tdtKey}`
            ],
            tileSize: 256,
            minzoom: 0,
            maxzoom: 22
        },
        layer: {
            id: 'tdt_ter',
            type: 'raster',
            minzoom: 0,
            maxzoom: 22,
            layout: { visibility: 'none' }
        }
    },
    {
        code: 'stamen_img',
        name: 'stamen',
        toolName: 'stamen',
        icon: stamen,
        source: {
            type: 'raster',
            tiles: ['http://a.tile.stamen.com/terrain-background/{z}/{x}/{y}.png'],
            tileSize: 256,
            minzoom: 0,
            maxzoom: 22
        },
        layer: {
            id: 'stamen_img',
            type: 'raster',
            minzoom: 0,
            maxzoom: 22,
            layout: { visibility: 'none' }
        }
    }
];

export const SOURCE_ID = 'SOURCE_ID'
export const LAYER_ID = 'LAYER_ID'







