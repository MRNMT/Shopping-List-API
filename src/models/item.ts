export interface Item {
  id: string;
  name: string;
  quantity?: string | number;
  purchased: boolean;
  createdAt: string;
  updatedAt?: string;
  userId: string;
}
