import { useSelector } from 'react-redux';
import { selectWorkspace } from '../features/workspace/workspaceSlice.js';

export function useWorkspace() {
  return useSelector(selectWorkspace);
}
