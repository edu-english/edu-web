import request from '@/utils/request'


export function getDataTest() {
  return request({
    url: '/api/data/test',
    method: 'get',
  })
}


export default {
  getDataTest
}
