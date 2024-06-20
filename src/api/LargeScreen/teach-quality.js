import request from "@/utils/request";

export function getDataTeachQuality() {
  return request({
    url: '/api/data/antithesisTeachQuality',
    method: 'get',
  })
}
export default {
  getDataTeachQuality
}
