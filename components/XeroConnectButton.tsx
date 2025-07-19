'use client';

export default function XeroConnectButton() {
  const handleConnect = () => {
    window.location.href = '/auth/api/connect';
  };

  return (
    <button onClick={handleConnect} className="bg-blue-600 text-white px-4 py-2 rounded">
      Connect Xero
    </button>
  );
}
