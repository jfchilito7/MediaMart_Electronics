import { flexRender, getCoreRowModel, useReactTable, getPaginationRowModel, getFilteredRowModel} from '@tanstack/react-table'
import {defaultData} from '../utils/defaultData'
import { useState } from 'react'
import classNames from 'classnames'
import { rankItem } from '@tanstack/match-sorter-utils'
import { useEffect } from 'react'

const fuzzyFilter = (row, columnId, value, addMeta) => {
    const itemRank = rankItem(row.getValue(columnId), value)

    addMeta({itemRank})

    return itemRank.passed
}

const DebouncedInput = ({value:keyWord, onChange,...props}) => {
    const [value, setValue] = useState(keyWord);
    // console.log(value)

    useEffect(() => {
        const timeout = setTimeout(() => {
            onChange(value);
        }, 500)
        return () => clearTimeout(timeout);
    }, [value])

    return ( 
        <input {...props} value={value} onChange={e => setValue(e.target.value)}/>
    )
}

const DataTable = () => {
    const [data, setData] = useState(defaultData);
    const [globalFilter, setGlobalFilter] = useState('');
    console.log(globalFilter)

    const columns = [
        {
            accessorKey: 'name',
            header: () => <span>Nombre</span>,
            cell: info => <span className='font-bold'>{info.getValue()}</span>
        },
        {
            accessorKey: 'lastname',
            header: () => <span>Apellido</span>
        },
        {
            accessorKey: 'age',
            header: () => <span>Edad</span>
        },
        {
            accessorKey: 'status',
            header: () => <span>Estado</span>,
            cell: info => {
                return (
                    <span className={classNames({
                        'text-white px-2 rounded-full font-semibold' : true ,
                        'bg-red-500': 'Inactivo' === info.getValue(),
                        'bg-green-500': 'Activo' === info.getValue(),
                    })}>
                        {info.getValue()}
                    </span>
                )
            }
        },
    ]

    const getStateTable = () => {
        const totalRows = table.getFilteredRowModel().rows.length;
        const pageSize = table.getState().pagination.pageSize;
        const pageIndex = table.getState().pagination.pageIndex;
        const rowsPerPage = table.getRowModel().rows.length;


        const firtsIndex = (pageIndex * pageSize) + 1;
        const lastIndex = (pageIndex * pageSize) + rowsPerPage;

        return {
            totalRows,
            firtsIndex,
            lastIndex
        }
    }

    const table = useReactTable({
        data,
        columns,
        state: {
            globalFilter
        },
        initialState: {
            pagination: {
                pageSize: 5
            }
        },
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        globalFilterFn: fuzzyFilter
    });

    return (
        <div className='px-6 py-4'>
            <div className='my-2 text-right'>
                <DebouncedInput
                type="text" 
                value={globalFilter ?? ''}
                onChange={value => setGlobalFilter(String(value))}
                className='p-2 text-gray-600 border border-gray-300 rounded outline-indigo-700'
                placeholder='Buscar...'
                />
            </div>
            <table className='table-auto w-full'>
                <thead>
                    {table.getHeaderGroups().map(headerGroup => (
                        <tr key={headerGroup.id} className='border-b border-b-gray-300 text-gray-600 bg-gray-100'>
                            {headerGroup.headers.map(header => (
                                <th key={header.id} className='py-2 px-4 text-left uppercase'>
                                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())} 
                                </th>
                            ))}
                        </tr>
                    ))}
                </thead>
                <tbody>
                    {table.getRowModel().rows.map(row => (
                        <tr key={row.id} className='text-gray-600 hover:bg-slate-100'>
                            {row.getVisibleCells().map(cell => (
                                <td key={cell.id} className='py-2 px-4'>
                                    {flexRender(cell.column.columnDef.cell, cell.getContext())} 
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className='mt-4 flex items-center justify-between'>
                <div className='flex items-center gap-2'>
                    <button 
                    className='text-gray-600 bg-gray-200 py-0.5 px-1 rounded border border-gray-300 disabled:hover:bg-white disabled:hover:text-gray-300'
                    onClick={() => table.setPageIndex(0)}
                    disabled={!table.getCanPreviousPage()}
                    >
                        {'<<'}
                    </button>
                    <button 
                    className='text-gray-600 bg-gray-200 py-0.5 px-1 rounded border border-gray-300 disabled:hover:bg-white disabled:hover:text-gray-300'
                    onClick={() => table.previousPage()}
                    disabled={!table.getCanPreviousPage()}
                    >
                        {'<'}
                    </button>

                    {table.getPageOptions().map((value, key) => {
                        return(
                            <button key={key} 
                            className={classNames({
                                'text-gray-600 bg-gray-200 font-bold py-0.5 px-2 rounded border border-gray-300 disabled:hover:bg-white disabled:hover:text-gray-300': true,
                                'bg-indigo-200 text-indigo-700': value === table.getState().pagination.pageIndex
                            })}
                            onClick={() => table.setPageIndex(value)}
                            >
                                {value + 1}
                            </button>
                        );
                    })}

                    <button 
                    className='text-gray-600 bg-gray-200 py-0.5 px-1 rounded border border-gray-300 disabled:hover:bg-white disabled:hover:text-gray-300'
                    onClick={() => table.nextPage()}
                    disabled={!table.getCanNextPage()}
                    >
                        {'>'}
                    </button>
                    <button className='text-gray-600 bg-gray-200 py-0.5 px-1 rounded border border-gray-300 disabled:hover:bg-white disabled:hover:text-gray-300'
                    onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                    disabled={!table.getCanNextPage()}
                    >
                        {'>>'}
                    </button>
                </div>
                <div className='text-gray-600 font-semibold'>
                    Mostrando de {getStateTable().firtsIndex}&nbsp; a {getStateTable().lastIndex}&nbsp; del total de {getStateTable().totalRows} registros
                </div>
                <select 
                className='text-gray-600 border border-gray-300 rounded outline-indigo-700'
                onChange={e => {
                    table.setPageSize(Number(e.target.value))
                }}
                >
                    <option value="5">5 pag.</option>
                    <option value="10">10 pag.</option>
                    <option value="20">20 pag.</option>
                    <option value="30">30 pag.</option>
                    <option value="50">50 pag.</option>
                </select>
            </div>
        </div>
    );
}

export default DataTable