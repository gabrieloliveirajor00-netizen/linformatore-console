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

export const TIMEZONE_CITIES = [
  { label: 'Lisboa', timezone: 'Europe/Lisbon' },
  { label: 'Londres', timezone: 'Europe/London' },
  { label: 'Nova Iorque', timezone: 'America/New_York' },
  { label: 'Roma', timezone: 'Europe/Rome' },
];
