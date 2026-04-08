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
    setLoading(true); // 👈 ensure loading starts properly

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

    setLoading(false); // 👈 move outside finally (safer)
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white w-full max-w-sm p-7 rounded-xl shadow-lg relative min-h-[420px]">
        {/* CLOSE */}
        <button
          onClick={() => navigate(-1)}
          className="absolute top-3 right-3 text-gray-500 text-lg"
        >
          ✕
        </button>

        {/* TITLE */}
        <h2 className="text-xl font-semibold text-center mb-6">
          Patient Review
        </h2>

        {loading ? (
          <p className="text-center mt-10">Loading...</p>
        ) : !review ? (
          <p className="text-center mt-10 text-gray-500">
            No review or rating given for this appointment
          </p>
        ) : (
          <>
            {/* ⭐ STARS (READ ONLY) */}
            <div className="flex justify-center gap-3 mb-6">
              {[1, 2, 3, 4, 5].map((star) => {
                const isActive = review.rating >= star;

                return (
                  <span
                    key={star}
                    className={`text-4xl ${
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

            {/* COMMENT */}
            <textarea
              value={review.review_text}
              readOnly
              className="w-full border rounded-lg p-3 resize-none bg-gray-100 focus:outline-none"
              rows={8}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default ViewReview;
