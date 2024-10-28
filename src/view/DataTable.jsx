import React from 'react'
import { flexRender, getCoreRowModel, useReactTable, getPaginationRowModel} from '@tanstack/react-table'
import {defaultData} from '../utils/defaultData'
import { useState } from 'react'
import classNames from 'classnames'

const DataTable = () => {
    const [data, setData] = useState(defaultData);

    const columns = [
        {
            accessorKey: 'name',
        },
        {
            accessorKey: 'lastname',
        },
        {
            accessorKey: 'age',
        },
        {
            accessorKey: 'status',
        },
    ]

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
    });

    return (
        <div className='px-6 py-4'>
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
                    Mostrando de 1 a 10 del total de 26 registros

                </div>
            </div>
        </div>
    );
}

export default DataTable