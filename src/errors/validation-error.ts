

export class ValidationError extends Error {
    public readonly falseProperties: Record<string, any>;

    constructor(falseProperties: Record<string, any>) {
        super('validation error');
        this.falseProperties = falseProperties;
    }
}
