import request from '@/utils/request'

export function listTarget(params){
  return request({
    url:'/test/target/queryList',
    method:'get',
    params: params
  })
}

export function addTarget(data){
  return request({
    url : '/test/target/addtarget',
    method : 'post',
    data : data
  })
}

export function detailTarget(id){
  return request({
    url : '/test/target/detailTarget/'+id,
    method : 'get',
  })
}
export function updateTarget(id,data){
  return request({
    url : '/test/target/updateTarget/'+id,
    method : 'post',
    data : data
  })
}

export function upload(fd){
  return request({
    url : '/test/target/upload',
    method : 'post',
    data : fd,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}

