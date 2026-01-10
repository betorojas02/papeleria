export class ApiResponse {
    static success<T>(data: T, message: string = 'Operation successful') {
        return {
            data,
            message,
        };
    }

    static error(message: string, errors?: any) {
        return {
            message,
            errors,
        };
    }

    static created<T>(data: T, message: string = 'Resource created successfully') {
        return {
            data,
            message,
        };
    }

    static updated<T>(data: T, message: string = 'Resource updated successfully') {
        return {
            data,
            message,
        };
    }

    static deleted(message: string = 'Resource deleted successfully') {
        return {
            message,
        };
    }
}
