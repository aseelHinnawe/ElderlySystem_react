import * as yup from "yup";

const AddRoomSchema = yup.object().shape({
    roomNumber: yup
        .string()
        .required("رقم الغرفة مطلوب"),
    roomType: yup
        .string()
        .required("نوع الغرفة مطلوب"),
    description: yup
        .string()
        .max(1000, "الوصف طويل جداً")
        .required("الوصف مطلوب"),
    images: yup
        .mixed()
        .test("required", "يجب اختيار صورة واحدة على الأقل", (value) => {
            return value && value.length > 0;
        })
        .test("fileType", "فقط صور مسموح بها", (value) => {
            if (!value || value.length === 0) return true;
            const allowed = ["image/jpeg", "image/png", "image/webp", "image/jpg"];
            return Array.from(value).every((f) => allowed.includes(f.type));
        })
        .test("fileSize", "حجم الصورة يجب ألا يتجاوز 5MB", (value) => {
            if (!value || value.length === 0) return true;
            const max = 5 * 1024 * 1024;
            return Array.from(value).every((f) => f.size <= max);
        }),
});

export default AddRoomSchema;