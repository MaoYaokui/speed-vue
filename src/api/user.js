import {request} from '@/utils/request'

export function login(data) {
  return request({
    url: '/login',
    method: 'post',
    data
  })
}

export function getInfo(token) {
  return request({
    url: '/info',
    method: 'get',
    params: {token}
  })
}

export function logout(token) {
  return request({
    url: '/logout',
    method: 'post',
    params: {token}
  })
}

export function get(id) {
  return request({
    url: '/user/get',
    method: 'get',
    params: {id}
  })
}

export function list(query) {
  return request({
    url: '/user/list',
    method: 'get',
    params: query
  })
}

export function create(data) {
  return request({
    url: '/user/create',
    method: 'post',
    data
  })
}

export function update(data) {
  return request({
    url: '/user/update',
    method: 'post',
    data
  })
}

export function reset(data) {
  return request({
    url: '/user/reset',
    method: 'post',
    params: data
  })
}
