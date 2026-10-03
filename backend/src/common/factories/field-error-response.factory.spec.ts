import { createFieldErrorResponse } from './field-error-response.factory';

describe('createFieldErrorResponse', () => {
    it('FieldErrorを1件渡すとdetailsを1件の配列にする', () => {
        const result = createFieldErrorResponse('Email is already in use', {
            field: 'email',
            messages: ['Email is already in use'],
        });

        expect(result).toEqual({
            message: 'Email is already in use',
            details: [
                {
                    field: 'email',
                    messages: ['Email is already in use'],
                },
            ],
        });
    });

    it('複数のFieldErrorを渡すと入力順を保ってdetailsに設定する', () => {
        const result = createFieldErrorResponse('Invalid interests', [
            {
                field: 'interests.0.interestId',
                messages: ['Interest does not exist or is inactive'],
            },
            {
                field: 'interests.1.interestId',
                messages: ['Interest does not exist or is inactive'],
            },
        ]);

        expect(result).toEqual({
            message: 'Invalid interests',
            details: [
                {
                    field: 'interests.0.interestId',
                    messages: ['Interest does not exist or is inactive'],
                },
                {
                    field: 'interests.1.interestId',
                    messages: ['Interest does not exist or is inactive'],
                },
            ],
        });
    });
});
