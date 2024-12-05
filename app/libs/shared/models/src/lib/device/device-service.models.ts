export interface CreateDeviceModel {
  slug: string;
  name: string;
  description?: string;
  location?: unknown;
}

export type CreateDeviceResultModel = CreateDeviceModel & {
  id: string;
};

export type UpdateDeviceModel = Partial<CreateDeviceModel>;

export type FindDeviceByIdResultModel = CreateDeviceResultModel;

export type FindDeviceResultModel = FindDeviceByIdResultModel[];

export type DeleteDeviceResultModel = {
  id: string;
};
