import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getReviews } from "../../services/reviewService";

const ViewReview = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [review, setReview] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log("ID:", id);
    if (id) {
      fetchReview();
    }
  }, [id]);

  const fetchReview = async () => {
    setLoading(true);

    try {
      const res = await getReviews();

      const appointmentId = Number(id);

      const found = res.data.find((rev) => {
        if (typeof rev.appointment === "object") {
          return rev.appointment.id === appointmentId;
        }
        return rev.appointment === appointmentId;
      });

      setReview(found || null);
    } catch (err) {
      console.log("ERROR:", err);
      setReview(null);
    }

    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-3">
      
      {/* CARD */}
      <div className="surface-card w-full max-w-sm sm:max-w-md p-5 sm:p-6 md:p-7 rounded-xl shadow-lg relative min-h-[360px] sm:min-h-[420px]">
        
        {/* CLOSE */}
        <button
          onClick={() => navigate(-1)}
          className="absolute top-3 right-3 text-slate-500 dark:text-slate-300 text-lg hover:opacity-70"
        >
          ✕
        </button>

        {/* TITLE */}
        <h2 className="text-lg sm:text-xl font-semibold text-center mb-5 sm:mb-6">
          Patient Review
        </h2>

        {loading ? (
          <p className="text-center mt-8 sm:mt-10 theme-text-muted">
            Loading...
          </p>
        ) : !review ? (
          <p className="text-center mt-8 sm:mt-10 theme-text-muted text-sm sm:text-base">
            No review or rating given for this appointment
          </p>
        ) : (
          <>
            {/* ⭐ STARS */}
            <div className="flex justify-center gap-2 sm:gap-3 mb-5 sm:mb-6">
              {[1, 2, 3, 4, 5].map((star) => {
                const isActive = review.rating >= star;

                return (
                  <span
                    key={star}
                    className={`text-3xl sm:text-4xl ${
                      isActive
                        ? "text-yellow-400"
                        : "text-transparent"
                    }`}
                    style={{
                      WebkitTextStroke: isActive
                        ? "0px"
                        : "2px #94a3b8", // better for dark theme
                    }}
                  >
                    ★
                  </span>
                );
              })}
            </div>

            {/* COMMENT */}
            <textarea
              value={review.review_text}
              readOnly
              rows={6}
              className="w-full border theme-border rounded-lg p-3 text-sm sm:text-base resize-none bg-slate-50 dark:bg-slate-800 focus:outline-none"
            />
          </>
        )}
      </div>
    </div>
  );
};

export default ViewReview;