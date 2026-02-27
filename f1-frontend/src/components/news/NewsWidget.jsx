import { useEffect, useState } from "react";
import api from "../../services/api";

export default function NewsWidget() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/news/top3")
      .then(res => {
        console.log("NEWS WIDGET DATA 👉", res.data);
        setNews(res.data);
      })
      .catch(err => {
        console.error("NewsWidget API Error", err);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <p className="text-muted">Loading news...</p>;
  }

  if (news.length === 0) {
    return <p className="text-muted">No news available</p>;
  }

  return (
    <div className="row">
      {news.map(n => (
        <div className="col-md-4 mb-3" key={n.id}>
          <div className="card shadow-sm h-100">
            {n.imageUrl && (
              <img
                src={`http://localhost:8080${n.imageUrl}`}
                alt=""
                className="card-img-top"
                style={{ height: 180, objectFit: "cover" }}
              />
            )}
            <div className="card-body">
              <h6>{n.title}</h6>
              <p className="small">
                {n.description?.substring(0, 90)}...
              </p>
              <small className="text-muted">{n.source}</small>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
