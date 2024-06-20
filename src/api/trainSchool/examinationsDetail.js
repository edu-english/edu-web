import request from '@/utils/request'

export function getExaminationDetail(examinationId) {
  return request({
    url: '/api/examinations/byId?id=' + examinationId,
    method: 'get',
  })
}

export function getExaminationsDetailByStuId(stuId) {
  return request({
    url: '/api/student/examinationIncludeStudentAnswer?id=' + stuId,
    method: 'get',
  })
}

export default {getExaminationDetail, getExaminationsDetailByStuId}

