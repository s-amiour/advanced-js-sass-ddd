import { domainEvents } from "./src/infra/event"

export function logLint(title: string) {
    console.log(`\n=============|  ${title}  |=============`)
}

export function registerEventLogs() {
    domainEvents.sub("StudentEnrolled", e =>
        console.log("Event: StudentEnrolled", {
            studentId: e.id,
            courseCode: e.courseCode,
            semester: e.semester,
            enrollmentId: e.enrollmentId
        })
    )
    domainEvents.sub("EnrollmentCancelled", e =>
        console.log("Event: EnrollmentCancelled", {
            enrollmentId: e.id,
            studentId: e.studentId,
            courseCode: e.courseCode,
            semester: e.semester
        })
    )
    domainEvents.sub("CourseCapacityDone", e =>
        console.log("Event: CourseCapacityReached", {
            courseCode: e.code,
            semester: e.semester,
            capacity: e.capacity,
            enrolledCount: e.enrolledCount
        })
    )
    domainEvents.sub("CourseFull", e =>
        console.log("Event: CourseFull", {
            courseCode: e.courseCode,
            semester: e.semester,
            capacity: e.capacity,
            enrolledCount: e.enrolledCount
        })
    )
}