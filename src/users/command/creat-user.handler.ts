import {CommandHandler, EventBus, ICommandHandler} from '@nestjs/cqrs';
import { CreateUserCommand } from './creat-user.command';
import {Injectable, UnprocessableEntityException} from "@nestjs/common";
import * as uuid from "uuid";
import {InjectRepository} from "@nestjs/typeorm";
import {UserEntity} from "../entity/user.entity";
import {DataSource, Repository} from "typeorm";
import {ulid} from "ulid";
import {UserCreatedEvent} from "../event/user-created.event";
import {TestEvent} from "../event/test.event";

@Injectable()
@CommandHandler(CreateUserCommand)
export class CreateUserHandler implements ICommandHandler<CreateUserCommand> {

    constructor(
        @InjectRepository(UserEntity) private usersRepository: Repository<UserEntity>,  // 유저 리포지토리를 주입
        private dataSource: DataSource,
        private eventBus: EventBus,
    ) {
    }

    async execute(command: CreateUserCommand) {
        const { name, email, password } = command;

        const userExist = await this.checkUserExists(email);

        if (userExist) {
            throw new UnprocessableEntityException('해당 이메일로는 가입할 수 없습니다.');
        }

        const signupVerifyToken = uuid.v1();

        await this.saveUser(name, email, password, signupVerifyToken);
        this.eventBus.publish(new UserCreatedEvent(email, signupVerifyToken));
        this.eventBus.publish(new TestEvent());
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
}