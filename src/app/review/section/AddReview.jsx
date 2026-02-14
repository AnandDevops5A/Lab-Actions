import React, { useContext, useEffect, useState, useTransition } from "react";
import { ArrowRight, LoaderCircle } from "lucide-react";
import { StarRating } from "../StarRating";
import { askLogin, errorMessage, successMessage } from "@/lib/utils/alert";
import { useRouter } from "next/navigation";
import { UserContext } from "@/lib/contexts/user-context";
import { setCache } from "@/lib/utils/client-cache";
import { addNewReview } from "@/lib/api/backend-api";

const AddReview = ({
  setReviews,
  tournaments,
  isDarkMode,
  inputClasses,
}) => {
  const router = useRouter();
  const { user } = useContext(UserContext);
  const [isPending, startTransition] = useTransition();

  const [form, setForm] = useState({
    reviewerName: "",
    tournamentId: "",
    rating: 5,
    comment: "",
    tags: "",
  });

  useEffect(() => {
    if (user?.username) {
      setForm((prev) => ({
        ...prev,
        reviewerName: prev.reviewerName || user.username,
      }));
    }
  }, [user]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!user) {
      askLogin(router);
      return;
    }
    if (!form.reviewerName.trim() || !form.comment.trim() || !form.tournamentId) return;
    
    const tags =
      form.tags
        .split(/[,\.\s]+/) // split on comma, period, or whitespace
        .map((t) => t.trim())
        .filter(Boolean) || [];

    const newReview = {
      reviewId: `r-${Date.now()}`,
      reviewerName: form.reviewerName.trim(),
      tournamentId: form.tournamentId,
      rating: form.rating,
      comment: form.comment.trim(),
      tags,
      createdAt: new Date().toISOString(),
    };

    startTransition(async () => {
      try {
        const resp = await addNewReview(newReview);
        if (resp.ok) {
          successMessage("Review added successfully");
          
          // Optimistic update
          setReviews((prev) => [newReview, ...prev]);
          
          // Invalidate cache so next load gets fresh data
          await setCache("reviews", reviews);

          setForm({
            reviewerName: user?.username || "",
            tournamentId: "",
            rating: 5,
            comment: "",
            tags: "",
          });
        } else {
          errorMessage("Something went wrong");
        }
      } catch (error) {
        errorMessage("Failed to submit review");
      }
    });
  };

  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 p-7 ">
      <div
        className={`overflow-hidden rounded-2xl border border-white/10 ${
          isDarkMode
            ? "bg-linear-to-br from-black/60 to-gray-900/60"
            : "bg-linear-to-br from-gray-100/30 to-gray-200/50"
        } p-6 sm:p-10`}
      >
        <div className="absolute inset-px rounded-2xl ring-1 ring-white/10 pointer-events-none" />
        <div className="grid gap-8 lg:grid-cols-2">
          <div>
            <h3 className="text-2xl font-bold">Drop a review</h3>
            <p className="mt-2 text-gray-300">
              Share your experience to help players decide. Keep it honest,
              specific, and respectful.
            </p>
            <ul className="mt-4 space-y-2 text-sm text-gray-300">
              <li className="flex items-start gap-2">
                <span className="inline-block h-1.5 w-1.5 mt-1 rounded-full bg-cyan-400" />
                <span>
                  <strong className="text-cyan-300">Details:</strong> Mention
                  production, schedules, staff, and fairness.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="inline-block h-1.5 w-1.5 mt-1 rounded-full bg-red-400" />
                <span>
                  <strong className="text-red-300">Tone:</strong> Be
                  constructive. No personal attacks.
                </span>
              </li>
            </ul>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-gray-400">Display Name</label>
                <input
                  type="text"
                  value={form.reviewerName}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, reviewerName: e.target.value }))
                  }
                  placeholder="Your display name"
                  className={`${inputClasses}`}
                  disabled={isPending}
                  required
                />
              </div>
              <div>
                <label className="text-xs text-gray-400">Tournament</label>
                <select
                  value={form.tournamentId}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, tournamentId: e.target.value }))
                  }
                  className={`${inputClasses}`}
                  disabled={isPending}
                  required
                >
                  <option value="">Select a tournament</option>
                  {tournaments?.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.tournamentName}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="text-xs text-gray-400">Rating</label>
              <div className="mt-1">
                <StarRating
                  value={form.rating}
                  onChange={(n) => setForm((f) => ({ ...f, rating: n }))}
                  size="lg"
                  label="Select rating"
                  readOnly={isPending}
                />
              </div>
            </div>

            <div>
              <label className="text-xs text-gray-400">Comment</label>
              <textarea
                value={form.comment}
                onChange={(e) =>
                  setForm((f) => ({ ...f, comment: e.target.value }))
                }
                placeholder="What stood out? Be specific."
                rows={4}
                className={`${inputClasses}`}
                disabled={isPending}
                required
              />
            </div>

            <div>
              <label className="text-xs text-gray-400">
                Tags (comma separated)
              </label>
              <input
                type="text"
                value={form.tags}
                onChange={(e) =>
                  setForm((f) => ({ ...f, tags: e.target.value }))
                }
                disabled={isPending}
                placeholder="Logistics, Production, Bracket"
                className={`${inputClasses}`}
              />
            </div>

            <div className="flex items-center justify-between pt-2">
              <div className="text-xs text-gray-400">
                By submitting, you agree to community guidelines.
              </div>
              <button
                type="submit"
                disabled={isPending}
                className="inline-flex items-center gap-2 rounded-lg border border-cyan-500/40 bg-cyan-500/10 px-4 py-2 text-sm font-semibold text-cyan-300 hover:bg-cyan-500/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isPending ? (
                  //spinner
                  <>
                 <LoaderCircle className="h-4 w-4 animate-spin"/>
                  <span className="">Publishing...</span></>
                ) : (
                  <>
                    <ArrowRight className="h-4 w-4" strokeWidth={1.6} />
                    Publish review
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default AddReview;
