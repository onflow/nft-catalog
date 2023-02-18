export function Divider({ space }: { space?: string|undefined }) {
  if (!space) { space = '8px' }
  return (
    <div
      style={{
        borderBottomWidth: '1px',
        borderColor: 'rgba(0,0,0,.11)',
        marginTop: space,
        marginBottom: space,
      }}
    />
  );
}