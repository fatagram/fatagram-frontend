export enum TimeUnit {
    Miliseconds = "Miliseconds",
    Seconds = "Seconds",
    Minutes = "Minutes",
    Hours = "Hours",
    Days = "Days",
    Weeks = "Weeks",
    Months = "Months",
    Years = "Years"
}

export const TimeUnitTranslateMap: Record<TimeUnit, string> = {
    [TimeUnit.Miliseconds]: "times:time.milisecond",
    [TimeUnit.Seconds]: "times:time.second",
    [TimeUnit.Minutes]: "times:time.minute",
    [TimeUnit.Hours]: "times:time.hour",
    [TimeUnit.Days]: "times:time.day",
    [TimeUnit.Weeks]: "times:time.week",
    [TimeUnit.Months]: "times:time.month",
    [TimeUnit.Years]: "times:time.year"
}