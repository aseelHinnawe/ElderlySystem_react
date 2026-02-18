import * as yup from "yup";

const AddActivitySchema = yup.object({
    activityName: yup
        .string()
        .trim()
        .required("اسم النشاط مطلوب")
        .min(2, "اسم النشاط قصير جدًا"),

    description: yup
        .string()
        .trim()
        .required("الوصف مطلوب")
        .min(5, "الوصف قصير جدًا"),

    location: yup
        .string()
        .trim()
        .required("الموقع مطلوب")
        .min(2, "الموقع قصير جدًا"),

    date: yup
        .string()
        .required("التاريخ مطلوب"),

    startTime: yup
        .string()
        .trim()
        .required("وقت البداية مطلوب")
        .min(2, "وقت البداية غير صحيح"),

    activityOrganizations: yup
        .array()
        .of(
            yup.object({
                organizationName: yup
                    .string()
                    .trim()
                    .required("اسم الجهة مطلوب")
                    .min(2, "اسم الجهة قصير جدًا"),
            })
        )
        .min(1, "أضف جهة واحدة على الأقل")
        .required("الجهات مطلوبة"),
});

export default AddActivitySchema;