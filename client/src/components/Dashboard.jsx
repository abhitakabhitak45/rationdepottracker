import useLoad from '../useLoad.js';

const LOW_STOCK = 100;

export default function Dashboard() {
  const { data, error, loading } = useLoad('/summary');

  if (loading) return <p>Loading…</p>;
  if (error) return <p className="error">{error}</p>;

  return (
    <section>
      <h2>Summary for {data.month}</h2>

      <div className="cards">
        <div className="card">
          <span className="big">{data.beneficiaries}</span>
          <span>Ration cards registered</span>
        </div>
        <div className="card">
          <span className="big">{data.distributionsThisMonth}</span>
          <span>Distributions this month</span>
        </div>
      </div>

      <h3>Distributed this month</h3>
      {data.byItem.length === 0 ? (
        <p>No distributions yet this month.</p>
      ) : (
        <table>
          <thead>
            <tr><th>Item</th><th>Total given</th><th>Transactions</th></tr>
          </thead>
          <tbody>
            {data.byItem.map((row) => (
              <tr key={row.name}>
                <td>{row.name}</td>
                <td>{row.total} {row.unit}</td>
                <td>{row.count}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <h3>Stock in hand</h3>
      <table>
        <thead>
          <tr><th>Item</th><th>Quantity</th><th></th></tr>
        </thead>
        <tbody>
          {data.stock.map((item) => (
            <tr key={item._id}>
              <td>{item.name}</td>
              <td>{item.quantity} {item.unit}</td>
              <td>{item.quantity < LOW_STOCK && <span className="badge warn">Low stock</span>}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
