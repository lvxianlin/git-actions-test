'use strict'

const fs = require('fs');

const {request} = require('./request');

// 解析配置文件
let config = JSON.parse(fs.readFileSync('./config.json'));

// 添加环境测试
// process.env.COOKIE = 

// 读取cookie
request.defaults.headers.common.cookie = eval(config.COOKIE);

request.defaults.headers.common["user-agent"] = config["User-Agent"];

// 签到请求
const checkIn = () =>{
  return request({
    method: 'post',
    url: 'https://glados.rocks/api/user/checkin',
    data: {
      token: 'glados_network',
    }
  })
}

// 获得状态
const getStatus = ()=>{
  return request({
    method: 'get',
    url: 'https://glados.rocks/api/user/status',
    data: {
      token: 'glados_network',
    }
  })
}

// 处理数据结果
function dealData(checkInRes, statusRes){
  return {
    message: checkInRes.message,
    // checkInRec: checkInRes.list,
    UseDays: statusRes.days,
    email: statusRes.email,
    leftDays: statusRes.leftDays,
  }
}



async function main(){
  let start = new Date();
  const checkInRes =  await checkIn();
  const StatusRes = await getStatus();
  let end = new Date();
  let during = (end - start) / 1000;
  let res = dealData(checkInRes.data, StatusRes.data.data);
  console.log(res);
  console.log("done, use " + during + "s");
}

main();
