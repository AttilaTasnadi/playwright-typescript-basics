export const STEP_MARKER = 'STEP';
export const RESULT_MARKER = 'RESULT';
export const ACTION_MARKER = 'ACTION';
export const DATA_MARKER = 'DATA';

export type Marker =
  | typeof STEP_MARKER
  | typeof RESULT_MARKER
  | typeof ACTION_MARKER
  | typeof DATA_MARKER;