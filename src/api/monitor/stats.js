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


// node metrics -----------

export function nodeUname(instance) {
    return metricserver({
        url: 'api/v1/query',
        method: 'get',
        params: {
            query: `node_uname_info{job="node", instance=~"${instance}"}`
        }
    })
}

export function nodeBootTime(instance) {
    return metricserver({
        url: 'api/v1/query',
        method: 'get',
        params: {
            query: `node_boot_time_seconds{job="node", instance=~"${instance}"}`
        }
    })
}

export function nodeCPUNum(instance) {
    return metricserver({
        url: 'api/v1/query',
        method: 'get',
        params: {
            query: `count(node_cpu_seconds_total{instance=~"${instance}", job="node", mode='system'}) by (instance)`
        }
    })
}

export function nodeMem(instance) {
    return metricserver({
        url: 'api/v1/query',
        method: 'get',
        params: {
            query: `sum(node_memory_MemTotal_bytes{instance=~"${instance}", job="node"}) by (instance)`
        }
    })
}

export function nodeSwap(instance) {
    return metricserver({
        url: 'api/v1/query',
        method: 'get',
        params: {
            query: `sum(node_memory_SwapTotal_bytes{instance=~"${instance}", job="node"}) by (instance)`
        }
    })
}

export function nodePids(instance) {
    return metricserver({
        url: 'api/v1/query',
        method: 'get',
        params: {
            query: `node_processes_pids{instance=~"${instance}", job="node"}`
        }
    })
}

export function nodeCPUUsage(instance) {
    return metricserver({
        url: 'api/v1/query',
        method: 'get',
        params: {
            query: `(1 - avg(irate(node_cpu_seconds_total{instance=~"${instance}", job="node", mode="idle"}[5m])) by (instance)) * 100`
        }
    })
}

export function nodeMemUsage(instance) {
    return metricserver({
        url: 'api/v1/query',
        method: 'get',
        params: {
            query: `(1 - (node_memory_MemAvailable_bytes{instance=~"${instance}", job="node"} / (node_memory_MemTotal_bytes{instance=~"${instance}", job="node"})))* 100`
        }
    })
}