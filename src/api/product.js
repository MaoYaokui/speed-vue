import {request} from '@/utils/request'

export function get(params) {
  return request({
    url: '/product/get',
    method: 'get',
    params
  })
}

export function list(params) {
  return request({
    url: '/product/list',
    method: 'get',
    params
  })
}

export function create(data) {
  return request({
    url: '/product/create',
    method: 'post',
    data
  })
}

export function update(data) {
  return request({
    url: '/product/update',
    method: 'post',
    data
  })
}

export function deleteRole(params) {
  return request({
    url: '/product/delete',
    method: 'post',
    params
  })
}

export function topUpdate(params) {
  return request({
    url: '/product/top',
    method: 'post',
    params
  })
}

export function deleteImage(params) {
  return request({
    url: '/product/image/delete',
    method: 'post',
    params
  })
}



