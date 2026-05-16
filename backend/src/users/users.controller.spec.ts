import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './users.controller';
import { UsersService } from './users.service';

describe('UserController', () => {
    let controller: UserController;
    let mockUsersService: jest.Mocked<UsersService>;

    beforeEach(async () => {
        // モックの作成
        mockUsersService = {
            findAll: jest.fn(),
            findOne: jest.fn(),
            create: jest.fn(),
        } as any;

        const module: TestingModule = await Test.createTestingModule({
            controllers: [UserController],
            providers: [
                {
                    provide: UsersService,
                    useValue: mockUsersService,
                },
            ],
        }).compile();

        controller = module.get<UserController>(UserController);
    });

    // findAll のテスト
    it('should return all users', async () => {
        const mockUsers = [
            { id: 1, name: 'JURIN', email: 'jurin@example.com' },
            { id: 2, name: 'CHISA', email: 'chisa@example.com' },
        ];
        mockUsersService.findAll.mockReturnValue(mockUsers);

        const result = controller.findAll();

        expect(result).toEqual(mockUsers);
        expect(mockUsersService.findAll).toHaveBeenCalled();
    });

    // findOne のテスト
    it('should return a user by id', async () => {
        const mockUser = { id: 1, name: 'JURIN', email: 'jurin@example.com' };
        mockUsersService.findOne.mockReturnValue(mockUser);

        const result = controller.findOne('1');

        expect(result).toEqual(mockUser);
        expect(mockUsersService.findOne).toHaveBeenCalledWith(1);
    });

    // create のテスト
    it('should create a user', async () => {
        const createUserDto = {
            name: 'たくっち',
            email: 'takucchi@example.com',
        };
        const mockCreatedUser = { id: 4, ...createUserDto };
        mockUsersService.create.mockReturnValue(mockCreatedUser);

        const result = controller.create(createUserDto);

        expect(result).toEqual(mockCreatedUser);
        expect(mockUsersService.create).toHaveBeenCalledWith(createUserDto);
    });
});
