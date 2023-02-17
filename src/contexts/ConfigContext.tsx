import { JSONObject } from "commonTypes";
import React, { createContext, useState } from "react";

export type ConfigType = {
  name: string;
  type: string;
  data: JSONObject;
};

export type ConfigContextType = {
  configs: ConfigType[];
  selectedConfig: ConfigType | null;
  addConfig: (config: ConfigType) => void;
  setSelectedConfig: (config: ConfigType | null) => void;
};

export const ConfigContext = createContext<ConfigContextType>({
  configs: [],
  addConfig: () => {},
  selectedConfig: null,
  setSelectedConfig: () => {},
});

export const ConfigProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [configs, setConfigs] = useState<ConfigType[]>([]);
  const [selectedConfig, setSelectedConfig] = useState<ConfigType | null>(null);

  function addConfig(config: ConfigType) {
    setConfigs((prevConfigs) => [...prevConfigs, config]);
  }

  return (
    <ConfigContext.Provider
      value={{ configs, addConfig, selectedConfig, setSelectedConfig }}
    >
      {children}
    </ConfigContext.Provider>
  );
};
