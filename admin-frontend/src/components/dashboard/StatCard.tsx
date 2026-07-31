export const StatCard = ({ title, value }: { title: string; value: string }) => {
  return (
    <div style={{ padding: '1rem', border: '1px solid #333', borderRadius: '0.75rem' }}>
      <h3>{title}</h3>
      <p>{value}</p>
    </div>
  );
};
