import { useContext, useMemo } from "react";
import "./App.css";
import NodeFlow from "./components/NodeFlow";
import FileUploader from "./components/FileUploader";
import { ConfigContext, ConfigProvider } from "./contexts/ConfigContext";
import { getNodesAndEdges } from "./utils/objectToNodeConverter";

function App() {
  const { selectedConfig } = useContext(ConfigContext);

  // use getNodesAndEdges to convert the selected config to nodes and edges
  const { nodes, edges } = useMemo(() => {
    if (!selectedConfig) {
      return { nodes: [], edges: [] };
    }
    return getNodesAndEdges(selectedConfig, "cmp");
  }, [selectedConfig]);

  return (
    <div className='text-white w-full'>
      <p className='text-center'>This is start of something great!</p>
      <div className='flex flex-col md:flex-row h-[90vh] rounded shadow-md p-6 bg-white bg-opacity-[0.05] ring-1 ring-inset ring-white/20 text-white mx-5'>
        <FileUploader />
        <NodeFlow initialEdges={edges} initialNodes={nodes} />
      </div>
    </div>
  );
}

export default App;
