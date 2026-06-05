export default function LogoutModal({ onConfirm, onCancel }) {
  return (
    <div className="logout-overlay" id="neon-logout-modal">
      <div className="logout-modal">
        <h2>Sistemden Çıkış</h2>
        <p>Oturumunuzu kapatmak istediğinize emin misiniz?</p>
        <div className="logout-actions">
          <button type="button" className="btn-neon-red" onClick={onConfirm}>
            Evet, Çıkış Yap
          </button>
          <button type="button" className="btn-neon-outline" onClick={onCancel}>
            Hayır, İptal
          </button>
        </div>
      </div>
    </div>
  );
}
