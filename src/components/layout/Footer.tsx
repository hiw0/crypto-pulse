import { S } from '../../styles/S';

export function Footer() {
  return (
    <footer style={S.ft}>
      Data from{' '}
      <a href="https://elfa.ai" target="_blank" rel="noreferrer" style={{ color: 'var(--accent)', textDecoration: 'none' }}>
        Elfa AI
      </a>
      {' '}&middot; Not financial advice
    </footer>
  );
}
