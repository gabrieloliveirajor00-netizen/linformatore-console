export type WeatherCondition = 'sun' | 'rain' | 'night' | 'clouds';

export interface WeatherData {
  temperature: number;
  condition: WeatherCondition;
  conditionLabel: string;
  windSpeed: number;
  windDirection: string;
  humidity: number;
  city: string;
}

// Mock data — ready to swap with OpenWeatherMap API
export const getMockWeather = (): WeatherData => {
  const hour = new Date().getHours();
  
  if (hour >= 21 || hour < 6) {
    return {
      temperature: 14,
      condition: 'night',
      conditionLabel: 'Notte Serena',
      windSpeed: 8,
      windDirection: 'NE',
      humidity: 65,
      city: 'Roma',
    };
  }
  
  // Daytime — rotate conditions for demo
  const conditions: Array<{ condition: WeatherCondition; label: string; temp: number }> = [
    { condition: 'sun', label: 'Soleggiato', temp: 26 },
    { condition: 'rain', label: 'Pioggia Leggera', temp: 17 },
    { condition: 'clouds', label: 'Nuvoloso', temp: 21 },
  ];

  const pick = conditions[Math.floor(Date.now() / 60000) % conditions.length];

  return {
    temperature: pick.temp,
    condition: pick.condition,
    conditionLabel: pick.label,
    windSpeed: 12,
    windDirection: 'SO',
    humidity: 58,
    city: 'Roma',
  };
};

export const getMissionBriefing = (condition: WeatherCondition): string => {
  switch (condition) {
    case 'sun':
      return 'Visibilità perfetta per la sorveglianza. Incontro fissato in Piazza. Indossare gli occhiali da sole.';
    case 'rain':
      return "Operazione sotto copertura. L'asfalto è scivoloso, attenzione all'inseguimento. Il soprabito è obbligatorio.";
    case 'night':
      return 'Modalità silenziosa attivata. Le luci della città sono la vostra copertura.';
    case 'clouds':
      return 'Cielo coperto — condizioni ideali per il passaggio di documenti. Mantenere il profilo basso.';
  }
};
