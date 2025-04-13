import isString from 'lodash/isString';
import isEmpty from 'lodash/isEmpty';

export const exception = async (res, error, errorType = 'exception', details = {}) => {
    console.error(error);

    if (error && error.response && !isEmpty(error.response.data)) {
        return res.status(error.statusCode).send({
            errored: true,
            errorType,
            error: isString(error) ? error : JSON.stringify(error.response.data),
            ...details
        });
    }

    return res.status(error.statusCode).send({
        errored: true,
        errorType,
        error: isString(error) ? error : JSON.stringify(error),
        ...details
    });
};

export const error = async (res, error, errorType = 'exception', details = {}) => {
    console.error(error);
    let errorFormatted = error;

    if (
        !isString(error) &&
        errorType !== 'validationError' &&
        !isEmpty(error.response) &&
        !isEmpty(error.response.data)
    ) {
        errorFormatted = JSON.stringify(error.response.data);
    }

    return res.status(500).send({
        errored: true,
        errorType,
        error: errorFormatted,
        ...details
    });
};

export const notAuthorized = async (res, error) => {
    console.error(error);

    if (error && error.response && !isEmpty(error.response.data)) {
        return res.status(401).send({
            errored: true,
            errorType: 'exception',
            error: isString(error) ? error : JSON.stringify(error.response.data)
        });
    }

    return res.status(401).send({
        errored: true,
        errorType: 'exception',
        error: isString(error) ? error : JSON.stringify(error)
    });
};

export const badRequest = async (res, error, errorType = 'exception', details = {}) => {
    console.error(error);

    if (error && error.response && !isEmpty(error.response.data)) {
        return res.status(400).send({
            errored: true,
            errorType,
            error: isString(error) ? error : JSON.stringify(error.response.data),
            ...details
        });
    }

    if (error && errorType === 'validationError') {
        return res.status(400).send({
            errored: true,
            errorType,
            error,
            ...details
        });
    }

    return res.status(400).send({
        errored: true,
        errorType,
        error: isString(error) ? error : JSON.stringify(error),
        ...details
    });
};

export const notFound = async (res, error, errorType = 'exception', details = {}) => {
    console.error(error);
    return res.status(404).send({
        errored: true,
        errorType,
        error: isString(error) ? error : JSON.stringify(error),
        ...details
    });
};

export const ok = async (res, data) => {
    return res.status(200).send(data);
};

export const noContent = async (res) => {
    return res.status(204).send();
};
