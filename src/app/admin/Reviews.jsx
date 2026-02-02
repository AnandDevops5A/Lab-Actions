"use client";
import React, { useState, useContext, useMemo, useEffect } from "react";
import { ThemeContext } from "../../lib/contexts/theme-context";
import dynamic from "next/dynamic";
import { Star, Trash2, ThumbsUp, Search, Save } from "lucide-react";
import { confirmMessage, successMessage, errorMessage } from "../../lib/utils/alert";
import CyberLoading from "../skeleton/CyberLoading";
import { FetchBackendAPI } from "../../lib/api/backend-api";

const Table = dynamic(() => import('./Table'), {
  loading: () => <CyberLoading/>,
  ssr: false,
});

const Reviews = () => {
  const { isDarkMode } = useContext(ThemeContext);
  const [searchTerm, setSearchTerm] = useState("");
  const [ratingFilter, setRatingFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [reviews, setReviews] = useState([]);
  
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await FetchBackendAPI("review/all");
        if (response && response.data) {
          const formatted = response.data.map((r) => ({
            ...r,
            id: r.reviewId || r._id || r.id,
            user: r.reviewerName || r.user || "Anonymous",
            date: r.createdAt ? new Date(r.createdAt).toLocaleDateString() : "N/A",
            likes: r.likes || 0,
            rating: r.rating || 0,
            comment: r.comment || "",
            adminReply: r.adminReply || "",
            savedAdminReply: r.adminReply || "", // Track saved state
          }));
          setReviews(formatted);
        }
      } catch (error) {
        console.error("Failed to fetch reviews", error);
      } finally {
        setLoading(false);
      }
    };
    fetchReviews();
  }, []);

  const handleDelete = async (id) => {
    const confirmed = await confirmMessage("Are you sure you want to delete this review?", "Delete Review");
    if (confirmed) {
      try {
        const response = await fetch(`http://localhost:8082/review/delete/${id}`, { method: "DELETE" });
        if (response.ok) {
          setReviews(prev => prev.filter(r => r.id !== id));
          successMessage("Review deleted successfully");
        } else {
          errorMessage("Failed to delete review");
        }
      } catch (error) {
        errorMessage("An error occurred while deleting");
      }
    }
  };

  const handleSaveReply = async (row) => {
    try {
      const response = await fetch("http://localhost:8082/review/reply", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reviewId: row.id, adminReply: row.adminReply }),
      });

      if (response.ok) {
        setReviews(prev => prev.map(r => r.id === row.id ? { ...r, savedAdminReply: row.adminReply } : r));
        successMessage("Reply saved successfully");
      } else {
        errorMessage("Failed to save reply");
      }
    } catch (error) {
      errorMessage("An error occurred while saving");
    }
  };

  const filteredReviews = useMemo(() => {
    return reviews.filter(r => {
      const matchesSearch = r.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.comment.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesRating = ratingFilter === "all" || r.rating === parseInt(ratingFilter);
      return matchesSearch && matchesRating;
    });
  }, [reviews, searchTerm, ratingFilter]);

  const columns = [
    {
      header: "User",
      sortKey: "user",
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${isDarkMode ? 'bg-gray-800 text-purple-400' : 'bg-gray-200 text-purple-600'}`}>
            {row.user.charAt(0).toUpperCase()}
          </div>
          <span className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{row.user}</span>
        </div>
      )
    },
    {
      header: "Rating",
      sortKey: "rating",
      render: (row) => (
        <div className="flex items-center gap-1">
          {[...Array(5)].map((_, i) => (
            <Star 
              key={i} 
              size={14} 
              className={i < row.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-600"} 
            />
          ))}
        </div>
      )
    },
    {
      header: "Comment",
      sortKey: "comment",
      render: (row) => (
        <div className={`max-w-xs truncate ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`} title={row.comment}>
          {row.comment}
        </div>
      )
    },
    {
      header: "Admin Reply",
      render: (row) => (
        <div className="flex items-center gap-2">
          <input
              type="text"
              value={row.adminReply || ""}
              onChange={(e) => {
                  const newReply = e.target.value;
                  setReviews(prev => prev.map(r => r.id === row.id ? { ...r, adminReply: newReply } : r));
              }}
              placeholder="Type to reply..."
              className={`w-full min-w-[150px] bg-transparent border-b ${isDarkMode ? 'border-gray-700 focus:border-purple-500 text-purple-300 placeholder-gray-600' : 'border-gray-300 focus:border-purple-500 text-purple-700 placeholder-gray-400'} outline-none text-sm py-1 transition-colors`}
          />
          {row.adminReply !== row.savedAdminReply && (
            <button
              onClick={() => handleSaveReply(row)}
              className={`p-1.5 rounded-full transition-all ${isDarkMode ? 'bg-green-500/20 text-green-400 hover:bg-green-500/30' : 'bg-green-100 text-green-600 hover:bg-green-200'}`}
              title="Save Reply"
            >
              <Save size={14} />
            </button>
          )}
        </div>
      )
    },
    {
      header: "Date",
      sortKey: "date",
      render: (row) => <span className={`text-sm ${isDarkMode ? 'text-gray-500' : 'text-gray-500'}`}>{row.date}</span>
    },
    {
      header: "Likes",
      sortKey: "likes",
      render: (row) => (
        <div className={`flex items-center gap-1 text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          <ThumbsUp size={14} className="text-blue-400" />
          {row.likes}
        </div>
      )
    },
    {
      header: "Actions",
      render: (row) => (
        <button 
          onClick={() => handleDelete(row.id)}
          className="p-2 hover:bg-red-500/10 rounded-lg text-red-500 transition-colors"
          title="Delete Review"
        >
          <Trash2 size={16} />
        </button>
      )
    }
  ];

  if (loading) {
    return <CyberLoading />;
  }

  return (
    <Table
      title="Review_Control"
      subtitle="// FEEDBACK_ANALYSIS"
      themeColor="purple"
      itemsPerPage={5}
      columns={columns}
      data={filteredReviews}
      actions={
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative">
            <select
              value={ratingFilter}
              onChange={(e) => setRatingFilter(e.target.value)}
              className={`w-full sm:w-32 px-3 py-2 rounded-lg text-sm outline-none focus:ring-2 transition-all appearance-none cursor-pointer
              ${
                isDarkMode
                  ? "bg-gray-900 text-purple-100 border border-gray-700 focus:border-purple-500 focus:ring-purple-500/20"
                  : "bg-white text-gray-900 border border-gray-300 focus:border-purple-500 focus:ring-purple-500/20"
              }`}
            >
              <option value="all">All Stars</option>
              <option value="5">5 Stars</option>
              <option value="4">4 Stars</option>
              <option value="3">3 Stars</option>
              <option value="2">2 Stars</option>
              <option value="1">1 Star</option>
            </select>
            <div className={`absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none text-xs ${isDarkMode ? 'text-purple-400' : 'text-gray-500'}`}>
              ▼
            </div>
          </div>

          <div className="relative group">
              <div
                className={`absolute -inset-0.5 bg-linear-to-r from-purple-500 to-pink-600 rounded-lg blur opacity-30 group-hover:opacity-75 transition duration-200 ${
                  !isDarkMode && "hidden"
                }`}
              ></div>
            <div className="relative flex items-center">
              <Search className={`absolute left-3 w-4 h-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`} />
              <input
                  type="text"
                  placeholder="SEARCH_REVIEWS..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={`relative w-full sm:w-64 pl-9 pr-4 py-2 rounded-lg text-sm outline-none focus:ring-2 transition-all
                  ${
                    isDarkMode
                      ? "bg-gray-900 text-purple-100 border border-gray-700 focus:border-purple-500 focus:ring-purple-500/20 placeholder-gray-600"
                      : "bg-white text-gray-900 border border-gray-300 focus:border-purple-500 focus:ring-purple-500/20"
                  }`}
              />
            </div>
          </div>
        </div>
      }
    />
  );
};

export default Reviews;