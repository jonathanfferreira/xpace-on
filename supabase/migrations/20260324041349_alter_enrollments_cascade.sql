-- Permite que um curso seja excluído mesmoco existindo matrículas (apagando as matrículas em cascata)
ALTER TABLE "public"."enrollments" DROP CONSTRAINT "enrollments_course_id_fkey";
ALTER TABLE "public"."enrollments" ADD CONSTRAINT "enrollments_course_id_fkey" FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE;
