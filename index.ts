import { logLint, registerEventLogs } from "./utilities"
import { Student, Course, Enrollment } from "./src/domain/entities"
import {
    Semester,
    createStudentId,
    createCourseCode,
    createEmail,
    createCredits,
    createSemester,
    unwrap
} from "./src/domain/types"
import { enroll, cancelEnrollment, handleEnroll } from "./src/domain/enroll"

function main() {
    registerEventLogs()

    const semester = unwrap(createSemester("Fall2024"))
    const enrollments: Enrollment[] = []

    logLint("i. Successful enrollment {{StudentEnrolled}}")
    const student1 = Student.create(
        unwrap(createStudentId("STU000001")),
        "Alice",
        unwrap(createEmail("alice@example.com"))
    )
    const course1 = Course.create(
        unwrap(createCourseCode("CS101")),
        "Intro to CS",
        unwrap(createCredits(3)),
        30
    )
    handleEnroll(enrollments, student1, course1, semester)

    logLint("ii. Course reaches 80% capacity {{CourseCapacityDone}}")
    const course2 = Course.create(
        unwrap(createCourseCode("MATH201")),
        "Discrete Math",
        unwrap(createCredits(3)),
        5
    )
    for (let i = 2; i <= 5; i++) {
        const student = Student.create(
            unwrap(createStudentId(`STU00000${i}`)),
            `Student${i}`,
            unwrap(createEmail(`student${i}@example.com`))
        )
        handleEnroll(enrollments, student, course2, semester)
    }

    logLint("iii. Course becomes full {{CourseFull}}")
    const student6 = Student.create(
        unwrap(createStudentId("STU000006")),
        "Student6",
        unwrap(createEmail("student6@example.com"))
    )
    handleEnroll(enrollments, student6, course2, semester)

    logLint("iv. Student exceeds 18 credits {{Fails, no event}}")
    const student7 = Student.create(
        unwrap(createStudentId("STU000007")),
        "Student7",
        unwrap(createEmail("student7@example.com"))
    )
    const course3 = Course.create(
        unwrap(createCourseCode("PHY301")),
        "Physics",
        unwrap(createCredits(6)),
        10
    )
    const course4 = Course.create(
        unwrap(createCourseCode("CHEM301")),
        "Chemistry",
        unwrap(createCredits(6)),
        10
    )
    const course5 = Course.create(
        unwrap(createCourseCode("BIO301")),
        "Biology",
        unwrap(createCredits(6)),
        10
    )
    handleEnroll(enrollments, student7, course3, semester)
    handleEnroll(enrollments, student7, course4, semester)
    handleEnroll(enrollments, student7, course5, semester)

    logLint("v. Enrollment cancellation {{EnrollmentCancelled}}")
    const enrollmentToCancel = enrollments.find(
        e => e.studentId === student1.id && e.courseCode === course1.code && e.isActive
    )
    if (!enrollmentToCancel) {
        console.log("No active enrollment found to cancel")
        return
    }
    const cancelResult = cancelEnrollment(enrollmentToCancel, student1, course1)
    if (cancelResult instanceof Error) {
        console.log("Cancel failed:", cancelResult.message)
    }
}

main()