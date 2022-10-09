import {IsInt, IsString} from "class-validator";

export class UserInfoEntity {
    @IsInt()
    name: string;

    @IsString()
    email: string;

    @IsString()
    id: string;
}