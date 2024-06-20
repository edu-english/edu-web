import request from '@/utils/request'


export function getDataListen() {
  return request({
    url: '/api/data/listen',
    method: 'get',
  })
}
export default {
  getDataListen
}
