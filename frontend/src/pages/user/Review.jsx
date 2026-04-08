import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { addReview } from "../../services/reviewService";

const Review = () => {
  const navigate = useNavigate();
  const { state } = useLocation();

  const appointment = state?.appointment || null;
  
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);

  if (!appointment) {
    return <div className="text-center mt-20">Invalid review request</div>;
  }

  const handleSubmit = async () => {
    if (loading) return;

    if (rating === 0) {
      alert("Please give rating");
      return;
    }

    if (!comment.trim()) {
      alert("Please write review");
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

      alert("Review submitted successfully");

      navigate(-1); // close modal
    } catch (err) {
      console.log(err);

      if (err.response?.data) {
        const msg =
          typeof err.response.data === "string"
            ? err.response.data
            : Object.values(err.response.data).join(", ");
        alert(msg);
      } else {
        alert("Failed to submit review");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white w-full max-w-sm p-7 rounded-xl shadow-lg relative min-h-[480px]">
        {/* close */}
        <button
          onClick={() => navigate(-1)}
          className="absolute top-3 right-3 text-gray-500 text-lg"
        >
          ✕
        </button>

        {/* title */}
        <h2 className="text-xl font-semibold text-center mb-4">
          Give Rating for this Appointment
        </h2>

        {/* stars */}
        <div className="flex justify-center gap-3 mb-6">
          {[1, 2, 3, 4, 5].map((star) => {
            const isActive = (hover || rating) >= star;

            return (
              <span
                key={star}
                onClick={() => setRating(star)}
                onMouseEnter={() => setHover(star)}
                onMouseLeave={() => setHover(0)}
                className={`text-4xl cursor-pointer transition ${
                  isActive ? "text-yellow-400" : "text-transparent"
                }`}
                style={{
                  WebkitTextStroke: isActive ? "0px" : "2px #d1d5db", // gray border
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
          className="w-full border rounded-lg p-3 mb-6 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows={10}
        />

        {/* button */}
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full py-3 bg-blue-600 text-white rounded-lg font-medium disabled:opacity-50"
        >
          {loading ? "Submitting..." : "Submit Review"}
        </button>
      </div>
    </div>
  );
};

export default Review;
