export interface AlbumBlock {
  id: string;
  type: "text" | "image" | "music" | "video" | "hidden-message" | "counter";
  content: string;
  title?: string;
  color?: string;
  textColor?: string;
  order: number;
}

export interface Album {
  id: string;
  senderName: string;
  receiverName: string;
  password: string;
  passwordHint: string;
  mainMessage: string;
  backgroundColor: string;
  textColor: string;
  borderColor: string;
  enableHearts: boolean;
  enableLights: boolean;
  animationSpeed: "slow" | "normal" | "fast";
  textSpeed: "slow" | "normal" | "fast";
  blocks: AlbumBlock[];
  createdAt: number;
  relationshipStartDate: string;
}
