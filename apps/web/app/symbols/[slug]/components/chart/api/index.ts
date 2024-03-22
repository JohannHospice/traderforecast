export interface Api<T = any> {
  api: () => T;
  free: () => void;
}
