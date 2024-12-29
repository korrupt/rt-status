export interface CreateAuthKeyModel {
  watcher_id: string;
  expires_at?: Date;
}

export type CreateAuthKeyResultModel = CreateAuthKeyModel & {
  id: string;
  key: string;
  created_at: Date;
  updated_at: Date;
  last_used_at: Date;
  revoked_at?: Date;
};

export type UpdateAuthKeyModel = Partial<
  Omit<CreateAuthKeyResultModel, 'created_at' | 'updated_at' | 'id' | 'key'>
>;

export type UpdateAuthKeyResultModel = CreateAuthKeyResultModel;
