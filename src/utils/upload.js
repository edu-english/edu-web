import axios from 'axios'
import {getToken} from '@/utils/auth'
import OSS from 'ali-oss';
import request from "@/utils/request";
import {v4 as uuidv4} from 'uuid'

export function upload(api, file) {
  var data = new FormData()
  data.append('file', file)
  const config = {
    headers: {'Authorization': getToken()}
  }
  return axios.post(api, data, config)
}


// 自定义请求头
const headers = {
  // 指定Object的存储类型。
  // 'x-oss-storage-class': 'Standard',
  // 指定Object的访问权限。
  // 'x-oss-object-acl': 'private',
  // 通过文件URL访问文件时，指定以附件形式下载文件，下载后的文件名称定义为example.txt。
  // 'Content-Disposition': 'attachment; filename="example.txt"',
  // 设置Object的标签，可同时设置多个标签。
  'x-oss-tagging': 'Tag1=1&Tag2=2',
  // 指定PutObject操作时是否覆盖同名目标Object。此处设置为true，表示禁止覆盖同名Object。
  'x-oss-forbid-overwrite': 'false',
};

export async function ossPut(file, pathPrefix) {
  const token = await request({url: 'api/aliyun/oss', method: 'get'}).then((token) => {
    return token
  })
  const client = new OSS({
    region: token.content.domain,
    accessKeyId: token.content.accessKeyId,
    accessKeySecret: token.content.accessKeySecret,
    stsToken: token.content.securityToken,
    refreshSTSTokenInterval: token.content.expiration,// 刷新临时访问凭证的时间间隔，单位为毫秒。
    bucket: token.content.bucket, //bucket名字
    secure: true
  });
  const fileName = pathPrefix + "/" + uuidv4().replace(/-/g, '')
  return client.put(fileName, file.file, {headers}).then(res => {
    return {
      'val': fileName,
    }
  }).catch(err => {
    console.error(err)
    return null
  });
}


export async function ossRemove(fileName) {
  try {
    const token = await request({url: 'api/aliyun/oss', method: 'get'}).then((token) => {
      return token
    })
    const client = new OSS({
      region: token.content.domain,
      accessKeyId: token.content.accessKeyId,
      accessKeySecret: token.content.accessKeySecret,
      stsToken: token.content.securityToken,
      refreshSTSTokenInterval: token.content.expiration,//// 刷新临时访问凭证的时间间隔，单位为毫秒。
      bucket: token.content.bucket, //bucket名字
      secure: true
    });
    // 填写Object完整路径。Object完整路径中不能包含Bucket名称。
    const result = await client.delete(fileName);
    console.log(result);
  } catch (error) {
    console.log(error);
  }
}
