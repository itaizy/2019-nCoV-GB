# Encoding: utf-8
import os
import json
from urllib.request import urlretrieve
from PIL import Image
import numpy as np
f = open('data/overall.json',encoding='utf-8')
user_dict = json.load(f)
f.close()
print("加载入文件完成...")
stocks = [
    'modifyTime',
    'currentConfirmedCount',
    'confirmedCount',
    'suspectedCount',
    'curedCount',
    'deadCount',
    'seriousCount' 
]
increments = [
    'suspectedIncr',
    'currentConfirmedIncr',
    'confirmedIncr',
    'curedIncr',
    'deadIncr',
    'seriousIncr'
]
qg4gb = {}

for key in stocks:
    qg4gb[key] = user_dict[key]
for key in increments:
    qg4gb[key] = user_dict[key] if key in user_dict.keys() else '-'

#####################################################
qg4gb['suspectedCount'] = 253
#####################################################


f = open('data/qg4gb.json', 'w', encoding='utf-8')
json.dump(qg4gb, f)
f.close()

print(qg4gb)
print('Done.')
val = os.system('wget -O - https://api.inews.qq.com/newsqa/v1/query/pubished/daily/list?province=%E6%B9%96%E5%8C%97 > data/hb4gball.json')

f = open('data/hb4gball.json',encoding='utf-8')
hball = json.load(f)
f.close()
f = open('data/hb4gb.json', 'w', encoding='utf-8')
hbdata = [k for k in sorted(hball['data'], key=lambda item:item['date'], reverse=True)][0]

# *************************************************************
hbdata['suspected_add'] = 1
hbdata['suspected'] = 49
hbdata['suspected_delete'] = 110
json.dump(hbdata, f, ensure_ascii=False)
f.close()
# *************************************************************


img4gb = {}
qgtc = []
for img_url in user_dict['quanguoTrendChart']:
    kp = img_url['imgUrl']
    print(kp)
    filename = 'images/' + kp.split('/')[-1]
    qgtc.append(filename)
hbtc = []
for img_url in user_dict['hbFeiHbTrendChart']:
    kp = img_url['imgUrl']
    print(kp)
    filename = 'images/' + kp.split('/')[-1]
    hbtc.append(filename)
img4gb['qgtc'] = qgtc
img4gb['hbtc'] = hbtc
f = open('data/img4gb.json', 'w', encoding='utf-8')
json.dump(img4gb, f)
f.close()

val = os.system('python3 ImgCrawler.py')
print('GB Done.' + str(val))

val = os.system('cp -r images/ ../build/gb')
val = os.system('cp data/qg4gb.json ../build/gb')
val = os.system('cp data/hb4gb.json ../build/gb')
val = os.system('cp data/img4gb.json ../build/gb')




