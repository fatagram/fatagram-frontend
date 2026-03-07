import { ProfileDto } from "./profile.dto";

export type GetMeDto = ProfileDto<{
  id: string;
  urlName: string;
  languageCode: string;
}>;
