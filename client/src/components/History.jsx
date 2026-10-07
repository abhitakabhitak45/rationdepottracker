import useLoad from '../useLoad.js';

export default function History({ onView }) {
  const { data, error, loading } = useLoad('/distributions');

  if (loading) return <p>Loading…</p>;
  if (error) return <p className="error">{error}</p>;

  return (
    <section>
      <h2>Recent distributions</h2>
      {data.length === 0 ? (
        <p>No distributions yet.</p>
      ) : (
        <table>
          <thead>
            <tr><th>Receipt</th><th>Date</th><th>Card</th><th>Item</th><th>Auth</th><th></th></tr>
          </thead>
          <tbody>
            {data.map((d) => (
              <tr key={d._id}>
                <td>{d.receiptNumber}</td>
                <td>{new Date(d.createdAt).toLocaleString('en-IN')}</td>
                <td>{d.beneficiary ? d.beneficiary.cardNumber : 'Removed card'}</td>
                <td>{d.quantity} {d.unit} {d.itemName}</td>
                <td>{d.authMethod === 'otp' ? 'OTP' : 'Biometric'}</td>
                <td><button className="link" onClick={() => onView(d)}>View receipt</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </section>
  );
}
