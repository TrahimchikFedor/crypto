import {
    ValidationArguments,
    ValidatorConstraint,
    ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ name: 'differentFields', async: false })
export class DifferentFieldsConstraint implements ValidatorConstraintInterface {
    validate(value: any, args: ValidationArguments) {
        const [relatedPropertyName] = args.constraints;
        const relatedValue = (args.object as any)[relatedPropertyName];
        return value !== relatedValue;
    }
    defaultMessage(args: ValidationArguments): string {
        const [relatedPropertyName] = args.constraints;
        return `${args.property} должно отличаться от ${relatedPropertyName}`;
    }
}
