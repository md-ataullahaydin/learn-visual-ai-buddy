
import React, { useState } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CheckCircle, MapPin, School, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export const SUBJECTS = ['Mathematics', 'Science', 'Physics', 'Chemistry', 'Biology', 'English', 'History', 'Geography', 'Computer Science', 'Economics', 'Psychology'];
export const GRADES = ['1st Grade', '2nd Grade', '3rd Grade', '4th Grade', '5th Grade', '6th Grade', '7th Grade', '8th Grade', '9th Grade', '10th Grade', '11th Grade', '12th Grade', 'College/University'];

export const educationSchema = z.object({
  country: z.string().min(1, { message: 'Country is required' }),
  state: z.string().min(1, { message: 'State is required' }),
  school: z.string().min(1, { message: 'School name is required' }),
  grade: z.string().min(1, { message: 'Grade/Class is required' }),
  subjects: z.array(z.string()).min(1, { message: 'Please select at least one subject' }),
});

interface EducationFormProps {
  onSubmit: (data: z.infer<typeof educationSchema>) => void;
  onBack: () => void;
}

const EducationForm = ({ onSubmit, onBack }: EducationFormProps) => {
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
  const [customSubject, setCustomSubject] = useState('');
  const [showCustomSubjectInput, setShowCustomSubjectInput] = useState(false);

  const form = useForm<z.infer<typeof educationSchema>>({
    resolver: zodResolver(educationSchema),
    defaultValues: {
      country: '',
      state: '',
      school: '',
      grade: '',
      subjects: [],
    },
  });

  const toggleSubject = (subject: string) => {
    if (selectedSubjects.includes(subject)) {
      const newSubjects = selectedSubjects.filter(s => s !== subject);
      setSelectedSubjects(newSubjects);
      form.setValue('subjects', newSubjects);
    } else {
      const newSubjects = [...selectedSubjects, subject];
      setSelectedSubjects(newSubjects);
      form.setValue('subjects', newSubjects);
    }
  };

  const addCustomSubject = () => {
    if (customSubject.trim() !== '' && !selectedSubjects.includes(customSubject)) {
      const newSubjects = [...selectedSubjects, customSubject];
      setSelectedSubjects(newSubjects);
      form.setValue('subjects', newSubjects);
      setCustomSubject('');
      setShowCustomSubjectInput(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <FormField
            control={form.control}
            name="country"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Country</FormLabel>
                <FormControl>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                    <Input 
                      placeholder="Enter your country" 
                      className="pl-10" 
                      {...field} 
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="state"
            render={({ field }) => (
              <FormItem>
                <FormLabel>State/Province</FormLabel>
                <FormControl>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                    <Input 
                      placeholder="Enter your state/province" 
                      className="pl-10" 
                      {...field} 
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <FormField
            control={form.control}
            name="school"
            render={({ field }) => (
              <FormItem>
                <FormLabel>School/Institution</FormLabel>
                <FormControl>
                  <div className="relative">
                    <School className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                    <Input 
                      placeholder="Enter your school/institution" 
                      className="pl-10" 
                      {...field} 
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="grade"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Grade/Class</FormLabel>
                <Select 
                  onValueChange={field.onChange} 
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your grade/class" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {GRADES.map((grade) => (
                      <SelectItem key={grade} value={grade}>
                        {grade}
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
          name="subjects"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Subjects of Interest</FormLabel>
              <FormMessage />
              <div className="flex flex-wrap gap-2 pt-2">
                {SUBJECTS.map((subject) => (
                  <Button
                    key={subject}
                    type="button"
                    variant={selectedSubjects.includes(subject) ? "default" : "outline"}
                    onClick={() => toggleSubject(subject)}
                    className="mb-2"
                  >
                    {selectedSubjects.includes(subject) && (
                      <CheckCircle className="mr-2 h-4 w-4" />
                    )}
                    {subject}
                  </Button>
                ))}
                
                {/* Add custom subject button */}
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowCustomSubjectInput(true)}
                  className="mb-2"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add Subject
                </Button>
              </div>
              
              {/* Custom subject input */}
              {showCustomSubjectInput && (
                <div className="mt-3 flex gap-2">
                  <Input
                    placeholder="Enter custom subject"
                    value={customSubject}
                    onChange={(e) => setCustomSubject(e.target.value)}
                    className="flex-1"
                  />
                  <Button type="button" onClick={addCustomSubject}>
                    Add
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => {
                      setShowCustomSubjectInput(false);
                      setCustomSubject('');
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              )}
              
              {/* Display selected custom subjects */}
              {selectedSubjects.filter(s => !SUBJECTS.includes(s)).length > 0 && (
                <div className="mt-3">
                  <p className="text-sm font-medium mb-1">Custom Subjects:</p>
                  <div className="flex flex-wrap gap-2">
                    {selectedSubjects.filter(s => !SUBJECTS.includes(s)).map((subject) => (
                      <Button
                        key={subject}
                        type="button"
                        variant="default"
                        onClick={() => toggleSubject(subject)}
                        className="mb-2"
                      >
                        <CheckCircle className="mr-2 h-4 w-4" />
                        {subject}
                      </Button>
                    ))}
                  </div>
                </div>
              )}
            </FormItem>
          )}
        />
        
        <div className="flex justify-between pt-4">
          <Button type="button" variant="outline" onClick={onBack}>
            Back
          </Button>
          <Button type="submit">Continue</Button>
        </div>
      </form>
    </Form>
  );
};

export default EducationForm;
