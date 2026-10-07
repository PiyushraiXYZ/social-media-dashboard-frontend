import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { PageHeader } from '../../../components/layout/PageHeader/PageHeader.jsx';
import { Card } from '../../../components/ui/Card/Card.jsx';
import { Skeleton } from '../../../components/ui/Skeleton/Skeleton.jsx';
import { Alert } from '../../../components/ui/Alert/Alert.jsx';
import { useGetProfileQuery } from '../api.js';
import { setProfile } from '../brandSlice.js';
import { CompanyProfileForm } from '../components/CompanyProfileForm.jsx';
import { AssetUploader } from '../components/AssetUploader.jsx';
import { BrandPreview } from '../components/BrandPreview.jsx';
import { BrandingControls } from '../components/BrandingControls.jsx';

export function BrandSettingsPage() {
  const dispatch = useDispatch();
  const { data, isLoading, isError, error } = useGetProfileQuery();

  useEffect(() => {
    if (data) {
      dispatch(setProfile({
        persona: data.persona || '',
        industry: data.industry || '',
        brand_name: data.brand_name || '',
        logo_url: data.logo_url || '',
        tone: data.tone || '',
        audience: data.audience || '',
        country_code: data.country_code || '',
        language: data.language || '',
        posts_per_week: data.posts_per_week || 3,
      }));
      if (data.footer_url) dispatch(setProfile({ footer_url: data.footer_url }));
    }
  }, [data, dispatch]);

  if (isLoading) {
    return (
      <>
        <PageHeader eyebrow="Brand" title="A consistent signature." />
        <Card><Skeleton rows={6} /></Card>
      </>
    );
  }

  if (isError && error?.status !== 404) {
    return (
      <>
        <PageHeader eyebrow="Brand" title="A consistent signature." />
        <Alert tone="danger" title="Could not load brand profile">
          {error?.data?.detail || 'Network error'}
        </Alert>
      </>
    );
  }

  // 404 = profile not created yet → still render form
  return (
    <>
      <PageHeader
        eyebrow="03 / Content creation · Profile & brand assets"
        title="A consistent signature."
        subtitle="Manage the assets used to brand generated images across your workspace."
      />
      <div className="grid gap-4 lg:grid-cols-2">
        <CompanyProfileForm />
        <AssetUploader />
        <BrandPreview />
        <BrandingControls />
      </div>
    </>
  );
}