export interface AreaDetail {
  name: string;
  parts?: string[];
  locals?: string[];
}

export interface SignalArea {
  areas: {
    Luzon: AreaDetail[];
    Visayas: AreaDetail[];
    Mindanao: AreaDetail[];
  };
}

export interface WindSignals {
  signals: {
    [key: string]: SignalArea;
  };
}
