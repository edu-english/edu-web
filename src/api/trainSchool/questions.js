import request from '@/utils/request'

export function add(data) {
  return request({
    url: '/api/questions/bank',
    method: 'post',
    data
  })
}

export function del(ids) {
  return request({
    url: '/api/questions/bank',
    method: 'delete',
    data: ids
  })
}

export function edit(data) {
  return request({
    url: '/api/questions/bank',
    method: 'put',
    data
  })
}

export function getSubQuestion(pid) {
  return request({
    url: '/api/questions/bank/byId?pid=' + pid,
    method: 'get'
  })
}

export default {add, edit, del, getSubQuestion}

