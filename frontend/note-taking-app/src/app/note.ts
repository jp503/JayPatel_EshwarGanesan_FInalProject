
export interface Note {
  id: number;
  title?: string;
  content: string;
  color?: string;
  tags?: string[];
  pinned?: boolean;
  passwordProtected?: boolean;
}