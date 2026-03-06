import { useNavigate } from "react-router-dom";
import "./next-event.css";

export default function NextEvent({ race }) {
  const navigate = useNavigate();

  if (!race || !race.circuit) return null;

  const getDateRange = () => {
    const start = new Date(race.startDate);
    const end = new Date(race.endDate);
    return `${start.getDate()} – ${end.getDate()} ${end.toLocaleDateString("en-GB", { month: "short" }).toUpperCase()}`;
  };

  const handleClick = () => {
    navigate(`/race/${race.id}`);
  };

  const getCurrentTime = () => {
    return new Date().toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
  };

  const getCountryFlag = (country) => {
    const flags = {
      'Bahrain': '🇧🇭',
      'Saudi Arabia': '🇸🇦',
      'Australia': '🇦🇺',
      'Japan': '🇯🇵',
      'China': '🇨🇳',
      'USA': '🇺🇸',
      'Italy': '🇮🇹',
      'Monaco': '🇲🇨',
      'Spain': '🇪🇸',
      'Canada': '🇨🇦',
      'Austria': '🇦🇹',
      'Great Britain': '🇬🇧',
      'UK': '🇬🇧',
      'Hungary': '🇭🇺',
      'Belgium': '🇧🇪',
      'Netherlands': '🇳🇱',
      'Singapore': '🇸🇬',
      'Mexico': '🇲🇽',
      'Brazil': '🇧🇷',
      'UAE': '🇦🇪',
      'Abu Dhabi': '🇦🇪'
    };
    return flags[country] || '🏁';
  };

  const circuitUrl = race.circuit.circuitImage?.startsWith('http')
    ? race.circuit.circuitImage
    : race.circuit.circuitImage
    ? `http://localhost:8080${race.circuit.circuitImage}`
    : null;

  return (
    <div className="next-event-bar" onClick={handleClick}>
      <div className="next-event-content">
        <span className="event-label">TEST</span>
        <span className="event-dates">{getDateRange()}</span>
        <div className="event-location">
          <span className="country-flag-emoji">{getCountryFlag(race.circuit.country)}</span>
          <span className="country-name">{race.circuit.country}</span>
          <span className="arrow-icon">›</span>
        </div>
      </div>
      <div className="event-times">
        <div className="time-info">
          <span className="time-label">MY TIME</span>
          <span className="time-value">{getCurrentTime()}</span>
        </div>
        <div className="time-info">
          <span className="time-label">TRACK TIME</span>
          <span className="time-value">{getCurrentTime()}</span>
        </div>
        {circuitUrl && (
          <img 
            src={circuitUrl}
            alt="Circuit"
            className="circuit-badge"
            onError={(e) => e.target.style.display = 'none'}
          />
        )}
      </div>
    </div>
  );
}
