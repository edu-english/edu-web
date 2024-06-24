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
    url: '/api/training/byId?id=' + id,
    method: 'get'
  })
}

//试卷下拉框
export function examinationsSelect(eduLevel, difficultyLevel) {
  return request({
    url: '/api/examinations/select?eduLevel=' + eduLevel + '&difficultyLevel=' + difficultyLevel,
    method: 'get'
  })
}


export default {add, edit, del, getTrainInfo,examinationsSelect}

