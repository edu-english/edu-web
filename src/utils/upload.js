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

let credentials = null;

export async function ossPut(file, pathPrefix) {
  if (isCredentialsExpired(credentials)) {
    credentials = await request({url: 'api/aliyun/oss', method: 'get'}).then((token) => {
      console.log("请求token==" + JSON.stringify(token.content))
      return token.content
    })
  }

  const client = new OSS({
    region: credentials.domain,
    accessKeyId: credentials.accessKeyId,
    accessKeySecret: credentials.accessKeySecret,
    stsToken: credentials.securityToken,
    bucket: credentials.bucket, //bucket名字
    secure: true,

  });
  const name = file.file.name
  const fileName = pathPrefix + "/" + uuidv4().replace(/-/g, '') + name.substring(name.lastIndexOf('.'))
  return client.put(fileName, file.file,
    {
      timeout: 3600000,// 超时时间
      headers: {
        headers
      },
    }).then(res => {
    // console.log(res, 'res---header ');
    return {
      'val': fileName,
      'name':name
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


/**
 * 判断临时凭证是否到期。
 **/
function isCredentialsExpired(credentials) {
  if (!credentials) {
    return true;
  }
  const expireDate = new Date(credentials.expiration);
  const now = new Date();
  // 如果有效期不足一分钟，视为过期。
  return expireDate.getTime() - now.getTime() <= 60000;
}
