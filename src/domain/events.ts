import { StudentId, CourseCode, Semester, EnrollmentId } from "./types"

export type StudentEnrolledEvent = {
    id: StudentId
    courseCode: CourseCode
    semester: Semester
    enrollmentId: EnrollmentId
}

export type EnrollmentCancelledEvent = {
    id: EnrollmentId
    studentId: StudentId
    courseCode: CourseCode
    semester: Semester
}

export type CourseFullEvent = {
    courseCode: CourseCode
    semester: Semester
    capacity: number
    enrolledCount: number
}

export type CourseCapacityDoneEvent = {
    code: CourseCode
    semester: Semester
    capacity: number
    enrolledCount: number
}

export type DomainEvent =
    | { type: "StudentEnrolled"; payload: StudentEnrolledEvent }
    | { type: "EnrollmentCancelled"; payload: EnrollmentCancelledEvent }
    | { type: "CourseFull"; payload: CourseFullEvent }
    | { type: "CourseCapacityDone"; payload: CourseCapacityDoneEvent }
    