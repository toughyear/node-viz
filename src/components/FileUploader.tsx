import React, { useContext } from "react";
import yaml from "yaml";
import { ConfigContext, ConfigType } from "../contexts/ConfigContext";

function FileUploader() {
  const { addConfig, configs, selectedConfig, setSelectedConfig } =
    useContext(ConfigContext);

  const saveFilesToState = (files: FileList) => {
    // for all files uploaded, read them. If they are YAML, convert to JSON using yaml library. If it is JSON, parse it using JSON.parse
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      // check if file already exists in state
      if (configs.some((config) => config.name === file.name)) {
        continue;
      }

      const reader = new FileReader();
      reader.onload = function (e) {
        if (e.target && e.target.result) {
          let config: ConfigType;
          if (file.name.endsWith(".yaml") || file.name.endsWith(".yml")) {
            config = yaml.parse(e.target.result as string);
            // add name and type to config
            config.name = file.name;
            config.type = "yaml";
          } else {
            config = JSON.parse(e.target.result as string);
            // add name and type to config
            config.name = file.name;
            config.type = "json";
          }
          addConfig(config);
          // if selected config is null, set it to the first config
          if (!selectedConfig && i === 0) {
            setSelectedConfig(config);
          }
        }
      };
      reader.readAsText(file);
    }
  };

  function handleFileUpload(event: React.ChangeEvent<HTMLInputElement>) {
    if (!event.target.files || event.target.files.length === 0) {
      return;
    }

    saveFilesToState(event.target.files);
  }

  const handleClick = () => {
    if (typeof window === "undefined") {
      return;
    }

    document.getElementById("uploader-input")?.click();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileUpload(e as any);
      e.dataTransfer.clearData();
    }

    // store all files in state
    saveFilesToState(e.dataTransfer.files);
  };

  const handleConfigSelection = (config: ConfigType) => {
    setSelectedConfig(config);
  };

  return (
    <div className='flex flex-col items-center w-full md:w-1/5 rounded shadow-md p-6 bg-white/10 ring-1 ring-inset ring-white/20 text-white mx-10'>
      <div
        id='dropzone'
        className='relative my-10 flex h-64 w-full cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed border-gray-200 text-center'
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        onClick={handleClick}
      >
        <div className='text-lg text-gray-300'>
          Drop a file or click to upload
        </div>
        <div className='text-lg text-gray-300'>-----------</div>
        <div className='text-lg text-gray-300'>
          press{" "}
          <span className='rounded bg-indigo-700 px-2 py-1 text-sm text-white'>
            {" "}
            cmd
          </span>
          {" + "}
          <span className='rounded bg-indigo-700 p-1 text-sm text-white'>
            v
          </span>{" "}
          to paste
        </div>
        <input
          type='file'
          multiple
          name='uploader'
          id='uploader-input'
          className='hidden'
          onChange={handleFileUpload}
        />
      </div>
      <div>
        {
          // display all file names and types
          configs.map((config, index) => (
            <div
              key={index}
              className={`text-sm text-gray-200 px-5 py-2 bg-white/10 mb-5 rounded-md cursor-pointer ${
                selectedConfig?.name === config.name
                  ? "bg-indigo-700"
                  : "hover:bg-white/20"
              }`}
              onClick={() => handleConfigSelection(config)}
            >
              {config.name as string}
            </div>
          ))
        }
      </div>
    </div>
  );
}

export default FileUploader;
