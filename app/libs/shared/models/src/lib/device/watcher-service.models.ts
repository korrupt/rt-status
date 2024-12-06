export interface CreateWatcherModel {
  name: string;
  description?: string;
  slug: string;
  device_id: string;
}

export type CreateWatcherResultModel = CreateWatcherModel & {
  id: string;
};

export type FindWatcherByIdResultModel = CreateWatcherResultModel;

export type FindWatcherResultModel = FindWatcherByIdResultModel[];

export type UpdateWatcherModel = Partial<CreateWatcherModel>;
export type UpdateWatcherResultModel = CreateWatcherResultModel;

export type DeleteWatcherResultModel = { id: string };
