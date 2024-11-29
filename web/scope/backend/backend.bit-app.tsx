import { NodeServer } from '@bitdev/node.node-server';

export default NodeServer.from({
  name: 'backend',
  mainPath: import.meta.resolve('./backend.app-root.js'),
});
