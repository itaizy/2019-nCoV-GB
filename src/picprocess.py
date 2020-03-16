# Encoding: utf-8
import os
import json
from urllib.request import urlretrieve

import requests
from urllib.request import urlopen

from PIL import Image
import numpy as np
val = os.system('cd .. && node scripts/build-origin.js')
print('DXY Data update.' + str(val))
val = os.system('wget -O - http://c.m.163.com/nc/article/headline/T1348647853363/0-40.html > data/n163.json')
f163 = open('data/n163.json',encoding='utf-8')
news = json.load(f163)
f163.close()
newsDict = {}
for new in news['T1348647853363']:
    newsDict[new['docid']] = new
newsf = []
for new in newsDict:
    newsf.append(newsDict[new])
newsfw = {}
newsfw['T1348647853363'] = newsf
with open('./data/n163.json', 'w', encoding='utf-8') as fp:
    json.dump(newsfw, fp, ensure_ascii=False)
fp.close()
print('n163 Data update.' + str(val))
f = open('data/overall.json',encoding='utf-8')
user_dic = json.load(f)
print("加载入文件完成...")
print(user_dic['dailyPics'])
for img_url in user_dic['quanguoTrendChart']:
    kp = img_url['imgUrl']
    print(kp)
    filename = 'images/' + kp.split('/')[-1]
    urlretrieve(kp, filename)
    im = Image.open(filename)
    im_array = im.load()
    im_nparray = np.array(im)
    print(im.size)
    for row in range(im.size[0]):
        for line in range(im.size[1]):
            if im_array[row, line][0] >= 235 and im_array[row, line][1] >= 235 and im_array[row, line][2] >= 235:
                im_array[row, line] = (255, 255, 255)
    im = im.crop((0, 135, im.size[0], im.size[1]))
    im.resize((int(im.size[0]*0.3), int(im.size[1]*0.3)), Image.ANTIALIAS)
    im.save(filename)
for img_url in user_dic['hbFeiHbTrendChart']:
    kp = img_url['imgUrl']
    print(kp)
    filename = 'images/' + kp.split('/')[-1]
    urlretrieve(kp, filename)
    im = Image.open(filename)
    im_array = im.load()
    im_nparray = np.array(im)
    print(im.size)
    for row in range(im.size[0]):
        for line in range(im.size[1]):
            if im_array[row, line][0] >= 235 and im_array[row, line][1] >= 235 and im_array[row, line][2] >= 235:
                im_array[row, line] = (255, 255, 255)
    im = im.crop((0, 135, im.size[0], im.size[1]))
    im.resize((int(im.size[0]*0.3), int(im.size[1]*0.3)), Image.ANTIALIAS)
    im.save(filename)
val = os.system('cd .. && npm install')
print('安装依赖' + str(val))
val = os.system('cd .. && npm run build')
print('build complete' + str(val))
val = os.system('cp data/img4gb.json ../build/gb/')
val = os.system('cp ../build/index.html ../build/gb/')
print('Done.' + str(val))
val = os.system('python3 gb.py')
print('GB Done.' + str(val))

## Generate Data for Multi-Echarts
frArea = open('./data/area.json', 'r', encoding='utf-8')
area = json.load(frArea)
hubei = []
temp = []
allp = {}
hubeijson = {}
for p in area:
    response = requests.get(p['statisticsData'])
    temp = response.json()
    if p['pinyin'] == 'hubei':
        for tt in temp['data']:
            hubeijson[str(tt['dateId'])] = tt
    for tdata in temp['data']:
        if str(tdata['dateId']) in allp:
            allp[str(tdata['dateId'])].append(tdata)
        else:
            allp[str(tdata['dateId'])] = [tdata]

keywords = [
    'currentConfirmedCount',
    'deadIncr',
    'curedIncr',
    'confirmedCount',
    'confirmedIncr',
    'deadCount',
    'curedCount',
    'currentConfirmedIncr'
]

quanguo = {}
hubei = {}
feihubei = {}

for tk in keywords:
    quanguo[tk] = []
    hubei[tk] = []
    feihubei[tk] = []

print(sorted(hubeijson.keys()))
print(sorted(allp.keys()))

for one in sorted(allp.keys()):
    if '20200119' == one:
        continue
    tsum = {}
    for tk in keywords:
        tsum[tk] = 0
        if one in hubeijson:
            hubei[tk].append(hubeijson[one][tk])
        else:
            hubei[tk].append("-")
    for oneone in allp[one]:
        for tk in keywords:
            tsum[tk] = tsum[tk] + oneone[tk]
    for tk in keywords:
        quanguo[tk].append(tsum[tk])

for tk in keywords:
    for i in range(0, len(quanguo[tk])):
        thb = hubei[tk][i]
        if thb == "-":
            feihubei[tk].append(quanguo[tk][i])
        else:
            feihubei[tk].append(quanguo[tk][i] - hubei[tk][i])


fw = open('./data/echartsdata.json', 'w', encoding='utf-8')
json.dump({
    'xAxis': [str(str(int(tk[4:6])) + '/' +str(int(tk[6:]))) for tk in sorted(hubeijson.keys())], 
    'quanguo': quanguo, 
    'hubei': hubei,
    'feihubei': feihubei
    }, fw)
fw.close()

print('echarts data Done!')

# print(temp)

# 爬取重点十国的新增确诊和累计确诊数据
with open('./data/countries.json','r',encoding='utf8')as fp:
    json_data = json.load(fp)
json_data.sort(key=lambda x:x['confirmedCount'],reverse=True)
res_json = []
i=0
while(True):
    if json_data[i]['provinceName'] == '中国':
        i += 1
        continue
    url = json_data[i]['statisticsData']
    res = requests.get(url).text
    res = json.loads(res)['data']
    list1 = [i['confirmedCount'] for i in res]
    list2 = [i['confirmedIncr'] for i in res]
    list3 = [str(i['dateId'])[5 if (str(i['dateId'])[4]=='0') else 4:6]+'/'+str(i['dateId'])[6:] for i in res]
    dict1 = {'provinceName':json_data[i]['provinceName'],'confirmedCount':list1,'confirmedIncr':list2,'date':list3}
    res_json.append(dict1) 
    i += 1
    if len(res_json)==10:
        break
res_json1 = json.dumps(res_json,ensure_ascii=False)
with open('./data/echartsdata2.json', 'w') as f1:
    f1.write(res_json1)
print('echarts data2 Done!')
