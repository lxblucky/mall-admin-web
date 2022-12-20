import request from '@/utils/request'

export function listtarget(params){
  return request({
    url:'/test/target/queryList',
    method:'get',
    params: params
  })
}
