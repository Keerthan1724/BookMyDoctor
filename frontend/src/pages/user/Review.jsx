import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { addReview } from "../../services/reviewService";
import { toast } from "../../components/CustomToast";

const Review = () => {
  const navigate = useNavigate();
  const { state } = useLocation();

  const appointment = state?.appointment || null;

  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);

  if (!appointment) {
    return (
      <div className="text-center mt-20 text-gray-600 dark:text-gray-300">
        Invalid review request
      </div>
    );
  }

  const handleSubmit = async () => {
    if (loading) return;

    if (rating === 0) {
      toast("Please give rating", "warning");
      return;
    }

    if (!comment.trim()) {
      toast("Please write review", "warning");
      return;
    }

    try {
      setLoading(true);

      const payload = {
        appointment: appointment.id,
        rating,
        review_text: comment,
      };

      await addReview(payload);

      toast("Review submitted successfully", "success");

      navigate(-1);
    } catch (err) {
      console.log(err);

      if (err.response?.data) {
        const msg =
          typeof err.response.data === "string"
            ? err.response.data
            : Object.values(err.response.data).join(", ");

        toast(msg, "error");
      } else {
        toast("Failed to submit review", "error");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 dark:bg-black/60 backdrop-blur-sm px-3">

      <div className="relative w-full max-w-sm sm:max-w-md bg-white dark:bg-slate-900 p-5 sm:p-7 rounded-xl shadow-lg border border-gray-200 dark:border-slate-800 min-h-[420px] sm:min-h-[480px]">

        {/* close */}
        <button
          onClick={() => navigate(-1)}
          className="absolute top-3 right-3 text-gray-500 dark:text-gray-400 text-lg"
        >
          ✕
        </button>

        {/* title */}
        <h2 className="text-lg sm:text-xl font-semibold text-center mb-4 text-gray-800 dark:text-gray-100">
          Give Rating for this Appointment
        </h2>

        {/* stars */}
        <div className="flex justify-center gap-2 sm:gap-3 mb-6">

          {[1, 2, 3, 4, 5].map((star) => {
            const isActive = (hover || rating) >= star;

            return (
              <span
                key={star}
                onClick={() => setRating(star)}
                onMouseEnter={() => setHover(star)}
                onMouseLeave={() => setHover(0)}
                className={`text-3xl sm:text-4xl cursor-pointer transition ${
                  isActive ? "text-yellow-400" : "text-transparent"
                }`}
                style={{
                  WebkitTextStroke: isActive ? "0px" : "2px #d1d5db",
                }}
              >
                ★
              </span>
            );
          })}

        </div>

        {/* textarea */}
        <textarea
          placeholder="Write your review..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="w-full border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-800 dark:text-gray-100 rounded-lg p-3 mb-6 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows={6}
        />

        {/* button */}
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium disabled:opacity-50 transition"
        >
          {loading ? "Submitting..." : "Submit Review"}
        </button>

      </div>
    </div>
  );
};

export default Review;