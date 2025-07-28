export interface Area {
  name: string;
  parts?: string[];
  locals?: string[];
}

export interface Regions {
  regions: {
    Luzon: Area[];
    Visayas: Area[];
    Mindanao: Area[];
  };
}

export interface WindSignals {
  signals: {
    [key: string]: Regions;
  };
}
