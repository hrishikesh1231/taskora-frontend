import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "./VisitProfile.css";
import { Link } from "react-router-dom";

const VisitProfile = () => {
  const { userId } = useParams();
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      const res = await axios.get(
        `https://taskora-backend-aejx.onrender.com/users/${userId}/profile`
      );
      setProfile(res.data);
    };

    fetchProfile();
  }, [userId]);

  if (!profile) return <div className="profile-loading">Loading...</div>;

  const renderStars = (rating) => {
    return "★".repeat(rating) + "☆".repeat(5 - rating);
  };

  return (
    <div className="profile-page">
      {/* HEADER CARD */}
      <div className="profile-card">
        <div className="profile-avatar">
          {profile.user.username?.charAt(0).toUpperCase()}
        </div>

        <div className="profile-info">
          <h2>{profile.user.username}</h2>

          <div className="profile-rating">
            <span className="big-rating">
              ⭐ {profile.avgRating} / 5
            </span>
            <span className="review-count">
              ({profile.totalReviews} Reviews)
            </span>
          </div>
        </div>
      </div>

      {/* REVIEWS SECTION */}
      <div className="reviews-section">
        <h3>Reviews</h3>

        {profile.reviews.length === 0 ? (
          <p>No reviews yet.</p>
        ) : (
            profile.reviews.map((review) => (
            <div key={review._id} className="review-card">
                <div className="review-header">

                {review.reviewer?._id ? (
                    <Link
                    to={`/profile/${review.reviewer._id}`}
                    className="reviewer-link"
                    >
                    {review.reviewer.username}
                    </Link>
                ) : (
                    <strong>Unknown User</strong>
                )}

                <span className="stars">
                    {renderStars(review.rating)}
                </span>
                </div>

                <p className="review-comment">{review.comment}</p>
            </div>
            ))
        )}
      </div>
    </div>
  );
};

export default VisitProfile;