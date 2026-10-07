export default function Receipt({ receipt, onClose }) {
  const person = receipt.beneficiary;

  return (
    <div className="overlay" onClick={onClose}>
      <div className="receipt" onClick={(e) => e.stopPropagation()}>
        <h2>Ration Receipt</h2>
        <p className="muted">Demo data only</p>
        <dl>
          <dt>Receipt no.</dt><dd>{receipt.receiptNumber}</dd>
          <dt>Date</dt><dd>{new Date(receipt.createdAt).toLocaleString('en-IN')}</dd>
          <dt>Card</dt><dd>{person ? person.cardNumber : '-'}</dd>
          <dt>Head of family</dt><dd>{person ? person.headName : '-'}</dd>
          <dt>Village</dt><dd>{person ? person.village : '-'}</dd>
          <dt>Item</dt><dd>{receipt.itemName}</dd>
          <dt>Quantity</dt><dd>{receipt.quantity} {receipt.unit}</dd>
          <dt>Authentication</dt><dd>{receipt.authMethod === 'otp' ? 'OTP' : 'Biometric e-KYC'}</dd>
        </dl>
        <div className="actions no-print">
          <button onClick={() => window.print()}>Print</button>
          <button className="secondary" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
}
