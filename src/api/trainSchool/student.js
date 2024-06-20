import request from '@/utils/request'

export function add(data) {
  return request({
    url: '/api/student',
    method: 'post',
    data
  })
}

export function del(ids) {
  return request({
    url: '/api/student',
    method: 'delete',
    data: ids
  })
}

export function edit(data) {
  return request({
    url: '/api/student',
    method: 'put',
    data
  })
}

export function getFaceInfo() {
  return request({
    url: '/api/student/getLastStudentSnap',
    method: 'get'
  })
}

/*学习进度*/
export function getStudentStudySchedule(studentId) {
  return request({
    url: '/api/student/getStudentStudySchedule?id=' + studentId,
    method: 'get'
  })
}

export function getStudentStudyScheduleDetail(studentId, trainId, detailType, size, page) {
  return request({
    url: '/api/student/getStudentStudyScheduleDetail?trainId=' + trainId + '&studentId=' + studentId + '&size=' + size + '&page=' + page + '&detailType=' + detailType,
    method: 'get'
  })
}


export default {add, edit, del, getFaceInfo, getStudentStudySchedule, getStudentStudyScheduleDetail}

