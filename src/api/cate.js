import {request} from '@/utils/request'

export function list(params) {
  return request({
    url: '/product/cate/list',
    method: 'get',
    params
  })
}

export function create(data) {
  return request({
    url: '/product/cate/create',
    method: 'post',
    data
  })
}

export function update(data) {
  return request({
    url: '/product/cate/update',
    method: 'post',
    data
  })
}

export function topUpdate(params) {
  return request({
    url: '/product/cate/top',
    method: 'post',
    params
  })
}
