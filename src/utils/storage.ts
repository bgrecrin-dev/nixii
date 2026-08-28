import { StudentProfile, PinItem, TaskItem, PlannerEntry, ScheduleLesson, SavedCourseGrade } from '../types';
import { initialProfile, initialPins, initialTasks, initialPlannerEntries, initialScheduleLessons } from '../data/initialData';

const STORAGE_KEYS = {
  PROFILE: 'nixi_student_profile_v2',
  PINS: 'nixi_pins_v2',
  TASKS: 'nixi_tasks_v2',
  PLANNER: 'nixi_planner_entries_v2',
  SCHEDULE: 'nixi_weekly_schedule_v2',
  SAVED_GRADES: 'nixi_saved_course_grades_v2',
  ONBOARDING: 'nixi_onboarding_completed_v2',
  VIEW_MODE: 'nixi_view_mode_v2',
};

export function hasCompletedOnboarding(): boolean {
  try {
    return localStorage.getItem(STORAGE_KEYS.ONBOARDING) === 'true';
  } catch {
    return false;
  }
}

export function setOnboardingCompleted(completed: boolean): void {
  try {
    localStorage.setItem(STORAGE_KEYS.ONBOARDING, completed ? 'true' : 'false');
  } catch (e) {
    console.warn('Failed to save onboarding state to localStorage', e);
  }
}

export function loadProfile(): StudentProfile {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.PROFILE);
    if (raw) {
      const parsed = JSON.parse(raw);
      return { ...initialProfile, ...parsed };
    }
  } catch (e) {
    console.warn('Failed to load profile from localStorage', e);
  }
  return initialProfile;
}

export function saveProfile(profile: StudentProfile): void {
  try {
    localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(profile));
  } catch (e) {
    console.warn('Failed to save profile to localStorage', e);
  }
}

export function loadPins(): PinItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.PINS);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.warn('Failed to load pins from localStorage', e);
  }
  return initialPins;
}

export function savePins(pins: PinItem[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.PINS, JSON.stringify(pins));
  } catch (e) {
    console.warn('Failed to save pins to localStorage', e);
  }
}

export function loadTasks(): TaskItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.TASKS);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.warn('Failed to load tasks from localStorage', e);
  }
  return initialTasks;
}

export function saveTasks(tasks: TaskItem[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks));
  } catch (e) {
    console.warn('Failed to save tasks to localStorage', e);
  }
}

export function loadPlannerEntries(): PlannerEntry[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.PLANNER);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.warn('Failed to load planner entries from localStorage', e);
  }
  return initialPlannerEntries;
}

export function savePlannerEntries(entries: PlannerEntry[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.PLANNER, JSON.stringify(entries));
  } catch (e) {
    console.warn('Failed to save planner entries to localStorage', e);
  }
}

export function loadScheduleLessons(): ScheduleLesson[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SCHEDULE);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        return parsed;
      }
    }
  } catch (e) {
    console.warn('Failed to load schedule lessons from localStorage', e);
  }
  return initialScheduleLessons as ScheduleLesson[];
}

export function saveScheduleLessons(lessons: ScheduleLesson[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.SCHEDULE, JSON.stringify(lessons));
  } catch (e) {
    console.warn('Failed to save schedule lessons to localStorage', e);
  }
}

export function loadSavedCourseGrades(): SavedCourseGrade[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SAVED_GRADES);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        return parsed;
      }
    }
  } catch (e) {
    console.warn('Failed to load saved grades from localStorage', e);
  }
  return [];
}

export function saveSavedCourseGrades(grades: SavedCourseGrade[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.SAVED_GRADES, JSON.stringify(grades));
  } catch (e) {
    console.warn('Failed to save saved grades to localStorage', e);
  }
}

export function loadViewMode(): 'masonry' | 'compact' {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.VIEW_MODE);
    if (raw === 'compact' || raw === 'masonry') {
      return raw;
    }
  } catch {
    // default
  }
  return 'masonry';
}

export function saveViewMode(mode: 'masonry' | 'compact'): void {
  try {
    localStorage.setItem(STORAGE_KEYS.VIEW_MODE, mode);
  } catch (e) {
    console.warn('Failed to save view mode to localStorage', e);
  }
}

export function resetAllData(): {
  profile: StudentProfile;
  pins: PinItem[];
  tasks: TaskItem[];
  plannerEntries: PlannerEntry[];
  scheduleLessons: ScheduleLesson[];
} {
  try {
    localStorage.removeItem(STORAGE_KEYS.PROFILE);
    localStorage.removeItem(STORAGE_KEYS.PINS);
    localStorage.removeItem(STORAGE_KEYS.TASKS);
    localStorage.removeItem(STORAGE_KEYS.PLANNER);
    localStorage.removeItem(STORAGE_KEYS.SCHEDULE);
    localStorage.removeItem(STORAGE_KEYS.SAVED_GRADES);
    localStorage.removeItem(STORAGE_KEYS.ONBOARDING);
    localStorage.removeItem(STORAGE_KEYS.VIEW_MODE);
  } catch (e) {
    console.warn('Failed to reset localStorage', e);
  }
  return {
    profile: initialProfile,
    pins: initialPins,
    tasks: initialTasks,
    plannerEntries: initialPlannerEntries,
    scheduleLessons: initialScheduleLessons as ScheduleLesson[],
  };
}
