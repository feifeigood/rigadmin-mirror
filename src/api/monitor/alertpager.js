import { alertpager } from '@/utils/request'

// 查询监控告警数据
export function listAlerts(data) {
  return alertpager({
    url: '/alerts.json',
    method: 'post',
    data: data
  })
}
