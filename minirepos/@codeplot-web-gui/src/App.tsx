import 'reactflow/dist/style.css';

import { memo, useCallback, useEffect } from 'react';
import ReactFlow, { Background, BackgroundVariant, Connection, Controls, MiniMap, SelectionMode, addEdge, useEdgesState, useNodesState, useReactFlow } from 'reactflow';
import 'reactflow/dist/style.css';
import NodeWrapper from './NodeWrapper';

const SomeComp = memo(() => (<div className='bg-red-500 w-full h-full'>{Date.now()}</div>))

const nodeTypes = {
  resizable: NodeWrapper(SomeComp),
}

 
const initialNodes = [
  { type: 'resizable', id: '1', position: { x: 0, y: 0 }, data: { label: '1' } },
  { type: 'resizable', id: '2', position: { x: 0, y: 100 }, data: { label: '2' } },
];
const initialEdges = [{ id: 'e1-2', source: '1', target: '2' }];

const panOnDrag = [1, 2];

import { observer } from 'mobx-react';
import { useKeyPress } from 'reactflow';
import { FileModel } from './FileModel';


const fileStore = FileModel.create({ fileContent: null });

const FileComponent = observer(() => {
  useEffect(() => {
    const interval = setInterval(() => {
      fileStore.checkForChanges(); // Use the action to check for changes
    }, 100); // Adjust the interval as needed

    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      <button onClick={() => fileStore.selectAndReadFile()}>Select File</button>
      <div>File Content: {fileStore.fileContent}</div>
    </div>
  );
});



function Flow() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  useEffect(() => {
    if (!window.showOpenFilePicker) {
      alert("The File System Access API is not supported in this browser.");
      return;
    }
    
  }, [])
  const onConnect = useCallback(
    (connection: Connection) => setEdges((eds) => addEdge(connection, eds)),
    [setEdges]
  );


  return (
    <div style={{ width: '100vw', height: '100vh' }}>
    <FileComponent />
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onConnect={onConnect}
      snapGrid={[8, 8]}
      snapToGrid={true}
      panOnScroll

      selectionOnDrag
      panOnDrag={panOnDrag}
      selectionMode={SelectionMode.Partial}
      nodeTypes={nodeTypes}
    >
      <Background variant={BackgroundVariant.Dots} />
      <MiniMap />
      <Controls />
      <SomeComponent />
      </ReactFlow>
    </div>
  );
}

const SomeComponent = () => {
  const a = useReactFlow();


  
 
    const spacePressed = useKeyPress('Space');
    const cmdAndSPressed = useKeyPress(['Meta+s', 'Strg+s']);
   const deletePressed = useKeyPress('Delete');

   useEffect(() => {
    if(deletePressed) {
      const nodesToDelete = a.getNodes().filter((node) => node.selected).map((node) => ({id: node.id}));
      a.deleteElements({nodes: nodesToDelete});
    }
  }, [deletePressed]);
  
    return (
      <div>
        {spacePressed && <p>Space pressed!</p>}
        {cmdAndSPressed && <p>Cmd + S pressed!</p>}
      </div>
    );
  }
export default Flow;
