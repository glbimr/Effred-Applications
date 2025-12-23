import React, { useState } from 'react';
import { JobRole, ApplicationFormData } from './types';
import { RoleToggle } from './components/RoleToggle';
import { FileUpload } from './components/FileUpload';
import { supabase, isSupabaseConfigured } from './services/supabaseClient';
import { Send, CheckCircle2, Loader2, ExternalLink } from 'lucide-react';

const App: React.FC = () => {
  const [formData, setFormData] = useState<ApplicationFormData>({
    role: JobRole.MARKET_RESEARCH,
    fullName: '',
    email: '',
    phone: '',
    linkedIn: '',
    portfolio: '',
    resume: null
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Auto-format URLs when the user clicks away from the input
  const handleUrlBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    let finalValue = value.trim();

    if (!finalValue) return;

    // If the user entered something that looks like a domain but missing protocol
    // e.g. "linkedin.com/in/me" or "www.portfolio.com"
    if (!/^https?:\/\//i.test(finalValue)) {
      finalValue = `https://${finalValue}`;
      setFormData(prev => ({ ...prev, [name]: finalValue }));
    }
  };

  const handleRoleChange = (role: JobRole) => {
    setFormData(prev => ({ ...prev, role }));
  };

  const handleFileChange = (file: File | null) => {
    setFormData(prev => ({ ...prev, resume: file }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.resume) {
      alert("Please attach your resume.");
      return;
    }
    
    setIsSubmitting(true);

    try {
      // Check if Supabase is configured. If not, run in mock mode.
      if (!isSupabaseConfigured) {
        console.warn('Supabase not configured. Simulating successful submission.');
        await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate network delay
        
        console.log('Mock Submission Data:', {
          ...formData,
          resumeName: formData.resume.name
        });
        
        setIsSuccess(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }

      // 1. Upload Resume to Supabase Storage
      const timestamp = Date.now();
      const fileExt = formData.resume.name.split('.').pop();
      // Sanitize filename to avoid characters that might cause issues in URLs
      const sanitizedName = formData.fullName.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase();
      const fileName = `${timestamp}_${sanitizedName}.${fileExt}`;
      const filePath = `${fileName}`; // Path inside the 'resumes' bucket

      let { error: uploadError } = await supabase.storage
        .from('resumes')
        .upload(filePath, formData.resume);

      // Handle missing bucket error by attempting to create it
      if (uploadError && (uploadError.message.includes('Bucket not found') || uploadError.message.includes('not found'))) {
        console.log("Bucket 'resumes' not found. Attempting to create...");
        const { error: createBucketError } = await supabase.storage.createBucket('resumes', {
          public: true
        });

        if (!createBucketError) {
           // Retry upload if bucket creation was successful
           const { error: retryError } = await supabase.storage
             .from('resumes')
             .upload(filePath, formData.resume);
           uploadError = retryError;
        } else {
           console.error("Auto-creation of bucket failed:", createBucketError);
           // Throw a specific error telling the user to create the bucket manually
           throw new Error("Storage bucket 'resumes' is missing. Please go to your Supabase Dashboard -> Storage and create a new public bucket named 'resumes'.");
        }
      }

      if (uploadError) {
        throw new Error(`Upload failed: ${uploadError.message}`);
      }

      // 2. Insert Application Record into Supabase Database
      const { error: insertError } = await supabase
        .from('applications')
        .insert([
          {
            full_name: formData.fullName,
            email: formData.email,
            phone: formData.phone,
            linkedin_url: formData.linkedIn || null,
            portfolio_url: formData.portfolio || null,
            role: formData.role,
            resume_path: filePath,
            status: 'new'
          }
        ]);

      if (insertError) {
        throw new Error(`Database insert failed: ${insertError.message}`);
      }

      console.log('Form Submitted Successfully');
      setIsSuccess(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });

    } catch (error: any) {
      console.error('Error submitting application:', error);
      alert(`Submission Error: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getProgressClass = () => {
    switch (formData.role) {
      case JobRole.MARKET_RESEARCH:
        return 'left-0';
      case JobRole.UI_UX:
        return 'left-1/3';
      case JobRole.FRONTEND:
        return 'left-2/3';
      default:
        return 'left-0';
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-white sm:bg-slate-50 flex items-center justify-center p-0 sm:p-4">
        <div className="bg-white max-w-md w-full sm:rounded-2xl sm:shadow-xl p-8 text-center animate-fade-in-up h-screen sm:h-auto flex flex-col justify-center">
          <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 size={40} />
          </div>
          <h2 className="text-3xl font-bold text-slate-900 mb-2">Application Received!</h2>
          <p className="text-slate-600 mb-12 text-lg">
            Thanks for applying to the <span className="font-semibold text-indigo-600">{formData.role}</span> position at Effred Technologies. We'll be in touch soon.
          </p>
          <button
            onClick={() => {
              setIsSuccess(false);
              setFormData({
                role: JobRole.MARKET_RESEARCH,
                fullName: '',
                email: '',
                phone: '',
                linkedIn: '',
                portfolio: '',
                resume: null
              });
            }}
            className="w-full py-4 px-4 bg-slate-900 text-white rounded-xl font-medium hover:bg-slate-800 transition-colors text-lg shadow-lg"
          >
            Submit Another Application
          </button>
        </div>
      </div>
    );
  }

  return (
    // Changed: Removed min-h-screen centering for mobile to allow natural flow
    <div className="min-h-screen bg-white sm:bg-slate-50 sm:py-12 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="w-full sm:max-w-3xl">
        
        {/* Main Form Card - Full screen on mobile, Card on Desktop */}
        <div className="bg-white sm:rounded-2xl sm:shadow-xl overflow-hidden sm:border sm:border-slate-100 min-h-screen sm:min-h-0 flex flex-col">
          
          {/* Progress Bar - Sticky on top for mobile app feel */}
          <div className="sticky top-0 z-20 h-1.5 w-full bg-slate-100">
            <div 
              className={`absolute top-0 bottom-0 w-1/3 bg-indigo-600 transition-all duration-500 ease-in-out ${getProgressClass()}`}
            ></div>
          </div>

          <div className="flex-1 p-5 sm:p-12 pb-10">
            
            {/* Header Section */}
            <div className="flex flex-col items-center text-center mb-8 sm:mb-10 border-b border-slate-100 pb-6 sm:pb-8 pt-4 sm:pt-0">
              <a 
                href="https://effred.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="group flex items-center justify-center gap-3 text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight hover:text-indigo-600 transition-colors mb-2"
              >
                <span>Effred Technologies</span>
                <ExternalLink size={20} className="text-slate-400 group-hover:text-indigo-600 transition-colors" />
              </a>
              <h1 className="text-lg sm:text-2xl text-slate-600 font-medium">Internship Application</h1>
              <p className="mt-3 text-sm sm:text-base text-slate-500 max-w-2xl px-2">
                We're looking for innovative minds to shape the future. Apply for our internship opportunities below.
              </p>
            </div>

            <RoleToggle selectedRole={formData.role} onChange={handleRoleChange} />

            <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8 mt-6 sm:mt-8">
              
              {/* Personal Info Section */}
              <div className="space-y-5 sm:space-y-6">
                <h3 className="text-lg font-semibold text-slate-900 flex items-center gap-2 pb-2 border-b border-slate-100">
                  <div className="w-1 h-5 bg-indigo-500 rounded-full"></div>
                  Personal Information
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
                  <div>
                    <label htmlFor="fullName" className="block text-sm font-medium text-slate-700 mb-1.5">Full Name <span className="text-red-500">*</span></label>
                    <input
                      type="text"
                      id="fullName"
                      name="fullName"
                      required
                      value={formData.fullName}
                      onChange={handleInputChange}
                      placeholder="Jane Doe"
                      className="w-full px-4 py-3.5 sm:py-3 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all outline-none bg-slate-50 focus:bg-white text-base"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1.5">Email Address <span className="text-red-500">*</span></label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="jane@example.com"
                      className="w-full px-4 py-3.5 sm:py-3 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all outline-none bg-slate-50 focus:bg-white text-base"
                    />
                  </div>
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-slate-700 mb-1.5">Phone Number <span className="text-red-500">*</span></label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      required
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="+1 (555) 000-0000"
                      className="w-full px-4 py-3.5 sm:py-3 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all outline-none bg-slate-50 focus:bg-white text-base"
                    />
                  </div>
                  <div>
                    <label htmlFor="linkedIn" className="block text-sm font-medium text-slate-700 mb-1.5">LinkedIn Profile</label>
                    <input
                      type="text"
                      inputMode="url"
                      id="linkedIn"
                      name="linkedIn"
                      value={formData.linkedIn}
                      onChange={handleInputChange}
                      onBlur={handleUrlBlur}
                      placeholder="linkedin.com/in/username"
                      className="w-full px-4 py-3.5 sm:py-3 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all outline-none bg-slate-50 focus:bg-white text-base"
                    />
                  </div>
                  
                  {/* Universal Optional Portfolio Field */}
                  <div className="md:col-span-2">
                    <label htmlFor="portfolio" className="block text-sm font-medium text-slate-700 mb-1.5">
                      Portfolio / Project Links <span className="text-slate-400 font-normal ml-1">(Optional)</span>
                    </label>
                    <input
                      type="text"
                      inputMode="url"
                      id="portfolio"
                      name="portfolio"
                      value={formData.portfolio}
                      onChange={handleInputChange}
                      onBlur={handleUrlBlur}
                      placeholder="github.com/username or yoursite.com"
                      className="w-full px-4 py-3.5 sm:py-3 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all outline-none bg-slate-50 focus:bg-white text-base"
                    />
                  </div>
                </div>
              </div>

              {/* Resume Section */}
              <div className="space-y-5 sm:space-y-6">
                <h3 className="text-lg font-semibold text-slate-900 flex items-center gap-2 pb-2 border-b border-slate-100">
                  <div className="w-1 h-5 bg-indigo-500 rounded-full"></div>
                  Documents
                </h3>
                
                <FileUpload file={formData.resume} onFileChange={handleFileChange} />
              </div>

              {/* Submit Button */}
              <div className="pt-6 pb-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-slate-900 text-white font-bold py-4 px-8 rounded-xl hover:bg-slate-800 focus:outline-none focus:ring-4 focus:ring-slate-900/20 active:scale-[0.98] transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-3 shadow-lg hover:shadow-xl text-lg"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="animate-spin" size={24} />
                      Submitting...
                    </>
                  ) : (
                    <>
                      Submit Application
                      <Send size={20} />
                    </>
                  )}
                </button>
                <p className="mt-4 text-center text-xs text-slate-400 px-4">
                  By clicking submit, you agree to our Terms & Privacy Policy.
                </p>
              </div>

            </form>
          </div>
        </div>
        
        {/* Footer */}
        <div className="mt-6 mb-8 text-center hidden sm:block">
            <p className="text-slate-400 text-sm">© {new Date().getFullYear()} Effred Technologies. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
};

export default App;