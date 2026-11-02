import { projectConfig } from '@/src/config/project';

export function StartingPrices() {
  return (
    <ul className="starting-prices" aria-label="Apartment starting prices">
      {Object.entries(projectConfig.CONFIGURATION_PRICES).map(([configuration, price]) => (
        <li key={configuration}>
          <span className="starting-prices-label">{configuration} <span>starting at</span></span>
          <strong>{price}</strong>
        </li>
      ))}
    </ul>
  );
}
