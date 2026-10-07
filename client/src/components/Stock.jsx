import { useState } from 'react';
import { api } from '../api.js';
import useLoad from '../useLoad.js';

export default function Stock() {
  const { data, error, loading, reload } = useLoad('/stock');
  const [form, setForm] = useState({ name: '', unit: 'kg', quantity: 0 });
  const [addQty, setAddQty] = useState({});
  const [message, setMessage] = useState('');

  async function handleCreate(e) {
    e.preventDefault();
    setMessage('');
    try {
      await api.post('/stock', { ...form, quantity: Number(form.quantity) });
      setForm({ name: '', unit: 'kg', quantity: 0 });
      reload();
    } catch (err) {
      setMessage(err.message);
    }
  }

  async function handleAdd(id) {
    setMessage('');
    try {
      await api.post(`/stock/${id}/add`, { quantity: Number(addQty[id]) });
      setAddQty({ ...addQty, [id]: '' });
      reload();
    } catch (err) {
      setMessage(err.message);
    }
  }

  return (
    <section>
      <h2>Stock</h2>

      <form className="form" onSubmit={handleCreate}>
        <input placeholder="Item name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
        <select value={form.unit} onChange={(e) => setForm({ ...form, unit: e.target.value })}>
          <option value="kg">kg</option>
          <option value="kit">kit</option>
        </select>
        <input type="number" min="0" placeholder="Opening quantity" value={form.quantity} onChange={(e) => setForm({ ...form, quantity: e.target.value })} required />
        <button type="submit">Add item</button>
      </form>
      {message && <p className="error">{message}</p>}

      {loading && <p>Loading…</p>}
      {error && <p className="error">{error}</p>}
      {data && (
        <table>
          <thead>
            <tr><th>Item</th><th>In hand</th><th>Receive stock</th></tr>
          </thead>
          <tbody>
            {data.map((item) => (
              <tr key={item._id}>
                <td>{item.name}</td>
                <td>{item.quantity} {item.unit}</td>
                <td>
                  <input
                    className="small"
                    type="number"
                    min="0"
                    placeholder="Qty"
                    value={addQty[item._id] || ''}
                    onChange={(e) => setAddQty({ ...addQty, [item._id]: e.target.value })}
                  />
                  <button onClick={() => handleAdd(item._id)} disabled={!addQty[item._id]}>Add</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </section>
  );
}
