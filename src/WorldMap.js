import React, { useEffect, useState } from 'react'
import ReactEcharts from 'echarts-for-react/lib/core'
import echarts from 'echarts/lib/echarts'
import nameMap from './data/nameMap'

import 'echarts/lib/chart/map'
import 'echarts/lib/component/visualMap'
import 'echarts/lib/component/tooltip'

function WorldMap ({ province, data, onClick }) {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    import(`echarts/map/json/world.json`).then(map => {
      echarts.registerMap('world', map.default)
      setLoading(false)
    })
  }, [province])

  const getOption = () => {
    return {
      visualMap: {
        show: true,
        type: 'piecewise',
        min: 0,
        max: 2000,
        align: 'right',
        top: province ? 0 : '40%',
        right: 0,
        left: province ? 0 : 'auto',
        inRange: {
          color: [
            '#ffc0b1',
            '#ff8c71',
            '#ef1717',
            '#9c0505'
          ]
        },
        pieces: [
          {min: 90000},
          {min: 10000, max: 89999},
          {min: 1000, max: 9999},
          {min: 100, max: 999},
          {min: 1, max: 99},
        ],
        padding: 5,
        // "inverse": false,
        // "splitNumber": 5,
        orient: province ? 'horizontal' : 'vertical',
        showLabel: province ? false : true,
        text: ['高', '低'],
        itemWidth: 10,
        itemHeight: 10,
        textStyle: {
          fontSize: 10
        }
        // "borderWidth": 0
      },
      series: [{
        left: 'center',
        // top: '15%',
        // bottom: '10%',
        type: 'map',
        name: '确诊人数',
        silent: province ? true : false,
        label: {
          show: false,
          position: 'inside',
          // margin: 8,
          fontSize: 6
        },
        mapType: 'world',
        nameMap: nameMap,
        data,
        zoom: 1.2,
        roam: false,
        showLegendSymbol: false,
        emphasis: {},
        rippleEffect: {
          show: true,
          brushType: 'stroke',
          scale: 2.5,
          period: 4
        }
      }],
      tooltip: {
        trigger: 'item',
      }
    }
  }
  return (
    loading ? <div className="loading">地图正在加载中...</div> :
    <ReactEcharts
      echarts={echarts}
      option={getOption()}
      lazyUpdate={true}
      onEvents={{
        click (e) {
          onClick(e.name)
        }
      }}
    />
  )
}

export default WorldMap
