import { useState } from 'react';
import { DevotionalForm } from './components/DevotionalForm';
import { DevotionalDisplay } from './components/DevotionalDisplay';
import { BibleUpload } from './components/BibleUpload';
import { Footer } from './components/Footer';
import { Toaster } from '@/components/ui/toaster';
import { Button } from '@/components/ui/button';
import { BookOpen, Upload } from 'lucide-react';
import type { DevotionalPlan } from '~backend/devotional/types';

export default function App() {
  const [devotionalPlan, setDevotionalPlan] = useState<DevotionalPlan | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showUpload, setShowUpload] = useState(false);

  const handleDevotionalGenerated = (plan: DevotionalPlan) => {
    setDevotionalPlan(plan);
    setIsGenerating(false);
  };

  const handleStartNew = () => {
    setDevotionalPlan(null);
    setIsGenerating(false);
    setShowUpload(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col">
      <div className="flex-1">
        <div className="container mx-auto px-4 py-8">
          <header className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">
              Guia Devocional
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Transforme sua leitura bíblica em uma jornada completa de meditação, 
              oração, estudo e adoração através de um plano devocional personalizado.
            </p>
            
            {!devotionalPlan && !showUpload && (
              <div className="flex justify-center gap-4 mt-6">
                <Button
                  variant="outline"
                  onClick={() => setShowUpload(true)}
                  className="flex items-center gap-2"
                >
                  <Upload className="h-4 w-4" />
                  Upload Bíblia NVI
                </Button>
              </div>
            )}
          </header>

          <main>
            {showUpload ? (
              <div className="space-y-6">
                <div className="flex justify-center">
                  <Button
                    variant="outline"
                    onClick={() => setShowUpload(false)}
                    className="flex items-center gap-2"
                  >
                    <BookOpen className="h-4 w-4" />
                    Voltar ao Devocional
                  </Button>
                </div>
                <BibleUpload />
              </div>
            ) : !devotionalPlan ? (
              <DevotionalForm 
                onDevotionalGenerated={handleDevotionalGenerated}
                isGenerating={isGenerating}
                setIsGenerating={setIsGenerating}
              />
            ) : (
              <DevotionalDisplay 
                devotionalPlan={devotionalPlan}
                onStartNew={handleStartNew}
              />
            )}
          </main>
        </div>
      </div>
      <Footer />
      <Toaster />
    </div>
  );
}
