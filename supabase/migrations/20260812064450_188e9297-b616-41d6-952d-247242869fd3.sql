-- 1) Storage: restrict UPDATE on cvs bucket to staff only
DROP POLICY IF EXISTS "Staff can update CVs" ON storage.objects;
CREATE POLICY "Staff can update CVs" ON storage.objects
  FOR UPDATE TO authenticated
  USING (bucket_id = 'cvs' AND public.is_staff(auth.uid()))
  WITH CHECK (bucket_id = 'cvs' AND public.is_staff(auth.uid()));

-- 2) Remove direct API access to the SECURITY DEFINER bootstrap function
REVOKE ALL ON FUNCTION public.claim_owner() FROM PUBLIC, anon, authenticated;
