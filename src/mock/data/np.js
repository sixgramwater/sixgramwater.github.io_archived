import Mock from 'mockjs';


const detailList = [];
for (let i = 0; i < 5; i++) {
  detailList.push(Mock.mock({
    'goodsId|0-7': 1,
    'goodsNum|0-10': 1,
  }));
}


const npLists = [];

for (let i = 0; i < 100; i++) {
  npLists.push(Mock.mock({
    id: Mock.Random.guid(),
    // 营业部1， 人事部2， 财务部3， 销售部4， 广告部5， 企划部6， 研发部7
    'depart|1-7': 1,
    'detail|1-2':detailList,
    name: Mock.Random.cname(),
    stime: Mock.Random.date(),
    etime: Mock.Random.date(),
    desc: Mock.mock('@sentence'),
    'status|1-4':1, 
  }));
}

export { npLists };
