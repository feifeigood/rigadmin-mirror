import { metricserver } from '@/utils/request'

export function cpuUsageRank() {
    return metricserver({
        url: 'api/v1/query',
        method: 'get',
        params: {
            query: 'topk(10, 100 - (avg(irate(node_cpu_seconds_total{job="node",mode="idle"}[5m])) by (instance) * 100))'
        }
    })
}

export function memUsageRank() {
    return metricserver({
        url: 'api/v1/query',
        method: 'get',
        params: {
            query: 'topk(10, avg((1 - (node_memory_MemAvailable_bytes{job="node"} / (node_memory_MemTotal_bytes{job="node"})))) by (instance) * 100)'
        }
    })
}

export function mysqlActiveSessionRank() {
    return metricserver({
        url: 'api/v1/query',
        method: 'get',
        params: {
            query: 'topk(10, sum(max_over_time(mysql_global_status_threads_running{job=~"mysql"}[5m])) by (instance))'
        }
    })
}

export function diskIOPSRank() {
    return metricserver({
        url: 'api/v1/query',
        method: 'get',
        params: {
            query: 'topk(10, avg(rate(node_disk_reads_completed_total{device=~"[a-z]*[a-z]"}[5m])) by (instance))'
        }
    })
}