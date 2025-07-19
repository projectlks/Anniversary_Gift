import React from 'react'

export default function Loading() {
    return (
        <div className="fixed inset-0 h-screen flex items-center justify-center bg-[#00000050]  z-50">
            <div className="animate-spin rounded-full  h-16 w-16  border-b-2 border-t-gray-100 border-b-pink-500"></div>
        </div>)
}
