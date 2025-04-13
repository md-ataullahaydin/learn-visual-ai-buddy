
import React from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export const LEARNING_STYLES = ['Visual', 'Auditory', 'Reading/Writing', 'Kinesthetic', 'Mixed'];
export const STUDY_HOURS = ['1-5 hours', '6-10 hours', '11-15 hours', '16-20 hours', '20+ hours'];

export const preferencesSchema = z.object({
  learningStyle: z.string().min(1, { message: 'Learning style is required' }),
  studyHoursPerWeek: z.string().min(1, { message: 'Study hours is required' }),
  goals: z.string().min(5, { message: 'Please share your learning goals' }),
  difficulties: z.string().optional(),
});

interface PreferencesFormProps {
  onSubmit: (data: z.infer<typeof preferencesSchema>) => void;
  onBack: () => void;
  isLoading: boolean;
}

const PreferencesForm = ({ onSubmit, onBack, isLoading }: PreferencesFormProps) => {
  const form = useForm<z.infer<typeof preferencesSchema>>({
    resolver: zodResolver(preferencesSchema),
    defaultValues: {
      learningStyle: '',
      studyHoursPerWeek: '',
      goals: '',
      difficulties: '',
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <FormField
            control={form.control}
            name="learningStyle"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Learning Style</FormLabel>
                <Select 
                  onValueChange={field.onChange} 
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your learning style" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {LEARNING_STYLES.map((style) => (
                      <SelectItem key={style} value={style}>
                        {style}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="studyHoursPerWeek"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Study Hours Per Week</FormLabel>
                <Select 
                  onValueChange={field.onChange} 
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your weekly study hours" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {STUDY_HOURS.map((hours) => (
                      <SelectItem key={hours} value={hours}>
                        {hours}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <FormField
          control={form.control}
          name="goals"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Learning Goals</FormLabel>
              <FormControl>
                <Input
                  placeholder="What are your main learning goals?"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="difficulties"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Learning Difficulties (Optional)</FormLabel>
              <FormControl>
                <Input
                  placeholder="Any specific difficulties you face while learning?"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="flex justify-between pt-4">
          <Button type="button" variant="outline" onClick={onBack}>
            Back
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Creating Account...' : 'Create Account'}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default PreferencesForm;
