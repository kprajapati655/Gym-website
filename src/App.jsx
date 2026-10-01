import { useEffect, useState } from "react";
import { gymConfig } from "./config/gymConfig";
import "./App.css";


function App() {
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewName, setReviewName] = useState("");
  const [reviewText, setReviewText] = useState("");
  const [reviewRating, setReviewRating] = useState(5);

  const [reviews, setReviews] = useState([
    {
      name: "Member",
      initials: "RK",
      rating: 5,
      text: "Great equipment, clean environment and a motivating atmosphere. It feels like a premium place to train."
    },
    {
      name: "Member",
      initials: "AS",
      rating: 5,
      text: "The overall experience is excellent. The gym has everything needed for focused and consistent training."
    },
    {
      name: "Member",
      initials: "MP",
      rating: 5,
      text: "A modern training space with a strong atmosphere and quality facilities. Very comfortable for daily workouts."
    }
  ]);

  useEffect(() => {
    const loadReviews = async () => {
      try {
        const [{ collection, getDocs, orderBy, query }, { db }] = await Promise.all([
          import("firebase/firestore"),
          import("./firebase")
        ]);

        const reviewsQuery = query(
          collection(db, "reviews"),
          orderBy("createdAt", "desc")
        );

        const snapshot = await getDocs(reviewsQuery);
        const onlineReviews = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data()
        }));

        setReviews((current) =>
          onlineReviews.length ? onlineReviews : current
        );
      } catch (error) {
        console.error("Failed to load reviews:", error);
      }
    };

    loadReviews();
  }, []);

  const getInitials = (name) =>
    name
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((word) => word[0])
      .join("")
      .toUpperCase();

  const wordCount = reviewText.trim()
    ? reviewText.trim().split(/\s+/).length
    : 0;

  const handleReviewSubmit = async (event) => {
    event.preventDefault();

    const cleanName = reviewName.trim();
    const cleanText = reviewText.trim();

    if (!cleanName || !cleanText || wordCount > 200) return;

    const newReview = {
      name: cleanName,
      initials: getInitials(cleanName),
      rating: reviewRating,
      text: cleanText,
      createdAt: new Date()
    };

    try {
      const [{ addDoc, collection }, { db }] = await Promise.all([
        import("firebase/firestore"),
        import("./firebase")
      ]);

      const reviewRef = await addDoc(
        collection(db, "reviews"),
        newReview
      );

      setReviews((current) => [
        {
          id: reviewRef.id,
          ...newReview
        },
        ...current
      ]);

      setReviewName("");
      setReviewText("");
      setReviewRating(5);
      setShowReviewForm(false);
    } catch (error) {
      console.error("Failed to save review:", error);
    }
  };

  return (
    <main className="gym-app">
      <nav className="navbar">
        <div className="brand">
          <div className="logo-placeholder">
            {gymConfig.logo.type === "image" && gymConfig.logo.image ? (
              <img src={gymConfig.logo.image} alt={`${gymConfig.name} logo`} />
            ) : (
              gymConfig.logo.value
            )}
          </div>
          <span>{gymConfig.name}</span>
        </div>

        <div className="nav-links">
          <a href="#about">About</a>
          <a href="#facilities">Facilities</a>
          <a href="#membership">Membership</a>
          <a href="#gallery">Gallery</a>
          <a href="#reviews">Reviews</a>
          <a href="#faq">FAQ</a>
          <a href="#contact">Contact</a>
        </div>

        <a className="nav-button" href="#membership">
          Join Now
        </a>
      </nav>

      <section className="hero">
        <div className="hero-content">
          <p className="eyebrow">PREMIUM FITNESS EXPERIENCE</p>

          <h1>
            Train Hard.
            <br />
            <span>Live Strong.</span>
          </h1>

          <p className="hero-text">
            Discover a premium fitness space designed to help you become
            stronger, healthier and more confident.
          </p>

          <div className="hero-buttons">
            <a className="primary-button" href="#membership">
              Explore Membership
            </a>

            <a className="secondary-button" href="#facilities">
              Explore Gym
            </a>
          </div>
        </div>

        <div className="hero-3d">
          <div className="hero-3d-fallback" />
        </div>
      </section>

      <section className="info-strip">
        <div>
          <strong>Premium Equipment</strong>
          <span>Modern training environment</span>
        </div>

        <div>
          <strong>Flexible Memberships</strong>
          <span>Plans for every goal</span>
        </div>

        <div>
          <strong>Open Daily</strong>
          <span>{gymConfig.timings.weekdays}</span>
        </div>
      </section>

      <section id="about" className="content-section">
        <p className="eyebrow">ABOUT THE GYM</p>
        <h2>More than a gym.</h2>
        <p>
          A premium fitness destination built around quality equipment,
          comfortable spaces and an inspiring training environment.
        </p>
      </section>

      <section id="facilities" className="content-section dark-section">
        <div className="section-heading">
          <p className="eyebrow">FACILITIES</p>
          <h2>Built for serious training.</h2>
          <p>
            Everything you need for strength, conditioning and everyday fitness
            in one premium training environment.
          </p>
        </div>

        <div className="feature-grid facilities-grid">
          <article className="facility-card">
            <span className="facility-number">01</span>
            <div className="facility-icon">◈</div>
            <h3>Cardio Zone</h3>
            <p>
              Modern cardio equipment for warm-ups, endurance and
              high-energy conditioning sessions.
            </p>
          </article>

          <article className="facility-card">
            <span className="facility-number">02</span>
            <div className="facility-icon">◆</div>
            <h3>Strength Zone</h3>
            <p>
              Dedicated strength equipment for progressive resistance
              training and full-body workouts.
            </p>
          </article>

          <article className="facility-card">
            <span className="facility-number">03</span>
            <div className="facility-icon">⬡</div>
            <h3>Free Weights</h3>
            <p>
              A focused free-weight area with dumbbells, barbells and
              essential strength-training equipment.
            </p>
          </article>

          <article className="facility-card">
            <span className="facility-number">04</span>
            <div className="facility-icon">✦</div>
            <h3>Functional Area</h3>
            <p>
              Flexible open space for mobility, conditioning, functional
              movements and dynamic training.
            </p>
          </article>
        </div>
      </section>

      <section id="membership" className="content-section membership-section">
        <div className="section-heading">
          <p className="eyebrow">MEMBERSHIPS</p>
          <h2>Choose your plan.</h2>
          <p>
            Flexible membership options designed for different training
            commitments and fitness goals.
          </p>
        </div>

        <div className="pricing-grid">
          {[
            ["monthly", "MONTHLY", "Flexible month-to-month membership."],
            ["quarterly", "QUARTERLY", "Great value for consistent training."],
            ["halfYearly", "6 MONTHS", "A longer commitment with better value."],
            ["yearly", "YEARLY", "Maximum value for a full year.", true],
          ].map(([key, label, description, featured]) => {
            const plan = gymConfig.membership[key];

            return (
              <article
                key={key}
                className={`price-card ${featured ? "featured" : ""}`}
              >
                {featured && <span className="popular-badge">BEST VALUE</span>}

                <span className="plan-label">{label}</span>

                <h3>
                  ₹{plan.price.toLocaleString("en-IN")}
                </h3>

                <small>{plan.duration}</small>

                <p>{description}</p>

                {plan.discount && (
                  <strong className="discount">{plan.discount}</strong>
                )}

                <a className="plan-button" href="#contact">
                  Enquire Now
                </a>
              </article>
            );
          })}
        </div>
      </section>

      <section id="gallery" className="content-section gallery-section">
        <div className="section-heading">
          <p className="eyebrow">GYM GALLERY</p>
          <h2>Step inside the experience.</h2>
          <p>
            Explore the training environment, equipment and premium spaces
            through a visual tour of the gym.
          </p>
        </div>

        <div className="gallery-grid">
          <div className="gallery-card gallery-large">
            <div className="gallery-placeholder">
              <span>01</span>
              <strong>Main Training Floor</strong>
              <small>Premium training environment</small>
            </div>
          </div>

          <div className="gallery-card">
            <div className="gallery-placeholder">
              <span>02</span>
              <strong>Strength Zone</strong>
              <small>Built for focused training</small>
            </div>
          </div>

          <div className="gallery-card">
            <div className="gallery-placeholder">
              <span>03</span>
              <strong>Cardio Area</strong>
              <small>Energy meets endurance</small>
            </div>
          </div>

          <div className="gallery-card">
            <div className="gallery-placeholder">
              <span>04</span>
              <strong>Functional Zone</strong>
              <small>Move. Train. Perform.</small>
            </div>
          </div>

          <div className="gallery-card">
            <div className="gallery-placeholder">
              <span>05</span>
              <strong>Premium Equipment</strong>
              <small>Quality from every angle</small>
            </div>
          </div>
        </div>

        <div className="tour-card">
          <div>
            <p className="eyebrow">VIRTUAL GYM TOUR</p>
            <h3>Explore the space before you visit.</h3>
            <p>
              A future interactive 3D walkthrough can showcase the gym floor,
              equipment zones and facilities.
            </p>
          </div>

          <a className="secondary-button" href="#contact">
            Explore Tour
          </a>
        </div>
      </section>

      <section id="reviews" className="content-section reviews-section">
        <div className="section-heading">
          <p className="eyebrow">MEMBER REVIEWS</p>
          <h2>What members say.</h2>
          <p>
            Real experiences from people who train, improve and grow with us.
          </p>
        </div>

        <div className="review-action">
          <button
            type="button"
            className="primary-button review-toggle"
            onClick={() => setShowReviewForm((current) => !current)}
          >
            {showReviewForm ? "Close Review Form" : "Write a Review"}
          </button>
        </div>

        {showReviewForm && (
          <form className="review-form" onSubmit={handleReviewSubmit}>
            <div className="review-form-top">
              <div>
                <label htmlFor="review-name">Your Name</label>
                <input
                  id="review-name"
                  type="text"
                  value={reviewName}
                  onChange={(event) => setReviewName(event.target.value)}
                  placeholder="Enter your name"
                  maxLength={60}
                  required
                />
              </div>

              <div>
                <label>Rating</label>
                <div className="rating-picker" aria-label="Choose rating">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      className={star <= reviewRating ? "star active" : "star"}
                      onClick={() => setReviewRating(star)}
                      aria-label={`${star} star${star > 1 ? "s" : ""}`}
                    >
                      ★
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <label htmlFor="review-text">Your Review</label>
              <textarea
                id="review-text"
                value={reviewText}
                onChange={(event) => {
                  const value = event.target.value;
                  const words = value.trim()
                    ? value.trim().split(/\s+/)
                    : [];

                  if (words.length <= 200) {
                    setReviewText(value);
                  }
                }}
                placeholder="Share your experience..."
                rows="6"
                required
              />
              <div className="review-counter">
                {wordCount}/200 words
              </div>
            </div>

            <button
              type="submit"
              className="primary-button"
              disabled={!reviewName.trim() || !reviewText.trim() || wordCount > 200}
            >
              Submit Review
            </button>
          </form>
        )}

        <div className="reviews-grid">
          {reviews.map((review, index) => (
            <article
              className={`review-card ${index === 1 ? "featured-review" : ""}`}
              key={`${review.name}-${index}`}
            >
              <div className="review-stars">
                {"★".repeat(review.rating)}
                {"☆".repeat(5 - review.rating)}
              </div>

              <p>“{review.text}”</p>

              <div className="review-author">
                <span>{review.initials}</span>
                <div>
                  <strong>{review.name}</strong>
                  <small>Gym Member</small>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section id="offers" className="content-section dark-section offers-section">
        <div className="section-heading">
          <p className="eyebrow">SPECIAL OFFERS</p>
          <h2>More membership. More value.</h2>
          <p>
            Flexible offers designed to make your fitness journey more valuable.
          </p>
        </div>

        <div className="offers-grid">
          <article className="offer-card offer-featured">
            <span className="offer-tag">LIMITED OFFER</span>
            <span className="offer-number">01</span>
            <h3>Yearly Membership</h3>
            <p>
              Commit for the year and unlock better membership value with
              long-term savings.
            </p>
            <strong>
              {gymConfig.membership.yearly.discount || "SPECIAL VALUE"}
            </strong>
            <a className="plan-button" href="#contact">
              Claim Offer
            </a>
          </article>

          <article className="offer-card">
            <span className="offer-tag">POPULAR</span>
            <span className="offer-number">02</span>
            <h3>Quarterly Plan</h3>
            <p>
              A balanced option for members who want flexibility with a longer
              training commitment.
            </p>
            <strong>Great Value</strong>
            <a className="plan-button" href="#contact">
              Enquire Now
            </a>
          </article>

          <article className="offer-card">
            <span className="offer-tag">NEW MEMBERS</span>
            <span className="offer-number">03</span>
            <h3>Start Your Journey</h3>
            <p>
              Contact the gym to learn about current joining offers and
              available membership packages.
            </p>
            <strong>Ask Our Team</strong>
            <a className="plan-button" href="#contact">
              Get Details
            </a>
          </article>
        </div>
      </section>

      <section id="faq" className="content-section faq-section">
        <div className="section-heading">
          <p className="eyebrow">FAQ</p>
          <h2>Frequently asked questions.</h2>
          <p>
            Quick answers about memberships, timings, facilities and visiting
            the gym.
          </p>
        </div>

        <div className="faq-grid">
          <details className="faq-item" open>
            <summary>What are the gym timings?</summary>
            <p>
              We are open {gymConfig.timings.weekdays} on weekdays and{" "}
              {gymConfig.timings.weekends} on weekends.
            </p>
          </details>

          <details className="faq-item">
            <summary>What membership plans are available?</summary>
            <p>
              Monthly, quarterly, 6-month and yearly membership options are
              available.
            </p>
          </details>

          <details className="faq-item">
            <summary>Can I visit the gym before joining?</summary>
            <p>
              Contact our team to arrange a visit and learn more about the
              facilities and membership options.
            </p>
          </details>

          <details className="faq-item">
            <summary>Where is the gym located?</summary>
            <p>
              {gymConfig.location.address}, {gymConfig.location.city}.
            </p>
          </details>
        </div>

        <div className="location-card">
          <div>
            <p className="eyebrow">VISIT US</p>
            <h3>{gymConfig.location.city}</h3>
            <p>{gymConfig.location.address}</p>

            <div className="timing-list">
              <div>
                <span>Weekdays</span>
                <strong>{gymConfig.timings.weekdays}</strong>
              </div>

              <div>
                <span>Weekends</span>
                <strong>{gymConfig.timings.weekends}</strong>
              </div>
            </div>
          </div>

          <a
            className="secondary-button"
            href="https://www.google.com/maps/search/?api=1&query=YOUR+GYM+ADDRESS"
            target="_blank"
            rel="noreferrer"
          >
            Open in Google Maps
          </a>
        </div>
      </section>

      <section id="contact" className="contact-section premium-contact">
        <div className="contact-content">
          <p className="eyebrow">READY TO JOIN?</p>
          <h2>Start your fitness journey.</h2>
          <p className="contact-intro">
            Visit us, explore the facilities and find the membership plan
            that works for you.
          </p>

          <div className="contact-actions">
            <a
              className="primary-button"
              href={`https://wa.me/${gymConfig.contact.whatsapp.replace(/\D/g, "")}`}
              target="_blank"
              rel="noreferrer"
            >
              WhatsApp Us
            </a>

            <a
              className="secondary-button"
              href={`tel:${gymConfig.contact.phone}`}
            >
              Call Now
            </a>
          </div>
        </div>

        <div className="contact-info-grid">
          <div className="contact-info-card">
            <span>LOCATION</span>
            <strong>{gymConfig.location.address}</strong>
            <small>{gymConfig.location.city}</small>
          </div>

          <div className="contact-info-card">
            <span>PHONE</span>
            <strong>{gymConfig.contact.phone}</strong>
            <small>Call our team</small>
          </div>

          <div className="contact-info-card">
            <span>EMAIL</span>
            <strong>{gymConfig.contact.email}</strong>
            <small>Send us a message</small>
          </div>

          <div className="contact-info-card">
            <span>OPENING HOURS</span>
            <strong>{gymConfig.timings.weekdays}</strong>
            <small>Weekdays · Weekends {gymConfig.timings.weekends}</small>
          </div>
        </div>
      </section>

      <footer>
        <strong>{gymConfig.name}</strong>
        <span>© 2026. All rights reserved.</span>
      </footer>
    </main>
  );
}

export default App;
