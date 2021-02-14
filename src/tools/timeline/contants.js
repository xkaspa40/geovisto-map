import {
    eachDayOfInterval,
    eachHourOfInterval,
    eachMonthOfInterval,
    eachWeekOfInterval,
    eachYearOfInterval,
} from 'date-fns';

// export const TimeGranularity = {
//     HOUR: 'TIME_GRANULARITY_HOUR',
//     DAY: 'TIME_GRANULARITY_DAY',
//     WEEK: 'TIME_GRANULARITY_WEEK',
//     MONTH: 'TIME_GRANULARITY_MONTH',
//     YEAR: 'TIME_GRANULARITY_YEAR',
// };

export const TimeGranularity = {
    HOUR: 'hour',
    DAY: 'day',
    WEEK: 'week',
    MONTH: 'month',
    YEAR: 'year',
};

export const AggregationFunction = {
    SUM: 'AGGREGATION_FUNCTION_SUM',
    AVERAGE: 'AGGREGATION_FUNCTION_AVERAGE',
};

export const IntervalFunction = {
    [TimeGranularity.HOUR]: eachHourOfInterval,
    [TimeGranularity.DAY]: eachDayOfInterval,
    [TimeGranularity.WEEK]: eachWeekOfInterval,
    [TimeGranularity.MONTH]: eachMonthOfInterval,
    [TimeGranularity.YEAR]: eachYearOfInterval,
};

export const TimeInterval = {
    [TimeGranularity.HOUR]: 'hours',
    [TimeGranularity.DAY]: 'days',
    [TimeGranularity.WEEK]: 'weeks',
    [TimeGranularity.MONTH]: 'months',
    [TimeGranularity.YEAR]: 'years',
};
