import * as yup from "yup";

const CompleteNurseProfileSchema = yup.object({
  educationLevel: yup
    .string()
    .required("المستوى التعليمي مطلوب"),

  maritalStatus: yup
    .string()
    .required("الحالة الاجتماعية مطلوبة"),

  fieldOfStudy: yup
    .string()
    .max(100, "مجال الدراسة يجب ألا يزيد عن 100 حرف")
    .required("مجال الدراسة مطلوب"),

  yearsOfStudy: yup
    .number()
    .min(0)
    .max(20)
    .required("عدد سنوات الدراسة مطلوب"),

  yearOfGraduation: yup
    .string()
    .matches(/^\d{4}$/, "سنة التخرج يجب أن تكون 4 أرقام")
    .required("سنة التخرج مطلوبة"),

  workExperiences: yup.array().of(
  yup.object({
    workName: yup.string().max(100),
    workLocation: yup.string().max(100),
    jobTitle: yup.string().max(50),
  })
)
});

export default CompleteNurseProfileSchema;
