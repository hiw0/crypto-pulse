import { S } from '../../styles/S';
import type { MacroData } from '../../types';

interface HeaderProps {
  macro: MacroData | null;
}

export function Header({ macro }: HeaderProps) {
  return (
    <header style={S.header}>
      <div style={S.hL}>
        <div style={S.logo}>CRYPTO PULSE</div>
      </div>
      <div style={S.hR}>
        <div style={S.pill}>
          BTC {macro?.btcPrice ?? '---'}{' '}
          <span style={{ color: 'var(--green)', marginLeft: 4 }}>{macro?.btcChange ?? ''}</span>
        </div>
        <div style={S.pill}>
          ETH {macro?.ethPrice ?? '---'}{' '}
          <span style={{ color: 'var(--green)', marginLeft: 4 }}>{macro?.ethChange ?? ''}</span>
        </div>
        <div style={S.pill}>
          SOL {macro?.solPrice ?? '---'}{' '}
          <span style={{ color: 'var(--green)', marginLeft: 4 }}>{macro?.solChange ?? ''}</span>
        </div>
      </div>
    </header>
  );
}
