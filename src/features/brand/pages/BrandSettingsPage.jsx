import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { PageHeader } from '../../../components/layout/PageHeader/PageHeader.jsx';
import { Card } from '../../../components/ui/Card/Card.jsx';
import { Skeleton } from '../../../components/ui/Skeleton/Skeleton.jsx';
import { Alert } from '../../../components/ui/Alert/Alert.jsx';
import { useGetProfileQuery } from '../api.js';
import { setProfile, setOverlay } from '../brandSlice.js';
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
        logo_size: data.logo_size ?? 60,
        logo_position_x: data.logo_position_x ?? 4,
        logo_position_y: data.logo_position_y ?? 4,
        footer_height: data.footer_height ?? 60,
        footer_width: data.footer_width ?? 100,
        footer_position_x: data.footer_position_x ?? 0,
        footer_position_y: data.footer_position_y ?? 0,
        overlay_color: data.overlay_color ?? '#ffffff',
      }));

      if (data.footer_url) {
        dispatch(setProfile({ footer_url: data.footer_url }));
      }

      dispatch(setOverlay({
        text: data.overlay_text || '',
        position: data.overlay_position || 'bottom-center',
        text_size: data.overlay_text_size ?? 40,
        color: data.overlay_color || '#ffffff',
      }));
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

  return (
    <div className="max-w-[1400px] mx-auto px-4">
      {/* Page header */}
      <PageHeader
        eyebrow="03 / Content creation"
        title="A consistent signature."
        subtitle="Design your brand. Preview how AI posts will look."
      />

      {/* 2-column layout: Preview | Controls */}
      <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,480px)_minmax(0,1fr)]">

        {/* ─── LEFT: Preview + Upload ─── */}
        <div className="space-y-5">
          <BrandPreview />
          <AssetUploader />
        </div>

        {/* ─── RIGHT: Overlay + Profile ─── */}
        <div className="space-y-5">
          <BrandingControls />
          <CompanyProfileForm />
        </div>

      </div>
    </div>
  );
}