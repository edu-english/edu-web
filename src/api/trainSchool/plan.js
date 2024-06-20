import request from '@/utils/request'

export function add(data) {
  return request({
    url: '/api/training',
    method: 'post',
    data
  })
}

export function del(ids) {
  return request({
    url: '/api/training',
    method: 'delete',
    data: ids
  })
}

export function edit(data) {
  return request({
    url: '/api/training',
    method: 'put',
    data
  })
}

export function getTrainInfo(id) {
  return request({
    url: 'api/training/byId?id=' + id,
    method: 'get'
  })
}


export default {add, edit, del, getTrainInfo}

