import {request} from '@/utils/request'

export function datasetList(query) {
  return request({
    url: '/test/dataset/list',
    method: 'get',
    params: query
  })
}

export function createDataset(data) {
  return request({
    url: '/test/dataset/create',
    method: 'post',
    data
  })
}

export function updateDataset(data) {
  return request({
    url: '/test/dataset/update',
    method: 'post',
    data
  })
}

export function deleteDataset(id) {
  return request({
    url: '/test/dataset/delete',
    method: 'post',
    params: {id}
  })
}

export function detailList(query) {
  return request({
    url: '/test/detail/list',
    method: 'get',
    params: query
  })
}

export function deleteDetail(ids) {
  return request({
    url: '/test/detail/delete',
    method: 'post',
    params: {ids}
  })
}

