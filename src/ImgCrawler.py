# -*- Encoding:UTF-8 -*-
from selenium import webdriver
from selenium.webdriver.common.action_chains import ActionChains
import time
import random
import json
import base64

options = webdriver.ChromeOptions()
options.add_argument('--headless')
options.add_argument('--disable-gpu')
options.add_argument('--window-size=343,768')
driver = webdriver.Chrome(chrome_options=options)
driver.get('http://ring.act.buaa.edu.cn/gb/')

time.sleep(8)

#下面的js代码根据canvas文档说明而来
JS = 'return arguments[0].toDataURL("image/png", 1.0);'
WidthJS = 'arguments[0].style.width="441px";'
HeightJS = 'arguments[0].style.height="240px";'
# 执行 JS 代码并拿到图片 base64 数据
i = 0
#for img in driver.find_elements_by_xpath("//div[@id='Trends']//div[@class='echarts-for-react ']"):
#    driver.execute_script(WidthJS, img)  #执行js文件得到带图片信息的图片数据
#    driver.execute_script(HeightJS, img)  #执行js文件得到带图片信息的图片数据
#time.sleep(5)

fnquanguo = []
fnhubei = []

for img in driver.find_elements_by_xpath("//div[@id='Trends']/div[1]//img"):
    tag = "images/quanguo"
    #im_info = driver.execute_script(JS, img)  #执行js文件得到带图片信息的图片数据
    im_info = img.get_attribute("src")
    im_base64 = im_info.split(',')[1]  #拿到base64编码的图片信息
    im_bytes = base64.b64decode(im_base64)  #转为bytes类型
    with open(tag + "-" + str(i) + '.png','wb') as f:  #保存图片到本地
        f.write(im_bytes)
    fnquanguo.append(tag + "-" + str(i) + '.png')
    i += 1
i = 0
for img in driver.find_elements_by_xpath("//div[@id='Trends']/div[2]//img"):
    tag = "images/hubei"
    #im_info = driver.execute_script(JS, img)  #执行js文件得到带图片信息的图片数据
    im_info = img.get_attribute("src")
    im_base64 = im_info.split(',')[1]  #拿到base64编码的图片信息
    im_bytes = base64.b64decode(im_base64)  #转为bytes类型
    with open(tag + "-" + str(i) + '.png','wb') as f:  #保存图片到本地
        f.write(im_bytes)
    fnhubei.append(tag + "-" + str(i) + '.png')
    i += 1
driver.quit()

f = open('data/img4gb.json', 'w', encoding='utf-8')
json.dump({'qgtc': fnquanguo, 'hbtc': fnhubei}, f)
f.close()



