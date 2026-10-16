import { useDispatch, useSelector } from 'react-redux';
import { Card } from '../../../components/ui/Card/Card.jsx';
import { FileUpload } from '../../../components/ui/FileUpload/FileUpload.jsx';
import { Alert } from '../../../components/ui/Alert/Alert.jsx';
import {
  setProfile,
  setFooter,
  setUploadStatus,
} from '../brandSlice.js';
import {
  useUploadLogoMutation,
  useUploadFooterMutation,
} from '../api.js';

export function AssetUploader() {
  const dispatch = useDispatch();
  const uploadStatus = useSelector((s) => s.brand.uploadStatus);
  const profile = useSelector((s) => s.brand.profile);
  const footerUrl = useSelector((s) => s.brand.footer_url);

  const [uploadLogo, { isLoading: logoLoading }] = useUploadLogoMutation();
  const [uploadFooter, { isLoading: footerLoading }] = useUploadFooterMutation();

  const handleLogo = async (file) => {
    dispatch(setUploadStatus('uploading'));
    try {
      const res = await uploadLogo(file).unwrap();
      dispatch(setProfile({ logo_url: res.logo_url }));
      dispatch(setUploadStatus('success'));
    } catch (err) {
      console.error('[upload logo] error:', err);
      dispatch(setUploadStatus('failed'));
    }
  };

  const handleFooter = async (file) => {
    dispatch(setUploadStatus('uploading'));
    try {
      const res = await uploadFooter(file).unwrap();
      dispatch(setFooter(res.footer_url));
      dispatch(setUploadStatus('success'));
    } catch (err) {
      console.error('[upload footer] error:', err);
      dispatch(setUploadStatus('failed'));
    }
  };

  return (
    <Card title="Company assets">
      <div className="space-y-3">
        {/* ─── Logo ─── */}
        <div>
          <div className="mb-1.5 flex items-center justify-between">
            <span className="text-xs font-medium text-slate-700">
              Logo
            </span>
            <span className="text-[10px] text-slate-400">
              PNG · JPG · WebP · 5MB
            </span>
          </div>
          <FileUpload
            label={logoLoading ? 'Uploading…' : 'Upload logo'}
            onFile={handleLogo}
            accept={{ 'image/*': ['.png', '.jpg', '.jpeg', '.webp'] }}
            maxSize={5 * 1024 * 1024}
          />
          {profile.logo_url && (
            <img
              src={profile.logo_url}
              alt="logo"
              className="mt-1.5 h-12 rounded border border-slate-200"
            />
          )}
        </div>

        {/* ─── Footer ─── */}
        <div>
          <div className="mb-1.5 flex items-center justify-between">
            <span className="text-xs font-medium text-slate-700">
              Footer
            </span>
            <span className="text-[10px] text-slate-400">
              PNG · JPG · WebP · 5MB
            </span>
          </div>
          <FileUpload
            label={footerLoading ? 'Uploading…' : 'Upload footer'}
            onFile={handleFooter}
            accept={{ 'image/*': ['.png', '.jpg', '.jpeg', '.webp'] }}
            maxSize={5 * 1024 * 1024}
          />
          {footerUrl && (
            <img
              src={footerUrl}
              alt="footer"
              className="mt-1.5 h-12 rounded border border-slate-200"
            />
          )}
        </div>

        {/* ─── Feedback ─── */}
        {uploadStatus === 'success' && (
          <Alert tone="success">Upload successful ✅</Alert>
        )}
        {uploadStatus === 'failed' && (
          <Alert tone="danger">Upload failed. Try again.</Alert>
        )}
      </div>
    </Card>
  );
}