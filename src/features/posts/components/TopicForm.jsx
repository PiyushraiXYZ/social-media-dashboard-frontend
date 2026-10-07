import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { topicSchema } from '../../../lib/validators.js';
import { Input } from '../../../components/ui/Input/Input.jsx';
import { Button } from '../../../components/ui/Button/Button.jsx';

export function TopicForm({ onGenerate, onManual }) {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(topicSchema),
    defaultValues: { title: 'AI and Machine Learning', direction: '', generateImage: true },
  });

  return (
    <form onSubmit={handleSubmit(onGenerate)} className="space-y-4">
      <Input label="Topic / title" {...register('title')} error={errors.title?.message} />
      <div className="space-y-1">
        <label className="block text-sm font-medium text-slate-700">Creative direction — optional</label>
        <textarea
          rows={3}
          className="input"
          placeholder="Make AI approachable for curious professionals…"
          {...register('direction')}
        />
      </div>
      <label className="flex items-center gap-2 text-sm text-slate-700">
        <input type="checkbox" {...register('generateImage')} /> Generate an image
      </label>
      <div className="flex gap-2">
        <Button type="submit">Generate with AI</Button>
        <Button type="button" variant="ghost" onClick={onManual}>Start a manual draft</Button>
      </div>
    </form>
  );
}
