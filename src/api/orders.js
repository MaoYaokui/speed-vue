import {request} from '@/utils/request'

export function list(query) {
  return request({
    url: '/orders/list',
    method: 'get',
    params: query
  })
}

export function listAll(query) {
  return request({
    url: '/orders/listAll',
    method: 'get',
    params: query
  })
}

export function getTurnover(query) {
  return request({
    url: '/orders/getTurnover',
    method: 'get',
    params: query
  })
}
