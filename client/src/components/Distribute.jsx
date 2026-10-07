import { useState } from 'react';
import { api } from '../api.js';
import useLoad from '../useLoad.js';

export default function Distribute({ onDone }) {
  const people = useLoad('/beneficiaries');
  const stock = useLoad('/stock');
  const [form, setForm] = useState({ beneficiaryId: '', itemId: '', quantity: '', authMethod: 'biometric' });
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const update = (field) => (e) => setForm({ ...form, [field]: e.target.value });
  const selectedItem = stock.data?.find((i) => i._id === form.itemId);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setBusy(true);
    try {
      const receipt = await api.post('/distributions', { ...form, quantity: Number(form.quantity) });
      setForm({ ...form, quantity: '' });
      stock.reload();
      onDone(receipt);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  if (people.loading || stock.loading) return <p>Loading…</p>;
  if (people.error || stock.error) return <p className="error">{people.error || stock.error}</p>;

  return (
    <section>
      <h2>New distribution</h2>

      <form className="stack" onSubmit={handleSubmit}>
        <label>
          Ration card
          <select value={form.beneficiaryId} onChange={update('beneficiaryId')} required>
            <option value="">Select a card</option>
            {people.data.map((b) => (
              <option key={b._id} value={b._id}>
                {b.cardNumber} – {b.headName} ({b.village})
              </option>
            ))}
          </select>
        </label>

        <label>
          Item
          <select value={form.itemId} onChange={update('itemId')} required>
            <option value="">Select an item</option>
            {stock.data.map((i) => (
              <option key={i._id} value={i._id}>
                {i.name} – {i.quantity} {i.unit} in hand
              </option>
            ))}
          </select>
        </label>

        <label>
          Quantity {selectedItem ? `(${selectedItem.unit})` : ''}
          <input type="number" min="0" step="any" value={form.quantity} onChange={update('quantity')} required />
        </label>

        <label>
          Authentication
          <select value={form.authMethod} onChange={update('authMethod')}>
            <option value="biometric">Biometric e-KYC</option>
            <option value="otp">OTP (biometric failed)</option>
          </select>
        </label>

        {error && <p className="error">{error}</p>}
        <button type="submit" disabled={busy}>{busy ? 'Saving…' : 'Issue receipt'}</button>
      </form>
    </section>
  );
}
