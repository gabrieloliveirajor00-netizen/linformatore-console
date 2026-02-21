export type WeatherCondition = 'sun' | 'rain' | 'night' | 'clouds';

export interface WeatherData {
  temperature: number;
  condition: WeatherCondition;
  conditionLabel: string;
  windSpeed: number;
  windDirection: string;
  humidity: number;
  pressure: number;
  visibility: number;
  city: string;
}

export const getMockWeather = (): WeatherData => {
  const hour = new Date().getHours();

  if (hour >= 21 || hour < 6) {
    return {
      temperature: 14,
      condition: 'night',
      conditionLabel: 'Noite Limpa',
      windSpeed: 8,
      windDirection: 'NE',
      humidity: 65,
      pressure: 1018,
      visibility: 10,
      city: 'Lisboa',
    };
  }

  const conditions: Array<{ condition: WeatherCondition; label: string; temp: number }> = [
    { condition: 'sun', label: 'Céu Limpo', temp: 26 },
    { condition: 'rain', label: 'Chuva Ligeira', temp: 17 },
    { condition: 'clouds', label: 'Nublado', temp: 21 },
  ];

  const pick = conditions[Math.floor(Date.now() / 60000) % conditions.length];

  return {
    temperature: pick.temp,
    condition: pick.condition,
    conditionLabel: pick.label,
    windSpeed: 12,
    windDirection: 'SO',
    humidity: 58,
    pressure: 1015,
    visibility: 12,
    city: 'Lisboa',
  };
};

export const getMissionBriefing = (condition: WeatherCondition): string => {
  switch (condition) {
    case 'sun':
      return 'Visibilidade perfeita para vigilância. Encontro marcado na Praça. Usar óculos escuros.';
    case 'rain':
      return 'Operação sob cobertura. O asfalto está escorregadio, cuidado na perseguição. O sobretudo é obrigatório.';
    case 'night':
      return 'Modo silencioso ativado. As luzes da cidade são a sua cobertura.';
    case 'clouds':
      return 'Céu coberto — condições ideais para passagem de documentos. Manter perfil baixo.';
  }
};

export interface Mission {
  id: string;
  title: string;
  description: string;
  priority: 1 | 2 | 3;
  completed: boolean;
  folderId?: string;
}

export const getDefaultMissions = (): Mission[] => [
  {
    id: '1',
    title: 'Migração de Ativos (Copilot)',
    description: 'Transferir documentos classificados para o novo sistema de comunicação seguro.',
    priority: 3,
    completed: false,
  },
  {
    id: '2',
    title: 'Reconhecimento do Perímetro',
    description: 'Mapear todas as entradas e saídas do edifício alvo no sector Norte.',
    priority: 2,
    completed: false,
  },
  {
    id: '3',
    title: 'Manutenção do Equipamento',
    description: 'Verificar calibração dos instrumentos de escuta no posto avançado.',
    priority: 1,
    completed: false,
  },
];

const API_KEY = '54d7db1e9e8ce1607d91c6fd9284c3ce';
const BASE_URL = 'https://api.openweathermap.org/data/2.5/weather';

export const fetchWeather = async (): Promise<WeatherData> => {
  try {
    // Trafaria, PT coords or query
    const response = await fetch(`${BASE_URL}?q=Trafaria,PT&units=metric&appid=${API_KEY}`);
    if (!response.ok) throw new Error('Weather API Failed');

    const data = await response.json();

    // Map API condition to our type
    const mapCondition = (id: number): { condition: WeatherCondition; label: string } => {
      if (id >= 200 && id < 600) return { condition: 'rain', label: 'Chuva' };
      if (id >= 600 && id < 700) return { condition: 'rain', label: 'Neve/Gelo' }; // Mapping snow to rain/cold for simplicity or add 'snow' later
      if (id >= 700 && id < 800) return { condition: 'clouds', label: 'Neblina' };
      if (id === 800) {
        const isNight = data.weather[0].icon.includes('n');
        return isNight
          ? { condition: 'night', label: 'Noite Limpa' }
          : { condition: 'sun', label: 'Céu Limpo' };
      }
      return { condition: 'clouds', label: 'Nublado' };
    };

    const mapped = mapCondition(data.weather[0].id);

    return {
      temperature: Math.round(data.main.temp),
      condition: mapped.condition,
      conditionLabel: mapped.label,
      windSpeed: Math.round(data.wind.speed * 3.6), // m/s to km/h
      windDirection: 'N/A', // OpenWeather gives degrees, we can simplify or map later
      humidity: data.main.humidity,
      pressure: data.main.pressure,
      visibility: data.visibility / 1000, // meters to km
      city: 'Trafaria', // Or data.name
    };
  } catch (error) {
    console.warn('Weather API failed, using mock data:', error);
    return getMockWeather();
  }
};

export const TIMEZONE_CITIES = [
  { label: 'Lisboa', timezone: 'Europe/Lisbon' },
  { label: 'Londres', timezone: 'Europe/London' },
  { label: 'Nova Iorque', timezone: 'America/New_York' },
  { label: 'Roma', timezone: 'Europe/Rome' },
  { label: 'Trafaria', timezone: 'Europe/Lisbon' }, // Added for context
];
