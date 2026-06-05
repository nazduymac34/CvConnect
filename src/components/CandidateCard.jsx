import { initials } from "../utils/ui";

export default function CandidateCard({ candidate, onMessage }) {
  const skills = (candidate.skills || []).map((s) => (
    <span key={s} className="chip">
      {s}
    </span>
  ));

  const avatar = candidate.photo ? (
    <img className="avatar" src={candidate.photo} alt={candidate.fullName} />
  ) : (
    <div className="avatar avatar-fallback">{initials(candidate.fullName)}</div>
  );

  return (
    <article className="card candidate-card">
      <div className="candidate-top">
        {avatar}
        <div>
          <h3>{candidate.fullName}</h3>
          <p>
            <strong>{candidate.title}</strong>
          </p>
          <p className="meta">
            {candidate.city} • {candidate.experience} yıl deneyim
          </p>
          <p className="meta">
            {candidate.email} • {candidate.phone}
          </p>
        </div>
      </div>
      <p>{candidate.bio}</p>
      <div className="chips">{skills}</div>
      <button type="button" className="btn btn-primary" onClick={() => onMessage(candidate.id)}>
        Mesaj Gönder
      </button>
    </article>
  );
}
