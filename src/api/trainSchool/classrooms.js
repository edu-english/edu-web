import request from '@/utils/request'

export function add(data) {
  return request({
    url: '/api/classrooms',
    method: 'post',
    data
  })
}

export function del(ids) {
  return request({
    url: '/api/classrooms',
    method: 'delete',
    data: ids
  })
}

//教室内设备列表
export function getClassroomDevice(classroomId) {
  return request({
    url: '/api/classrooms/device?classroom_id=' + classroomId,
    method: 'get',
  })
}

//解绑设备
export function delClassroomDevice(id) {
  return request({
    url: '/api/classrooms/device',
    data: id,
    method: 'delete',
  })
}


//教室学生分配设备 上机
export function stuDistribute(data) {
  return request({
    url: '/api/classrooms/student/distribute',
    method: 'post',
    data
  })
}

// 下机
export function stuLogoutDistribute(data) {
  return request({
    url: '/api/classrooms/student/logout',
    method: 'post',
    data
  })
}

export function stusLogoutDistribute(data) {
  return request({
    url: '/api/classrooms/logout',
    method: 'post',
    data
  })
}

//教室学生列表-未上机
export function getClassRoomStu(classroomId) {
  return request({
    url: '/api/classrooms/student?classroom_id=' + classroomId,
    method: 'get',
  })
}

//教室扫脸设备同步全部学生信息
export function classroomSyncStu(id) {
  return request({
    url: '/api/classrooms/async',
    method: 'put',
    data: id
  })
}

export default {
  add,
  del,
  getClassroomDevice,
  delClassroomDevice,
  stuDistribute,
  stuLogoutDistribute,
  stusLogoutDistribute,
  getClassRoomStu,
  classroomSyncStu
}

