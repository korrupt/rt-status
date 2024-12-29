export interface CreateUserModel {
  name: string;
}

export type CreateUserResultModel = CreateUserModel & {
  id: string;
};

export type FindUserByIdResultModel = CreateUserModel;

export type FindUserResultModel = FindUserByIdResultModel[];

export type UpdateUserModel = Partial<CreateUserModel>;

export type DeleteUserModel = { id: string };
