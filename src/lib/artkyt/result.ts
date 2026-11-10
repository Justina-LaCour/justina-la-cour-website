export type BaseError<C = string> = {
    code: C;
    message: string;
};

export type Success<T> = {
    success: true;
    value: T;
};

export type Failure<E = BaseError> = {
    success: false;
    error: E;
}

export type Result<T, E extends BaseError = BaseError> = Success<T> | Failure<E>;

export function ok<T>(value: T): Success<T> {
    return {
        success: true,
        value
    }
}

export function failure<E>(error: E): Failure<E> {
    return {
        success: false,
        error
    };
}

export function mapResult<T, U, E extends BaseError = BaseError>(
    result: Result<T, E>,
    mapper: (value: T) => U
): Result<U, E> {
    if (!result.success) return result;

    return ok(mapper(result.value));
}
