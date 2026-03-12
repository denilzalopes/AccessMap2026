export default function SplashScreen() {
  return (
    <div style={{
      position: 'fixed', inset: 0,
      background: '#07071A',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999
    }}>
      <div style={{
        width: 44, height: 44,
        border: '4px solid rgba(75,85,232,0.2)',
        borderTopColor: '#4B55E8',
        borderRadius: '50%',
        animation: 'spin 0.8s linear infinite'
      }} />
    </div>
  );
}
