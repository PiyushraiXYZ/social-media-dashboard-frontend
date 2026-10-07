import { MediaPreview } from '../../../components/shared/MediaPreview/MediaPreview.jsx';

export function ApprovalPreview() {
  return (
    <div className="space-y-3">
      <div className="text-xs text-slate-500">POST 123 · Illustrative</div>
      <div className="text-lg font-semibold text-slate-900">AI and Machine Learning</div>
      <MediaPreview
        src="https://via.placeholder.com/800x500/0f172a/ffffff?text=Build.+Learn.+Grow."
        footer="NORTHSTAR LEARNING · Ideas into impact · northstar.example"
      />
      <p className="text-sm text-slate-700">
        AI is changing how we work. Machine learning is helping us turn complex data into practical decisions. Start small, stay curious, and build with purpose.
      </p>
      <p className="text-sm text-slate-500">Build. Learn. Grow. #ArtificialIntelligence #MachineLearning #NorthstarLearning</p>
    </div>
  );
}
