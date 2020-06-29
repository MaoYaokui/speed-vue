import {request} from '@/utils/request'

export function list(params) {
  return request({
    url: '/appointment/list',
    method: 'get',
    params
  })
}

export function listAll(query) {
  return request({
    url: '/appointment/listAll',
    method: 'get',
    params: query
  })
}

export function through(data) {
  return request({
    url: '/appointment/through',
    method: 'post',
    data
  })
}

export function overrule(data) {
  return request({
    url: '/appointment/overrule',
    method: 'post',
    data
  })
}

export function writeOff(data) {
  return request({
    url: '/appointment/writeOff',
    method: 'post',
    data
  })
}


