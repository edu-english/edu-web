import request from '@/utils/request'

export function add(data) {
  return request({
    url: '/api/student/recordScore',
    method: 'post',
    data
  })
}


export function getStudentInfoList() {
  return request({
    url: '/api/student/select',
    method: 'get'
  })
}

export function getTestNameList() {
  return request({
    url: '/api/student/handScoreTestNameSelect',
    method: 'get'
  })
}

export default {add, getTestNameList,getStudentInfoList}

