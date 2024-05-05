import winston from 'winston';

const customLevelsOptions = {
    levels: {
        fatal: 0,
        error: 1,
        warning: 2,
        info: 3,
        http: 4,
        debug: 5,
    },
    colors: {
        fatal: 'bold italic redBG',
        error: 'bold italic red',
        warning: 'bold italic yellow',
        info: 'bold italic blue',
        debug: 'italic cyan',
    },
}

const devLogger = winston.createLogger({
    levels: customLevelsOptions.levels,
    transports: [
        new winston.transports.Console({
            level: 'debug',
            format: winston.format.combine(
                winston.format.colorize({ colors: customLevelsOptions.colors }),
                winston.format.simple()
            )
        }),
    ],
});

const prodLogger = winston.createLogger({
    levels: customLevelsOptions.levels,
    transports: [
        new winston.transports.Console({
            level: 'info',
            format: winston.format.combine(
                winston.format.colorize({ colors: customLevelsOptions.colors }),
                winston.format.simple()
            )
        }),
        new winston.transports.File({
            filename: 'logs/errors.log',
            level: 'error',
            format: winston.format.combine(
                winston.format.timestamp(),
                winston.format.json()
            )
        }),
    ],
});

winston.addColors(customLevelsOptions.colors);

Object.keys(customLevelsOptions.levels).forEach(level => {
    devLogger[level] = message => devLogger.log({ level, message });
    prodLogger[level] = message => prodLogger.log({ level, message });
})

export const addLogger = (req, res, next) => {
    const env = process.env.NODE_ENV || 'development';
    req.logger = env === 'production' ? prodLogger : devLogger;
    next();
}

export const getLogger = () => {
    const env = process.env.NODE_ENV || 'development';
    return env === 'production' ? prodLogger : devLogger;
};