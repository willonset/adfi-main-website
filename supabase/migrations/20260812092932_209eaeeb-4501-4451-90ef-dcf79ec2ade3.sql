CREATE SCHEMA IF NOT EXISTS private;
REVOKE ALL ON SCHEMA private FROM PUBLIC, anon, authenticated;
GRANT USAGE ON SCHEMA private TO authenticated, service_role;

CREATE OR REPLACE FUNCTION private.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

CREATE OR REPLACE FUNCTION private.is_staff(_user_id uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role IN ('admin','owner'))
$$;

REVOKE ALL ON FUNCTION private.has_role(uuid, public.app_role) FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION private.is_staff(uuid) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION private.has_role(uuid, public.app_role) TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION private.is_staff(uuid) TO authenticated, service_role;

-- jobs
DROP POLICY IF EXISTS "Admins can view all jobs" ON public.jobs;
DROP POLICY IF EXISTS "Admins can insert jobs" ON public.jobs;
DROP POLICY IF EXISTS "Admins can update jobs" ON public.jobs;
DROP POLICY IF EXISTS "Admins can delete jobs" ON public.jobs;
DROP POLICY IF EXISTS "Staff can view all jobs" ON public.jobs;
DROP POLICY IF EXISTS "Staff can insert jobs" ON public.jobs;
DROP POLICY IF EXISTS "Staff can update jobs" ON public.jobs;
DROP POLICY IF EXISTS "Staff can delete jobs" ON public.jobs;
CREATE POLICY "Staff can view all jobs" ON public.jobs FOR SELECT TO authenticated USING (private.is_staff(auth.uid()));
CREATE POLICY "Staff can insert jobs" ON public.jobs FOR INSERT TO authenticated WITH CHECK (private.is_staff(auth.uid()));
CREATE POLICY "Staff can update jobs" ON public.jobs FOR UPDATE TO authenticated USING (private.is_staff(auth.uid())) WITH CHECK (private.is_staff(auth.uid()));
CREATE POLICY "Staff can delete jobs" ON public.jobs FOR DELETE TO authenticated USING (private.is_staff(auth.uid()));

-- leads
DROP POLICY IF EXISTS "Staff can view leads" ON public.leads;
DROP POLICY IF EXISTS "Staff can update leads" ON public.leads;
DROP POLICY IF EXISTS "Staff can delete leads" ON public.leads;
CREATE POLICY "Staff can view leads" ON public.leads FOR SELECT TO authenticated USING (private.is_staff(auth.uid()));
CREATE POLICY "Staff can update leads" ON public.leads FOR UPDATE TO authenticated USING (private.is_staff(auth.uid())) WITH CHECK (private.is_staff(auth.uid()));
CREATE POLICY "Staff can delete leads" ON public.leads FOR DELETE TO authenticated USING (private.is_staff(auth.uid()));

-- job_applications
DROP POLICY IF EXISTS "Staff can view applications" ON public.job_applications;
DROP POLICY IF EXISTS "Staff can update applications" ON public.job_applications;
DROP POLICY IF EXISTS "Staff can delete applications" ON public.job_applications;
CREATE POLICY "Staff can view applications" ON public.job_applications FOR SELECT TO authenticated USING (private.is_staff(auth.uid()));
CREATE POLICY "Staff can update applications" ON public.job_applications FOR UPDATE TO authenticated USING (private.is_staff(auth.uid())) WITH CHECK (private.is_staff(auth.uid()));
CREATE POLICY "Staff can delete applications" ON public.job_applications FOR DELETE TO authenticated USING (private.is_staff(auth.uid()));

-- blog_posts
DROP POLICY IF EXISTS "Staff can view all posts" ON public.blog_posts;
DROP POLICY IF EXISTS "Staff can insert posts" ON public.blog_posts;
DROP POLICY IF EXISTS "Staff can update posts" ON public.blog_posts;
DROP POLICY IF EXISTS "Staff can delete posts" ON public.blog_posts;
CREATE POLICY "Staff can view all posts" ON public.blog_posts FOR SELECT TO authenticated USING (private.is_staff(auth.uid()));
CREATE POLICY "Staff can insert posts" ON public.blog_posts FOR INSERT TO authenticated WITH CHECK (private.is_staff(auth.uid()));
CREATE POLICY "Staff can update posts" ON public.blog_posts FOR UPDATE TO authenticated USING (private.is_staff(auth.uid())) WITH CHECK (private.is_staff(auth.uid()));
CREATE POLICY "Staff can delete posts" ON public.blog_posts FOR DELETE TO authenticated USING (private.is_staff(auth.uid()));

-- user_roles
DROP POLICY IF EXISTS "Staff can view all roles" ON public.user_roles;
DROP POLICY IF EXISTS "Owner can grant roles" ON public.user_roles;
DROP POLICY IF EXISTS "Owner can revoke roles" ON public.user_roles;
CREATE POLICY "Staff can view all roles" ON public.user_roles FOR SELECT TO authenticated USING (private.is_staff(auth.uid()));
CREATE POLICY "Owner can grant roles" ON public.user_roles FOR INSERT TO authenticated WITH CHECK (private.has_role(auth.uid(), 'owner'::public.app_role));
CREATE POLICY "Owner can revoke roles" ON public.user_roles FOR DELETE TO authenticated USING (private.has_role(auth.uid(), 'owner'::public.app_role) AND user_id <> auth.uid());

-- storage policies
DROP POLICY IF EXISTS "Anyone can upload a CV" ON storage.objects;
DROP POLICY IF EXISTS "Staff can read CVs" ON storage.objects;
DROP POLICY IF EXISTS "Staff can delete CVs" ON storage.objects;
DROP POLICY IF EXISTS "Staff can update CVs" ON storage.objects;
CREATE POLICY "Staff can read CVs" ON storage.objects FOR SELECT TO authenticated USING (bucket_id = 'cvs' AND private.is_staff(auth.uid()));
CREATE POLICY "Staff can update CVs" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'cvs' AND private.is_staff(auth.uid())) WITH CHECK (bucket_id = 'cvs' AND private.is_staff(auth.uid()));
CREATE POLICY "Staff can delete CVs" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'cvs' AND private.is_staff(auth.uid()));

DROP POLICY IF EXISTS "Staff can upload blog media" ON storage.objects;
DROP POLICY IF EXISTS "Staff can update blog media" ON storage.objects;
DROP POLICY IF EXISTS "Staff can delete blog media" ON storage.objects;
DROP POLICY IF EXISTS "Staff can read blog media" ON storage.objects;
CREATE POLICY "Staff can upload blog media" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'blog-media' AND private.is_staff(auth.uid()));
CREATE POLICY "Staff can update blog media" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'blog-media' AND private.is_staff(auth.uid())) WITH CHECK (bucket_id = 'blog-media' AND private.is_staff(auth.uid()));
CREATE POLICY "Staff can delete blog media" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'blog-media' AND private.is_staff(auth.uid()));
CREATE POLICY "Staff can read blog media" ON storage.objects FOR SELECT TO authenticated USING (bucket_id = 'blog-media' AND private.is_staff(auth.uid()));

DROP FUNCTION IF EXISTS public.claim_owner();
DROP FUNCTION IF EXISTS public.has_role(uuid, public.app_role);
DROP FUNCTION IF EXISTS public.is_staff(uuid);