import { memo } from 'react';
import { Handle, Position, NodeResizer } from 'reactflow';

const ResizableNode = (Component: any) => () => {
  return (
    <>
      <NodeResizer minWidth={100} minHeight={30} />
        <Component />
        <div>Hello</div>
    </>
  );
};

export default ResizableNode
