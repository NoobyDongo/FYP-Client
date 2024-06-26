'use client'
import {
    useMutation,
    useQuery,
    useQueryClient,
    keepPreviousData,
} from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import useProgress from "@/components/Progress/useProgress/useProgress"
import useNotification from '@/components/Notifications/useNotification'
import useAPI from '@/utils/crud/useAPI'
import React from 'react'
import toFilters from '../../components/Table/utils/filters/toFilters'
import isEmptyObject from '../isEmptyObject'

export default function CRUD({ tableName, methods = {}, allowSimple = false, refetchTotalRowCount}, fetchAll, options = {}) {

    const { pagination, columnFilters, globalFilter, sorting } = options

    const router = useRouter()
    const callAPI = useAPI('/api/record', tableName, router)

    const { customUpdate, customDelete, customCreate } = methods
    const { create = callAPI, get = callAPI, update = callAPI, delete: _del = callAPI } = methods
    const { createOption, getOption, updateOption, deleteOption } = methods
    const { createSimple = true, getSimple = true, updateSimple = true, deleteSimple = true } = methods
    const [tries, setTries] = React.useState(0)

    const createFn = React.useCallback(async (record) => await create({
        option: createOption || "add",
        method: "POST",
        simple: createSimple && allowSimple,
        body: customCreate?.(record) ?? record
    }), [createOption, createSimple, allowSimple, customCreate])

    const getFn = React.useCallback(async () => {

        let criteriaList = toFilters(columnFilters) || []
        criteriaList = criteriaList.concat(globalFilter)

        let body = {
            ...(criteriaList.length > 0 ? { criteriaList } : {}),
            ...(sorting.length > 0 ? { sort: sorting.map(e => ({ property: e.id, direction: e.desc ? "desc" : "asc" })) } : {}),
            page: pagination.pageIndex,
            size: pagination.pageSize,
        }

        let res = await get({
            option: getOption || (fetchAll ? "all" : "search"),
            method: fetchAll ? "GET" : "POST",
            ...(fetchAll ? {} : { body }),
            simple: getSimple && allowSimple
        })
        return res
    }, [fetchAll, getSimple, allowSimple, getOption, pagination, columnFilters, globalFilter, sorting])

    const updateFn = React.useCallback(async (record) => await update({
        option: updateOption || "add",
        method: "POST",
        simple: updateSimple && allowSimple,
        body: customUpdate?.(record) ?? record
    }), [updateOption, updateSimple, allowSimple, customUpdate])

    const deleteFn = React.useCallback(async (record) => await _del({
        option: deleteOption || `remove/${record.id}`,
        method: "DELETE",
        simple: deleteSimple && allowSimple,
        body: customDelete?.(record) ?? record
    }), [deleteOption, deleteSimple, allowSimple, customDelete])

    const queryKey = React.useMemo(() => (fetchAll ?
        [tableName] :
        [tableName, pagination.pageIndex, pagination.pageSize, columnFilters, globalFilter, sorting]),
        [tableName, fetchAll, pagination, columnFilters, globalFilter, sorting])

    const _updateQuerySet = (prevRecords, newRecord, updateMethod) => {
        let { [tableName]: table, ...others } = prevRecords
        let o = {
            ...others, [tableName]: updateMethod(newRecord, table)
        }
        return o
    }
    const append = (prevRecords, newRecord) => {
        return _updateQuerySet(prevRecords, newRecord, (n, table) => [...table, n])
    }
    const modify = (prevRecords, newRecord) => {
        return _updateQuerySet(prevRecords, newRecord, (n, table) => table?.map((p) => p.id === n.id ? n : p))
    }
    const remove = (prevRecords, newRecord) => {
        return _updateQuerySet(prevRecords, newRecord, (n, table) => table?.filter((p) => p.id !== n.id))
    }

    const { normal: newNotification, error: alertError } = useNotification()
    const { startAsync } = useProgress(1)

    const _mutationFn = (aquireDataFn) => async (record = null) => {
        return await startAsync(async () => {
            try {
                let e = await aquireDataFn(record)
                if (isEmptyObject(e)) {
                    return null
                }
                return e
            } catch (err) {
                console.error(err)
                alertError({ error: 'Something went wrong' })
            }
        })
    }

    const useCreate = () => {
        const queryClient = useQueryClient()
        return useMutation({
            mutationFn: _mutationFn(createFn),
            onSuccess: (newRecord) => {
                if (!newRecord?.id) {
                    alertError({ error: "Failed to create record" })
                    return
                }
                if (alertError(newRecord))
                    return
                if (fetchAll)
                    queryClient.setQueryData(queryKey, (p) => append(p, newRecord))

                newNotification("A record has been created", "info")
            },
            onError: (err) => {
                alertError({ error: err })
            },
            ...(!fetchAll && {
                onSettled: () => {
                    queryClient.invalidateQueries({ queryKey: [tableName] })
                    refetchTotalRowCount()
                }
            })
        })
    }

    const useGet = () => {
        return useQuery({
            queryKey: queryKey,
            queryFn: _mutationFn(async () => {
                await refetchTotalRowCount()
                let record = []
                let table = await getFn()
                if (table.error) {
                    setTries(prev => prev + 1)
                    if (tries > 0)
                        table.error = `${table.error}(${tries})`
                    alertError(table)
                    return record
                }
                else {
                    setTries(0)
                }
                record = table
                return record
            }),
            onError: (err) => {
                alertError({ error: err })
            },
            placeholderData: keepPreviousData,
            refetchOnWindowFocus: false,
        })
    }

    const useUpdate = () => {
        const queryClient = useQueryClient()
        return useMutation({
            mutationFn: _mutationFn(updateFn),
            onSuccess: (newRecord) => {
                if (!newRecord?.id) {
                    alertError({ error: "Failed to update record" })
                    return
                }
                if (alertError(newRecord))
                    return

                if (fetchAll)
                    queryClient.setQueryData(queryKey, (p) => modify(p, newRecord))

                newNotification("A record has been edited", "info")
            },
            onError: (err) => {
                alertError({ error: err })
            },
            ...(!fetchAll && {
                onSettled: () => {
                    queryClient.invalidateQueries({ queryKey })
                    refetchTotalRowCount()
                }
            })
        })
    }

    const useDelete = () => {
        const queryClient = useQueryClient()
        return useMutation({
            mutationFn: _mutationFn(deleteFn),
            onSuccess: (newRecord) => {
                if (alertError(newRecord))
                    return

                if (fetchAll)
                    queryClient.setQueryData(queryKey, (p) => remove(p, newRecord))
                newNotification("A record has been removed", "info")
            },
            onError: (err) => {
                alertError({ error: err })
            },
            ...(!fetchAll && {
                onSettled: () => {
                    queryClient.invalidateQueries({ queryKey: [tableName] })
                    refetchTotalRowCount()
                }
            })
        })
    }

    return [useCreate, useGet, useUpdate, useDelete]
}
