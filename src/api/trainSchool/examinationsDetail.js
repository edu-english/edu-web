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


//阅卷
export function markExamination(data) {
  return request({
    url: '/api/examinations/markExamination',
    method: 'post',
    data
  })
}



export default {getExaminationDetail, getExaminationsDetailByStuId,markExamination}

