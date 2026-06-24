import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import api from "../api/axios";

export default function PropertyDetails() {
  const { slug } = useParams();
  const navigate = useNavigate();

  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const propertyId = slug.split("-").pop();
        const res = await api.get(`/properties/${propertyId}`);
        setProperty(res.data.property || res.data);
      } catch (err) {
        console.error(err);
        setProperty(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProperty();
  }, [slug]);

  if (loading) {
    return (
      <div style={{ padding: "clamp(60px, 18vw, 120px) 20px", textAlign: "center" }}>
        Loading...
      </div>
    );
  }

  if (!property) {
    return (
      <div style={{ padding: "clamp(60px, 18vw, 120px) 20px", textAlign: "center" }}>
        <h2>Property not found</h2>
        <button
          onClick={() => navigate("/buy")}
          style={{
            marginTop: 20,
            padding: "10px 20px",
            cursor: "pointer",
          }}
        >
          Back to Properties
        </button>
      </div>
    );
  }

  const image =
    property.images?.[0]?.url ||
    "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1200&q=80";

  return (
    <>
      <Helmet>
        <title>
          {property.title} in {property.city} | 1Ground
        </title>

        <meta
          name="description"
          content={`${property.title} in ${property.city}. Price ₹${Number(
            property.price
          ).toLocaleString("en-IN")}. View property details on 1Ground.`}
        />

        <link
          rel="canonical"
          href={`https://www.1ground.in/property/${slug}`}
        />
      </Helmet>

      <Navbar />

      <section
        style={{
          paddingTop: "clamp(80px, 20vw, 120px)",
          paddingBottom: "clamp(40px, 8vw, 60px)",
          minHeight: "100vh",
          background: "#0a0a0a",
          color: "#fff",
        }}
      >
        <div
          className="container"
          style={{ maxWidth: 1200, margin: "0 auto", padding: "0 20px" }}
        >
          <button
            onClick={() => navigate(-1)}
            style={{
              marginBottom: 20,
              padding: "10px 20px",
              cursor: "pointer",
            }}
          >
            ← Back
          </button>

          {/* Image */}
          <img
            src={image}
            alt={`${property.title} in ${property.city}`}
            style={{
              width: "100%",
              maxHeight: "clamp(220px, 60vw, 500px)",
              objectFit: "cover",
              borderRadius: 12,
            }}
          />

          {/* Details */}
          <div style={{ marginTop: 30 }}>
            <h1
              style={{
                fontSize: "clamp(1.6rem, 6vw, 2.5rem)",
                lineHeight: 1.2,
                marginBottom: 10,
                wordBreak: "break-word",
              }}
            >
              {property.title}
            </h1>

            <p
              style={{
                color: "#bbb",
                marginBottom: 20,
                fontSize: "clamp(.85rem, 2.5vw, 1rem)",
              }}
            >
              📍 {property.locality
                ? `${property.locality}, `
                : ""}
              {property.city}
            </p>

            <h2
              style={{
                color: "#d4af37",
                marginBottom: 20,
                fontSize: "clamp(1.3rem, 4.5vw, 1.8rem)",
              }}
            >
              ₹{Number(property.price).toLocaleString("en-IN")}
              {property.listingType === "rent"
                ? " / month"
                : ""}
            </h2>

            <div
              style={{
                display: "flex",
                gap: 20,
                flexWrap: "wrap",
                marginBottom: 30,
                fontSize: "clamp(.85rem, 2.2vw, 1rem)",
              }}
            >
              {property.bedrooms && (
                <span>🛏 {property.bedrooms} BHK</span>
              )}

              {property.areaSqft && (
                <span>📐 {property.areaSqft} sqft</span>
              )}

              {property.furnished && (
                <span>🛋 Furnished</span>
              )}

              {property.type && (
                <span>🏢 {property.type}</span>
              )}
            </div>

            {property.description && (
              <>
                <h3>Description</h3>
                <p
                  style={{
                    lineHeight: 1.8,
                    color: "#ccc",
                    fontSize: "clamp(.88rem, 2.3vw, 1rem)",
                  }}
                >
                  {property.description}
                </p>
              </>
            )}
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}