import * as uuid from 'uuid';
import {Injectable, NotFoundException, UnprocessableEntityException} from '@nestjs/common';
import { EmailService } from 'src/email/email.service';
import {InjectRepository} from "@nestjs/typeorm";
import {DataSource, Repository} from "typeorm";
import {UserEntity} from "./entity/user.entity";
import {ulid} from "ulid";
import {AuthService} from "../auth/auth.service";
import {UserInfoEntity} from "./entity/userInfo.entity";

@Injectable()
export class UsersService {
    constructor(
        private emailService: EmailService,
        private authService: AuthService,
        @InjectRepository(UserEntity) private usersRepository: Repository<UserEntity>,  // 유저 리포지토리를 주입
        private dataSource: DataSource
    ) { }

    async createUser(name: string, email: string, password: string) {
        const userExist = await this.checkUserExists(email);

        if (userExist) {
            throw new UnprocessableEntityException('해당 이메일로는 가입할 수 없습니다.');
        }

        const signupVerifyToken = uuid.v1();

        await this.saveUser(name, email, password, signupVerifyToken);
        await this.sendMemberJoinEmail(email, signupVerifyToken);
    }

    private async checkUserExists(emailAddress: string) {
        const user = await this.usersRepository.findOne({ where: {email: emailAddress} });
        return user !== null;
    }

    private async saveUser(name: string, email: string, password: string, signupVerifyToken: string) {
        const queryRunner = this.dataSource.createQueryRunner();

        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            const user = new UserEntity();
            user.id = ulid();
            user.name = name;
            user.email = email;
            user.password = password;
            user.signupVerifyToken = signupVerifyToken;
            await queryRunner.manager.save(user);

            // throw new InternalServerErrorException(); // 일부러 에러를 발생시켜 본다

            await queryRunner.commitTransaction();
        } catch (e) {
            // 에러가 발생하면 롤백
            await queryRunner.rollbackTransaction();
        } finally {
            // 직접 생성한 QueryRunner는 해제시켜 주어야 함
            await queryRunner.release();
        }
    }

    private async sendMemberJoinEmail(email: string, signupVerifyToken: string) {
        await this.emailService.sendMemberJoinVerification(email, signupVerifyToken);
    }

    async verifyEmail(signupVerifyToken: string): Promise<string> {
        const user = await this.usersRepository.findOne({ where: { signupVerifyToken } });

        if (!user) {
            throw new NotFoundException('유저가 존재하지 않습니다');
        }

        return this.authService.login({
            id: user.id,
            name: user.name,
            email: user.email,
        });
    }

    async login(email: string, password: string): Promise<string> {
        const user = await this.usersRepository.findOne({ where: { email, password } });

        if (!user) {
            throw new NotFoundException('유저가 존재하지 않습니다');
        }

        return this.authService.login({
            id: user.id,
            name: user.name,
            email: user.email,
        });
    }

    async getUserInfo(userId: string): Promise<UserInfoEntity> {
        const user = await this.usersRepository.findOne({ where: { id: userId } });

        if (!user) {
            throw new NotFoundException('유저가 존재하지 않습니다');
        }

        return {
            id: user.id,
            name: user.name,
            email: user.email,
        };
    }
}