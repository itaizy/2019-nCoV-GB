import React, { useState, Suspense, useEffect } from 'react'
// import {Tabs, Button, PickerView, Carousel, WingBlank, Flex, Radio } from 'antd-mobile'
import {Tabs, Button, Flex, Radio } from 'antd-mobile'
import keyBy from 'lodash.keyby'
import dayjs from 'dayjs'
import 'dayjs/locale/zh-cn'
import relativeTime from 'dayjs/plugin/relativeTime'
import all from './data/overall'
import provinces from './data/area'
import countries from './data/countries'
import NavFab from "./component/NavFab"
import predictData from './data/predictData'
import hbdata from './data/hb4gb'
import ed from './data/echartsdata'
import ed2 from './data/echartsdata2'

import Tag from './Tag'

import Map from './Map'
import WorldMap from './WorldMap'

import './App.css'
import axios from 'axios'
import TotalTag from "./TotalTag";
// import { green, red } from '_ansi-colors@3.2.4@ansi-colors'

import 'antd-mobile/lib/tabs/style/css'
import 'antd-mobile/lib/button/style/css'
import 'antd-mobile/lib/picker-view/style/css'
import 'antd-mobile/lib/carousel/style/css'
import 'antd-mobile/lib/flex/style/css'
import 'antd-mobile/lib/radio/style/css'


dayjs.extend(relativeTime)

// import Map from './Map'

// const Map = React.lazy(() => import('./Map'))
const Predict = React.lazy(() => import('./Predict'))
const PredictMultiple = React.lazy(() => import('./PredictMultiple'))

const provincesByName = keyBy(provinces, 'name')

const fetcher = (url) => axios(url).then(data => {
  return data.data.data
})
const countryDataByName = keyBy(ed2,(x)=>(x.provinceName))
const countryMax = 34

function New ({ title, summary, sourceUrl, pubDate, pubDateStr }) {
  return (
    <div className="new">
      <div className="new-date">
        <div className="relative">
          {dayjs(pubDate).locale('zh-cn').fromNow()}
        </div>
        {dayjs(pubDate).format('YYYY-MM-DD HH:mm')}
      </div>
      {/* <a className="title" href={sourceUrl}>{ title }</a> */}
      <a className="title">{ title }</a>
      {/* <div className="summary">{ summary.length < 200? summary: (summary.slice(0, 200)+ '...') }</div> */}
      <div className="summary">{ summary }</div>
    </div>
  )
}

function News ({ province }) {
  const [len, setLen] = useState(8)
  const [news, setNews] = useState([])

  useEffect(() => {
    fetcher(`https://file1.dxycdn.com/2020/0130/492/3393874921745912795-115.json?t=${46341925 + Math.random()}`).then(news => {
      setNews(news)
    })
  }, [])

  return (
    <div className="card">
      <h2 id="News">实时动态</h2>
      {
        news
          .filter(n => province ? province.provinceShortName === (n.provinceName && n.provinceName.slice(0, 2)) : true)
          .slice(0, len)
          .map(n => <New {...n} key={n.id} />)
      }
      {
        len<news.length-1?
        <div className="more" onClick={() => { setLen(len+10<news.length?len+10:news.length) }}>点击查看更多动态</div>
        :<div>已加载全部</div>
      }
      
    </div>
  )
}

function Stat ({ modifyTime, currentConfirmedCount, suspectedCount, deadCount, curedCount, name }) {
  return (
    <div>
      <h3 id="Stas">
        地域 {name ? `: ${name}` : ': 全国'}
        <span className="due">
          截止到: {dayjs(modifyTime).format('YYYY-MM-DD HH:mm')}
        </span>
      </h3>
      <div className="row">
        <Tag number={currentConfirmedCount} className="numberconfirmed">
          现存确诊
        </Tag>
        <Tag number={name=='湖北'?hbdata['suspected']:suspectedCount || '-'} className="number">
          疑似
        </Tag>
        <Tag number={deadCount} className="dead">
          死亡
        </Tag>
        <Tag number={curedCount} className="numbercured">
          治愈
        </Tag>
      </div>
    </div>
  )
}

function WorldStat ({ modifyTime, confirmedCount, suspectedCount, deadCount, curedCount, name }) {
  return (
    <div>
      <h3 id="WorldStas">
        地域 {name ? `: ${name}` : ': 世界'}
        <span className="due">
          截止到: {dayjs(modifyTime).format('YYYY-MM-DD HH:mm')}
        </span>
      </h3>
      <div className="row">
        <Tag number={confirmedCount} className="numberconfirmed">
          确诊
        </Tag>
        {/* <Tag number={suspectedCount || '-'} className="number">
          疑似
        </Tag> */}
        <Tag number={curedCount} className="numbercured">
          治愈
        </Tag>
        <Tag number={deadCount} className="dead">
          死亡
        </Tag>
      </div>
    </div>
  )
}


function StatIncr ({ modifyTime}) {
  return (
    <div className="card">
      <h2 id="Incr">
        实时数据
        <span className="due">
          (全国)截止时间: {dayjs(modifyTime).format('YYYY-MM-DD HH:mm')}
        </span>
      </h2>
      <div className="row">
        <TotalTag number={all.currentConfirmedIncr} total={all.currentConfirmedCount} className="numberconfirmed">
          现存确诊
        </TotalTag>
        <TotalTag number={all.suspectedIncr || '-'}  total={all.suspectedCount} className="number">
          疑似
        </TotalTag>
        <TotalTag number={all.seriousIncr} total={all.seriousCount} className="icu">
          重症
        </TotalTag>
        <TotalTag number={all.deadIncr} total={all.deadCount} className="dead">
          死亡
        </TotalTag>
        <TotalTag number={all.curedIncr} total={all.curedCount} className="numbercured">
          治愈
        </TotalTag>
      </div>
    </div>
  )
}

function Area ({ area, onChange }) {
  const renderArea = () => {
    return area.map(x => (
      <div className="province" key={x.name || x.cityName} onClick={() => {
        // 表示在省一级
        if (x.name) {
          onChange(x)
          // window.location.href = window.location.href + "#Map"
          // setTimeout('window.location="#Map"',300)
          document.getElementById('Map').scrollIntoView()
        }
      }}>
        <div className={`area ${x.name ? 'active' : ''}`}>
          { x.name || x.cityName }
        </div>
        <div className="confirmed">{ x.confirmedCount }</div>
        <div className="death">{ x.deadCount }</div>
        <div className="cured">{ x.curedCount }</div>
      </div>
    ))
  }

  return (
    <>
      <div className="province header">
        <div className="area">地区</div>
        <div className="confirmed">确诊</div>
        <div className="death">死亡</div>
        <div className="cured">治愈</div>
      </div>
      { renderArea() }
    </>
  )
}

function WorldArea ({ area, onChange }) {
  const [viewall,setviewall] = useState(false)
  const renderArea = () => {
    return area.map(x => (
      <div className="province" key={x.provinceName} onClick={() => {}}>
        <div className={`area ${x.provinceName ? 'active' : ''}`}>{x.provinceName}
        </div>
        <div className="confirmed">{ x.confirmedCount }</div>
        <div className="death">{ x.deadCount }</div>
        <div className="cured">{ x.curedCount }</div>
      </div>
    )).slice(0,(viewall==0) ? countryMax : 100)
  }
  const viewAllButton = () => {
    if (viewall) {
      return (
        <Button onClick={() => {setviewall(false)}} size='small'>
          点击收起
        </Button>
      )
    }else {
      return (
        <Button onClick={() => {setviewall(true)}} size='small'>
          点击查看全部国家
        </Button>
      )
    }
  }

  return (
    <>
      <div className="province header">
        <div className="area">地区</div>
        <div className="confirmed">确诊</div>
        <div className="death">死亡</div>
        <div className="cured">治愈</div>
      </div>
      { renderArea() }
      { viewAllButton() }
    </>
  )
}

function Header ({ province }) {
  return (
    <header>
    </header>
  )
}

function App () {
  const [countryState,setCountryState] = useState(ed2[0].provinceName)
  const [province, _setProvince] = useState(provincesByName['湖北'])
  const [userLocation, _setUserLocation] = useState(true)
  const country = null

  useEffect(() => {
    if (province) {
      // window.document.title = `新冠疫情实时地图 | ${province.name}`
      window.document.title = `实时地图`
    }
  }, [province])

  const setProvince = (p) => {
    _setProvince(p)
    window.history.pushState(null, null, p ? p.pinyin : '/')
  }

  const data = !province ? provinces.map(p => ({
    name: p.provinceShortName,
    value: p.confirmedCount
  })) : provincesByName[province.name].cities.map(city => ({
    name: city.fullCityName,
    value: city.confirmedCount
  }))

  const Worlddata = countries.map(p => ({
    name: p.provinceName,
    value: p.confirmedCount
  }))//.concat([{name: '中国',
//             value: all.confirmedCount
//            }])


  const area = province ? provincesByName[province.name].cities : provinces
  const overall = province ? province : all

//   const Worldarea = ([{'provinceName': '中国',
//             'confirmedCount': all.confirmedCount,
//             'deadCount': all.deadCount,
//             'curedCount': all.curedCount,
//             'sort': 0
//   }]).concat(countries)
  const Worldarea = countries.sort((a,b)=>(b.confirmedCount-a.confirmedCount))


  const citylist = ['武汉市','黄石市','十堰市','宜昌市','襄阳市','鄂州市','荆门市','孝感市','荆州市','黄冈市','咸宁市','随州市','恩施土家族苗族自治州仙桃市','潜江市','天门市','神农架林区']

  const tabs = [
    { title: '全国疫情地图' },
    { title: '世界疫情地图' },
  ];


  useEffect(() => {
    const BMap = window.BMap;
    const myCity = new BMap.LocalCity();

    myCity.get(function (result) {
      // console.log(result.name);          //城市名称
        if (result.name) {
          if (citylist.indexOf(result.name) != -1){
            _setUserLocation(true)
          } else {
            _setUserLocation(false)
          }
        }
    });
  }, [])  

  return (
    <div>
      <Header province={province} />
      {/* 实时数据 */}
      <StatIncr modifyTime={all.modifyTime}/> 

        {/* 地图 */}
      <div className="card" id="MapTab">
       <Tabs tabs={tabs} initialPage={1} animated={false} useOnPan={false}>
        <div id="Map">
         <h2>疫情地图 { province ? `· ${province.name}` : "(点击省市查看详情)" }
         {
           province ? <small
             onClick={() => setProvince(null)}
           >返回全国</small> : null
         }
         </h2>
         {/* <h3>点击省市查看详情</h3> */}
         <Stat { ...overall } name={province && province.name} modifyTime={all.modifyTime} />
         {/* <Suspense fallback={<div className="loading">地图正在加载中...</div>}> */}
           <Map province={province} data={data} onClick={name => {
             const p = provincesByName[name]
             if (p) {
               setProvince(p)
             }
           }} />
         {/* </Suspense> */}
         <Area area={area} onChange={setProvince} />
        </div>
        <div id="WorldMap">
           <h2>世界疫情地图 { country ? `· ${country.name}` : "" }
              {
                country ? <small
                  onClick={null}
                >返回世界地图</small> : null
              }
           </h2>
           <WorldStat { ...all.foreignStatistics } name={'世界'} modifyTime={all.modifyTime} />
           <WorldMap province={country} data={Worlddata} onClick= {(name) => {}}/>
           {/* <PickerView
                data={ed2.map((x) => ({label:x.provinceName,value:x.provinceName}) )}
                value={countryState}
                onChange={(x)=>{
                            console.log(x);
                            setCountryState(x);
                           }}
                cols={1}
                //cascade={false}
            /> */}
            <Suspense fallback={<div className="loading">正在加载中...</div>}>

                  <PredictMultiple data={{
                    "xAxis": countryDataByName[countryState].date, 
                    "yAxis": [
                    {
                      "legend": countryDataByName[countryState].provinceName + "累计确诊", 
                      "type": "true",
                      "data": countryDataByName[countryState].confirmedCount,
                    }],
                    "refresh": countryState
                    }}/>
                  <PredictMultiple data={{
                    "xAxis": countryDataByName[countryState].date, 
                    "yAxis": [
                    {
                      "legend": countryDataByName[countryState].provinceName + "新增确诊", 
                      "type": "true",
                      "data": countryDataByName[countryState].confirmedIncr,
                    }],
                    "refresh": countryState
                    }}/>

            </Suspense>
            <Flex style={{ padding: '15px' }}>
            {
              ed2.map((x) => (
                <Flex.Item key={x.provinceName}>
                  <Radio className="my-radio" 
                    checked={countryState === x.provinceName} 
                    onChange={() => {
                      setCountryState(x.provinceName)
                      }}>{x.provinceName}
                  </Radio>
                </Flex.Item>
              ))
            }
              
            </Flex>
            
           
           <WorldArea area={Worldarea} onChange={null} />
        </div>
       </Tabs>
      </div>

      {/* 趋势 */}
        <div className="card" id='Trends'>
        <h2>全国</h2>
        <div>
            {/* {all.quanguoTrendChart.map(n => (              
              <div key={n.title}>
                <img src={require('./images/' + n.imgUrl.split('/')[n.imgUrl.split('/').length - 1])}
                     alt=""
                    //  style={{ width: '100%', verticalAlign: 'top' }}
                     style={{ width: '100%'}}
                     onLoad={() => {
                         // fire window resize event to change height
                         window.dispatchEvent(new Event('resize'));
                     }}/>
              </div>))} */}
        <Suspense fallback={<div className="loading">正在加载中...</div>}>
          <PredictMultiple data={{
              // "title": "确诊",
              "xAxis": ed.xAxis, 
              "yAxis": [
                {
                  "legend": "新增确诊", 
                  "type": "true",
                  "data": ed.quanguo.confirmedIncr,
                }
              ]
              }}/>
          <PredictMultiple data={{
              // "title": "确诊",
              "xAxis": ed.xAxis, 
              "yAxis": [
                {
                  "legend": "现存确诊", 
                  "type": "true",
                  "data": ed.quanguo.currentConfirmedCount,
                }
              ]
              }}/>
          <PredictMultiple data={{
              // "title": "确诊",
              "xAxis": ed.xAxis, 
              "yAxis": [
                {
                  "legend": "治愈", 
                  "type": "true",
                  "data": ed.quanguo.curedCount,
                }
              ]
              }}/>
          <PredictMultiple data={{
              // "title": "确诊",
              "xAxis": ed.xAxis, 
              "yAxis": [
                {
                  "legend": "死亡", 
                  "type": "true",
                  "data": ed.quanguo.deadCount,
                }
              ]
              }}/>
          <PredictMultiple data={{
              // "title": "确诊",
              "xAxis": ed.xAxis, 
              "yAxis": [
                {
                  "legend": "治愈新增", 
                  "type": "true",
                  "data": ed.quanguo.curedIncr,
                }
              ]
              }}/>
          </Suspense>
          
          </div>
          <h2>湖北/非湖北</h2>
          <div>
          <Suspense fallback={<div className="loading">正在加载中...</div>}>
            <PredictMultiple data={{
                // "title": "确诊",
                "xAxis": ed.xAxis, 
                "yAxis": [
                  {
                    "legend": "湖北新增", 
                    "type": "true",
                    "data": ed.hubei.confirmedIncr,
                  }
                ]
                }}/>
            <PredictMultiple data={{
              // "title": "确诊",
              "xAxis": ed.xAxis, 
              "yAxis": [
                {
                  "legend": "湖北现存", 
                  "type": "true",
                  "data": ed.hubei.currentConfirmedCount,
                }
              ]
              }}/>
            <PredictMultiple data={{
              // "title": "确诊",
              "xAxis": ed.xAxis, 
              "yAxis": [
                {
                  "legend": "湖北治愈", 
                  "type": "true",
                  "data": ed.hubei.curedCount,
                }
              ]
              }}/>
            <PredictMultiple data={{
              // "title": "确诊",
              "xAxis": ed.xAxis, 
              "yAxis": [
                {
                  "legend": "湖北治愈新增", 
                  "type": "true",
                  "data": ed.hubei.curedIncr,
                }
              ]
              }}/>
            <PredictMultiple data={{
              // "title": "确诊",
              "xAxis": ed.xAxis, 
              "yAxis": [
                {
                  "legend": "非湖北确诊新增", 
                  "type": "true",
                  "data": ed.feihubei.confirmedIncr,
                },
                {
                  "legend": "非湖北治愈新增", 
                  "type": "true",
                  "data": ed.feihubei.curedIncr,
                }
              ]
              }}/>
          </Suspense>
          </div>
          </div>
            {/* {all.hbFeiHbTrendChart.map(n => (
              <div key={n.title}>
                <img src={require('./images/' + n.imgUrl.split('/')[n.imgUrl.split('/').length - 1])}
                     alt=""
                    //  style={{ width: '100%', verticalAlign: 'top' }}
                     style={{ width: '100%'}}
                     onLoad={() => {
                         // fire window resize event to change height
                         window.dispatchEvent(new Event('resize'));
                     }}/>
                     </div>))}
                     </div> */}
        {/* </Carousel> */}
      {/* </WingBlank> */}
      
      {/* 定位 */}
      {/* <div className="card">
        <h2 id="local">周边疫情
        {
          userLocation ? <small
            onClick={() => _setUserLocation(false)}
          >查看非湖北</small> : <small
          onClick={() => _setUserLocation(true)}
        >查看湖北</small>
        }</h2>
      </div> */}
      {/* <iframe src={userLocation?"https://yqdt.jianguan.gov.cn/":"https://map.sogou.com/m/shouji4/page/emap/?_=0.8058073278712437"} width="100%" height="500px" frameBorder="0"></iframe> */}
      {/* <iframe src={userLocation?"https://yqdt.jianguan.gov.cn/":"https://yqdt.jianguan.gov.cn/"} width="100%" height="500px" frameBorder="0"></iframe> */}
      {/* <iframe src={"http://39.107.70.155/"} width="100%" height="500px" frameBorder="0"></iframe> */}
      
      {/* 预测 */}
      <div className="card" id="Predict">
        <h2> 疫情预测（确诊趋势）· 近期</h2>
        <div height="250px">
        <Suspense fallback={<div className="loading">正在加载中...</div>}>
          <Predict data={{"legend": ["武汉", "武汉趋势"], "xAxis": predictData.xAxis, "predict": predictData.wuhan, "truedata": predictData.wuhan_t}} onClick={() => {alert('仅供参考')}} />
          <Predict data={{"legend": ["湖北（不含武汉）", "湖北（不含武汉）趋势"], "xAxis": predictData.xAxis, "predict": predictData.hubei, "truedata": predictData.hubei_t}} onClick={() => {alert('仅供参考')}} />
          <Predict data={{"legend": ["北上广", "北上广趋势"], "xAxis": predictData.xAxis, "predict": predictData.bsg, "truedata": predictData.bsg_t}} onClick={() => {alert('仅供参考')}} />
          <Predict data={{"legend": ["全国（不含湖北）", "全国（不含湖北）趋势"], "xAxis": predictData.xAxis, "predict": predictData.all, "truedata": predictData.all_t}} onClick={() => {alert('仅供参考')}} />
        </Suspense>
        </div>
        <h2> 疫情预测（确诊趋势）· 长期</h2>
        <div>
          <img src={require('./images/p_bsg.png')} alt="" style={{ width: '100%'}}
                     onLoad={() => {
                         window.dispatchEvent(new Event('resize'));
                     }}/>
                     </div>
        <div>
          <img src={require('./images/p_all.png')} alt="" style={{ width: '100%'}}
                     onLoad={() => {
                         window.dispatchEvent(new Event('resize'));
                     }}/>
                     </div>
        <div>
          <img src={require('./images/p_hb.png')} alt="" style={{ width: '100%'}}
                     onLoad={() => {
                         window.dispatchEvent(new Event('resize'));
                     }}/>
                     </div>
        <div>
          <img src={require('./images/p_wh.png')} alt="" style={{ width: '100%'}}
                     onLoad={() => {
                         window.dispatchEvent(new Event('resize'));
                     }}/>
                     </div>
      </div>
      
      {/* 动态 */}
      <News province={province} />
      <NavFab/>
    </div>
  );
}

export default App;
