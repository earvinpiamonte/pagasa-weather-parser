export interface Area {
  name: string;
  parts?: string[];
  locals?: string[];
}

export interface Regions {
  regions: {
    luzon: Area[];
    visayas: Area[];
    mindanao: Area[];
  };
}

export interface WindSignals {
  signals: {
    [key: string]: Regions;
  };
}
