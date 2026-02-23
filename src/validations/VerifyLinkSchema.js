import * as yup from "yup";

const VerifyLinkSchema = yup.object({
    elderlyNationalId: yup
        .string()
        .trim()
        .required("رقم هوية المسن مطلوب")
        .matches(/^\d+$/, "رقم هوية المسن يجب أن يحتوي أرقام فقط")
        .length(9, "رقم الهوية يجب ان يكون من 9 ارقام"),
    sponsorNationalId: yup
        .string()
        .trim()
        .required("رقم هوية الكفيل مطلوب")
        .matches(/^\d+$/, "رقم هوية الكفيل يجب أن يحتوي أرقام فقط")
        .length(9, "رقم الهوية يجب ان يكون من 9 ارقام"),
});

export default VerifyLinkSchema;