import { useState } from 'react';
import Dashboard from './components/Dashboard.jsx';
import Distribute from './components/Distribute.jsx';
import Beneficiaries from './components/Beneficiaries.jsx';
import Stock from './components/Stock.jsx';
import History from './components/History.jsx';
import Receipt from './components/Receipt.jsx';

const TABS = [
  ['dashboard', 'Dashboard'],
  ['distribute', 'Distribute'],
  ['beneficiaries', 'Beneficiaries'],
  ['stock', 'Stock'],
  ['history', 'History'],
];

export default function App() {
  const [tab, setTab] = useState('dashboard');
  const [receipt, setReceipt] = useState(null);

  return (
    <div className="app">
      <header className="topbar">
        <h1>Ration Depot Tracker</h1>
        <p>Demo project: beneficiaries, stock, distributions and receipts</p>
      </header>

      <nav className="tabs">
        {TABS.map(([id, label]) => (
          <button key={id} className={tab === id ? 'tab active' : 'tab'} onClick={() => setTab(id)}>
            {label}
          </button>
        ))}
      </nav>

      <main>
        {tab === 'dashboard' && <Dashboard />}
        {tab === 'distribute' && <Distribute onDone={setReceipt} />}
        {tab === 'beneficiaries' && <Beneficiaries />}
        {tab === 'stock' && <Stock />}
        {tab === 'history' && <History onView={setReceipt} />}
      </main>

      {receipt && <Receipt receipt={receipt} onClose={() => setReceipt(null)} />}
    </div>
  );
}
