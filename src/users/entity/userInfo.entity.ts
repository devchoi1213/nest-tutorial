import {IsInt, IsString} from "class-validator";

export class UserInfoEntity {
    @IsString()
    name: string;

    @IsString()
    email: string;

    @IsString()
    id: string;
}