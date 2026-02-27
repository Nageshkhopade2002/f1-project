import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../services/api";

export default function CircuitDetails() {
  const { id } = useParams();
  const [circuit, setCircuit] = useState(null);

  useEffect(() => {
    api.get(`/circuit/${id}`).then(res => setCircuit(res.data));
  }, [id]);

  if (!circuit) return <p>Loading circuit...</p>;

  return (
    <div className="container mt-4">
      <h2>{circuit.name}</h2>
      <h5 className="text-muted">
        {circuit.city}, {circuit.country}
      </h5>

      {/* INFO GRID */}
      <div className="row mt-4">
        <div className="col-md-6 mb-3">
          <div className="card p-3">
            <strong>Circuit Length</strong>
            <p>{circuit.circuitLengthKm} km</p>
          </div>
        </div>

        <div className="col-md-6 mb-3">
          <div className="card p-3">
            <strong>Number of Laps</strong>
            <p>{circuit.numberOfLaps}</p>
          </div>
        </div>

        <div className="col-md-6 mb-3">
          <div className="card p-3">
            <strong>Race Distance</strong>
            <p>{circuit.raceDistanceKm} km</p>
          </div>
        </div>

        <div className="col-md-6 mb-3">
          <div className="card p-3">
            <strong>First Grand Prix</strong>
            <p>{circuit.firstGrandPrix}</p>
          </div>
        </div>

        <div className="col-md-6 mb-3">
          <div className="card p-3">
            <strong>Fastest Lap</strong>
            <p>
              {circuit.fastestLap} <br />
              <small className="text-muted">
                {circuit.fastestLapDriver}
              </small>
            </p>
          </div>
        </div>

        <div className="col-md-6 mb-3">
          <div className="card p-3">
            <strong>Timezone</strong>
            <p>{circuit.timezone}</p>
          </div>
        </div>
      </div>

      {/* MAP PLACEHOLDER */}
      <div className="card p-4 mt-4 text-center">
        <strong>Circuit Map</strong>
        <p className="text-muted mt-2">
          (SVG / Image can be added here later)
        </p>
      </div>
    </div>
  );
}
