import { useDispatch } from 'react-redux';
import { Card } from '../../../components/ui/Card/Card.jsx';
import { FileUpload } from '../../../components/ui/FileUpload/FileUpload.jsx';
import { Alert } from '../../../components/ui/Alert/Alert.jsx';
import { setLogoUrl, setFooterUrl, setUploadStatus } from '../brandSlice.js';
import { uploadToCloudinary } from '../../../lib/cloudinary.js';

export function AssetUploader() {
  const dispatch = useDispatch();

  const handleUpload = async (type, file) => {
    dispatch(setUploadStatus('uploading'));
    try {
      const { url } = await uploadToCloudinary(file);
      if (type === 'logo') dispatch(setLogoUrl(url));
      if (type === 'footer') dispatch(setFooterUrl(url));
      dispatch(setUploadStatus('success'));
    } catch (e) {
      dispatch(setUploadStatus('failed'));
    }
  };

  return (
    <Card title="Company assets">
      <div className="space-y-3">
        <FileUpload label="Upload logo" onFile={(f) => handleUpload('logo', f)} />
        <FileUpload label="Upload footer" onFile={(f) => handleUpload('footer', f)} />
        <Alert tone="info">PNG, JPG, or SVG logo; PNG or JPG footer; 5 MB per asset.</Alert>
      </div>
    </Card>
  );
}
