import {request} from '@/utils/request'

export function taskList(query) {
  return request({
    url: '/test/task/list',
    method: 'get',
    params: query
  })
}

export function createTask(data) {
  return request({
    url: '/test/task/create',
    method: 'post',
    data
  })
}

export function engineList() {
  return request({
    url: '/engine/list',
    method: 'get',
  })
}

export function taskDetailList(data) {
  return request({
    url: '/test/task/detail/list',
    method: 'post',
    data
  })
}

export function taskResultList(query) {
  return request({
    url: '/test/task/result/list',
    method: 'get',
    params: query
  })
}

export function createTaskResult(data) {
  return request({
    url: '/test/task/result/create',
    method: 'post',
    data
  })
}
