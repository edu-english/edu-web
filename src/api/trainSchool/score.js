import request from '@/utils/request'

export function add(data) {
  return request({
    url: '/api/student/recordScore',
    method: 'post',
    data
  })
}


export function getStudentInfoList(eduLevel) {
  return request({
    url: '/api/student/select?eduLevel='+eduLevel,
    method: 'get'
  })
}

export function getTestNameList() {
  return request({
    url: '/api/student/handScoreTestNameSelect',
    method: 'get'
  })
}

export function del(ids) {
  return request({
    url: 'api/student/scoreList',
    method: 'delete',
    data: ids
  })
}
export default {add,del, getTestNameList,getStudentInfoList}

