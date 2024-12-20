export interface TrackerInfo {
    dailyVersion: string;
    weeklyVersion: string;
    lastDailyTrackerVisit: string;
    lastWeeklyTrackerVisit: string;
    dailyInfoVisible: boolean;
    dailyInfoTitle: string;
    dailyInfoText: string;
    weeklyInfoVisible: boolean;
    weeklyInfoTitle: string;
    weeklyInfoText: string;
    dailyImagePrefix: string;
    weeklyImagePrefix: string;
}

export interface TaskGroup {
    title: string;
    image: string;
    tasks: Task[];
    allDisabled: boolean;
}

export interface Task {
    name: string;
    image: string;
    done: boolean;
    enabled: boolean;
    type: string;
    dispCon: string;
}