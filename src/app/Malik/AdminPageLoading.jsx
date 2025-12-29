import React from 'react'
import { SkeletonCard, SkeletonChart,SkeletonTable } from '../skeleton/Skeleton'

const AdminPageLoading = ({activeTab}) => {
  return (
            <>
              {activeTab === "overview" && (
                <div className="space-y-8">
                  {/* Skeleton Stats Cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                    {[...Array(4)].map((_, i) => (
                      <SkeletonCard key={i} />
                    ))}
                  </div>
                  {/* Skeleton Charts */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
                    <SkeletonChart />
                    <SkeletonChart />
                  </div>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
                    <SkeletonChart />
                    <SkeletonChart />
                  </div>
                </div>
              )}

              {(
                activeTab === "participants" || activeTab === "tournaments") && (
                <div className="space-y-6">
                  <div className="h-8 bg-gray-700 rounded w-48 animate-pulse"></div>
                  <SkeletonTable />
                </div>
              )}

              {activeTab === "revenue" && (
                <div className="space-y-6">
                  <div className="h-8 bg-gray-700 rounded w-48 animate-pulse"></div>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
                    <SkeletonChart />
                    <SkeletonChart />
                  </div>
                </div>
              )}

              {activeTab === "reports" && (
                <div className="space-y-6">
                  <div className="h-8 bg-gray-700 rounded w-48 animate-pulse"></div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
                    {[...Array(4)].map((_, i) => (
                      <div
                        key={i}
                        className="bg-gray-800 p-4 md:p-6 rounded-xl border border-gray-700 shadow-lg animate-pulse"
                      >
                        <div className="h-5 bg-gray-700 rounded w-32 mb-2"></div>
                        <div className="h-4 bg-gray-700 rounded w-full mb-4"></div>
                        <div className="h-4 bg-gray-700 rounded w-24"></div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === "settings" && (
                <div className="space-y-6">
                  <div className="h-8 bg-gray-700 rounded w-48 animate-pulse"></div>
                  <div className="bg-gray-800 p-4 md:p-6 rounded-xl border border-gray-700 shadow-lg animate-pulse">
                    <div className="space-y-4">
                      <div className="h-6 bg-gray-700 rounded w-40 mb-4"></div>
                      <div className="h-10 bg-gray-700 rounded mb-4"></div>
                      <div className="h-10 bg-gray-700 rounded"></div>
                    </div>
                  </div>
                </div>
              )}
            </>
          ) 
}

export default AdminPageLoading
