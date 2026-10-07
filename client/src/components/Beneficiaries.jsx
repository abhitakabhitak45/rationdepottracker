import { useState } from 'react';
import { api } from '../api.js';
import useLoad from '../useLoad.js';

const EMPTY = { cardNumber: '', headName: '', village: '', members: 1 };

export default function Beneficiaries() {
  const [query, setQuery] = useState('');
  const { data, error, loading, reload } = useLoad(`/beneficiaries?q=${encodeURIComponent(query)}`);
  const [form, setForm] = useState(EMPTY);
  const [formError, setFormError] = useState('');

  const update = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  async function handleSubmit(e) {
    e.preventDefault();
    setFormError('');
    try {
      await api.post('/beneficiaries', { ...form, members: Number(form.members) });
      setForm(EMPTY);
      reload();
    } catch (err) {
      setFormError(err.message);
    }
  }

  async function handleDelete(id) {
    if (!window.confirm('Remove this ration card?')) return;
    try {
      await api.del(`/beneficiaries/${id}`);
      reload();
    } catch (err) {
      setFormError(err.message);
    }
  }

  return (
    <section>
      <h2>Beneficiaries</h2>

      <form className="form" onSubmit={handleSubmit}>
        <input placeholder="Card number" value={form.cardNumber} onChange={update('cardNumber')} required />
        <input placeholder="Head of family" value={form.headName} onChange={update('headName')} required />
        <input placeholder="Village" value={form.village} onChange={update('village')} required />
        <input type="number" min="1" placeholder="Members" value={form.members} onChange={update('members')} required />
        <button type="submit">Add</button>
      </form>
      {formError && <p className="error">{formError}</p>}

      <input
        className="search"
        placeholder="Search by name, card number or village"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />

      {loading && <p>Loading…</p>}
      {error && <p className="error">{error}</p>}
      {data && (
        <table>
          <thead>
            <tr><th>Card</th><th>Head of family</th><th>Village</th><th>Members</th><th></th></tr>
          </thead>
          <tbody>
            {data.map((b) => (
              <tr key={b._id}>
                <td>{b.cardNumber}</td>
                <td>{b.headName}</td>
                <td>{b.village}</td>
                <td>{b.members}</td>
                <td><button className="link" onClick={() => handleDelete(b._id)}>Remove</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </section>
  );
}
