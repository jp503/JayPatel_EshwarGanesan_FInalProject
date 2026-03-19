
export interface Note {
  id: string;
  title?: string;
  body: string;
  color?: string;
  labels?: string[];
  pinned?: boolean;
}