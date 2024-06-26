import request from '@/utils/request'


export function getDataTest() {
  return request({
    url: '/api/data/test',
    method: 'get',
  })
}

//大屏点击查询接口
export function getLargeInfo(stuId, type, page, size) {
  return request({
    url: '/api/data/bySId?sId=' + stuId + '&type=' + type + '&page=' + page + '&size=' + size,
    method: 'get',
  })
}


export default {
  getDataTest,
  getLargeInfo
}
