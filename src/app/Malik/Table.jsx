"use client";
import React, { useContext, useState, useMemo } from "react";
import { ThemeContext } from "../Library/ThemeContext";
import { ChevronUp, ChevronDown, ArrowUpDown } from "lucide-react";

const Table = ({
  title,
  subtitle,
  columns,
  data,
  actions,
  pagination = true,
  themeColor = "green", // "green" or "cyan"
  containerClassName = "",
}) => {
  const { isDarkMode } = useContext(ThemeContext);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });

  const sortedData = useMemo(() => {
    if (!data) return [];
    if (!sortConfig.key) return data;

    return [...data].sort((a, b) => {
      const aVal = a[sortConfig.key];
      const bVal = b[sortConfig.key];

      if (aVal === bVal) return 0;
      if (aVal === null || aVal === undefined) return 1;
      if (bVal === null || bVal === undefined) return -1;

      const comparison = aVal < bVal ? -1 : 1;
      return sortConfig.direction === "asc" ? comparison : -comparison;
    });
  }, [data, sortConfig]);

  const handleSort = (key) => {
    if (!key) return;
    setSortConfig((current) => ({
      key,
      direction:
        current.key === key && current.direction === "asc" ? "desc" : "asc",
    }));
  };

  const colorMap = {
    cyan: {
      border: "border-cyan-500/30",
      shadow: "shadow-[0_0_20px_rgba(6,182,212,0.15)]",
      headerText: "text-cyan-400",
      rowHover: "hover:bg-cyan-950/30",
      titleGradient: "from-cyan-400 to-purple-500",
      dropShadow: "drop-shadow-[0_0_5px_rgba(6,182,212,0.5)]",
      subtitle: "text-cyan-600",
      paginationHover: "hover:text-cyan-400",
    },
    green: {
      border: "border-green-500/30",
      shadow: "shadow-[0_0_20px_rgba(34,197,94,0.15)]",
      headerText: "text-green-400",
      rowHover: "hover:bg-green-950/30",
      titleGradient: "from-green-400 to-purple-500",
      dropShadow: "drop-shadow-[0_0_5px_rgba(34,197,94,0.5)]",
      subtitle: "text-green-600",
      paginationHover: "hover:text-green-400",
    },
  };

  const theme = colorMap[themeColor] || colorMap.green;

  const containerClass = isDarkMode
    ? `bg-gray-900/80 border ${theme.border} ${theme.shadow}`
    : "bg-white border border-gray-200 shadow-lg";

  const headerClass = isDarkMode
    ? `${theme.headerText} border-b ${theme.border} bg-gray-900/50`
    : "text-gray-600 border-b border-gray-200 bg-gray-50";

  const rowClass = isDarkMode
    ? `border-b border-gray-800 ${theme.rowHover} transition-colors duration-300`
    : "border-b border-gray-100 hover:bg-gray-50 transition-colors duration-300";

  const textClass = isDarkMode ? "text-gray-300" : "text-gray-700";

  return (
    <div className="space-y-6 font-mono">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4">
        <div>
          <h2
            className={`text-2xl md:text-3xl font-black uppercase tracking-tighter ${
              isDarkMode
                ? `text-transparent bg-clip-text bg-linear-to-r ${theme.titleGradient} ${theme.dropShadow}`
                : "text-gray-800"
            }`}
          >
            {title}
          </h2>
          <p
            className={`text-xs ${
              isDarkMode ? theme.subtitle : "text-gray-500"
            } mt-1 tracking-widest`}
          >
            {subtitle}
          </p>
        </div>
        {actions}
      </div>

      <div
        className={`rounded-xl overflow-hidden backdrop-blur-sm ${containerClass} flex flex-col ${containerClassName}`}
      >
        <div className="overflow-x-auto flex-1">
          <table className="w-full text-sm">
            <thead className={`${headerClass} sticky top-0 z-10`}>
              <tr>
                {columns.map((col, index) => (
                  <th
                    key={index}
                    className={`px-6 py-4 text-left text-xs font-bold uppercase tracking-wider ${col.className || ""} ${col.sortKey ? "cursor-pointer select-none hover:opacity-80" : ""}`}
                    onClick={() => handleSort(col.sortKey)}
                  >
                    <div className="flex items-center gap-2">
                      {col.header}
                      {col.sortKey && (
                        <span className="inline-block">
                          {sortConfig.key === col.sortKey ? (
                            sortConfig.direction === "asc" ? (
                              <ChevronUp size={14} />
                            ) : (
                              <ChevronDown size={14} />
                            )
                          ) : (
                            <ArrowUpDown size={14} className="opacity-30" />
                          )}
                        </span>
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {sortedData && sortedData.length > 0 ? (
                sortedData.map((row, rowIndex) => (
                  <tr key={row.id || rowIndex} className={rowClass}>
                    {columns.map((col, colIndex) => (
                      <td
                        key={`${rowIndex}-${colIndex}`}
                        className={`px-6 py-4 ${textClass} ${
                          col.className || ""
                        }`}
                      >
                        {col.render
                          ? col.render(row, rowIndex)
                          : row[col.key]}
                      </td>
                    ))}
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={columns.length}
                    className="px-6 py-8 text-center text-gray-500 font-mono"
                  >
                    // NO_DATA_FOUND
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        {pagination && (
          <div
            className={`px-6 py-4 border-t flex items-center justify-between text-xs ${
              isDarkMode
                ? "border-gray-800 text-gray-500"
                : "border-gray-200 text-gray-500"
            }`}
          >
            <span>SHOWING {data ? data.length : 0} RECORDS</span>
            <div className="flex gap-2">
              <button
                className={`${theme.paginationHover} transition-colors`}
              >
                &lt; PREV
              </button>
              <button
                className={`${theme.paginationHover} transition-colors`}
              >
                NEXT &gt;
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Table;