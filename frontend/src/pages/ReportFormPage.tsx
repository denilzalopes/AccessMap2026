import { useState, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../App';
import { searchPlaces } from '../hooks/useAddress';

const REPORT_URL    = import.meta.env.VITE_REPORT_API_URL;
const CLOUD_NAME    = 'djp4phexi';
const UPLOAD_PRESET = 'accessmap_unsigned';

const CAT_GROUPS: Record<string, string[]> = {
  'Voirie':                ['STEP', 'RAMP', 'SIDEWALK', 'SIGNAGE', 'PARKING'],
  'Transports — En panne': ['ELEVATOR', 'ESCALATOR_BROKEN'],
  'Transports — Absent':   ['NO_ELEVATOR', 'NO_ESCALATOR'],
  'Transports — Accès':    ['INACCESSIBLE_ENTRY', 'INACCESSIBLE_PLATFORM', 'INACCESSIBLE_STOP', 'NARROW_PASSAGE'],
};

const CAT_LABELS: Record<string, string> = {
  STEP:                  'Marche / Escalier',
  RAMP:                  'Rampe manquante',
  SIDEWALK:              'Trottoir impraticable',
  SIGNAGE:               'Signalétique absente',
  PARKING:               'Stationnement inaccessible',
  ELEVATOR:              'Ascenseur en panne',
  ESCALATOR_BROKEN:      'Escalator en panne',
  NO_ELEVATOR:           'Ascenseur absent',
  NO_ESCALATOR:          'Escalator absent',
  INACCESSIBLE_ENTRY:    'Entrée inaccessible',
  INACCESSIBLE_PLATFORM: 'Quai inaccessible',
  INACCESSIBLE_STOP:     'Arrêt inaccessible',
  NARROW_PASSAGE:        'Passage étroit',
};

export default function ReportFormPage() {
  const navigate  = useNavigate();
  const location  = useLocation();
  const { userId, displayName, email } = useAuth();
  const accessToken = localStorage.getItem('accessToken');

  const state = location.state as { lat?: number; lon?: number; address?: string } | null;

  const [form, setForm]   = useState({
    title: '', description: '', category: '', address: state?.address ?? '',
  });
  const [coords, setCoords]             = useState({ lat: state?.lat ?? 0, lon: state?.lon ?? 0 });
  const [suggestions, setSuggestions]   = useState<any[]>([]);
  const [imageFile, setImageFile]       = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [uploading, setUploading]       = useState(false);
  const [loading, setLoading]           = useState(false);
  const [error, setError]               = useState('');
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleAddressChange = (val: string) => {
    setForm(f => ({ ...f, address: val }));
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      if (val.length > 2) {
        const results = await searchPlaces(val);
        setSuggestions(results);
      } else {
        setSuggestions([]);
      }
    }, 350);
  };

  const selectSuggestion = (s: any) => {
    setForm(f => ({ ...f, address: s.label }));
    setCoords({ lat: s.lat, lon: s.lon });
    setSuggestions([]);
  };

  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const uploadImage = async (): Promise<string> => {
    if (!imageFile) return '';
    const fd = new FormData();
    fd.append('file', imageFile);
    fd.append('upload_preset', UPLOAD_PRESET);
    const res  = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
      method: 'POST', body: fd,
    });
    const data = await res.json();
    return data.secure_url ?? '';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.category)           { setError('Veuillez choisir une catégorie.'); return; }
    if (!coords.lat || !coords.lon) { setError('Veuillez saisir une adresse.'); return; }
    setLoading(true);
    setError('');
    try {
      setUploading(true);
      const imageUrl = await uploadImage();
      setUploading(false);

      const payload = {
        userId,
        authorName:  displayName ?? 'Anonyme',
        authorEmail: email ?? '',
        title:       form.title,
        description: form.description,
        category:    form.category,
        latitude:    coords.lat,
        longitude:   coords.lon,
        imageUrl,
      };

      const res = await fetch(`${REPORT_URL}/api/reports`, {
        method:  'POST',
        headers: {
          'Content-Type':  'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error('Erreur lors de la création du signalement');
      navigate('/my-reports');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
      setUploading(false);
    }
  };

  return (
    <div className="page report-form-page">
      <div className="page-header">
        <button className="btn-back" onClick={() => navigate(-1)}>← Retour</button>
        <h1>Nouveau signalement</h1>
      </div>

      <form onSubmit={handleSubmit} className="report-form">

        <div className="form-group">
          <label>Titre *</label>
          <input
            type="text"
            value={form.title}
            onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
            placeholder="Ex : Ascenseur en panne station Châtelet"
            required
          />
        </div>

        <div className="form-group">
          <label>Catégorie *</label>
          <select
            value={form.category}
            onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
            required
          >
            <option value="">-- Choisir une catégorie --</option>
            {Object.entries(CAT_GROUPS).map(([group, cats]) => (
              <optgroup key={group} label={group}>
                {cats.map(c => (
                  <option key={c} value={c}>{CAT_LABELS[c] ?? c}</option>
                ))}
              </optgroup>
            ))}
          </select>
        </div>

        <div className="form-group address-group">
          <label>Adresse *</label>
          <input
            type="text"
            value={form.address}
            onChange={e => handleAddressChange(e.target.value)}
            placeholder="Rechercher une adresse..."
          />
          {suggestions.length > 0 && (
            <ul className="suggestions-list">
              {suggestions.map((s, i) => (
                <li key={i} onClick={() => selectSuggestion(s)}>{s.label}</li>
              ))}
            </ul>
          )}
        </div>

        <div className="form-group">
          <label>Description</label>
          <textarea
            value={form.description}
            onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
            placeholder="Décrivez l'obstacle..."
            rows={4}
          />
        </div>

        <div className="form-group">
          <label>Photo (optionnelle)</label>
          <input type="file" accept="image/*" onChange={handleImage} />
          {imagePreview && (
            <img src={imagePreview} alt="preview" className="image-preview" />
          )}
        </div>

        {error && <div className="form-error">{error}</div>}

        <button type="submit" className="btn-primary" disabled={loading}>
          {uploading ? 'Upload photo...' : loading ? 'Envoi...' : 'Envoyer le signalement'}
        </button>
      </form>
    </div>
  );
}
